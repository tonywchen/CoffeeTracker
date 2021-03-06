const yargs = require('yargs');
const mongo = require('mongodb');
const moment = require('moment-timezone');

const MongoClient = require('../service/mongo');

const Product = require('../models/product');
const ProductUpdate = require('../models/product-update');
const Roaster = require('../models/roaster');
const RoasterUpdate = require('../models/roaster-update');

const email = require('./email');
const Scraper = require('./Scraper');

const roasterConfigs = require('./configs/roasters.json');

const scrape = async () => {
    let scraper = Scraper();
    let scraped = await scraper.scrape(roasterConfigs);

    return scraped;
};

const scrapeDetail = async (product, roasterFid) => {
    if (!roasterFid) {
        return;
    }
    let roasterConfig = roasterConfigs[roasterFid];

    let scraper = Scraper();
    let scraped = await scraper.scrapeDetail(roasterConfig, product.link);
    
    return scraped;
}

const findOrCreateRoaster = async (roasterData) => {
    let roaster = await Roaster.findOne({fid: roasterData.fid});
    if (!roaster) {
        roaster = await Roaster.save({
            name: roasterData.name,
            fid: roasterData.fid,
            timezone: roasterData.timezone
        });
    }

    return roaster;
};

const addRoasterUpdate = async (roaster, updateTimestamp, rules) => {
    await RoasterUpdate.save({
        roasterId: roaster._id,
        timestamp: updateTimestamp,
        rules: rules,
        status: RoasterUpdate.STATUS_SUCCESS
    });
};

const findOrCreateProduct = async (productData, roaster, updateTimestamp) => {
    let roasterId = roaster._id;
    let timezone = roaster.timezone;

    let product = await Product.findOne({fid: productData.link});
    if (!product) {
        product = await Product.save({
            name: productData.name,
            fid: productData.link,
            roasterId: new mongo.ObjectID(roasterId),
            image: productData.image,
            link: productData.link,
            metrics: {
                created: updateTimestamp,
                createDate: moment(updateTimestamp).tz(timezone).format('YYYY/MM/DD')
            }
        });

        product._isNew = true;
    }

    return product;
};

const upsertProductUpdate = async (updateTimestamp, product, roaster, availableProductMap) => {
    let dateString = moment(updateTimestamp).tz(roaster.timezone).format('YYYY/MM/DD');

    await ProductUpdate.findOrCreate({
        productId: product._id,
        dateString: dateString
    }, {
        productId: product._id,
        productName: product.name,
        roasterId: roaster._id,
        roasterName: roaster.name,
        dateString: dateString,
        statuses: [],
        totalChecks: 0,
        totalAvailable: 0
    });
    
    let status = (availableProductMap[product._id])
        ? ProductUpdate.STATUS_AVAILABLE
        : ProductUpdate.STATUS_UNAVAILABLE;

    await ProductUpdate.update({
        productId: product._id,
        dateString: dateString                
    }, {
        '$push': {
            statuses: {
                timestamp: updateTimestamp,
                status: status
            }
        },
        '$set': {
            status: status
        },
        '$inc': {
            totalChecks: 1,
            totalAvailable: (availableProductMap[product._id])? 1 : 0
        }
    });
};

const setProductDetail = async (product, detail = {}) => {
    let sanitizedDetail = {
        description: detail.description,
        country: detail.country,
        tastingNotes: detail.tastingNotes,
        varietal: detail.varietal,
        process: detail.process
    };

    await Product.update({
        _id: product._id,
    }, {
        '$set': {
            detail: sanitizedDetail
        }
    });
};

const shouldEmailUpdates = () => {
    return !!yargs.argv.email;
};

const sendInfoEmail = async (currentRoasters, currentProducts, newProducts) => {
    if (!shouldEmailUpdates()) {
        return;
    }

    let roasterTotal = currentRoasters.length;
    let productTotal = currentProducts.filter(p => !p.isOutOfStock).length;
    let html = `Number of Roasters: ${roasterTotal}<br/>Number of Products: ${productTotal}<br/><br/>`;

    if (newProducts.length > 0) {
        let newProductData = newProducts.map(p => {
            return `${p.name}<br/>`;
        });
    
        html += `New Products:<br/>${newProductData}`;
    } else {
        html += `No New Products`
    }

    await email.info('Current Stock', html);    
};

(async () => {
    await MongoClient.connect();

    let scraped = await scrape();
    let updateTimestamp = new Date().getTime();
    
    let currentRoasters = [];
    let currentProducts = [];
    let newProducts = [];

    let productsWithoutDetail = [];

    for (let roasterData of scraped) {
        currentRoasters.push(roasterData);

        let roaster = await findOrCreateRoaster(roasterData);
        await addRoasterUpdate(roaster._id, updateTimestamp, roasterData.rules)

        let availableProductMap = {};
        for (let productData of roasterData.products) {

            let product = await findOrCreateProduct(productData, roaster, updateTimestamp);
            product.roaster = roaster;

            availableProductMap[product._id] = !productData.isOutOfStock;

            if (!product.detail) {
                productsWithoutDetail.push(product);
            }

            currentProducts.push(productData);
            if (product._isNew) {
                newProducts.push(product);
            }
        }
        let products = await Product.find({roasterId: new mongo.ObjectId(roaster._id)});
        for (let product of products) {
            await upsertProductUpdate(updateTimestamp, product, roaster, availableProductMap);
        }
    }
    for (let product of productsWithoutDetail) {
        let detail = await scrapeDetail(product, product.roaster.fid);
        await setProductDetail(product, detail);
    }

    await sendInfoEmail(currentRoasters, currentProducts, newProducts);

    process.exit();
})();