const Product = require('../models/product');
const ProductUpdate = require('../models/product-update');

const DEFAULT_RECENT_DURATION = 60 * 60 * 24 * 1000 * 2; // 2 days

let ProductService  = {
    findAllProducts: async () => {
        // TODO
        return [];
    },

    /**
     * Find products that are recently available
     */
    findRecentProducts: async (duration = DEFAULT_RECENT_DURATION) => {
        let to = new Date().getTime();
        let from = to - DEFAULT_RECENT_DURATION;

        let query = {
            timestamp: {
                '$gte': from,
                '$lt': to
            }
        };
        console.log(query);

        // TODO: consider pagination?
        let productUpdates = await ProductUpdate.find(query);
        let productMap = {};
        for (let productUpdate of productUpdates) {
            let productId = productUpdate.productId;
            let product = productMap[productId];
            if (!product) {
                product = {
                    productId: productId,
                    productName: productUpdate.productName,
                    roasterName: productUpdate.roasterName,
                    updates: []
                };
                productMap[productId] = product;
            }

            product.updates.push(productUpdate.timestamp);
        }

        return Object.values(productMap);
    }
};

module.exports = ProductService;