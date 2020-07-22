import React from 'react';

import _ from 'lodash';
import moment from 'moment';

import LazyImage from '../common/LazyImage';

import {DATE_FORMAT, DATE_FORMAT_SHORT} from '../../const';

class Product extends React.Component {
    state = {
        collapsed: false
    };

    toggle = () => {        
        this.setState({
            collapsed: !this.state.collapsed
        });
    };

    renderStatuses = (statuses, productId) => {
        return Object.keys(statuses).sort().map((dateString) => {
            let status = statuses[dateString];
            let {iconClass, containerClass} = STATUS_TO_CLASSES[status];

            let date = moment(dateString, DATE_FORMAT).format(DATE_FORMAT_SHORT);

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
        let {productId, productImage, productName, productLink, statuses, createDate} = this.props.product;

        let dateStrings = Object.keys(statuses).sort();
        let latestDateString = _.last(dateStrings);
        let latestStatus = statuses[latestDateString];
        let latestClasses = STATUS_TO_CLASSES[latestStatus];

        let collapsedClass = (this.state.collapsed)? 'product--collapsed' : '';
        let availabilityClass = latestClasses.availabilityClass;

        let productClasses = ['product', collapsedClass, availabilityClass];
        let productClassName = productClasses.join(' ');

        return (
            <div className="list-item" data-createDate={createDate} data-productId={productId}>
                <div className={productClassName}>
                    <LazyImage src={productImage} className="product__image" alt={productName}></LazyImage>
                    <div className="product__content">
                        <div className="product__header">
                            <div className="product__name">
                                {productName}
                            </div>
                            <div className="product__action">
                                <a href={productLink} target="_blank" rel="noopener noreferrer">
                                    <i class="ui icon chain"></i>
                                </a>
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

Product.STATUS_NEW = 3;
Product.STATUS_AVAILABLE = 2;
Product.STATUS_PARTIALLY_AVAILABLE = 1;
Product.STATUS_NOT_APPLICABLE = 0;
Product.STATUS_UNAVAILABLE = -1;
Product.STATUS_UNKNOWN = -2;

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
STATUS_TO_CLASSES[Product.STATUS_PARTIALLY_AVAILABLE] = {
    containerClass: 'status available',
    iconClass: 'icon exclamation',
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
STATUS_TO_CLASSES[Product.STATUS_UNKNOWN] = {
    containerClass: 'status unknown',
    iconClass: 'icon question',
    availabilityClass: 'product--unknown'
};

export default Product;