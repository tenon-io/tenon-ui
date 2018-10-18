import React from 'react';
import Form from '../../../src/modules/forms/tenonForm/Form';

class ExampleTest extends React.Component {
    render() {
        return (
            <Form
                onSubmit={submitData => {
                    alert(JSON.stringyfy(submitData));
                }}
            >
                {() => (
                    <Form.TextInputController name="petName">
                        {({ getLabelProps, getInputProps }) => (
                            <div>
                                <label {...getLabelProps()}>
                                    Enter your pet's name:
                                </label>
                                <input
                                    {...getInputProps({
                                        className: 'some-class'
                                    })}
                                />
                            </div>
                        )}
                    </Form.TextInputController>
                )}
            </Form>
        );
    }
}

export default ExampleTest;
