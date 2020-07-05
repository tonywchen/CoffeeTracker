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
        let {productId, productImage, productName, updates, createDate} = this.props.product;
        let currentAvailability = 0;

        let statuses = Object.keys(updates).sort().map(dateString => {
            let isAvailable = updates[dateString];

            let iconClass = 'icon ban';
            let containerClass = 'status unavailable';

            if (isAvailable) {
                if (dateString === createDate) {
                    iconClass = 'icon star';
                    currentAvailability = 2;
                    containerClass = 'status new';
                } else {
                    iconClass = 'icon check';
                    currentAvailability = 1;
                    containerClass = 'status available';
                }
            } else {
                currentAvailability = 0;
            }
            let date = moment(dateString, 'YYYY/MM/DD').format('MM/DD');

            return (
                <div className={containerClass} key={`${productId}-${date}`}>
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
            (currentAvailability >= 1)? 'product--available' : 'product--unavailable'
        ];
        let productClassName = productClasses.join(' ');

        let availabilityClassName = 'icon ban';
        switch (currentAvailability) {
            case 1:
                availabilityClassName = 'icon check';
                break;
            case 2:
                availabilityClassName = 'icon star';
                break;
            default:
                break;
        }

        return (
            <div className="item" onClick={this.toggle}>
                <div className={productClassName}>
                    <img src={productImage} className="product__image" alt={productName}></img>
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