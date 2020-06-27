// Proposed Model:
//   _id                databae id
//   name               name of the coffee roaster
//   fid                friendly id to identify the roaster
//   lastUpdated        timestamp that indicates the last time the roaster's website was scraped

const BaseModel = require('./base');

class Roaster extends BaseModel {
    static collection = 'roaster';

    constructor() {
        super();
        this.obj = {}
    }

    static fromObject(object) {
        let roaster = new Roaster();
        roaster.setObj(object);

        return roaster;
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
}

module.exports = Roaster;