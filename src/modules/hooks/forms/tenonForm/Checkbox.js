import React, { forwardRef } from 'react';
import classNames from 'classnames';
import FeedbackBlock from '../../../forms/tenonForm/FeedbackBlock';
import { useCheckbox } from './formHooks';

const Checkbox = forwardRef(
    (
        {
            name,
            contentHintText,
            labelText,
            labelProps,
            className,
            required,
            requiredText,
            validators,
            ...rest
        },
        ref
    ) => {
        const {
            getLabelProps,
            getCheckboxProps,
            getErrorProps,
            getContentHintProps,
            showError,
            errorText
        } = useCheckbox(name, validators);
        return (
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
        );
    }
);

export default Checkbox;
