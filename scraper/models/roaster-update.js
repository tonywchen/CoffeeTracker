// Proposed Model:
//   _id                database id
//   roaster_id         database id of the roaster
//   timestamp          timestamp when the scraping alert
//   rule               rule used to scrape the website (optional?)
//   status             status of the scraping (SUCCESS, NO_CONNECTION, INVALID, FAIL, etc)

const BaseModel = require('./base');

class RoasterUpdate extends BaseModel {
    static collection = 'roaster_update';

    constructor(roasterId) {        
        this.obj = {
            roasterId: roasterId
        }
    }

    static fromObject(object) {
        let roasterUpdate = new RoasterUpdate();
        roasterUpdate.setObject(object);

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

module.exports = RoasterUpdate;