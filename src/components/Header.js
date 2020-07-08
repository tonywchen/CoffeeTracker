import React from 'react';
import { NavLink } from 'react-router-dom';

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
            currentMenu: menuLabel,
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
        
        return (
            <header>
                <div className="navbar">
                    <div className="navbar-item" onClick={this.showAbout}>
                        <i className="icon info circle"></i>
                    </div>
                    <div className="navmenu-selector" onClick={this.toggleMenu}>
                        <span className="navmenu-selection">{ this.state.currentMenu }</span>
                        <span className={navmenuToggleClassName}><i className="icon chevron down"/></span>
                    </div>
                    <div className="navbar-item">
                        {/* Empty icon for now to balance out both sides of the navbar */}
                        <i className="icon"></i>
                    </div>
                </div>
                <div className={navmenuClassName}>
                    <NavLink to="/" className="navmenu-item" exact activeClassName="selected" onClick={() => { this.selectMenuItem('New Coffee')}}>
                        <div className="navmenu-item__label">New Coffee</div>
                    </NavLink>
                    <NavLink to="/all" className="navmenu-item" exact activeClassName="selected" onClick={() => { this.selectMenuItem('All Coffee')}}>
                        <div className="navmenu-item__label">All Coffee</div>
                    </NavLink>                    
                </div>
                <div className={aboutClassName}>
                    <div className="about__nav">
                        <i className="icon chevron up" onClick={this.hideAbout}/>
                    </div>
                    <div className="about__content">
                        <div className="brand-logo">
                            COOLBEANS!
                        </div>
                        <p>
                            COOLBEANS! is a coffee stock tracker from various independent coffee roasters across Canada. Discover new coffee offerings or check out all the best coffee Canadian roasters have to offer.
                        </p>
                    </div>
                </div>
            </header>
        );
    };
}

export default Header;