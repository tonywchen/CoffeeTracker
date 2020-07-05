// Proposed Model:
//   _id                database id
//   productId          database id of the product
//   timestamp          timestamp of the udpate
//   status             availability of the product (AVAILABLE, UNAVAILABLE_IMPLICIT, UNAVAILABLE_EXPLICIT)

const BaseModel = require('./base');
const Product = require('./product');

const moment = require('moment');

const getDatesBetween = (from, to) => {
    let fromDate = moment(from).startOf('day');
    let toDate = moment(to).startOf('day');

    let currentDate = fromDate;
    let dates = [];
    while (!fromDate.isAfter(toDate)) {
        dates.push(currentDate.format('YYYY/MM/DD'));
        currentDate = currentDate.add(1, 'day');
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

    static async findRecent(from, to) {
        let dates = getDatesBetween(from, to);

        let match = {
            timestamp: {
                '$gte': from,
                '$lt': to
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

    static async findNew(from, to) {
        let dates = getDatesBetween(from, to);

        let match = {
            timestamp: {
                '$gte': from,
                '$lt': to
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
            'details.metrics.created': {
                '$gte': from,
                '$lt': to
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