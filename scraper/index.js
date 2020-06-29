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

const addProductUpdate = async (productData, updateTimestamp) => {
    let productId = productData.productId;
    let isOutOfStock = productData.isOutOfStock;

    let status = (isOutOfStock)
        ? ProductUpdate.STATUS_UNAVAILABLE
        : ProductUpdate.STATUS_AVAILABLE;

    await ProductUpdate.save({
        productId: productId,
        productName: productData.productName,
        roasterName: productData.roasterName,
        timestamp: updateTimestamp,
        status: status
    });
};

const syncProductUpdates = async () => {
    let roasters = await Roaster.find({});
    let roasterMap = {};
    for (let roaster of roasters) {
        roasterMap[roaster._id] = roaster;
    }

    let products = await Product.find({});
    let productMap = {};
    for (let product of products) {
        productMap[product._id] = product;
    }

    let productUpdates = await ProductUpdate.find({});
    for (let productUpdate of productUpdates) {
        let product = productMap[productUpdate.productId];
        let roaster = roasterMap[product.roasterId];

        let update = {
            '$set': {
                productName: product.name,
                roasterName: roaster.name
            }
        }

        ProductUpdate.update({_id: productUpdate._id}, update);
    }
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
            productData.productId = product._id;
            productData.roasterName = roaster.name;

            await addProductUpdate(productData, updateTimestamp);
        }
    }
})();