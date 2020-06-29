const express = require('express');
const app = express();
const cors = require('cors');

const port = 3001;
const corsOptions = {
    origin: 'http://localhost:3000'
};

const MongoClient = require('./service/mongo');

app.use(cors(corsOptions));
app.use(require('./routes'));

MongoClient.connect();

app.listen(port, () => console.log(`Example app listening at http://0.0.0.0:${port}`))