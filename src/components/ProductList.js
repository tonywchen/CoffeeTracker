import React from 'react';
import { connect } from 'react-redux';
import { fetchProducts } from '../actions'; 

import moment from 'moment';

const getUniqueTimestamps = (products) => {
    const allTimestamps = [];
    for (let product of products) {
        allTimestamps.push(...product.updates);
    }
    const uniqueTimestamps = Array.from(new Set(allTimestamps)).sort();

    return uniqueTimestamps;
};

class ProductList extends React.Component {
    componentDidMount() {
        this.props.fetchProducts();
    }

    renderList() {
        if (!this.props.products) {
            return 'Empty List';
        }

        const uniqueUpdates = getUniqueTimestamps(this.props.products);

        return this.props.products.map(p => {
            let statuses = uniqueUpdates.map(u => {
                let updateExists = p.updates.indexOf(u) > -1;
                let iconClass = (updateExists)? 'icon check circle' : 'icon ban';
                let containerClass = (updateExists)? 'status positive' : 'status negative';

                let date = moment(u).format('MM/DD');

                return (
                    <div className={containerClass}>
                        <div className="status__inner">
                            <div>{date}</div>
                            <i className={iconClass} />
                        </div>
                    </div>
                );
            });

            return (
                <div key={p.productId} className="item">
                    <div class="product">
                        <img src={p.productImage} className="product__image"></img>
                        <div className="product__name">
                            <div className="product__name-inner">
                                {p.productName}
                            </div>
                        </div>
                        <div className="statuses">
                            {statuses}
                        </div>
                    </div>
                </div>
            );
        });
    }

    render() {
        return (
            <div className="ui divided list">
                {this.renderList()}
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