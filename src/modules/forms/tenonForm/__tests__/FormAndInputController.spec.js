jest.mock('uuid/v4');

import React from 'react';
import { cleanup, render, fireEvent } from 'react-testing-library';
import 'jest-dom/extend-expect';
import Form from '../Form';
import InputController from '../InputController';
import { validator } from '../../../utils/helpers/validationHelpers';
import { isRequired, isLongerThan } from '../../../utils/data/validation';
import uuidv4 from 'uuid/v4';

//Tests for InputController registering with Form and the
//Form functionality supporting that.
describe('InputController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        uuidv4
            .mockReturnValueOnce('inputLabelId')
            .mockReturnValueOnce('contentHintId')
            .mockReturnValueOnce('errorId');
    });

    afterEach(cleanup);

    it('should render a standard input and label and decorate with standard props', () => {
        const { getByLabelText, getByText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <InputController name="testInput">
                        {({ getInputProps, getLabelProps }) => (
                            <div>
                                <label {...getLabelProps()}>Test input</label>
                                <input {...getInputProps()} />
                            </div>
                        )}
                    </InputController>
                )}
            </Form>
        );

        const testLabel = getByText('Test input');
        expect(testLabel).toHaveAttribute('for', 'inputLabelId');
        expect(testLabel.attributes.length).toBe(1);

        const testInput = getByLabelText('Test input');
        expect(testInput).toHaveAttribute('id', 'inputLabelId');
        expect(testInput).toHaveAttribute('name', 'testInput');
        expect(testInput).toHaveAttribute('value', '');
        expect(testInput.attributes.length).toBe(4);
    });

    it('should spawn standard and ARIA props for a disabled input', () => {
        const { getByLabelText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <InputController name="testInput">
                        {({ getInputProps, getLabelProps }) => (
                            <div>
                                <label {...getLabelProps()}>Test input</label>
                                <input
                                    {...getInputProps({
                                        disabled: 'disabled'
                                    })}
                                />
                            </div>
                        )}
                    </InputController>
                )}
            </Form>
        );

        const testInput = getByLabelText('Test input');
        expect(testInput).toHaveAttribute('disabled');
        expect(testInput).toHaveAttribute('aria-disabled', 'true');
        expect(testInput.attributes.length).toBe(6);
    });

    it('should spawn standard and ARIA props for a read-only input', () => {
        const { getByLabelText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <InputController name="testInput">
                        {({ getInputProps, getLabelProps }) => (
                            <div>
                                <label {...getLabelProps()}>Test input</label>
                                <input
                                    {...getInputProps({
                                        readOnly: 'readOnly'
                                    })}
                                />
                            </div>
                        )}
                    </InputController>
                )}
            </Form>
        );

        const testInput = getByLabelText('Test input');
        expect(testInput).toHaveAttribute('readonly');
        expect(testInput).toHaveAttribute('aria-readonly', 'true');
        expect(testInput.attributes.length).toBe(6);
    });

    it('should spawn standard and ARIA props for a required input', () => {
        const { getByLabelText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <InputController name="testInput">
                        {({ getInputProps, getLabelProps }) => (
                            <div>
                                <label {...getLabelProps()}>Test input</label>
                                <input
                                    {...getInputProps({
                                        required: 'required'
                                    })}
                                />
                            </div>
                        )}
                    </InputController>
                )}
            </Form>
        );

        const testInput = getByLabelText('Test input');
        expect(testInput).toHaveAttribute('required');
        expect(testInput).toHaveAttribute('aria-required', 'true');
        expect(testInput.attributes.length).toBe(6);
    });

    it('should validate an input and set an error text when appropriate', () => {
        const { getByLabelText, getByTestId, getByText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <div>
                        <InputController
                            name="testInput"
                            validators={[
                                validator(isRequired, 'This field is required.')
                            ]}
                        >
                            {({
                                getInputProps,
                                getLabelProps,
                                getErrorProps,
                                showError,
                                errorText
                            }) => {
                                return (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input
                                        </label>
                                        <input
                                            {...getInputProps({
                                                required: 'required'
                                            })}
                                        />
                                        <div data-testid="errorContainer">
                                            {showError ? (
                                                <span {...getErrorProps()}>
                                                    {errorText}
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                );
                            }}
                        </InputController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        fireEvent.click(getByText('Submit'));

        const input = getByLabelText('Test input');

        expect(getByTestId('errorContainer').firstChild).toHaveTextContent(
            'This field is required.'
        );

        expect(getByTestId('errorContainer').firstChild).toHaveAttribute(
            'id',
            'errorId'
        );

        expect(input).toHaveAttribute('aria-describedby', 'errorId');

        input.value = 'S';
        fireEvent.change(input);
        expect(getByTestId('errorContainer')).toBeEmpty();
        expect(input).not.toHaveAttribute('aria-describedby');

        input.value = 'Some text';
        fireEvent.change(input);
        expect(getByTestId('errorContainer')).toBeEmpty();
        expect(input).not.toHaveAttribute('aria-describedby');

        input.value = '';
        fireEvent.change(input);
        expect(getByTestId('errorContainer').firstChild).toHaveTextContent(
            'This field is required.'
        );
        expect(input).toHaveAttribute('aria-describedby', 'errorId');
    });

    it('should run input validators in sequence to allow for hierarchical control of validation', () => {
        const { getByLabelText, getByTestId, getByText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <div>
                        <InputController
                            name="testInput"
                            validators={[
                                validator(
                                    isRequired,
                                    'This field is required.'
                                ),
                                validator(
                                    isLongerThan(5),
                                    'The entry text should be longer than 5 characters'
                                )
                            ]}
                        >
                            {({
                                getInputProps,
                                getLabelProps,
                                getErrorProps,
                                showError,
                                errorText
                            }) => {
                                return (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input
                                        </label>
                                        <input
                                            {...getInputProps({
                                                required: 'required'
                                            })}
                                        />
                                        <div data-testid="errorContainer">
                                            {showError ? (
                                                <span {...getErrorProps()}>
                                                    {errorText}
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                );
                            }}
                        </InputController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        fireEvent.click(getByText('Submit'));

        expect(getByTestId('errorContainer').firstChild).toHaveTextContent(
            'This field is required.'
        );

        const input = getByLabelText('Test input');
        input.value = 'A';
        fireEvent.change(input);
        expect(getByTestId('errorContainer').firstChild).toHaveTextContent(
            'The entry text should be longer than 5 characters'
        );

        input.value = 'Abcde';
        fireEvent.change(input);
        expect(getByTestId('errorContainer').firstChild).toHaveTextContent(
            'The entry text should be longer than 5 characters'
        );

        input.value = 'Abcdef';
        fireEvent.change(input);
        expect(getByTestId('errorContainer')).toBeEmpty();
    });

    it('should allow a specific validator to be ignored', () => {
        const { getByLabelText, getByTestId, getByText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <div>
                        <InputController
                            name="testInput"
                            validators={[
                                validator(
                                    isRequired,
                                    'This field is required.',
                                    true
                                ),
                                validator(
                                    isLongerThan(5),
                                    'The entry text should be longer than 5 characters'
                                )
                            ]}
                        >
                            {({
                                getInputProps,
                                getLabelProps,
                                getErrorProps,
                                showError,
                                errorText
                            }) => {
                                return (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input
                                        </label>
                                        <input
                                            {...getInputProps({
                                                required: 'required'
                                            })}
                                        />
                                        <div data-testid="errorContainer">
                                            {showError ? (
                                                <span {...getErrorProps()}>
                                                    {errorText}
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                );
                            }}
                        </InputController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        fireEvent.click(getByText('Submit'));
        expect(getByTestId('errorContainer')).toBeEmpty();

        const input = getByLabelText('Test input');
        input.value = 'A';
        fireEvent.change(input);
        expect(getByTestId('errorContainer').firstChild).toHaveTextContent(
            'The entry text should be longer than 5 characters'
        );
    });

    it('should allow the user to specify a content hint', () => {
        const { getByLabelText, getByTestId } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <InputController name="testInput">
                        {({
                            getInputProps,
                            getLabelProps,
                            getContentHintProps
                        }) => {
                            return (
                                <div>
                                    <label {...getLabelProps()}>
                                        Test input
                                    </label>
                                    <input
                                        {...getInputProps({
                                            required: 'required'
                                        })}
                                    />
                                    <div data-testid="contentHintContainer">
                                        <span {...getContentHintProps()}>
                                            Some content hint
                                        </span>
                                    </div>
                                </div>
                            );
                        }}
                    </InputController>
                )}
            </Form>
        );

        expect(getByLabelText('Test input')).toHaveAttribute(
            'aria-describedby',
            'contentHintId'
        );
        expect(getByTestId('contentHintContainer').firstChild).toHaveAttribute(
            'id',
            'contentHintId'
        );
    });

    it('should properly link both a content hint and an error message accessibly', () => {
        const { getByLabelText, getByText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <div>
                        {' '}
                        <InputController
                            name="testInput"
                            validators={[
                                validator(isRequired, 'It is required')
                            ]}
                        >
                            {({
                                getInputProps,
                                getLabelProps,
                                getErrorProps,
                                getContentHintProps,
                                errorText,
                                showError
                            }) => {
                                return (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input
                                        </label>
                                        <input
                                            {...getInputProps({
                                                required: 'required'
                                            })}
                                        />
                                        <div data-testid="contentHintContainer">
                                            <span {...getContentHintProps()}>
                                                Some content hint
                                            </span>
                                        </div>
                                        {showError ? (
                                            <div data-testid="errorContainer">
                                                <span {...getErrorProps()}>
                                                    {errorText}
                                                </span>
                                            </div>
                                        ) : null}
                                    </div>
                                );
                            }}
                        </InputController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        fireEvent.click(getByText('Submit'));

        expect(getByLabelText('Test input')).toHaveAttribute(
            'aria-describedby',
            'contentHintId errorId'
        );

        const input = getByLabelText('Test input');
        input.value = 'A';
        fireEvent.change(input);

        expect(getByLabelText('Test input')).toHaveAttribute(
            'aria-describedby',
            'contentHintId'
        );
    });

    it('should should only display errors after one submit attempt', () => {
        const { getByLabelText, getByText, queryByTestId } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <div>
                        {' '}
                        <InputController
                            name="testInput"
                            validators={[
                                validator(isRequired, 'It is required')
                            ]}
                        >
                            {({
                                getInputProps,
                                getLabelProps,
                                getErrorProps,
                                getContentHintProps,
                                errorText,
                                showError
                            }) => {
                                return (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input
                                        </label>
                                        <input
                                            {...getInputProps({
                                                required: 'required'
                                            })}
                                        />
                                        <div data-testid="contentHintContainer">
                                            <span {...getContentHintProps()}>
                                                Some content hint
                                            </span>
                                        </div>
                                        {showError ? (
                                            <div data-testid="errorContainer">
                                                <span {...getErrorProps()}>
                                                    {errorText}
                                                </span>
                                            </div>
                                        ) : null}
                                    </div>
                                );
                            }}
                        </InputController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        expect(getByLabelText('Test input')).toHaveAttribute(
            'aria-describedby',
            'contentHintId'
        );

        expect(queryByTestId('errorContainer')).toBeNull();

        fireEvent.click(getByText('Submit'));

        expect(getByLabelText('Test input')).toHaveAttribute(
            'aria-describedby',
            'contentHintId errorId'
        );

        expect(queryByTestId('errorContainer')).not.toBeNull();
    });

    it('should should display errors always when alwaysShowErrors is on', () => {
        const { getByLabelText, queryByTestId } = render(
            <Form onSubmit={jest.fn()} alwaysShowErrors={true}>
                {() => (
                    <div>
                        {' '}
                        <InputController
                            name="testInput"
                            validators={[
                                validator(isRequired, 'It is required')
                            ]}
                        >
                            {({
                                getInputProps,
                                getLabelProps,
                                getErrorProps,
                                getContentHintProps,
                                errorText,
                                showError
                            }) => {
                                return (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input
                                        </label>
                                        <input
                                            {...getInputProps({
                                                required: 'required'
                                            })}
                                        />
                                        <div data-testid="contentHintContainer">
                                            <span {...getContentHintProps()}>
                                                Some content hint
                                            </span>
                                        </div>
                                        {showError ? (
                                            <div data-testid="errorContainer">
                                                <span {...getErrorProps()}>
                                                    {errorText}
                                                </span>
                                            </div>
                                        ) : null}
                                    </div>
                                );
                            }}
                        </InputController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        expect(getByLabelText('Test input')).toHaveAttribute(
            'aria-describedby',
            'contentHintId errorId'
        );

        expect(queryByTestId('errorContainer')).not.toBeNull();
    });
});

// Tests for Form specific functionality.
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
                            <InputController name="testInput">
                                {({ getInputProps, getLabelProps }) => (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input
                                        </label>
                                        <input {...getInputProps()} />
                                    </div>
                                )}
                            </InputController>
                            <InputController name="testInput2">
                                {({ getInputProps, getLabelProps }) => (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input 2
                                        </label>
                                        <input {...getInputProps()} />
                                    </div>
                                )}
                            </InputController>
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
                            <InputController name="testInput">
                                {({ getInputProps, getLabelProps }) => (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input
                                        </label>
                                        <input {...getInputProps()} />
                                    </div>
                                )}
                            </InputController>
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
                            <InputController name="testInput">
                                {({ getInputProps, getLabelProps }) => (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input
                                        </label>
                                        <input {...getInputProps()} />
                                    </div>
                                )}
                            </InputController>
                            {hideComponent ? null : (
                                <InputController name="testInput2">
                                    {({ getInputProps, getLabelProps }) => (
                                        <div>
                                            <label {...getLabelProps()}>
                                                Test input 2
                                            </label>
                                            <input {...getInputProps()} />
                                        </div>
                                    )}
                                </InputController>
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
                            <InputController name="testInput">
                                {({ getInputProps, getLabelProps }) => (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input
                                        </label>
                                        <input {...getInputProps()} />
                                    </div>
                                )}
                            </InputController>
                            <InputController name="testInput2">
                                {({ getInputProps, getLabelProps }) => (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input 2
                                        </label>
                                        <input {...getInputProps()} />
                                    </div>
                                )}
                            </InputController>
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
                            <InputController
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
                            </InputController>
                            <InputController name="testInput2">
                                {({ getInputProps, getLabelProps }) => (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input 2
                                        </label>
                                        <input {...getInputProps()} />
                                    </div>
                                )}
                            </InputController>
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
                            <InputController
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
                            </InputController>
                            <InputController name="testInput2">
                                {({ getInputProps, getLabelProps }) => (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test input 2
                                        </label>
                                        <input {...getInputProps()} />
                                    </div>
                                )}
                            </InputController>
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
});
