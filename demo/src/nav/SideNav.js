import React from 'react';
import { Link } from '@reach/router';

const SideNav = () => (
    <nav>
        <ul>
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
                <Link to="/spinner-button">Spinner Button</Link>
            </li>
            <li>
                <Link to="/tabs">Tabs</Link>
            </li>
        </ul>
    </nav>
);

export default SideNav;
