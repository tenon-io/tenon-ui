import React, { forwardRef } from 'react';
import classNames from 'classnames';
import FeedbackBlock from '../../../forms/tenonForm/FeedbackBlock';
import { useSelect } from './formHooks';

const Select = forwardRef(
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
            children,
            ...rest
        },
        ref
    ) => {
        const {
            getLabelProps,
            getSelectProps,
            getErrorProps,
            getContentHintProps,
            showError,
            errorText
        } = useSelect(name, validators);

        return (
            <div className="form-group">
                <div className="field-wrapper">
                    <label {...getLabelProps(labelProps)}>
                        {labelText}
                        {required ? (
                            <span aria-hidden="true" className="required">
                                &nbsp;
                                {requiredText || '*'}
                            </span>
                        ) : null}
                    </label>
                    <select
                        ref={ref}
                        className={
                            classNames(className, { 'has-error': showError }) ||
                            null
                        }
                        {...getSelectProps(rest)}
                    >
                        {children}
                    </select>
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

export default Select;
