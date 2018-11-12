import React, { Component, Fragment } from 'react';
import { Notification } from '@tenon-io/tenon-ui';

class NotificationExample extends Component {
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
            <Fragment>
                <Notification isActive={this.state.showInfoMessage} type="info">
                    <span>This is an information message</span>
                    <button
                        type="button"
                        className="dismiss-button"
                        onClick={this.onDismissHandler}
                    >
                        Dismiss
                    </button>
                </Notification>
                <button onClick={this.onClickHandler}>
                    Show information message
                </button>
            </Fragment>
        );
    }
}

export default NotificationExample;
