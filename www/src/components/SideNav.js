import React from 'react';
import { Link } from 'gatsby';

const SideNav = () => (
    <nav>
        <ul>
            <li>
                <h2>Information</h2>
                <ul>
                    <li>
                        <Link to="/">Home page</Link>
                    </li>
                    <li>
                        <Link to="/getting-started">Getting Started</Link>
                    </li>
                    <li>
                        <Link to="/styling">Styling</Link>
                    </li>
                </ul>
            </li>
            <li>
                <h2>Components</h2>
                <ul>
                    <li>
                        <Link to="/forms">Smart form components</Link>
                        <ul className="sub-nav">
                            <li>
                                <Link to="/forms-knowledge">
                                    Required knowledge
                                </Link>
                            </li>
                            <li>
                                <Link to="/forms-form-component">
                                    Form component
                                </Link>
                            </li>
                            <li>
                                <Link to="/forms-smart-controllers">
                                    Smart form element controllers
                                </Link>
                            </li>
                            <li>
                                <Link to="/forms-creating-elements">
                                    Creating elements
                                </Link>
                            </li>
                            <li>
                                <Link to="/forms-view-components">
                                    View component usage
                                </Link>
                            </li>
                            <li>
                                <Link to="/create-your-own-view">
                                    Create your own view
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <Link to="/headings">Headings</Link>
                    </li>
                    <li>
                        <Link to="/notifications">Notifications</Link>
                    </li>
                    <li>
                        <Link to="/spinner-button">Spinner Button</Link>
                    </li>
                    <li>
                        <Link to="/tabs">Tabbed interface</Link>
                    </li>
                </ul>
            </li>
            <li>
                <h2>Helper Components</h2>
                <ul>
                    <li>
                        <Link to="/focus-catcher">Focus Catcher</Link>
                    </li>
                    <li>
                        <Link to="/spinner">Spinner</Link>
                    </li>
                </ul>
            </li>
        </ul>
    </nav>
);

export default SideNav;
