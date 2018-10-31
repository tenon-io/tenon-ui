import React from 'react';
import logo from '../../../demo/src/logo.png';
import { Link } from 'gatsby';

const Header = () => (
    <header className="app-header">
        <Link to="/">
            <img src={logo} className="app-logo" alt="Logo of Tenon.io" />
        </Link>
        <h1 className="app-title">Tenon-UI Documentation</h1>
    </header>
);

export default Header;
