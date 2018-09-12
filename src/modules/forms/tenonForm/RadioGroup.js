import React, { Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import FocusCatcher from '../../utils/components/FocusCatcher';

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
 *              of the group.
 * @prop required {function} getLegendProps - Prop getter function
 *              from the smart radiogroup controller for the <legend>
 *              of the group.
 * @prop required {function} getRadioButtonProps - Prop getter function
 *              from the smart radiogroup controller for each <input>
 *              of the group.
 * @prop required {function} getRadioGroupProps - Prop getter function
 *              from the smart radiogroup controller for the grouping
 *              element carrying the 'radiogroup' role.
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
 */
const RadioGroup = ({
    legend,
    options,
    getRadioButtonProps,
    getLabelProps,
    getLegendProps,
    getRadioGroupProps,
    contentHintText,
    errorText,
    getErrorProps,
    getContentHintProps,
    showError,
    required,
    className
}) => (
    <fieldset className={classNames('form-group', className)}>
        <legend {...getLegendProps()}>{legend}</legend>
        <div
            {...getRadioGroupProps({
                required: required || null
            })}
        >
            <FocusCatcher>
                {Object.keys(options).map(option => (
                    <Fragment key={option}>
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
                    </Fragment>
                ))}
            </FocusCatcher>
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
    </fieldset>
);

RadioGroup.displayName = 'RadioGroup';

RadioGroup.propTypes = {
    legend: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired,
    getRadioButtonProps: PropTypes.func.isRequired,
    getLegendProps: PropTypes.func.isRequired,
    getRadioGroupProps: PropTypes.func.isRequired,
    getLabelProps: PropTypes.func.isRequired,
    getErrorProps: PropTypes.func,
    getContentHintProps: PropTypes.func,
    required: PropTypes.string,
    contentHintText: PropTypes.string,
    errorText: PropTypes.string,
    showError: PropTypes.bool,
    className: PropTypes.string
};

export default RadioGroup;
