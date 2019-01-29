import React, { forwardRef } from 'react';
import classNames from 'classnames';
import FeedbackBlock from '../../../forms/tenonForm/FeedbackBlock';
import { useTextArea } from './formHooks';

const TextArea = forwardRef(
    (
        {
            name,
            contentHintText,
            labelText,
            labelProps,
            required,
            requiredText,
            className,
            validators,
            ...rest
        },
        ref
    ) => {
        const {
            getLabelProps,
            getTextareaProps,
            getErrorProps,
            getContentHintProps,
            showError,
            errorText
        } = useTextArea(name, validators);

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
                    <textarea
                        ref={ref}
                        className={
                            classNames(className, { 'has-error': showError }) ||
                            null
                        }
                        {...getTextareaProps(rest)}
                    />
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

export default TextArea;
