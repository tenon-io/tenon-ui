import React, { Fragment, forwardRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import FocusCatcher from '../../utils/components/FocusCatcher';
import RequiredLegend from '../RequiredLegend';
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
 * @prop required {function} getLegendProps - Prop getter function
 *              from the smart checkbox group controller for the <legend>
 *              of the group.
 * @prop required {function} getCheckboxProps - Prop getter function
 *              from the smart checkbox group controller for each <input>
 *              of the group. It is required to set a name here or the
 *              component will fail.
 * @prop required {function} getCheckboxGroupProps - Prop getter function
 *              from the smart checkbox group controller for the grouping
 *              element carrying the 'group' role.
 * @prop {function} getErrorProps - Prop getter function
 *              from the smart checkbox group controller for the
 *              error message container.
 * @prop {function} getContentHintProps - Prop getter
 *              function from the smart checkbox group controller
 *              for the content hint container.
 * @prop {boolean} showError - A flag to indicate when the
 *              error container should be displayed.
 * @prop {string} required - Set to 'required' to mark the
 *              checkbox group container as required.
 * @prop {string} className - An optional class string to transfer to the
 *              className prop of the select element.
 * @prop {string} requiredText - An optional text to display next to the
 *              legend if the group is required.
 */
const CheckboxGroup = forwardRef(
    (
        {
            legend,
            options,
            getCheckboxProps,
            getLabelProps,
            getLegendProps,
            getCheckboxGroupProps,
            contentHintText,
            errorText,
            getErrorProps,
            getContentHintProps,
            showError,
            required,
            requiredText,
            className
        },
        ref
    ) => (
        <fieldset className={classNames('form-group', className)}>
            <RequiredLegend
                requiredText={requiredText || null}
                isRequired={!!required}
                {...getLegendProps()}
            >
                {legend}
            </RequiredLegend>
            <div ref={ref} {...getCheckboxGroupProps()}>
                <FocusCatcher>
                    {Object.keys(options).map(option => (
                        <Fragment key={option}>
                            <input
                                {...getCheckboxProps({
                                    name: option
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
            <FeedbackBlock
                getContentHintProps={getContentHintProps}
                getErrorProps={getErrorProps}
                errorText={errorText}
                contentHintText={contentHintText}
                showError={showError}
            />
        </fieldset>
    )
);

CheckboxGroup.displayName = 'RadioGroup';

CheckboxGroup.propTypes = {
    legend: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired,
    getGroupCheckboxProps: PropTypes.func.isRequired,
    getLegendProps: PropTypes.func.isRequired,
    getCheckboxGroupProps: PropTypes.func.isRequired,
    getLabelProps: PropTypes.func.isRequired,
    getErrorProps: PropTypes.func,
    getContentHintProps: PropTypes.func,
    required: PropTypes.string,
    contentHintText: PropTypes.string,
    errorText: PropTypes.string,
    showError: PropTypes.bool,
    className: PropTypes.string,
    requiredText: PropTypes.string
};

export default CheckboxGroup;
