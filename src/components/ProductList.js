import React from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';

import { fetchProducts } from '../actions'; 
import Product from './Product';

class ProductList extends React.Component {
    constructor() {
        super();
        this.mainContent = React.createRef();
    }

    state = {
        collapsed: true,
        isAnimatable: false,
        mainContentHeight: '0px'
    };

    componentDidMount() {
        // `ProductList` behaves like an accordion that can collapse/uncollapse
        // the content. Because of the dynamic nature of the content, it is extremely
        // difficult to animate the collapse/uncollapse using CSS transition only. We
        // rely on React/Javascript to handle this by programmatically set the max-height
        // value to the value of the content height (ie. `scrollHeight`)
        //
        // However, it is not possible to get the correct height of the content until it
        // is rendered once. So we must allow the component to render first in a
        // collapsed state, and then at the first opportunity (ie. componentDidMount)
        // uncollapse it so that it appears the component has a default uncollapsed state
        this.toggle(false);
    }

    toggle = (isManual = true) => {   
        let newCollapsed = !this.state.collapsed;     
        let newMainContentHeight = (newCollapsed)
            ? '0px'
            : this.mainContent.current.scrollHeight + 'px';

        this.setState({
            collapsed: newCollapsed,
            mainContentHeight: newMainContentHeight,
            isAnimatable: isManual
        });
    };

    renderList() {
        if (!this.props.products) {
            return 'Empty List';
        }
        
        return _.sortBy(this.props.products, ['productName']).map(p => {
            return <Product product={p} key={p.productId}></Product>
        });
    }

    render() {
        let toggleClassName = 'content-toggle';
        if (this.state.collapsed) {
            toggleClassName += ' content-toggle--collapsed';
        }

        let mainContentStyle = {
            maxHeight: this.state.mainContentHeight
        };
        if (this.state.isAnimatable) {
            mainContentStyle.transition = 'max-height 0.25s cubic-bezier(0, 0, 0.5, 1)';
        }

        return (
            <div className="content" key={this.props.title} onClick={this.toggle}>
                <div className="content__header">
                    <div className={toggleClassName}>
                        <i className="ui icon chevron down" />
                    </div>
                    <div className="descriptor">From</div>
                    {this.props.title}
                </div>
                <div
                    className="content__main"
                    ref={this.mainContent}
                    style={mainContentStyle}>
                    <div class="list">
                        {this.renderList()}
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, {
    fetchProducts
})(ProductList);