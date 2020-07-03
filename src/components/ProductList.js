import React from 'react';
import { connect } from 'react-redux';

import { fetchProducts } from '../actions'; 

import Product from './Product';

class ProductList extends React.Component {
    componentDidMount() {
        this.props.fetchProducts();
    }

    renderList(products) {
        if (!this.props.products) {
            return 'Empty List';
        }
        
        return products.map(p => {
            return <Product product={p}></Product>
        });
    }

    renderLists() {
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

        console.log(groups);

        return Object.keys(groups).sort().map(roasterName => {
            return (
                <div className="roaster">
                    <div className="roaster__name">
                        {roasterName}
                    </div>
                    <div className="ui divided list">
                        {this.renderList(groups[roasterName])}
                    </div>
                </div>
            );
        });
    }

    render() {
        return (
            <div>
                {this.renderLists()}
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
})(ProductList);