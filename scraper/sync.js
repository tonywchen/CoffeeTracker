const mongo = require('mongodb');

const MongoClient = require('../service/mongo');

const Product = require('../models/product');
const ProductUpdate = require('../models/product-update');
const Roaster = require('../models/roaster');

const moment = require('moment-timezone');

const syncProducts = async() => {
    let match = {
        status: ProductUpdate.STATUS_AVAILABLE
    };

    let group = {
        _id: '$productId',
        firstTimestamp: {
            '$min': '$timestamp'
        },
        firstDateString: {
            '$min': '$dateString'
        }
    };

    let aggregate = [{
        '$match': match
    }, {
        '$group': group
    }];

    let productUpdates = await ProductUpdate.aggregate(aggregate);
    for (let productUpdate of productUpdates) {
        console.log(productUpdate);
        let productId = productUpdate._id;
        let metrics = {
            created: productUpdate.firstTimestamp,
            createDate: productUpdate.firstDateString
        }

        let update = {
            '$set': {
                metrics: metrics
            }
        };

        await Product.update({_id: new mongo.ObjectID(productId)}, update);
    }
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
        let timezone = roaster.timezone || 'America/Toronto';

        let update = {
            '$set': {
                dateString: moment(productUpdate.timestamp).tz(timezone).format('YYYY/MM/DD'),
                productName: product.name,
                roasterId: product.roasterId,
                roasterName: roaster.name
            }
        }

        await ProductUpdate.update({_id: productUpdate._id}, update);
    }
};

(async () => {
    await MongoClient.connect();

    await syncProducts();
    await syncProductUpdates();

    process.exit();
})();