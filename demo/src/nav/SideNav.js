import React from 'react';
import { Link } from '@reach/router';

const SideNav = () => (
    <nav>
        <ul>
            <li>
                <h2>Tenon-ui</h2>
            </li>
            <li>
                <h2>Components</h2>
            </li>
            <li>
                <h2>Helper Components</h2>
            </li>
            <li>
                <Link to="/focus-catcher">Focus Catcher</Link>
            </li>
            <li>
                <Link to="/forms">Forms</Link>
            </li>
            <li>
                <Link to="/heading">Heading</Link>
            </li>
            <li>
                <Link to="/notification">Notification</Link>
            </li>
            <li>
                <Link to="/spinner">Spinner</Link>
            </li>
            <li>
                <Link to="/spinner-button">Spinner Button</Link>
            </li>
            <li>
                <Link to="/tabs">Tabs</Link>
            </li>
        </ul>
    </nav>
);

export default SideNav;
