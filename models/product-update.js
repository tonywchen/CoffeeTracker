// Proposed Model:
//   _id                database id
//   productId          database id of the product
//   timestamp          timestamp of the udpate
//   status             availability of the product (AVAILABLE, UNAVAILABLE_IMPLICIT, UNAVAILABLE_EXPLICIT)

const BaseModel = require('./base');
const Product = require('./product');

const moment = require('moment');

const getDatesBetween = (fromDate, toDate) => {
    let momentFrom = moment(fromDate, 'YYYY/MM/DD').startOf('day');
    let momentTo = moment(toDate, 'YYYY/MM/DD').startOf('day');

    let momentCurrent = momentFrom;
    let dates = [];
    while (!momentCurrent.isAfter(momentTo)) {
        dates.push(momentCurrent.format('YYYY/MM/DD'));
        momentCurrent = momentCurrent.add(1, 'day');
    }

    return dates;
};

const mapUpdatesAcorssDates = (updates, dates) => {
    let updateMap = {};
    for (let date of dates) {
        updateMap[date] = 0;
    }

    for (let {dateString, count} of updates) {
        if (updateMap[dateString] === undefined) {
            continue;
        }

        updateMap[dateString] += count;
    }

    return updateMap;
}

class ProductUpdate extends BaseModel {
    static collection = 'product_update';

    constructor(productId) {        
        super();
        this.obj = {
            productId: productId
        }
    }

    static fromObject(object) {
        let productUpdate = new ProductUpdate();
        productUpdate.setObj(object);

        return product;
    }

    setObj(object) {
        this.obj = {
            ...this.obj,
            ...object
        };
    }

    getObj() {
        return { ...obj };
    }

    save() {
        return this.constructor.save(getObj());
    }

    static async findRecent(fromDate, toDate) {
        let dates = getDatesBetween(fromDate, toDate);

        let match = {
            dateString: {
                '$gte': fromDate,
                '$lte': toDate
            },
            status: ProductUpdate.STATUS_AVAILABLE
        };

        let lookup = {
            from: Product.collection,
            localField: 'productId',
            foreignField: '_id',
            as: 'details'
        };

        let groupByProductAndDate = {
            _id: {
                productId: '$productId',
                dateString: '$dateString',
            },
            count: { '$sum': 1 },
            dateString: { '$first': '$dateString' },
            productId: { '$first': '$productId' },
            productName: { '$first': '$productName' },
            roasterName: { '$first': '$roasterName' },
            details: { '$first': '$details' }
        };

        let groupByProduct = {
            _id: {
                productId: '$productId'
            },
            dateString: { '$first': '$dateString' },
            productId: { '$first': '$productId' },
            productName: { '$first': '$productName' },
            roasterName: { '$first': '$roasterName' },
            details: { '$first': '$details' },
            updates: { '$push': {
                dateString: '$_id.dateString',
                count: '$count'
            }}
        };

        let aggregate = [{
            '$match': match
        }, {
            '$lookup': lookup
        }, {
            '$group': groupByProductAndDate
        }, {
            '$group': groupByProduct
        }];

        let rawResults = await this.aggregate(aggregate);
        let results = rawResults.map(({productId, updates, productName, roasterName, details}) => {
            let detail = (details)? details[0] : {};
            let metrics = detail.metrics || {};

            let updateMap = mapUpdatesAcorssDates(updates, dates);

            return {
                productId,
                productName: productName,
                productLink: detail.link,
                productImage: detail.image,
                roasterName: roasterName,
                createDate: metrics.createDate,
                isNew: Object.keys(updateMap).indexOf(metrics.createDate) > -1,
                updates: updateMap
            };
        });

        return results;
    }

    static async findNew(fromDate, toDate) {
        let dates = getDatesBetween(fromDate, toDate);

        let match = {
            dateString: {
                '$gte': fromDate,
                '$lte': toDate
            },
            status: ProductUpdate.STATUS_AVAILABLE
        };

        let lookup = {
            from: Product.collection,
            localField: 'productId',
            foreignField: '_id',
            as: 'details'
        };

        let matchCreated = {
            'details.metrics.createDate': {
                '$gte': fromDate,
                '$lte': toDate
            }
        };

        let groupByProductAndDate = {
            _id: {
                productId: '$productId',
                dateString: '$dateString',
            },
            count: { '$sum': 1 },
            dateString: { '$first': '$dateString' },
            productId: { '$first': '$productId' },
            productName: { '$first': '$productName' },
            roasterName: { '$first': '$roasterName' },
            details: { '$first': '$details' }
        };

        let groupByProduct = {
            _id: {
                productId: '$productId'
            },
            dateString: { '$first': '$dateString' },
            productId: { '$first': '$productId' },
            productName: { '$first': '$productName' },
            roasterName: { '$first': '$roasterName' },
            details: { '$first': '$details' },
            updates: { '$push': {
                dateString: '$_id.dateString',
                count: '$count'
            }}
        };

        let aggregate = [{
            '$match': match
        }, {
            '$lookup': lookup
        }, {
            '$match': matchCreated
        }, {
            '$group': groupByProductAndDate
        }, {
            '$group': groupByProduct
        }];

        let rawResults = await this.aggregate(aggregate);
        let results = rawResults.map(({productId, updates, productName, roasterName, details}) => {
            let detail = (details)? details[0] : {};
            let metrics = detail.metrics || {};
            
            let updateMap = mapUpdatesAcorssDates(updates, dates);

            return {
                productId,
                productName: productName,
                productLink: detail.link,
                productImage: detail.image,
                roasterName: roasterName,
                createDate: metrics.createDate,
                isNew: Object.keys(updateMap).indexOf(metrics.createDate) > -1,
                updates: updateMap
            };
        });

        return results;
    }
}

ProductUpdate.STATUS_AVAILABLE = 'available';
ProductUpdate.STATUS_UNAVAILABLE = 'unavailable';

module.exports = ProductUpdate;