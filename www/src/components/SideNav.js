import React from 'react';
import { Link } from 'gatsby';

//As we are managing focus manually this is required to tell the code when to focus.
const FocusLink = ({ children, ...props }) => (
    <Link {...props} state={{ focus: true }}>
        {children}
    </Link>
);

const SideNav = () => (
    <nav>
        <ul>
            <li>
                <h2>Information</h2>
                <ul>
                    <li>
                        <FocusLink to="/">Home page</FocusLink>
                    </li>
                    <li>
                        <FocusLink to="/getting-started">
                            Getting Started
                        </FocusLink>
                    </li>
                    <li>
                        <FocusLink to="/styling">Styling</FocusLink>
                    </li>
                </ul>
            </li>
            <li>
                <h2>Components</h2>
                <ul>
                    <li>
                        <FocusLink to="/forms">Smart form components</FocusLink>
                        <ul className="sub-nav">
                            <li>
                                <FocusLink to="/forms-knowledge">
                                    Required knowledge
                                </FocusLink>
                            </li>
                            <li>
                                <FocusLink to="/forms-form-component">
                                    Form component
                                </FocusLink>
                            </li>
                            <li>
                                <FocusLink to="/forms-smart-controllers">
                                    Smart form element controllers
                                </FocusLink>
                            </li>
                            <li>
                                <FocusLink to="/forms-view-components">
                                    View component usage
                                </FocusLink>
                            </li>
                            <li>
                                <FocusLink to="/forms-error-block">
                                    Put it all together with the ErrorBlock
                                </FocusLink>
                            </li>
                            <li>
                                <FocusLink to="/forms-full-demo">
                                    Full Tenon-UI Form demo
                                </FocusLink>
                            </li>
                            <li>
                                <FocusLink to="/forms-create-your-own-input-view">
                                    Create your own Input view
                                </FocusLink>
                            </li>
                            <li>
                                <FocusLink to="/forms-create-your-own-textarea-view">
                                    Create your own Textarea view
                                </FocusLink>
                            </li>
                            <li>
                                <FocusLink to="/forms-create-your-own-select-view">
                                    Create your own Select view
                                </FocusLink>
                            </li>
                            <li>
                                <FocusLink to="/forms-create-your-own-checkbox-view">
                                    Create your own Checkbox view
                                </FocusLink>
                            </li>
                            <li>
                                <FocusLink to="/forms-create-your-own-checkboxgroup-radiogroup-view">
                                    Create your own CheckboxGroup or RadioGroup
                                    view
                                </FocusLink>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <FocusLink to="/headings">Headings</FocusLink>
                    </li>
                    <li>
                        <FocusLink to="/notifications">Notifications</FocusLink>
                    </li>
                    <li>
                        <FocusLink to="/spinner-button">
                            Spinner Button
                        </FocusLink>
                    </li>
                    <li>
                        <FocusLink to="/tabs">Tabbed interface</FocusLink>
                    </li>
                </ul>
            </li>
            <li>
                <h2>Helper Components</h2>
                <ul>
                    <li>
                        <FocusLink to="/code-block">Code block</FocusLink>
                    </li>
                    <li>
                        <FocusLink to="/focus-catcher">Focus Catcher</FocusLink>
                    </li>
                    <li>
                        <FocusLink to="/spinner">Spinner</FocusLink>
                    </li>
                </ul>
            </li>
        </ul>
    </nav>
);

export default SideNav;
