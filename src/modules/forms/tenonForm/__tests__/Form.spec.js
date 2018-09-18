jest.mock('uuid/v4');

import React from 'react';
import { cleanup, fireEvent, render } from 'react-testing-library';
import 'jest-dom/extend-expect';
import Form from '../Form';
import { validator } from '../../../utils/helpers/validationHelpers';
import { isRequired } from '../../../utils/data/validation';
import uuidv4 from 'uuid/v4';

describe('Form', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        uuidv4
            .mockReturnValueOnce('inputLabelId')
            .mockReturnValueOnce('errorId')
            .mockReturnValueOnce('contentHintId')
            .mockReturnValueOnce('inputLabelId2')
            .mockReturnValueOnce('errorId2')
            .mockReturnValueOnce('contentHintId2');
    });

    afterEach(cleanup);

    it('should call the child render with a collection of form control values, a validity flag and a hasSubmitted flag', () => {
        let formControlsReference = null;
        let validityReference = null;
        let hasSubmittedReference = null;

        render(
            <Form onSubmit={jest.fn()}>
                {({ formControls, validity, hasSubmitted }) => {
                    formControlsReference = formControls;
                    validityReference = validity;
                    hasSubmittedReference = hasSubmitted;
                    return (
                        <div>
                            <Form.TextInputController name="testInput">
                                {({ getInputProps, getLabelProps }) => (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input
                                        </label>
                                        <input {...getInputProps()} />
                                    </div>
                                )}
                            </Form.TextInputController>
                            <Form.TextInputController name="testInput2">
                                {({ getInputProps, getLabelProps }) => (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input 2
                                        </label>
                                        <input {...getInputProps()} />
                                    </div>
                                )}
                            </Form.TextInputController>
                        </div>
                    );
                }}
            </Form>
        );

        expect(formControlsReference).toEqual({
            testInput: {
                controlId: 'inputLabelId',
                value: '',
                validity: true,
                errorText: ''
            },
            testInput2: {
                controlId: 'inputLabelId2',
                value: '',
                validity: true,
                errorText: ''
            }
        });
        expect(validityReference).toBeTruthy();
        expect(hasSubmittedReference).toBeFalsy();
    });

    it('should update the hasSubmitted flag once a form submit is attempted', () => {
        let hasSubmittedReference = null;

        const { getByText } = render(
            <Form onSubmit={jest.fn()}>
                {({ formControls, validity, hasSubmitted }) => {
                    hasSubmittedReference = hasSubmitted;
                    return (
                        <div>
                            <Form.TextInputController name="testInput">
                                {({ getInputProps, getLabelProps }) => (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input
                                        </label>
                                        <input {...getInputProps()} />
                                    </div>
                                )}
                            </Form.TextInputController>
                            <button type="submit">Submit</button>
                        </div>
                    );
                }}
            </Form>
        );

        expect(hasSubmittedReference).toBeFalsy();

        fireEvent.click(getByText('Submit'));

        expect(hasSubmittedReference).toBeTruthy();
    });

    it('should support unmounting of components', () => {
        let formControlsReference = null;
        let validityReference = null;

        const updateInfo = ({ formControls, validity }) => {
            formControlsReference = formControls;
            validityReference = validity;
        };

        const FormComponent = ({ hideComponent, updateInfo }) => (
            <Form onSubmit={jest.fn()}>
                {formInfo => {
                    updateInfo(formInfo);
                    return (
                        <div>
                            <Form.TextInputController name="testInput">
                                {({ getInputProps, getLabelProps }) => (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input
                                        </label>
                                        <input {...getInputProps()} />
                                    </div>
                                )}
                            </Form.TextInputController>
                            {hideComponent ? null : (
                                <Form.TextInputController name="testInput2">
                                    {({ getInputProps, getLabelProps }) => (
                                        <div>
                                            <label {...getLabelProps()}>
                                                Test input 2
                                            </label>
                                            <input {...getInputProps()} />
                                        </div>
                                    )}
                                </Form.TextInputController>
                            )}
                        </div>
                    );
                }}
            </Form>
        );

        const { rerender } = render(
            <FormComponent hideComponent={false} updateInfo={updateInfo} />
        );
        expect(Object.keys(formControlsReference)).toEqual([
            'testInput',
            'testInput2'
        ]);
        rerender(
            <FormComponent hideComponent={true} updateInfo={updateInfo} />
        );
        expect(Object.keys(formControlsReference)).toEqual(['testInput']);
    });

    it('should submit form data for no validations given', () => {
        let submitObjReference = null;

        const onSubmitHandler = submitObj => {
            submitObjReference = submitObj;
        };

        const { getByText, getByLabelText } = render(
            <Form onSubmit={onSubmitHandler}>
                {() => {
                    return (
                        <div>
                            <Form.TextInputController name="testInput">
                                {({ getInputProps, getLabelProps }) => (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input
                                        </label>
                                        <input {...getInputProps()} />
                                    </div>
                                )}
                            </Form.TextInputController>
                            <Form.TextInputController name="testInput2">
                                {({ getInputProps, getLabelProps }) => (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input 2
                                        </label>
                                        <input {...getInputProps()} />
                                    </div>
                                )}
                            </Form.TextInputController>
                            <button type="submit">Submit</button>
                        </div>
                    );
                }}
            </Form>
        );

        const input1 = getByLabelText('Test input');
        input1.value = 'Some text';
        fireEvent.change(input1);

        const input2 = getByLabelText('Test input 2');
        input2.value = 'Some other text';
        fireEvent.change(input2);

        fireEvent.click(getByText('Submit'));
        expect(submitObjReference).toEqual({
            testInput: 'Some text',
            testInput2: 'Some other text'
        });
    });

    it('should only submit form data for a valid form when validation is given', () => {
        let submitObjReference = null;

        const onSubmitHandler = submitObj => {
            submitObjReference = submitObj;
        };

        const { getByText, getByLabelText } = render(
            <Form onSubmit={onSubmitHandler}>
                {() => {
                    return (
                        <div>
                            <Form.TextInputController
                                name="testInput"
                                validators={[
                                    validator(
                                        isRequired,
                                        'A value is required.'
                                    )
                                ]}
                            >
                                {({ getInputProps, getLabelProps }) => (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input
                                        </label>
                                        <input
                                            {...getInputProps({
                                                required: 'required'
                                            })}
                                        />
                                    </div>
                                )}
                            </Form.TextInputController>
                            <Form.TextInputController name="testInput2">
                                {({ getInputProps, getLabelProps }) => (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input 2
                                        </label>
                                        <input {...getInputProps()} />
                                    </div>
                                )}
                            </Form.TextInputController>
                            <button type="submit">Submit</button>
                        </div>
                    );
                }}
            </Form>
        );

        const input2 = getByLabelText('Test input 2');
        input2.value = 'Some other text';
        fireEvent.change(input2);

        fireEvent.click(getByText('Submit'));
        expect(submitObjReference).toBeNull();

        const input1 = getByLabelText('Test input');
        input1.value = 'Some text';
        fireEvent.change(input1);

        fireEvent.click(getByText('Submit'));
        expect(submitObjReference).toEqual({
            testInput: 'Some text',
            testInput2: 'Some other text'
        });
    });

    it('should always call the raw submit function even if validation does not pass', () => {
        let submitObjReference = null;

        const onRawSubmitHandler = submitObj => {
            submitObjReference = submitObj;
        };

        const { getByText, getByLabelText } = render(
            <Form onSubmit={jest.fn()} onRawSubmit={onRawSubmitHandler}>
                {() => {
                    return (
                        <div>
                            <Form.TextInputController
                                name="testInput"
                                validators={[
                                    validator(
                                        isRequired,
                                        'A value is required.'
                                    )
                                ]}
                            >
                                {({ getInputProps, getLabelProps }) => (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input
                                        </label>
                                        <input
                                            {...getInputProps({
                                                required: 'required'
                                            })}
                                        />
                                    </div>
                                )}
                            </Form.TextInputController>
                            <Form.TextInputController name="testInput2">
                                {({ getInputProps, getLabelProps }) => (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input 2
                                        </label>
                                        <input {...getInputProps()} />
                                    </div>
                                )}
                            </Form.TextInputController>
                            <button type="submit">Submit</button>
                        </div>
                    );
                }}
            </Form>
        );

        const input2 = getByLabelText('Test input 2');
        input2.value = 'Some other text';
        fireEvent.change(input2);

        fireEvent.click(getByText('Submit'));
        expect(submitObjReference).toEqual({
            testInput: {
                controlId: 'inputLabelId2',
                errorText: 'A value is required.',
                validity: false,
                value: ''
            },
            testInput2: {
                controlId: 'inputLabelId',
                errorText: '',
                validity: true,
                value: 'Some other text'
            }
        });

        submitObjReference = null;
        const input1 = getByLabelText('Test input');
        input1.value = 'Some text';
        fireEvent.change(input1);

        fireEvent.click(getByText('Submit'));
        expect(submitObjReference).toEqual({
            testInput: {
                controlId: 'inputLabelId2',
                errorText: '',
                validity: true,
                value: 'Some text'
            },
            testInput2: {
                controlId: 'inputLabelId',
                errorText: '',
                validity: true,
                value: 'Some other text'
            }
        });
    });

    it('should allow loading of form data on mount', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
                formData={{
                    testInput: 'value one',
                    testInput2: 'value two'
                }}
            >
                {() => (
                    <div>
                        <Form.TextInputController name="testInput">
                            {({ getInputProps, getLabelProps }) => (
                                <div>
                                    <label {...getLabelProps()}>
                                        Test input
                                    </label>
                                    <input {...getInputProps()} />
                                </div>
                            )}
                        </Form.TextInputController>
                        <Form.TextInputController name="testInput2">
                            {({ getInputProps, getLabelProps }) => (
                                <div>
                                    <label {...getLabelProps()}>
                                        Test input 2
                                    </label>
                                    <input {...getInputProps()} />
                                </div>
                            )}
                        </Form.TextInputController>
                    </div>
                )}
            </Form>
        );

        expect(getByLabelText('Test input')).toHaveAttribute(
            'value',
            'value one'
        );
        expect(getByLabelText('Test input 2')).toHaveAttribute(
            'value',
            'value two'
        );
    });

    it('should allow loading of form data as a prop update', () => {
        const formData = {
            testInput: 'value one',
            testInput2: 'value two'
        };

        const { getByLabelText, rerender } = render(
            <Form onSubmit={jest.fn()} formData={{}}>
                {() => (
                    <div>
                        <Form.TextInputController name="testInput">
                            {({ getInputProps, getLabelProps }) => (
                                <div>
                                    <label {...getLabelProps()}>
                                        Test input
                                    </label>
                                    <input {...getInputProps()} />
                                </div>
                            )}
                        </Form.TextInputController>
                        <Form.TextInputController name="testInput2">
                            {({ getInputProps, getLabelProps }) => (
                                <div>
                                    <label {...getLabelProps()}>
                                        Test input 2
                                    </label>
                                    <input {...getInputProps()} />
                                </div>
                            )}
                        </Form.TextInputController>
                    </div>
                )}
            </Form>
        );

        expect(getByLabelText('Test input')).toHaveAttribute('value', '');
        expect(getByLabelText('Test input 2')).toHaveAttribute('value', '');

        rerender(
            <Form onSubmit={jest.fn()} formData={formData}>
                {() => (
                    <div>
                        <Form.TextInputController name="testInput">
                            {({ getInputProps, getLabelProps }) => (
                                <div>
                                    <label {...getLabelProps()}>
                                        Test input
                                    </label>
                                    <input {...getInputProps()} />
                                </div>
                            )}
                        </Form.TextInputController>
                        <Form.TextInputController name="testInput2">
                            {({ getInputProps, getLabelProps }) => (
                                <div>
                                    <label {...getLabelProps()}>
                                        Test input 2
                                    </label>
                                    <input {...getInputProps()} />
                                </div>
                            )}
                        </Form.TextInputController>
                    </div>
                )}
            </Form>
        );

        expect(getByLabelText('Test input')).toHaveAttribute(
            'value',
            'value one'
        );
        expect(getByLabelText('Test input 2')).toHaveAttribute(
            'value',
            'value two'
        );
    });

    it('should allow loading partial updates', () => {
        const formData = {
            testInput2: 'value two'
        };

        const { getByLabelText, rerender } = render(
            <Form onSubmit={jest.fn()} formData={{}}>
                {() => (
                    <div>
                        <Form.TextInputController name="testInput">
                            {({ getInputProps, getLabelProps }) => (
                                <div>
                                    <label {...getLabelProps()}>
                                        Test input
                                    </label>
                                    <input {...getInputProps()} />
                                </div>
                            )}
                        </Form.TextInputController>
                        <Form.TextInputController name="testInput2">
                            {({ getInputProps, getLabelProps }) => (
                                <div>
                                    <label {...getLabelProps()}>
                                        Test input 2
                                    </label>
                                    <input {...getInputProps()} />
                                </div>
                            )}
                        </Form.TextInputController>
                    </div>
                )}
            </Form>
        );

        expect(getByLabelText('Test input')).toHaveAttribute('value', '');
        expect(getByLabelText('Test input 2')).toHaveAttribute('value', '');

        rerender(
            <Form onSubmit={jest.fn()} formData={formData}>
                {() => (
                    <div>
                        <Form.TextInputController name="testInput">
                            {({ getInputProps, getLabelProps }) => (
                                <div>
                                    <label {...getLabelProps()}>
                                        Test input
                                    </label>
                                    <input {...getInputProps()} />
                                </div>
                            )}
                        </Form.TextInputController>
                        <Form.TextInputController name="testInput2">
                            {({ getInputProps, getLabelProps }) => (
                                <div>
                                    <label {...getLabelProps()}>
                                        Test input 2
                                    </label>
                                    <input {...getInputProps()} />
                                </div>
                            )}
                        </Form.TextInputController>
                    </div>
                )}
            </Form>
        );

        expect(getByLabelText('Test input')).toHaveAttribute('value', '');
        expect(getByLabelText('Test input 2')).toHaveAttribute(
            'value',
            'value two'
        );
    });

    it('should recalc validation if data is pushed into the form', () => {
        let formIsValid = null;
        const formData = {
            testInput: 'value one',
            testInput2: 'value two'
        };

        const { rerender } = render(
            <Form onSubmit={jest.fn()} formData={{}}>
                {({ validity }) => {
                    formIsValid = validity;
                    return (
                        <div>
                            <Form.TextInputController
                                name="testInput"
                                validators={[
                                    validator(
                                        isRequired,
                                        'A value is required.'
                                    )
                                ]}
                            >
                                {({ getInputProps, getLabelProps }) => (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input
                                        </label>
                                        <input {...getInputProps()} />
                                    </div>
                                )}
                            </Form.TextInputController>
                            <Form.TextInputController name="testInput2">
                                {({ getInputProps, getLabelProps }) => (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input 2
                                        </label>
                                        <input {...getInputProps()} />
                                    </div>
                                )}
                            </Form.TextInputController>
                        </div>
                    );
                }}
            </Form>
        );

        expect(formIsValid).toBe(false);

        rerender(
            <Form onSubmit={jest.fn()} formData={formData}>
                {({ validity }) => {
                    formIsValid = validity;
                    return (
                        <div>
                            <Form.TextInputController
                                name="testInput"
                                validators={[
                                    validator(
                                        isRequired,
                                        'A value is required.'
                                    )
                                ]}
                            >
                                {({ getInputProps, getLabelProps }) => (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input
                                        </label>
                                        <input {...getInputProps()} />
                                    </div>
                                )}
                            </Form.TextInputController>
                            <Form.TextInputController name="testInput2">
                                {({ getInputProps, getLabelProps }) => (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input 2
                                        </label>
                                        <input {...getInputProps()} />
                                    </div>
                                )}
                            </Form.TextInputController>
                        </div>
                    );
                }}
            </Form>
        );

        expect(formIsValid).toBe(true);
    });
});
