import React, { Component } from 'react';
import { I18n } from 'react-i18next';
import Pane from '../Pane';
import WorkingExample from '../WorkingExample';
import CodeExample from '../CodeExample';
import { SpinnerButton } from '../../../src';

class SpinnerButtonGuide extends Component {
    state = {
        showSpinner: false
    };

    onClickHandler = () => {
        this.setState({ showSpinner: true });
        setTimeout(() => {
            this.setState({ showSpinner: false });
        }, 2000);
    };

    render() {
        return (
            <I18n>
                {t => (
                    <Pane heading={t('spinnerButton.demo.heading')}>
                        <WorkingExample
                            heading={t('spinnerButton.demo.example.heading')}
                        >
                            <SpinnerButton
                                className="button-primary spinner-button"
                                onClick={this.onClickHandler}
                                onBusyClick={() => {
                                    alert(
                                        t('spinnerButton.demo.example.isBusy')
                                    );
                                }}
                                busyText={t(
                                    'spinnerButton.demo.example.busyText'
                                )}
                                isBusy={this.state.showSpinner}
                            >
                                {t('spinnerButton.demo.example.text')}
                            </SpinnerButton>
                        </WorkingExample>

                        <CodeExample
                            file="/examples/spinnerButton/spinnerButtonExample.js"
                            heading={t('spinnerButton.demo.code.heading')}
                            resetMessage={t('spinnerButton.demo.code.reset')}
                            resetActionText={t(
                                'spinnerButton.demo.code.resetAction'
                            )}
                        />
                    </Pane>
                )}
            </I18n>
        );
    }
}

export default SpinnerButtonGuide;
