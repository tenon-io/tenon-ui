import React, { Component } from 'react';
import { I18n } from 'react-i18next';
import Pane from '../Pane';
import WorkingExample from '../WorkingExample';
import { FocusCatcher, Heading } from '../../../src';
import CodeExample from '../CodeExample';

class SpinnerGuide extends Component {
    render() {
        return (
            <I18n>
                {t => (
                    <Pane heading={t('focusCatcher.heading')}>
                        <WorkingExample
                            heading={t('focusCatcher.example.heading')}
                        >
                            <Heading.H>
                                {t(
                                    'focusCatcher.example.withoutCatcherHeading'
                                )}
                            </Heading.H>
                            <div tabIndex="-1">
                                <label htmlFor="noFocusCatch">
                                    {t(
                                        'focusCatcher.example.withoutCatcherLabel'
                                    )}
                                </label>
                                <input id="noFocusCatch" />
                            </div>

                            <Heading.H style={{ marginTop: '1em' }}>
                                {t('focusCatcher.example.withCatcherHeading')}
                            </Heading.H>
                            <div tabIndex="-1">
                                <FocusCatcher>
                                    <label htmlFor="focusCatch">
                                        {t(
                                            'focusCatcher.example.withCatcherLabel'
                                        )}
                                    </label>
                                    <input id="focusCatch" />
                                </FocusCatcher>
                            </div>
                        </WorkingExample>

                        <CodeExample
                            file="/examples/focusCatcher/focusCatcherExample.js"
                            heading={t('spinner.demo.code.heading')}
                            resetMessage={t('spinner.demo.code.reset')}
                            resetActionText={t('spinner.demo.code.resetAction')}
                        />
                    </Pane>
                )}
            </I18n>
        );
    }
}

export default SpinnerGuide;
