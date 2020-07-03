const mongo = require('mongodb');

const Scraper = require('../scraper/scraper');
const MongoClient = require('../service/mongo');

const Product = require('../models/product');
const ProductUpdate = require('../models/product-update');
const Roaster = require('../models/roaster');
const RoasterUpdate = require('../models/roaster-update');

const configs = require('./roasters.json');

const scrape = async () => {
    let scraper = Scraper();
    let scraped = await scraper.scrape(configs);

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
    }

    return product;
};

const addProductUpdate = async (productData, updateTimestamp, timezone) => {
    let productId = productData.productId;
    let isOutOfStock = productData.isOutOfStock;

    let status = (isOutOfStock)
        ? ProductUpdate.STATUS_UNAVAILABLE
        : ProductUpdate.STATUS_AVAILABLE;

    await ProductUpdate.save({
        productId: productId,
        productName: productData.name,
        roasterId: productData.roasterId,
        roasterName: productData.roasterName,
        timestamp: updateTimestamp,
        status: status,
        dateString: moment(updateTimestamp).tz(timezone).format('YYYY/MM/DD')
    });
};

(async () => {
    await MongoClient.connect();

    let scraped = await scrape();
    let updateTimestamp = new Date().getTime();

    for (let roasterData of scraped) {
        let roaster = await findOrCreateRoaster(roasterData);
        await addRoasterUpdate(roaster._id, updateTimestamp, roasterData.rules)

        for (let productData of roasterData.products) {
            let product = await findOrCreateProduct(productData, roaster, updateTimestamp);
            productData.productId = product._id;
            productData.roasterId = roaster._id;
            productData.roasterName = roaster.name;

            await addProductUpdate(productData, updateTimestamp, roaster.timezone);
        }
    }
})();