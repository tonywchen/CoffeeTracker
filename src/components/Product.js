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

    _computeStatuses = (updates, dateStrings, createDate) => {
        let statuses = {};
        for (let dateString of dateStrings) {
            let isAvailable = updates[dateString];
            let status = Product.STATUS_NOT_APPLICABLE;

            if (dateString === createDate && isAvailable) {
                status = Product.STATUS_NEW;
            } else if (dateString > createDate) {
                status = (isAvailable)
                    ? Product.STATUS_AVAILABLE
                    : Product.STATUS_UNAVAILABLE;
            }

            statuses[dateString] = status;
        }

        return statuses;
    }

    renderStatuses = (statuses, productId) => {
        return Object.keys(statuses).sort().map((dateString) => {
            let status = statuses[dateString];
            let {iconClass, containerClass} = STATUS_TO_CLASSES[status];

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
    }

    render() {
        let {productId, productImage, productName, updates, createDate} = this.props.product;

        let dateStrings = Object.keys(updates).sort();
        let statuses = this._computeStatuses(updates, dateStrings, createDate);

        let latestDateString = _.last(dateStrings);
        let latestStatus = statuses[latestDateString];
        let latestClasses = STATUS_TO_CLASSES[latestStatus];

        let collapsedClass = (this.state.collapsed)? 'product--collapsed' : '';
        let availabilityClass = latestClasses.availabilityClass;

        let productClasses = ['product', collapsedClass, availabilityClass];
        let productClassName = productClasses.join(' ');

        return (
            <div className="list-item" onClick={this.toggle}>
                <div className={productClassName}>
                    <img src={productImage} className="product__image" alt={productName}></img>
                    <div className="product__content">
                        <div className="product__name">
                            <div className="product__name-inner">
                                <span className="product__availability">
                                    <i className={latestClasses.iconClass}></i>
                                </span>
                                {productName}
                            </div>
                        </div>
                        <div className="statuses">
                            {this.renderStatuses(statuses, productId)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Product.STATUS_NEW = 2;
Product.STATUS_AVAILABLE = 1;
Product.STATUS_NOT_APPLICABLE = 0;
Product.STATUS_UNAVAILABLE = -1;

const STATUS_TO_CLASSES = {};
STATUS_TO_CLASSES[Product.STATUS_NEW] = {
    containerClass: 'status new',
    iconClass: 'icon fire',
    availabilityClass: 'product--available'
};
STATUS_TO_CLASSES[Product.STATUS_AVAILABLE] = {
    containerClass: 'status available',
    iconClass: 'icon check',
    availabilityClass: 'product--available'
};
STATUS_TO_CLASSES[Product.STATUS_NOT_APPLICABLE] = {
    containerClass: 'status not-applicable',
    iconClass: 'icon circle outline',
    availabilityClass: ''
};
STATUS_TO_CLASSES[Product.STATUS_UNAVAILABLE] = {
    containerClass: 'status unavailable',
    iconClass: 'icon ban',
    availabilityClass: 'product--unavailable'
};


export default Product;