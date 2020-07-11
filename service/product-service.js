const moment = require('moment');

const ProductUpdate = require('../models/product-update');

const DEFAULT_RECENT_DAYS = 5; // 5 days

let ProductService  = {
    findAllProducts: async () => {
        // TODO
        return [];
    },

    /**
     * Find products that are recently available
     */
    findRecentProducts: async (dateString, days = DEFAULT_RECENT_DAYS) => {
        let toDate = moment(dateString).endOf('day');
        let fromDate = moment(toDate).subtract(days - 1, 'day').startOf('day');

        let to = toDate.valueOf();
        let from = fromDate.valueOf();

        // TODO: consider pagination?
        let productUpdates = await ProductUpdate.findRecent(from, to);
        return productUpdates;
    },

    findNewProducts: async (dateString, days = DEFAULT_RECENT_DAYS) => {
        let toDate = moment(dateString).endOf('day');
        let fromDate = moment(toDate).subtract(days - 1, 'day').startOf('day');

        let to = toDate.valueOf();
        let from = fromDate.valueOf();

        // TODO: consider pagination?
        let productUpdates = await ProductUpdate.findNew(from, to);
        return productUpdates;
    }
};

module.exports = ProductService;