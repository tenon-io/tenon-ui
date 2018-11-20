import React, { forwardRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import FocusCatcher from '../../utils/components/FocusCatcher';
import FeedbackBlock from './FeedbackBlock';

/**
 * @component
 * A default view component to use with the tenon-ui
 * smart checkbox group controller.
 *
 * @prop required {string} legend - Text to show as the legend.
 * @prop required {object} options - Key mapping object to show
 *                the checkboxes from. The keys are used as
 *                radiobutton values, the values as the labels.
 * @prop {string} contentHintText - Text to show as content
 *                hint of the checkbox group.
 * @prop {string} errorText - Text to show as error message
 *                of the checkbox group.
 * @prop required {function} getLabelProps - Prop getter function
 *              from the smart checkbox group controller for each <label>
 *              of the group. The autoIdPostfix config option should
 *              be set with the name of the checkbox input or the id
 *              linkage will fail.
 * @prop required {function} getCheckboxProps - Prop getter function
 *              from the smart checkbox group controller for each <input>
 *              of the group. It is required to set a name here or the
 *              component will fail.
 * @prop required {function} getFieldsetProps - Prop getter function
 *              from the smart checkbox group controller for the fieldset
 *              element.
 * @prop {boolean} showError - A flag to indicate when the
 *              error container should be displayed.
 * @prop {string} required - Set to 'required' to mark the
 *              checkbox group container as required.
 * @prop {string} className - An optional class string to transfer to the
 *              className prop of the select element.
 * @prop {string} requiredText - And optional string value to display
 *              after the legend indicating a required situation.
 *@prop {boolean} required - An optional boolean value indicating whether
 *              the current view component is attached to a required
 *              data model.
 */
const CheckboxGroup = forwardRef(
    (
        {
            legend,
            options,
            getCheckboxProps,
            getLabelProps,
            contentHintText,
            errorText,
            showError,
            required,
            requiredText,
            className
        },
        ref
    ) => (
        <fieldset className={classNames('form-group', className)}>
            <legend>
                {legend}
                {required ? (
                    <span className="required">
                        &nbsp;
                        {requiredText || '*'}
                    </span>
                ) : null}
                {contentHintText && (
                    <span className="visually-hidden">
                        &nbsp;
                        {contentHintText}
                    </span>
                )}
                {errorText && showError && (
                    <span className="visually-hidden">
                        &nbsp;
                        {errorText}
                    </span>
                )}
            </legend>
            <FocusCatcher>
                <ul className="checkbox-container">
                    {Object.keys(options).map((option, i) => (
                        <li key={option}>
                            <div className="checkbox-wrapper">
                                <input
                                    {...getCheckboxProps({
                                        name: option,
                                        focusElement: i === 0
                                    })}
                                    ref={i === 0 ? ref : null}
                                />
                                <label
                                    {...getLabelProps({
                                        autoIdPostfix: i === 0 ? '' : option
                                    })}
                                >
                                    {options[option]}
                                </label>
                            </div>
                        </li>
                    ))}
                </ul>
            </FocusCatcher>
            <FeedbackBlock
                errorText={errorText}
                contentHintText={contentHintText}
                showError={showError}
                aria-hidden="true"
            />
        </fieldset>
    )
);

CheckboxGroup.displayName = 'CheckboxGroup';

CheckboxGroup.propTypes = {
    legend: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired,
    getCheckboxProps: PropTypes.func.isRequired,
    getLabelProps: PropTypes.func.isRequired,
    required: PropTypes.bool,
    contentHintText: PropTypes.string,
    errorText: PropTypes.string,
    showError: PropTypes.bool,
    className: PropTypes.string,
    requiredText: PropTypes.string
};

export default CheckboxGroup;
