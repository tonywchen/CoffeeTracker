// Proposed Model:
//   _id                database id
//   productId          database id of the product
//   timestamp          timestamp of the udpate
//   status             availability of the product (AVAILABLE, UNAVAILABLE, UNKNOWN)

const BaseModel = require('./base');

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
        this.constructor.save(getObj());
    }
}

module.exports = ProductUpdate;