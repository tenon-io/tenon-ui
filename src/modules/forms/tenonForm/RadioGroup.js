import React, { forwardRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import FocusCatcher from '../../utils/components/FocusCatcher';
import FeedbackBlock from './FeedbackBlock';

/**
 * @component
 * A default view component to use with the tenon-ui
 * smart radiogroup controller.
 *
 * @prop required {string} legend - Text to show as the legend.
 * @prop required {object} options - Key mapping object to show
 *                the radiobuttons from. The keys are used as
 *                radiobutton values, the values as the labels.
 * @prop {string} contentHintText - Text to show as content
 *                hint of the radiogroup.
 * @prop {string} errorText - Text to show as error message
 *                of the radiogroup.
 * @prop required {function} getLabelProps - Prop getter function
 *              from the smart radiogroup controller for each <label>
 *              of the group. The autoIdPostfix config option should
 *              be set with the value of the radiobutton input or the id
 *              linkage will fail.
 * @prop required {function} getFieldsetProps - Prop getter function
 *              from the smart radiogroup controller for each <input>
 *              of the group. It is required to se the value in this
 *              function or the component will fail.
 * @prop required {function} getRadioFieldsetProps - Prop getter function
 *              from the smart radiogroup controller for the fiedset
 *              element.
 * @prop {function} getErrorProps - Prop getter function
 *              from the smart radiogroup controller for the
 *              error message container.
 * @prop {function} getContentHintProps - Prop getter
 *              function from the smart radiogroup controller
 *              for the content hint container.
 * @prop {boolean} showError - A flag to indicate when the
 *              error container should be displayed.
 * @prop {string} required - Set to 'required' to mark the
 *              radiogroup container as required.
 * @prop {string} className - An optional class string to transfer to the
 *              className prop of the select element.
 * @prop {string} requiredText - And optional string value to display
 *              after the legend indicating a required situation.
 *@prop {boolean} required - An optional boolean value indicating whether
 *              the current view component is attached to a required
 *              data model.
 */
const RadioGroup = forwardRef(
    (
        {
            legend,
            options,
            getRadioButtonProps,
            getLabelProps,
            getFieldsetProps,
            contentHintText,
            errorText,
            showError,
            required,
            requiredText,
            className
        },
        ref
    ) => (
        <fieldset
            className={classNames('form-group', className)}
            {...getFieldsetProps()}
            ref={ref}
        >
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
                {errorText &&
                    showError && (
                        <span className="visually-hidden">
                            &nbsp;
                            {errorText}
                        </span>
                    )}
            </legend>
            <FocusCatcher>
                <ul className="radio-container">
                    {Object.keys(options).map(option => (
                        <li key={option}>
                            <div className="radio-wrapper">
                                <input
                                    {...getRadioButtonProps({
                                        value: option
                                    })}
                                />
                                <label
                                    {...getLabelProps({
                                        autoIdPostfix: option
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

RadioGroup.displayName = 'RadioGroup';

RadioGroup.propTypes = {
    legend: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired,
    getRadioButtonProps: PropTypes.func.isRequired,
    getFieldsetProps: PropTypes.func.isRequired,
    getLabelProps: PropTypes.func.isRequired,
    getErrorProps: PropTypes.func,
    getContentHintProps: PropTypes.func,
    required: PropTypes.bool,
    contentHintText: PropTypes.string,
    errorText: PropTypes.string,
    showError: PropTypes.bool,
    className: PropTypes.string,
    requiredText: PropTypes.string
};

export default RadioGroup;
