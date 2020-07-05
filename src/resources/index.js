import axios from 'axios';

const connect = () => {
    return axios.create({
        baseURL: 'http://0.0.0.0:3001'
    });
};

export default {
    fetchProducts: () => {
        return connect().get('/products');
    },
    fetchNewProducts: () => {
        return connect().get('/products/new');
    }
};