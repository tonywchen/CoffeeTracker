import React from 'react';
import ReactTooltip from 'react-tooltip';

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
    }

    renderData = (tastingNotes = []) => {
        if (tastingNotes.length === 0) {
            return null;
        }

        let tags = tastingNotes.map(tastingNotes => {
            return (
                <div className="tag" key={tastingNotes}>
                    {tastingNotes}
                </div>
            );
        });

        return (
            <div className="product__data">
                <div className="tags">
                    {tags}
                </div>
            </div>
        )
    }

    renderStatuses = (statuses, productId) => {
        return Object.keys(statuses).sort().map((dateString) => {
            let status = statuses[dateString];
            let {iconClass, containerClass, tooltip} = STATUS_DATA[status];

            let date = moment(dateString, DATE_FORMAT).format(DATE_FORMAT_SHORT);

            return (
                <>
                    <div
                        className={containerClass} 
                        key={`${productId}-${date}`} 
                        data-tip={tooltip}>
                        <div className="status__inner">
                            <i className={iconClass} />
                            <div>{date}</div>
                        </div>
                    </div>
                    <ReactTooltip delayShow={100} border borderColor="rgba(255, 255, 255, 0.15)"></ReactTooltip>
                </>
            );
        });
    }

    render() {
        let {productId, productImage, productName, productLink, statuses, createDate, tastingNotes} = this.props.product;

        let dateStrings = Object.keys(statuses).sort();
        let latestDateString = _.last(dateStrings);
        let latestStatus = statuses[latestDateString];
        let latestClasses = STATUS_DATA[latestStatus];

        let collapsedClass = (this.state.collapsed)? 'product--collapsed' : '';
        let availabilityClass = latestClasses.availabilityClass;

        let productClasses = ['product', collapsedClass, availabilityClass];
        let productClassName = productClasses.join(' ');

        return (
            <div className="list-item" data-createdate={createDate} data-productid={productId}>
                <div className={productClassName}>
                    <LazyImage src={productImage} className="product__image" alt={productName}></LazyImage>
                    <div className="product__content">
                        <div className="product__header">
                            <div className="product__name">
                                {productName}
                            </div>
                            <div className="product__action">
                                <a href={productLink} target="_blank" rel="noopener noreferrer">
                                    <i className="ui icon chain"></i>
                                </a>
                            </div>
                        </div>
                        {this.renderData(tastingNotes)}
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

const STATUS_DATA = {};
STATUS_DATA[Product.STATUS_NEW] = {
    containerClass: 'status new',
    iconClass: 'icon fire',
    availabilityClass: 'product--available',
    tooltip: 'This bean is newly released!'
};
STATUS_DATA[Product.STATUS_AVAILABLE] = {
    containerClass: 'status available',
    iconClass: 'icon check',
    availabilityClass: 'product--available',
    tooltip: 'This bean is in stock'
};
STATUS_DATA[Product.STATUS_PARTIALLY_AVAILABLE] = {
    containerClass: 'status available',
    iconClass: 'icon exclamation',
    availabilityClass: 'product--available',
    tooltip: 'This availability of this bean has fluctuated throughout the day'
};
STATUS_DATA[Product.STATUS_NOT_APPLICABLE] = {
    containerClass: 'status not-applicable',
    iconClass: 'icon circle outline',
    availabilityClass: '',
    tooltip: 'No stock info is available for this bean'
};
STATUS_DATA[Product.STATUS_UNAVAILABLE] = {
    containerClass: 'status unavailable',
    iconClass: 'icon ban',
    availabilityClass: 'product--unavailable',
    tooltip: 'This bean is not in stock'
};
STATUS_DATA[Product.STATUS_UNKNOWN] = {
    containerClass: 'status unknown',
    iconClass: 'icon question',
    availabilityClass: 'product--unknown'
};

export default Product;