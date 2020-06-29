import axios from 'axios';

const connect = () => {
    return axios.create({
        baseURL: 'http://localhost:3001'
    });
};

export default {
    fetchProducts: () => {
        return connect().get('/products');
    }
};