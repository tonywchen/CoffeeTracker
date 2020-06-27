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
            fid: roasterData.fid
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

const findOrCreateProduct = async (productData, roasterId) => {
    let product = await Product.findOne({fid: productData.link});
    if (!product) {
        product = await Product.save({
            name: productData.name,
            fid: productData.link,
            roasterId: new mongo.ObjectID(roasterId),
            image: productData.image,
            link: productData.link
        });
    }

    return product;
};

const addProductUpdate = async (productId, updateTimestamp, isOutOfStock) => {
    let status = (isOutOfStock)
        ? ProductUpdate.STATUS_UNAVAILABLE
        : ProductUpdate.STATUS_AVAILABLE;

    await ProductUpdate.save({
        productId: productId,
        timestamp: updateTimestamp,
        status: status
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
            let product = await findOrCreateProduct(productData, roaster._id);
            await addProductUpdate(product._id, updateTimestamp, productData.isOutOfStock);
        }
    }
})();