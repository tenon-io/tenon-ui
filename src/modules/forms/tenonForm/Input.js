import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

/**
 * @component
 * A default view component to use with the tenon-ui
 * smart textinput controller.
 *
 * @prop {string} contentHintText - Text to show as content
 *                hint of the input.
 * @prop {string} errorText - Text to show as error message
 *                of the input.
 * @prop required {function} getLabelProps - Prop getter function
 *              from the smart textinput controller for the <label>.
 * @prop required {function} getInputProps - Prop getter function
 *              from the smart textinput controller for the <input>.
 * @prop {function} getErrorProps - Prop getter function
 *              from the smart textinput controller for the
 *              error message container.
 * @prop {function} getContentHintProps - Prop getter
 *              function from the smart textinput controller
 *              for the content hint container.
 * @prop required {string} labelText
 * @prop {object} labelProps - Control prop collection
 *              for the <label>
 * @prop {boolean} showError - A flag to indicate when the
 *              error container should be displayed.
 * @prop {string} className - An optional class string to transfer to the
 * className prop of the input element.
 *
 * NOTE: All props given to this input that does not
 * satisfy one of the above will be passed into the the
 * prop getter function of the input to enrich the input or
 * override already configured default props. Providing
 * extraneous properties that should not be rendered on an
 * <input> in the DOM can create run time errors.
 */
const Input = ({
    contentHintText,
    errorText,
    getLabelProps,
    getInputProps,
    getErrorProps,
    getContentHintProps,
    labelText,
    labelProps,
    showError,
    className,
    ...rest
}) => (
    <div className="form-group">
        <div className="field-wrapper">
            <label {...getLabelProps(labelProps)}>{labelText}</label>
            <input
                className={
                    classNames(className, { 'has-error': showError }) || null
                }
                {...getInputProps(rest)}
            />
        </div>
        {contentHintText && getContentHintProps ? (
            <div className="info-wrapper">
                <span {...getContentHintProps()}>{contentHintText}</span>
            </div>
        ) : null}
        {showError && getErrorProps ? (
            <div className="error-wrapper">
                <span {...getErrorProps()}>{errorText}</span>
            </div>
        ) : null}
    </div>
);

Input.displayName = 'Input';

Input.propTypes = {
    contentHintText: PropTypes.string,
    errorText: PropTypes.string,
    getLabelProps: PropTypes.func.isRequired,
    getInputProps: PropTypes.func.isRequired,
    getErrorProps: PropTypes.func,
    getContentHintProps: PropTypes.func,
    labelText: PropTypes.string.isRequired,
    labelProps: PropTypes.object,
    showError: PropTypes.bool,
    className: PropTypes.string
};

export default Input;
