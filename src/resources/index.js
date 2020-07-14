import axios from 'axios';
import moment from 'moment';

const connect = () => {
    return axios.create({
        baseURL: 'http://0.0.0.0:3001'
    });
};

export default {
    fetchProducts: () => {
        return connect().get('/products', {
            params: {
                dateString: moment().format('YYYY-MM-DD')
            }
        });
    },
    fetchNewProducts: () => {
        return connect().get('/products/new', {
            params: {
                dateString: moment().format('YYYY-MM-DD')
            }
        });
    }
};