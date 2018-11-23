import React, { Component } from 'react';
import { Disclosure } from '@tenon-io/tenon-ui';

class DisclosureExample extends Component {
    state = {
        allExpanded: false
    };

    onClickHandler = () => {
        this.setState(prevState => ({
            allExpanded: !prevState.allExpanded
        }));
    };

    render() {
        const { allExpanded } = this.state;
        return (
            <div className="disclose-container">
                <button onClick={this.onClickHandler}>
                    Example/collapse all
                </button>
                <div>
                    <Disclosure isExpanded={allExpanded}>
                        <Disclosure.Trigger>
                            Expand/collapse One
                        </Disclosure.Trigger>
                        <Disclosure.Target useHidden="true">
                            <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut
                                enim ad minim veniam, quis nostrud exercitation
                                ullamco laboris nisi ut aliquip ex ea commodo
                                consequat. Duis aute irure dolor in
                                reprehenderit in voluptate velit esse cillum
                                dolore eu fugiat nulla pariatur. Excepteur sint
                                occaecat cupidatat non proident, sunt in culpa
                                qui officia deserunt mollit anim id est laborum
                            </p>
                        </Disclosure.Target>
                    </Disclosure>
                </div>
                <div>
                    <Disclosure isExpanded={allExpanded}>
                        <Disclosure.Trigger>
                            Expand/collapse Two
                        </Disclosure.Trigger>
                        <Disclosure.Target>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut
                                enim ad minim veniam, quis nostrud exercitation
                                ullamco laboris nisi ut aliquip ex ea commodo
                                consequat. Duis aute irure dolor in
                                reprehenderit in voluptate velit esse cillum
                                dolore eu fugiat nulla pariatur. Excepteur sint
                                occaecat cupidatat non proident, sunt in culpa
                                qui officia deserunt mollit anim id est laborum
                            </p>
                        </Disclosure.Target>
                    </Disclosure>
                </div>
            </div>
        );
    }
}

export default DisclosureExample;
