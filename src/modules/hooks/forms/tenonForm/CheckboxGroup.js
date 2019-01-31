import React, { forwardRef } from 'react';
import classNames from 'classnames';
import FocusCatcher from '../../../utils/components/FocusCatcher';
import FeedbackBlock from '../../../forms/tenonForm/FeedbackBlock';
import { useCheckboxGroup } from './formHooks';

const CheckboxGroup = forwardRef(
    (
        {
            name,
            legend,
            options,
            contentHintText,
            required,
            requiredText,
            className,
            validators
        },
        ref
    ) => {
        const {
            getCheckboxProps,
            getLabelProps,
            errorText,
            showError
        } = useCheckboxGroup(name, validators);

        return (
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
        );
    }
);

export default CheckboxGroup;
