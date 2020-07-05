import { FETCH_PRODUCTS } from './types';
import resource from '../resources';

export const fetchProducts = () => {
    return async (dispatch) => {
        let response = await resource.fetchProducts();

        dispatch({
            type: FETCH_PRODUCTS,
            payload: response.data
        });
    }
};

export const fetchNewProducts = () => {
    return async (dispatch) => {
        let response = await resource.fetchNewProducts();

        dispatch({
            type: FETCH_PRODUCTS,
            payload: response.data
        });
    }
};