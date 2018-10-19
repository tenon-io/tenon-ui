import React from 'react';
import Form from '../../../src/modules/forms/tenonForm/Form';
import { validator } from '../../../src/modules/utils/helpers/validationHelpers';
import {
    isLongerThan,
    isRequired
} from '../../../src/modules/utils/data/validation';
import Select from '../../../src/modules/forms/tenonForm/Select';

export class ExamplesSelect extends React.Component {
    render() {
        return (
            <Form
                onSubmit={submitData => {
                    alert(JSON.stringify(submitData));
                }}
            >
                {() => (
                    <>
                        <Form.SelectController
                            name="petColour"
                            required="true"
                            validators={[
                                validator(
                                    isRequired,
                                    'Selecting a colour is required.'
                                )
                            ]}
                        >
                            {props => (
                                <Select
                                    {...props}
                                    labelText="Your pet's colour"
                                />
                            )}
                        </Form.SelectController>
                        <button>Submit</button>
                    </>
                )}
            </Form>
        );
    }
}

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
                        <Form.SelectController
                            name="petName"
                            required="true"
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
                        </Form.SelectController>
                        <button>Submit</button>
                    </>
                )}
            </Form>
        );
    }
}

export default ExampleTest;
