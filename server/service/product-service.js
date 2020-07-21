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
        let momentTo = moment(dateString).endOf('day');
        let momentFrom = moment(momentTo).subtract(days - 1, 'day').startOf('day');

        let fromDate = momentFrom.format('YYYY/MM/DD');
        let toDate = momentTo.format('YYYY/MM/DD');

        // TODO: consider pagination?
        let productUpdates = await ProductUpdate.findRecent(fromDate, toDate);
        return productUpdates;
    },

    findNewProducts: async (dateString, days = DEFAULT_RECENT_DAYS) => {
        let momentTo = moment(dateString).endOf('day');
        let momentFrom = moment(momentTo).subtract(days - 1, 'day').startOf('day');

        let fromDate = momentFrom.format('YYYY/MM/DD');
        let toDate = momentTo.format('YYYY/MM/DD');

        // TODO: consider pagination?
        let productUpdates = await ProductUpdate.findNew(fromDate, toDate);
        return productUpdates;
    }
};

module.exports = ProductService;