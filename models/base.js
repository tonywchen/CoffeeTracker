const mongo = require('mongodb');
const MongoClient = require('../service/mongo');

class BaseModel {

    static collection = '';

    constructor() {
    }

    static _validate() {
        if (!this.collection) {
            throw new Error('collection name not defined');
        }
    }

    static async exists(query) {
        let results = await this.find(query);

        return results.length;
    }

    static async get(id) {
        var _id = new mongo.ObjectID(id);

        return this.findOne({
            _id
        });
    }

    static async find(query) {
        this._validate();

        let db = MongoClient.get();
        let results = await db.collection(this.collection).find(query).toArray();

        return results;
    }

    static async findOne(query) {
        this._validate();

        let db = MongoClient.get();
        let result = await db.collection(this.collection).findOne(query);

        return result;
    }

    static async aggregate(aggregate) {
        this._validate();

        let db = MongoClient.get();
        let results = await db.collection(this.collection).aggregate(aggregate).toArray();

        return results;        
    }

    static async save(obj) {
        this._validate();

        let db = MongoClient.get();
        let dbObj = { ...obj };
        delete dbObj._id;

        await db.collection(this.collection).insertOne(dbObj);

        return dbObj;
    }

    static async update(query, update) {
        this._validate();

        let db = MongoClient.get();
        let result = await db.collection(this.collection).updateOne(query, update);

        return result;
    }
}

module.exports = BaseModel;