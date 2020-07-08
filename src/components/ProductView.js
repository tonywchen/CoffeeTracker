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
                <div className="content" key={key}>
                    <div className="content__header">
                        <div className="descriptor">From</div>
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
                { contents }
            </div>
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