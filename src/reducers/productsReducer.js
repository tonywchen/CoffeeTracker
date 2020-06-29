import { FETCH_PRODUCTS } from '../actions/types';

export default (products = [], action) => {
    switch (action.type) {
        case FETCH_PRODUCTS:
            return action.payload;
        default:
            return products;
    }
};