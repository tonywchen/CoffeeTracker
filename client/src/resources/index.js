import axios from 'axios';
import moment from 'moment';

const serverUrl = 'http://192.168.1.120:3001';

const connect = () => {
    return axios.create({
        baseURL: serverUrl
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