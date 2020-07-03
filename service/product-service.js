const Product = require('../models/product');
const ProductUpdate = require('../models/product-update');

const DEFAULT_RECENT_DURATION = 60 * 60 * 24 * 1000 * 6; // 7 days

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

        // TODO: consider pagination?
        let productUpdates = await ProductUpdate.findWithDetail(from, to);
        return productUpdates;
    }
};

module.exports = ProductService;