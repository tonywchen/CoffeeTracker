const router = require('express').Router();

const ProductService = require('../service/product-service');

router.get('/', (req, res) => {
    res.send('Hello World!!!')
});

router.get('/products', async (req, res) => {
    /* let products = await Product.find({});

    let productIds = products.map(p => new mongo.ObjectID(p._id));

    let currentTime = new Date().getTime();
    let twoDaysAgo = currentTime - 86400 * 1000 * 2;
    let withinTwoDays = {
        '$gte': twoDaysAgo,
        '$lt': currentTime
    };

    let productUpdateQuery = {
        timestamp: withinTwoDays
    };

    console.log(productUpdateQuery);

    let productUpdates = await ProductUpdate.find(productUpdateQuery);
    console.log(productUpdates);
    let productUpdateMap = {};
    for (let productUpdate of productUpdates) {
        let productId = productUpdate.productId;

        let productGroup = productUpdateMap[productId];
        if (!productGroup) {
            productGroup = [];
            productUpdateMap[productId] = productGroup;
        }

        productGroup.push(productUpdate);
    }

    for (let product of products) {
        let productId = product._id;

        if (productUpdateMap[productId]) {
            product.updates = productUpdateMap[productId];
        }
    } */

    let products = await ProductService.findRecentProducts();
    res.send(products);
})

module.exports = router;