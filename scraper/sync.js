const MongoClient = require('../service/mongo');

const Product = require('../models/product');
const ProductUpdate = require('../models/product-update');
const Roaster = require('../models/roaster');

const moment = require('moment-timezone');

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
        let timezone = roaster.timezone || 'America/Toronto';

        let update = {
            '$set': {
                dateString: moment(productUpdate.timestamp).tz(timezone).format('YYYY/MM/DD'),
                productName: product.name,
                roasterId: product.roasterId,
                roasterName: roaster.name
            }
        }

        console.log(update['$set']);

        ProductUpdate.update({_id: productUpdate._id}, update);
    }
};

(async () => {
    await MongoClient.connect();

    await syncProductUpdates();
})();