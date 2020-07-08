import React from 'react';

import _ from 'lodash';
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
        let latestStatus;
        let latestContainerClass;
        let latestIconClass;

        let datesToDisplay = _.takeRight(Object.keys(updates).sort(), 5);

        let statuses = datesToDisplay.map(dateString => {
            let isAvailable = updates[dateString];

            let currentStatus = {},
                iconClass = '',
                containerClass = '';

            if (dateString < createDate) {
                currentStatus.isNew = false;
                currentStatus.available = Product.STATUS_NOT_APPLICABLE;
            } else {
                currentStatus.isNew = (dateString === createDate) && isAvailable;
                currentStatus.available = (isAvailable)
                    ? Product.STATUS_AVAILABLE
                    : Product.STATUS_UNAVAILABLE
                ;
            }

            switch (currentStatus.available) {
                case Product.STATUS_NOT_APPLICABLE:
                    containerClass = 'status not-applicable';
                    iconClass = 'icon circle outline'
                    break;
                case Product.STATUS_AVAILABLE:
                    if (currentStatus.isNew) {
                        containerClass = 'status new';
                        iconClass = 'icon fire';
                    } else {
                        containerClass = 'status available';
                        iconClass = 'icon check';                        
                    }
                    break;
                case Product.STATUS_UNAVAILABLE:
                    containerClass = 'status unavailable';
                    iconClass = 'icon ban';
                    break;
                default:
                    break;
            }

            latestStatus = currentStatus;
            latestContainerClass = containerClass;
            latestIconClass = iconClass;

            let date = moment(dateString, 'YYYY/MM/DD').format('MM/DD');

            return (
                <div className={containerClass} key={`${productId}-${date}`}>
                    <div className="status__inner">
                        <i className={iconClass} />
                        <div>{date}</div>
                    </div>
                </div>
            );
        });
        
        let collapsedClass = (this.state.collapsed)? 'product--collapsed' : '';
        let availabilityClass = '';
        switch (latestStatus.available) {
            case Product.STATUS_AVAILABLE:
                availabilityClass = 'product--available';
                break;
            case Product.STATUS_UNAVAILABLE:
                availabilityClass = 'product--unavailable';
                break;
            default:
                // do nothing
        }

        let productClasses = ['product', collapsedClass, availabilityClass];
        let productClassName = productClasses.join(' ');

        return (
            <div className="item" onClick={this.toggle}>
                <div className={productClassName}>
                    <img src={productImage} className="product__image" alt={productName}></img>
                    <div className="product__content">
                        <div className="product__name">
                            <div className="product__name-inner">
                                <span className="product__availability">
                                    <i className={latestIconClass}></i>
                                </span>
                                {productName}
                            </div>
                        </div>
                        <div className="statuses">
                            {statuses}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Product.STATUS_AVAILABLE = 1;
Product.STATUS_NOT_APPLICABLE = 0;
Product.STATUS_UNAVAILABLE = -1;

export default Product;