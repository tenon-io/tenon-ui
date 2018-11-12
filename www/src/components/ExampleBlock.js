import React, { Component, Fragment } from 'react';
import CodeBlock from '@tenon-io/tenon-codeblock';
import Notification from '../../../src/modules/notifications/Notification';
import PropTypes from 'prop-types';

class ExampleBlock extends Component {
    static propTypes = {
        file: PropTypes.string,
        codeString: PropTypes.string,
        resetMessage: PropTypes.string.isRequired,
        resetActionText: PropTypes.string.isRequired,
        language: PropTypes.string
    };

    state = {
        showExampleMessage: false
    };

    onClickHandler = () => {
        this.setState({ showExampleMessage: false });
    };

    onResetHandler = () => {
        this.setState({ showExampleMessage: true });
    };

    render() {
        const {
            file,
            codeString,
            resetMessage,
            resetActionText,
            language
        } = this.props;
        return (
            <Fragment>
                <Notification
                    isActive={this.state.showExampleMessage}
                    type="info"
                >
                    <span>{resetMessage}</span>
                    <button
                        type="button"
                        className="dismiss"
                        onClick={this.onClickHandler}
                    >
                        {resetActionText}
                    </button>
                </Notification>
                <CodeBlock
                    codeString={codeString}
                    file={file}
                    language={language || 'jsx'}
                    onReset={this.onResetHandler}
                />
            </Fragment>
        );
    }
}

export default ExampleBlock;
