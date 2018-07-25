import React, { Component, Fragment } from 'react';
import CodeBlock from '@tenon-io/tenon-codeblock';
import { Notification } from '../../src/index';
import { Heading } from '../../src/index';

class CodeExample extends Component {
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
            heading,
            resetMessage,
            resetActionText,
            language
        } = this.props;
        return (
            <Fragment>
                <Heading.H>{heading}</Heading.H>
                <Notification
                    isActive={this.state.showExampleMessage}
                    type="info"
                >
                    <span>{resetMessage}</span>
                    <button
                        type="button"
                        className="dismiss-button"
                        onClick={this.onClickHandler}
                    >
                        {resetActionText}
                    </button>
                </Notification>
                <CodeBlock
                    codeString={codeString}
                    file={file}
                    language={language}
                    onReset={this.onResetHandler}
                />
            </Fragment>
        );
    }
}

export default CodeExample;
