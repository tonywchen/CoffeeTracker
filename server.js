const express = require('express')
const app = express()
const port = 3000

const MongoClient = require('./service/mongo');

app.use(require('./routes'));

MongoClient.connect();

app.listen(port, () => console.log(`Example app listening at http://0.0.0.0:${port}`))