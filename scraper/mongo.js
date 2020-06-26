const MongoClient = require('mongodb').MongoClient;

// Connection Settings
const URL = 'mongodb://localhost:27017';
const DBNAME = 'coffee-stock';

// Mongo client variables
const client = new MongoClient(URL);
let db;

const connect = async () => {
    await client.connect();
    
    console.log('success!');
    db = client.db(DBNAME);
};

const get = () => {
    return db;
};

const close = () => {
    if (db) {
        db.close();
    }
};

module.exports = {
    connect,
    get,
    close
};