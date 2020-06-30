import React from 'react';
import { connect } from 'react-redux';
import { fetchProducts } from '../actions'; 

import moment from 'moment';

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

        return this.props.products.map(p => {
            let statuses = uniqueUpdates.map(u => {
                let updateExists = p.updates.indexOf(u) > -1;
                let iconClass = (updateExists)? 'icon check circle' : 'icon ban';
                let containerClass = (updateExists)? 'status positive' : 'status negative';

                let date = moment(u).format('MM/DD');

                return (
                    <div className={containerClass}>
                        <div>{date}</div>
                        <i className={iconClass} />
                    </div>
                );
            });

            return (
                <div className="ui relaxed divided list">
                    <div key={p.productId} className="item">
                        <div class="product">
                            <h5 className="product__name">{p.productName}</h5>
                            <div className="statuses">
                                {statuses}
                            </div>
                        </div>
                    </div>
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