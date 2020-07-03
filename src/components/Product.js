import React from 'react';

import moment from 'moment';

class Product extends React.Component {
    state = {
        collapsed: false
    };

    toggle = () => {        
        this.setState({
            collapsed: !this.state.collapsed
        });
    };

    render() {
        let {productId, productImage, productName, updates} = this.props.product;
        let currentlyAvailable = false;

        let statuses = Object.keys(updates).sort().map(dateString => {
            let isAvailable = updates[dateString];
            let iconClass = (isAvailable)? 'icon check circle' : 'icon ban';
            let containerClass = (isAvailable)? 'status positive' : 'status negative';

            let date = moment(dateString).format('MM/DD');

            currentlyAvailable = isAvailable;

            return (
                <div className={containerClass}>
                    <div className="status__inner">
                        <div>{date}</div>
                        <i className={iconClass} />
                    </div>
                </div>
            );
        });
        
        let productClasses = [
            'product',
            (this.state.collapsed)? 'product--collapsed' : '',
            (currentlyAvailable)? 'product--available' : 'product--unavailable'
        ];
        let productClassName = productClasses.join(' ');

        let availabilityClassName = (currentlyAvailable)? 'icon check circle' : 'icon ban';

        return (
            <div key={productId} className="item" onClick={this.toggle}>
                <div className={productClassName}>
                    <img src={productImage} className="product__image"></img>
                    <div className="product__name">
                        <div className="product__name-inner">
                        <span className="product__availability">
                                <i className={availabilityClassName}></i>
                            </span>
                            {productName}
                        </div>
                    </div>
                    <div className="statuses">
                        {statuses}
                    </div>
                </div>
            </div>
        );
    }
}

export default Product;