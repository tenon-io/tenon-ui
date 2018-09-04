import React from 'react';

/**
 * @component
 * A default view component to use with the tenon-ui
 * smart textarea.
 *
 * @prop {string} contentHintText - Text to show as content
 *                hint of the smart input.
 * @prop {string} errorText - Text to show are error message
 *                of the smart input.
 * @prop required {function} getLabelProps - Prop getter function
 *              from the smart input controller for the <label>.
 * @prop required {function} getInputProps - Prop getter function
 *              from the smart input controller for the <input>.
 * @prop {function} getErrorProps - Prop getter function
 *              from the smart input controller for the
 *              error message container.
 * @prop {function} getContentHintProps - Prop getter
 *              function from the smart input controller
 *              for the content hint container.
 * @prop required {string} labelText
 * @prop {object} labelProps - Control prop collection
 *              for the <label>
 * @prop {boolean} showError - A flag to indicate when the
 *              error container should be displayed.
 *
 * NOTE: All props given to this textarea that does not
 * satisfy one of the above will be passed into the
 * prop getter function of the textarea to enrich the textarea or
 * override already configured default props. Providing
 * extraneous properties that should not be rendered on an
 * <textarea> in the DOM can create run time errors.
 */
const TextArea = ({
    contentHintText,
    errorText,
    getLabelProps,
    getInputProps,
    getErrorProps,
    getContentHintProps,
    labelText,
    labelProps,
    showError,
    ...rest
}) => {
    return (
        <div className="group">
            <div className="fieldwrapper">
                <label {...getLabelProps(labelProps)}>{labelText}</label>
                <textarea {...getInputProps(rest)} />
            </div>
            {contentHintText && getContentHintProps ? (
                <div className="infoWrapper">
                    <span {...getContentHintProps()}>{contentHintText}</span>
                </div>
            ) : null}
            {showError && getErrorProps ? (
                <div className="errorWrapper">
                    <span {...getErrorProps()}>{errorText}</span>
                </div>
            ) : null}
        </div>
    );
};

export default TextArea;
