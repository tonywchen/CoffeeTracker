import axios from 'axios';

const connect = () => {
    return axios.create({
        baseURL: 'http://0.0.0.0:3001'
    });
};

export default {
    fetchProducts: () => {
        return connect().get('/products', {
            params: {
                dateString: moment().add(1, 'day').format('YYYY-MM-DD')
            }
        });
    },
    fetchNewProducts: () => {
        return connect().get('/products/new', {
            params: {
                dateString: moment().add(1, 'day').format('YYYY-MM-DD')
            }
        });
    }
};