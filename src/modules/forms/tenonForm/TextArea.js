import React, { forwardRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import RequiredLabel from '../RequiredLabel';
import FeedbackBlock from './FeedbackBlock';

/**
 * @component
 * A default view component to use with the tenon-ui
 * textarea controller.
 *
 * @prop {string} contentHintText - Text to show as content
 *                hint of the textarea.
 * @prop {string} errorText - Text to show as error message
 *                of the textarea.
 * @prop required {function} getLabelProps - Prop getter function
 *              from the smart textarea controller for the <label>.
 * @prop required {function} getInputProps - Prop getter function
 *              from the smart textarea controller for the <textarea>.
 * @prop {function} getErrorProps - Prop getter function
 *              from the smart textarea controller for the
 *              error message container.
 * @prop {function} getContentHintProps - Prop getter
 *              function from the smart textarea controller
 *              for the content hint container.
 * @prop required {string} labelText
 * @prop {object} labelProps - Control prop collection
 *              for the <label>
 * @prop {boolean} showError - A flag to indicate when the
 *              error container should be displayed.
 * @prop {string} className - An optional class string to transfer to the
 *              className prop of the textarea element.
 * @prop {string} requiredText - An optional text to display next to the
 *              textarea label if the field is required.
 *
 * NOTE: All props given to this textarea that does not
 * satisfy one of the above will be passed into the
 * prop getter function of the textarea to enrich the textarea or
 * override already configured default props. Providing
 * extraneous properties that should not be rendered on an
 * <textarea> in the DOM can create run time errors.
 */
const TextArea = forwardRef(
    (
        {
            contentHintText,
            errorText,
            getLabelProps,
            getTextareaProps,
            getErrorProps,
            getContentHintProps,
            labelText,
            labelProps,
            showError,
            requiredText,
            className,
            ...rest
        },
        ref
    ) => (
        <div className="form-group">
            <div className="field-wrapper">
                <RequiredLabel
                    requiredText={requiredText || null}
                    {...getLabelProps(labelProps)}
                >
                    {labelText}
                </RequiredLabel>
                <textarea
                    ref={ref}
                    className={
                        classNames(className, { 'has-error': showError }) ||
                        null
                    }
                    {...getTextareaProps(rest)}
                />
            </div>
            <FeedbackBlock
                getContentHintProps={getContentHintProps}
                getErrorProps={getErrorProps}
                errorText={errorText}
                contentHintText={contentHintText}
                showError={showError}
            />
        </div>
    )
);

TextArea.displayName = 'TextArea';

TextArea.propTypes = {
    contentHintText: PropTypes.string,
    errorText: PropTypes.string,
    getLabelProps: PropTypes.func.isRequired,
    getTextareaProps: PropTypes.func.isRequired,
    getErrorProps: PropTypes.func,
    getContentHintProps: PropTypes.func,
    labelText: PropTypes.string.isRequired,
    labelProps: PropTypes.object,
    showError: PropTypes.bool,
    className: PropTypes.string,
    requiredText: PropTypes.string
};

export default TextArea;
