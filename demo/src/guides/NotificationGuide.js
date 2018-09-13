import React, { Component } from 'react';
import { I18n } from 'react-i18next';
import Pane from '../Pane';
import WorkingExample from '../WorkingExample';
import { Notification } from '../../../src';
import CodeExample from '../CodeExample';

class NotificationGuide extends Component {
    state = {
        showInfoMessage: false
    };

    onClickHandler = () => {
        this.setState({ showInfoMessage: true });
    };

    onDismissHandler = () => {
        this.setState({ showInfoMessage: false });
    };

    render() {
        return (
            <I18n>
                {t => (
                    <Pane heading={t('notification.demo.heading')}>
                        <WorkingExample
                            heading={t('notification.demo.example.heading')}
                        >
                            <Notification
                                isActive={this.state.showInfoMessage}
                                type="info"
                            >
                                <div className="notification-container">
                                    <span>
                                        {t(
                                            'notification.demo.example.infoText'
                                        )}
                                    </span>
                                    <button
                                        type="button"
                                        className="secondary"
                                        onClick={this.onDismissHandler}
                                    >
                                        {t(
                                            'notification.demo.example.infoDismiss'
                                        )}
                                    </button>
                                </div>
                            </Notification>
                            <button
                                className="primary"
                                onClick={this.onClickHandler}
                            >
                                {t('notification.demo.example.showInfo')}
                            </button>
                        </WorkingExample>

                        <CodeExample
                            file="/examples/notification/notificationExample.js"
                            heading={t('notification.demo.code.heading')}
                            resetMessage={t('notification.demo.code.reset')}
                            resetActionText={t(
                                'notification.demo.code.resetAction'
                            )}
                        />
                    </Pane>
                )}
            </I18n>
        );
    }
}

export default NotificationGuide;
