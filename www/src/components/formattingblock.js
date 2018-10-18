import Form from '../../../src/modules/forms/tenonForm/Form';
import React from 'react';

<Form.TextInputController name="petName">
    {({ getLabelProps, getInputProps }) => (
        <div>
            <label {...getLabelProps()}>Enter your pet's name:</label>
            <input
                {...getInputProps({
                    className: 'some-class'
                })}
            />
        </div>
    )}
</Form.TextInputController>;
