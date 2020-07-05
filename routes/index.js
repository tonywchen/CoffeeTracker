const router = require('express').Router();

const ProductService = require('../service/product-service');

router.get('/', (req, res) => {
    res.send('Hello World!!!')
});

router.get('/products', async (req, res) => {
    let products = await ProductService.findRecentProducts();
    res.send(products);
});

router.get('/products/new', async (req, res) => {
    let products = await ProductService.findNewProducts();
    res.send(products);
});

module.exports = router;