import React, { Component } from 'react';
import { SpinnerButton } from '@tenon-ui/tenon-ui';

class SpinnerButtonExample extends Component {
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
            <SpinnerButton
                onClick={this.onClickHandler}
                onBusyClick={() => {
                    alert('The button is still busy.');
                }}
                busyText="Working"
                isBusy={this.state.showSpinner}
            >
                Click me
            </SpinnerButton>
        );
    }
}

export default SpinnerButtonExample;
