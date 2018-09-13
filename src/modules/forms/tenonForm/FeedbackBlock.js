import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const FeedbackBlock = ({
    getContentHintProps,
    getErrorProps,
    showError,
    errorText,
    contentHintText
}) => (
    <Fragment>
        {contentHintText && getContentHintProps ? (
            <div className="info-wrapper">
                <span className="icon" />
                <span {...getContentHintProps()}>{contentHintText}</span>
            </div>
        ) : null}
        {showError && getErrorProps ? (
            <div className="error-wrapper">
                <span className="icon" />
                <span {...getErrorProps()}>{errorText}</span>
            </div>
        ) : null}
    </Fragment>
);

FeedbackBlock.displayName = 'FeedbackBlock';

FeedbackBlock.propTypes = {
    getContentHintProps: PropTypes.func,
    getErrorProps: PropTypes.func,
    showError: PropTypes.bool,
    errorText: PropTypes.string,
    contentHintText: PropTypes.string
};

export default FeedbackBlock;
