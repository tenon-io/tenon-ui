import React, { Fragment } from 'react';

const RadioGroup = ({
    legend,
    options,
    getRadioButtonProps,
    getLabelProps
}) => (
    <fieldset className="form-group">
        <legend>{legend}</legend>
        {Object.keys(options).map(option => (
            <Fragment>
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
    </fieldset>
);

export default RadioGroup;
