const express = require('express')
const app = express()
const port = 3000

app.use(require('./routes'));

app.listen(port, () => console.log(`Example app listening at http://0.0.0.0:${port}`))