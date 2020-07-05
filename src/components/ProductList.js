import React from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';

import { fetchProducts } from '../actions'; 
import Product from './Product';

class ProductList extends React.Component {
    renderList() {
        if (!this.props.products) {
            return 'Empty List';
        }
        
        return _.sortBy(this.props.products, ['productName']).map(p => {
            return <Product product={p} key={p.productId}></Product>
        });
    }

    render() {
        return (
            <div>
                {this.renderList()}
            </div>
        )
    }
}

export default connect(null, {
    fetchProducts
})(ProductList);