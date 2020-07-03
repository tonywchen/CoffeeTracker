import React from 'react';
import { connect } from 'react-redux';

import { fetchProducts } from '../actions'; 

import ProductList from './ProductList';

class ProductView extends React.Component {
    componentDidMount() {
        this.props.fetchProducts();
    }

    renderView() {
        let groups = {};
        for (let product of this.props.products) {
            let roasterName = product.roasterName;
            let group = groups[roasterName];
            if (!group) {
                group = [];
                groups[roasterName] = group;
            }

            group.push(product);
        }

        let contents = Object.keys(groups).sort().map(key => {
            return (
                <div className="content">
                    <div className="content__header">
                        {key}
                    </div>
                    <div className="content__main ui divided list">
                        <ProductList products={groups[key]} />
                    </div>
                </div>
            );
        });

        return (
            <div className="view">
                <h3 className="view__header">
                    Recent Products
                </h3>
                { contents }
            </div>
        );
    }

    render() {
        return (
            <div className="view">
                {this.renderView()}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        products: state.products
    };
};

export default connect(mapStateToProps, {
    fetchProducts
})(ProductView);