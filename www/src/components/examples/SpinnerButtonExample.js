import React, { Component } from 'react';
import SpinnerButton from '../../../../src/modules/forms/SpinnerButton';

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
                className="primary spinner-button"
                onClick={this.onClickHandler}
                onBusyClick={() => {
                    alert('The button is still busy.');
                }}
                busyText="The async action is busy."
                completeText="The async action is complete."
                isBusy={this.state.showSpinner}
            >
                Click me
            </SpinnerButton>
        );
    }
}

export default SpinnerButtonExample;
