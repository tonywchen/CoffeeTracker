const express = require('express');
const app = express();
const cors = require('cors');

const config = require('./config.json')

const host = config.server.host;
const port = config.server.port;
const corsOptions = {
    origin: config.domain
};

const MongoClient = require('./service/mongo');

app.use(cors(corsOptions));
app.use(require('./routes'));

MongoClient.connect();

app.listen(port, () => console.log(`Example app listening at ${host}:${port}`))