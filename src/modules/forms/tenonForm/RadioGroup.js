import React, { Fragment } from 'react';

const RadioGroup = ({
    legend,
    options,
    getRadioButtonProps,
    getLabelProps,
    contentHintText,
    errorText,
    getErrorProps,
    getContentHintProps,
    showError,
    getLegendProps,
    getRadioGroupProps
}) => (
    <fieldset className="form-group">
        <legend {...getLegendProps()}>{legend}</legend>
        <div
            {...getRadioGroupProps({
                required: 'required'
            })}
        >
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

export default RadioGroup;
