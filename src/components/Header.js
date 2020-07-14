import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';

const LINKS = [{
    to: '/',
    name: 'New Coffee'
}, {
    to: '/all',
    name: 'All Coffee'
}];   

class Header extends React.Component {
    state = {
        currentMenu: 'New Coffee',
        isMenuOpen: false,
        isAboutOpen: false
    };

    toggleMenu = () => {
        this.setState({
            isMenuOpen: !this.state.isMenuOpen
        });
    }

    selectMenuItem = (menuLabel) => {
        this.setState({
            isMenuOpen: false
        });  
    }

    showAbout = () => {
        this.setState({
            isAboutOpen: true
        });
    }
    hideAbout = () => {
        this.setState({
            isAboutOpen: false
        });
    }

    getCurrentLink = () => {
        let {pathname} = this.props.location;

        for (let link of LINKS) {
            if (link.to === pathname) {
                return link;
            }
        }
        
        return {};
    }

    render() {
        let navmenuToggleClassName = 'navmenu-toggle'
        let navmenuClassName = 'navmenu';
        if (this.state.isMenuOpen) {
            navmenuToggleClassName += ' navmenu-toggle--flipv';
            navmenuClassName += ' navmenu--open';
        }

        let aboutClassName = 'about';
        if (this.state.isAboutOpen) {
            aboutClassName += ' about--show';
        }

        let navLinks = LINKS.map(({to, name}) => {
            return (
                <NavLink to={to} className="navmenu-item" exact activeClassName="selected" onClick={this.selectMenuItem} key={to}>
                    <div className="navmenu-item__label">{name}</div>
                </NavLink>
            )
        });

        let currentLink = this.getCurrentLink();
        let currentLinkName = currentLink.name || '';
        
        return (
            <header>
                <div className="navbar mobile only">
                    <div className="navbar-item" onClick={this.showAbout}>
                        <i className="icon info circle"></i>
                    </div>
                    <div className="navmenu-selector" onClick={this.toggleMenu}>
                        <span className="navmenu-selection">{ currentLinkName }</span>
                        <span className={navmenuToggleClassName}><i className="icon chevron down"/></span>
                    </div>
                    <div className="navbar-item">
                        {/* Empty icon for now to balance out both sides of the navbar */}
                        <i className="icon"></i>
                    </div>
                </div>
                <div className={navmenuClassName}>
                    <div className="brand-logo mobile hidden">
                        COOLBEANS!
                    </div>
                    {navLinks}                   
                </div>
                <div className={aboutClassName}>
                    <div className="about__nav mobile only">
                        <i className="icon chevron up" onClick={this.hideAbout}/>
                    </div>
                    <div className="about__content">
                        <div className="brand-logo mobile only">
                            COOLBEANS!
                        </div>
                        <p>
                            COOLBEANS! is a coffee stock tracker from tracks coffee stocks from various Canadian independent coffee roasters through their websites. Discover new coffee offerings or check out all the best coffee Canadian roasters have to offer.
                        </p>
                    </div>
                </div>
            </header>
        );
    };
}

export default withRouter(Header);