import React from 'react';
import { connect } from 'react-redux';
import { fetchProducts } from '../actions'; 

class ProductList extends React.Component {
    componentDidMount() {
        this.props.fetchProducts();
    }

    renderList() {
        if (!this.props.products) {
            return 'Empty List';
        }

        const allUpdates = [];
        for (let product of this.props.products) {
            allUpdates.push(...product.updates);
        }
        const uniqueUpdates = Array.from(new Set(allUpdates)).sort();
        console.log(uniqueUpdates.map(u => new Date(u)));

        return this.props.products.map(p => {
            let statuses = uniqueUpdates.map(u => {
                let updateExists = p.updates.indexOf(u) > -1;
                return (updateExists)? 'O' : 'X';
            });

            return (
                <div>
                    {p.productName}
                    -
                    {statuses}
                </div>
            );
        });
    }

    render() {
        return this.renderList();
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