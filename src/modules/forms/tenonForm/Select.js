import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

/**
 * @component
 * A default view component to use with the tenon-ui
 * smart select controller.
 *
 * @prop {string} contentHintText - Text to show as content
 *                hint of the select.
 * @prop {string} errorText - Text to show as error message
 *                of the select.
 * @prop required {function} getLabelProps - Prop getter function
 *              from the smart select controller for the <label>.
 * @prop required {function} getSelectProps - Prop getter function
 *              from the smart select controller for the <select>.
 * @prop {function} getErrorProps - Prop getter function
 *              from the smart select controller for the
 *              error message container.
 * @prop {function} getContentHintProps - Prop getter
 *              function from the smart select controller
 *              for the content hint container.
 * @prop required {string} labelText
 * @prop {object} labelProps - Control prop collection
 *              for the <label>
 * @prop {boolean} showError - A flag to indicate when the
 *              error container should be displayed.
 * @prop {string} className - An optional class string to transfer to the
 *              className prop of the select element.
 * @prop required {React element} children - The <option> tags to render for the
 *              <select> element.
 *
 * NOTE: All props given to this select that does not
 * satisfy one of the above will be passed into the the
 * prop getter function of the input to enrich the select or
 * override already configured default props. Providing
 * extraneous properties that should not be rendered on an
 * <select> in the DOM can create run time errors.
 */
const Select = ({
    contentHintText,
    errorText,
    getLabelProps,
    getSelectProps,
    getErrorProps,
    getContentHintProps,
    labelText,
    labelProps,
    showError,
    className,
    children,
    ...rest
}) => (
    <div className="form-group">
        <div className="field-wrapper">
            <label {...getLabelProps(labelProps)}>{labelText}</label>
            <select
                className={
                    classNames(className, { 'has-error': showError }) || null
                }
                {...getSelectProps(rest)}
            >
                {children}
            </select>
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

Select.displayName = 'Select';

Select.propTypes = {
    children: PropTypes.node.isRequired,
    contentHintText: PropTypes.string,
    errorText: PropTypes.string,
    getLabelProps: PropTypes.func.isRequired,
    getSelectProps: PropTypes.func.isRequired,
    getErrorProps: PropTypes.func,
    getContentHintProps: PropTypes.func,
    labelText: PropTypes.string.isRequired,
    labelProps: PropTypes.object,
    showError: PropTypes.bool,
    className: PropTypes.string
};

export default Select;
