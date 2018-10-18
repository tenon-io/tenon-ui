import React from 'react';
import Form from '../../../src/modules/forms/tenonForm/Form';
import { validator } from '../../../src/modules/utils/helpers/validationHelpers';
import { isLongerThan } from '../../../src/modules/utils/data/validation';

class ExampleTest extends React.Component {
    render() {
        return (
            <Form
                onSubmit={submitData => {
                    alert(JSON.stringyfy(submitData));
                }}
            >
                {() => (
                    <>
                        <Form.TextInputController
                            name="petName"
                            validators={[
                                validator(
                                    isLongerThan(3),
                                    'The name is not long enough.'
                                )
                            ]}
                        >
                            {({
                                getLabelProps,
                                getInputProps,
                                getErrorProps,
                                getContentHintProps,
                                showError,
                                errorText
                            }) => (
                                <div>
                                    <label {...getLabelProps()}>
                                        Enter your pet's name:
                                    </label>
                                    <input {...getInputProps()} />
                                    <div
                                        {...getContentHintProps({
                                            className: 'content-hint-container'
                                        })}
                                    >
                                        The name should be longer than 3
                                        characters.
                                    </div>
                                    {showError && (
                                        <div
                                            {...getErrorProps({
                                                className: 'error-container'
                                            })}
                                        >
                                            {errorText}
                                        </div>
                                    )}
                                </div>
                            )}
                        </Form.TextInputController>
                        <button>Submit</button>
                    </>
                )}
            </Form>
        );
    }
}

export default ExampleTest;
