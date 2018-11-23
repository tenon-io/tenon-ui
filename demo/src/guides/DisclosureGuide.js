import React, { Component } from 'react';
import { I18n } from 'react-i18next';
import Pane from '../Pane';
import WorkingExample from '../WorkingExample';
import CodeExample from '../CodeExample';
import Disclosure from '../../../src/modules/layout/disclosure/Disclosure';

class DisclosureGuide extends Component {
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
            <I18n>
                {t => (
                    <Pane heading={t('disclosure.demo.heading')}>
                        <WorkingExample
                            heading={t('disclosure.demo.example.heading')}
                        >
                            <div className="disclose-container">
                                <button onClick={this.onClickHandler}>
                                    {t(
                                        'disclosure.demo.example.collapseAllButton'
                                    )}
                                </button>
                                <div>
                                    <Disclosure isExpanded={allExpanded}>
                                        <Disclosure.Trigger>
                                            {t(
                                                'disclosure.demo.example.collapseButtonOne'
                                            )}
                                        </Disclosure.Trigger>
                                        <Disclosure.Target useHidden="true">
                                            <p>
                                                Lorem ipsum dolor sit amet,
                                                consectetur adipiscing elit, sed
                                                do eiusmod tempor incididunt ut
                                                labore et dolore magna aliqua.
                                                Ut enim ad minim veniam, quis
                                                nostrud exercitation ullamco
                                                laboris nisi ut aliquip ex ea
                                                commodo consequat. Duis aute
                                                irure dolor in reprehenderit in
                                                voluptate velit esse cillum
                                                dolore eu fugiat nulla pariatur.
                                                Excepteur sint occaecat
                                                cupidatat non proident, sunt in
                                                culpa qui officia deserunt
                                                mollit anim id est laborum
                                            </p>
                                        </Disclosure.Target>
                                    </Disclosure>
                                </div>
                                <div>
                                    <Disclosure isExpanded={allExpanded}>
                                        <Disclosure.Trigger>
                                            {t(
                                                'disclosure.demo.example.collapseButtonTwo'
                                            )}
                                        </Disclosure.Trigger>
                                        <Disclosure.Target>
                                            <p>
                                                Lorem ipsum dolor sit amet,
                                                consectetur adipiscing elit, sed
                                                do eiusmod tempor incididunt ut
                                                labore et dolore magna aliqua.
                                                Ut enim ad minim veniam, quis
                                                nostrud exercitation ullamco
                                                laboris nisi ut aliquip ex ea
                                                commodo consequat. Duis aute
                                                irure dolor in reprehenderit in
                                                voluptate velit esse cillum
                                                dolore eu fugiat nulla pariatur.
                                                Excepteur sint occaecat
                                                cupidatat non proident, sunt in
                                                culpa qui officia deserunt
                                                mollit anim id est laborum
                                            </p>
                                        </Disclosure.Target>
                                    </Disclosure>
                                </div>
                            </div>
                        </WorkingExample>

                        <CodeExample
                            file="/examples/disclosure/disclosureExample.js"
                            heading={t('disclosure.demo.code.heading')}
                            resetMessage={t('disclosure.demo.code.reset')}
                            resetActionText={t(
                                'disclosure.demo.code.resetAction'
                            )}
                        />
                    </Pane>
                )}
            </I18n>
        );
    }
}

export default DisclosureGuide;
