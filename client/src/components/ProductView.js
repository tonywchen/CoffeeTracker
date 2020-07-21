import React from 'react';
import { connect } from 'react-redux';

import { fetchProducts, fetchNewProducts } from '../actions'; 

import ProductList from './ProductList';
import CoffeeCup from './CoffeeCup';

class ProductView extends React.Component {
    state = {
        isLoading: true
    };

    componentDidMount() {
        this.props.products.length = 0;

        switch(this.props.type) {
            case 'all':
                this.props.fetchProducts().then(() => {
                    this.setState({
                        isLoading: false
                    });
                });
                break;
            default:
                this.props.fetchNewProducts().then(() => {
                    this.setState({
                        isLoading: false
                    });
                });
        }
    }

    renderView() {
        let contents;
        let viewClassName = 'view';

        if (this.state.isLoading) {
            contents = (
                <div className="view-loader">
                    <div className="loader-icon">
                        <CoffeeCup></CoffeeCup>
                    </div>
                    <div>Caffenating the list...</div>
                </div>
            );
            viewClassName = 'view view--stretch view--center';
        } else {
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
    
            contents = Object.keys(groups).sort().map(key => {
                let contentKey = `${this.props.type}_${key}`;
                return (
                    <ProductList key={contentKey} title={key} products={groups[key]} />
                );
            });
        }

        return (
            <React.Fragment>
                <div className="view-header mobile hidden">
                    <div className="view-title">{this.props.title}</div>
                    <div className="view-description">{this.props.description}</div>
                </div>
                <div className={viewClassName}>
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