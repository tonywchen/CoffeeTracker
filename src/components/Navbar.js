import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="ui secondary pointing menu">
            <Link to="/" className="item">
                New Products
            </Link>
            <Link to="/all" className="item">
                All Products
            </Link>
        </div>
    );
};

export default Navbar;