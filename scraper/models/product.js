// Proposed Model:
//   _id                database id
//   fid                friendly id that identifies this product (for now, use the URL link)
//   roaster_fid        friendly id that identifies the roaster this product belongs to
//   name               name of product
//   image              photo/graphics representing the product
//   link               link to the product's page
//   lastStatus         latest availability of the product (AVAILABLE, UNAVAILABLE, UNKNOWN)

const BaseModel = require('./base');

class Product extends BaseModel {
    static collection = 'product';

    constructor() {        
        this.obj = {}
    }

    static fromObject(object) {
        let product = new Product();
        product.setObject(object);

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

module.exports = Product;