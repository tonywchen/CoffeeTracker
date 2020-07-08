import React from 'react';
import { NavLink } from 'react-router-dom';

class Navbar extends React.Component {
    render() {
        return (
            <div className="navbar">
                <NavLink to="/" className="nav-item" exact activeClassName="selected">
                    <div><i className="nav-icon icon fire"></i></div>
                    <div className="nav-label">New Coffee</div>
                </NavLink>
                <NavLink to="/all" className="nav-item" exact activeClassName="selected">
                    <div><i className="nav-icon icon list"></i></div>
                    <div className="nav-label">All Coffee</div>
                </NavLink>
            </div>
        );
    };
}

export default Navbar;