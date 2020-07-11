import React from 'react';
import { connect } from 'react-redux';

import { fetchProducts, fetchNewProducts } from '../actions'; 

import ProductList from './ProductList';

class ProductView extends React.Component {
    componentDidMount() {
        switch(this.props.type) {
            case 'all':
                this.props.fetchProducts();
                break;
            default:
                this.props.fetchNewProducts();
        }
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
                <ProductList title={key} products={groups[key]} />
            );
        });

        return (
            <React.Fragment>
                <div className="view-header mobile hidden">
                    <div className="view-title">{this.props.title}</div>
                    <div className="view-description">{this.props.description}</div>
                </div>
                <div className="view">
                    { contents }
                </div>
            </React.Fragment>
        );
    }

    render() {
        return this.renderView();
    }
}

const mapStateToProps = (state) => {
    return {
        products: state.products
    };
};

export default connect(mapStateToProps, {
    fetchProducts,
    fetchNewProducts
})(ProductView);