import React, { forwardRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import FeedbackBlock from './FeedbackBlock';

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
 * @prop required {function} getCheckboxProps - Prop getter function
 *              from the smart textinput controller for the
 *              <input type="checkbox">.
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
 * @prop {string} requiredText - And optional string value to display
 *              after the label indicating a required situation.
 *@prop {boolean} required - An optional boolean value indicating whether
 *              the current view component is attached to a required
 *              data model.
 *
 * NOTE: All props given to this input that does not
 * satisfy one of the above will be passed into the the
 * prop getter function of the input to enrich the input or
 * override already configured default props. Providing
 * extraneous properties that should not be rendered on an
 * <input> in the DOM can create run time errors.
 */
const Checkbox = forwardRef(
    (
        {
            contentHintText,
            errorText,
            getLabelProps,
            getCheckboxProps,
            getErrorProps,
            getContentHintProps,
            labelText,
            labelProps,
            showError,
            className,
            required,
            requiredText,
            ...rest
        },
        ref
    ) => (
        <div className="form-group">
            <div className="checkbox-wrapper">
                <input
                    ref={ref}
                    className={
                        classNames(className, { 'has-error': showError }) ||
                        null
                    }
                    {...getCheckboxProps(rest)}
                />
                <label {...getLabelProps(labelProps)}>
                    {labelText}
                    {required ? (
                        <span aria-hidden="true" className="required">
                            &nbsp;
                            {requiredText || '*'}
                        </span>
                    ) : null}
                </label>
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

Checkbox.displayName = 'Checkbox';

Checkbox.propTypes = {
    contentHintText: PropTypes.string,
    errorText: PropTypes.string,
    getLabelProps: PropTypes.func.isRequired,
    getCheckboxProps: PropTypes.func.isRequired,
    getErrorProps: PropTypes.func,
    getContentHintProps: PropTypes.func,
    labelText: PropTypes.string.isRequired,
    labelProps: PropTypes.object,
    showError: PropTypes.bool,
    className: PropTypes.string,
    required: PropTypes.bool,
    requiredText: PropTypes.string
};

export default Checkbox;
