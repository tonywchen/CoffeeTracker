// Proposed Model:
//   _id                database id
//   productId          database id of the product
//   timestamp          timestamp of the udpate
//   status             availability of the product (AVAILABLE, UNAVAILABLE_IMPLICIT, UNAVAILABLE_EXPLICIT)

const BaseModel = require('./base');
const Product = require('./product');

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

    static async findWithDetail(from, to) {
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

        let aggregate = [{
            '$match': match
        }, {
            '$lookup': lookup
        }];

        let rawResults = await this.aggregate(aggregate);
        let results = rawResults.map(({productId, timestamp, productName, roasterName, details}) => {
            let detail = (details)? details[0] : {};

            return {
                productId,
                timestamp,
                name: productName,
                link: detail.link,
                image: detail.image,
                roasterName: roasterName
            };
        });
        
        return results;
    }
}

ProductUpdate.STATUS_AVAILABLE = 'available';
ProductUpdate.STATUS_UNAVAILABLE = 'unavailable';

module.exports = ProductUpdate;