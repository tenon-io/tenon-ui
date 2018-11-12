import React from 'react';
import logo from '../../../demo/src/logo.png';
import { Link } from 'gatsby';

const Header = () => (
    <header className="app-header">
        <a href="#content" className="skip-link">
            Skip to content
        </a>
        <Link to="/">
            <img src={logo} className="app-logo" alt="Logo of Tenon.io" />
        </Link>
        <h1 className="app-title">Tenon-UI Documentation</h1>
        <a href="https://github.com/tenon-io/tenon-ui">Code on GitHub</a>
    </header>
);

export default Header;
