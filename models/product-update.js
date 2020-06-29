// Proposed Model:
//   _id                database id
//   productId          database id of the product
//   timestamp          timestamp of the udpate
//   status             availability of the product (AVAILABLE, UNAVAILABLE_IMPLICIT, UNAVAILABLE_EXPLICIT)

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
        return this.constructor.save(getObj());
    }
}

ProductUpdate.STATUS_AVAILABLE = 'available';
ProductUpdate.STATUS_UNAVAILABLE = 'unavailable';

module.exports = ProductUpdate;