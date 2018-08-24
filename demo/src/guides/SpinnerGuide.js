import React, { Component } from 'react';
import { I18n } from 'react-i18next';
import Pane from '../Pane';
import WorkingExample from '../WorkingExample';
import { Spinner } from '../../../src';
import CodeExample from '../CodeExample';

class SpinnerGuide extends Component {
    render() {
        return (
            <I18n>
                {t => (
                    <Pane heading={t('spinner.demo.heading')}>
                        <WorkingExample
                            heading={t('spinner.demo.example.heading')}
                        >
                            <Spinner title="Working" className="demo-spinner" />
                        </WorkingExample>

                        <CodeExample
                            file="/examples/spinner/spinnerExample.js"
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
