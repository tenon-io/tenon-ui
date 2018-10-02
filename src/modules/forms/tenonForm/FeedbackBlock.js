import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const FeedbackBlock = ({
    getContentHintProps,
    getErrorProps,
    showError,
    errorText,
    contentHintText,
    'aria-hidden': ariaHidden
}) => (
    <Fragment>
        {contentHintText ? (
            <div
                className="info-wrapper"
                aria-hidden={ariaHidden ? ariaHidden : null}
            >
                <span className="icon" />
                {getContentHintProps ? (
                    <span {...getContentHintProps()}>{contentHintText}</span>
                ) : (
                    <span>{contentHintText}</span>
                )}
            </div>
        ) : null}
        {showError ? (
            <div
                className="error-wrapper"
                aria-hidden={ariaHidden ? ariaHidden : null}
            >
                <span className="icon" />
                {getErrorProps ? (
                    <span {...getErrorProps()}>{errorText}</span>
                ) : (
                    <span>{errorText}</span>
                )}
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
    contentHintText: PropTypes.string,
    'aria-hidden': PropTypes.oneOf(['true', 'false'])
};

export default FeedbackBlock;
