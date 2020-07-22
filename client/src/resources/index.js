import axios from 'axios';
import moment from 'moment';

import {SERVER_URL} from '../config';
import {DATE_FORMAT_ISO} from '../const';

const connect = () => {
    return axios.create({
        baseURL: SERVER_URL
    });
};

export default {
    fetchProducts: () => {
        return connect().get('/products', {
            params: {
                dateString: moment().format(DATE_FORMAT_ISO)
            }
        });
    },
    fetchNewProducts: () => {
        return connect().get('/products/new', {
            params: {
                dateString: moment().format(DATE_FORMAT_ISO)
            }
        });
    }
};