jest.mock('uuid/v4');

import React from 'react';
import { cleanup, fireEvent, render } from 'react-testing-library';
import 'jest-dom/extend-expect';
import Form from '../Form';
import { validator } from '../../../utils/helpers/validationHelpers';
import { isLongerThan, isRequired } from '../../../utils/data/validation';
import uuidv4 from 'uuid/v4';

describe('Form.TextInputController', () => {
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
                    <Form.TextInputController name="testInput">
                        {({ getInputProps, getLabelProps }) => (
                            <div>
                                <label {...getLabelProps()}>Test input</label>
                                <input {...getInputProps()} />
                            </div>
                        )}
                    </Form.TextInputController>
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
                    <Form.TextInputController name="testInput">
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
                    </Form.TextInputController>
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
                    <Form.TextInputController name="testInput">
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
                    </Form.TextInputController>
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
                    <Form.TextInputController name="testInput">
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
                    </Form.TextInputController>
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
                        <Form.TextInputController
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
                        </Form.TextInputController>
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
                        <Form.TextInputController
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
                        </Form.TextInputController>
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
                        <Form.TextInputController
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
                        </Form.TextInputController>
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
                    <Form.TextInputController name="testInput">
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
                    </Form.TextInputController>
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
                        <Form.TextInputController
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
                        </Form.TextInputController>
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

    it('should only display errors after one submit attempt', () => {
        const { getByLabelText, getByText, queryByTestId } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <div>
                        {' '}
                        <Form.TextInputController
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
                        </Form.TextInputController>
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

    it('should display errors always when alwaysShowErrors is on', () => {
        const { getByLabelText, queryByTestId } = render(
            <Form onSubmit={jest.fn()} alwaysShowErrors={true}>
                {() => (
                    <div>
                        {' '}
                        <Form.TextInputController
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
                        </Form.TextInputController>
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

describe('Form.TextareaController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        uuidv4
            .mockReturnValueOnce('textareaId')
            .mockReturnValueOnce('contentHintId')
            .mockReturnValueOnce('errorId');
    });

    afterEach(cleanup);

    it('should render a standard textarea and label and decorate with standard props', () => {
        const { getByLabelText, getByText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <Form.TextareaController name="textTextarea">
                        {({ getTextareaProps, getLabelProps }) => (
                            <div>
                                <label {...getLabelProps()}>
                                    Test textarea
                                </label>
                                <textarea {...getTextareaProps()} />
                            </div>
                        )}
                    </Form.TextareaController>
                )}
            </Form>
        );

        const testLabel = getByText('Test textarea');
        expect(testLabel).toHaveAttribute('for', 'textareaId');
        expect(testLabel.attributes.length).toBe(1);

        const testTextarea = getByLabelText('Test textarea');
        expect(testTextarea).toHaveAttribute('id', 'textareaId');
        expect(testTextarea).toHaveAttribute('name', 'textTextarea');
        expect(testTextarea.value).toBe('');
        expect(testTextarea.attributes.length).toBe(2);
    });

    it('should spawn standard and ARIA props for a disabled textarea', () => {
        const { getByLabelText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <Form.TextareaController name="testTextarea">
                        {({ getTextareaProps, getLabelProps }) => (
                            <div>
                                <label {...getLabelProps()}>
                                    Test textarea
                                </label>
                                <input
                                    {...getTextareaProps({
                                        disabled: 'disabled'
                                    })}
                                />
                            </div>
                        )}
                    </Form.TextareaController>
                )}
            </Form>
        );

        const testTextarea = getByLabelText('Test textarea');
        expect(testTextarea).toHaveAttribute('disabled');
        expect(testTextarea).toHaveAttribute('aria-disabled', 'true');
        expect(testTextarea.attributes.length).toBe(5);
    });

    it('should spawn standard and ARIA props for a read-only textarea', () => {
        const { getByLabelText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <Form.TextareaController name="testTextarea">
                        {({ getTextareaProps, getLabelProps }) => (
                            <div>
                                <label {...getLabelProps()}>
                                    Test textarea
                                </label>
                                <input
                                    {...getTextareaProps({
                                        readOnly: 'readOnly'
                                    })}
                                />
                            </div>
                        )}
                    </Form.TextareaController>
                )}
            </Form>
        );

        const testTextarea = getByLabelText('Test textarea');
        expect(testTextarea).toHaveAttribute('readonly');
        expect(testTextarea).toHaveAttribute('aria-readonly', 'true');
        expect(testTextarea.attributes.length).toBe(5);
    });

    it('should spawn standard and ARIA props for a required textarea', () => {
        const { getByLabelText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <Form.TextareaController name="testTextarea">
                        {({ getTextareaProps, getLabelProps }) => (
                            <div>
                                <label {...getLabelProps()}>
                                    Test textarea
                                </label>
                                <input
                                    {...getTextareaProps({
                                        required: 'required'
                                    })}
                                />
                            </div>
                        )}
                    </Form.TextareaController>
                )}
            </Form>
        );

        const testTextarea = getByLabelText('Test textarea');
        expect(testTextarea).toHaveAttribute('required');
        expect(testTextarea).toHaveAttribute('aria-required', 'true');
        expect(testTextarea.attributes.length).toBe(5);
    });

    it('should validate a textarea and set an error text when appropriate', () => {
        const { getByLabelText, getByTestId, getByText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <div>
                        <Form.TextareaController
                            name="testTextarea"
                            validators={[
                                validator(isRequired, 'This field is required.')
                            ]}
                        >
                            {({
                                getTextareaProps,
                                getLabelProps,
                                getErrorProps,
                                showError,
                                errorText
                            }) => {
                                return (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test textarea
                                        </label>
                                        <input
                                            {...getTextareaProps({
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
                        </Form.TextareaController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        fireEvent.click(getByText('Submit'));

        const textarea = getByLabelText('Test textarea');

        expect(getByTestId('errorContainer').firstChild).toHaveTextContent(
            'This field is required.'
        );

        expect(getByTestId('errorContainer').firstChild).toHaveAttribute(
            'id',
            'errorId'
        );

        expect(textarea).toHaveAttribute('aria-describedby', 'errorId');

        textarea.value = 'S';
        fireEvent.change(textarea);
        expect(getByTestId('errorContainer')).toBeEmpty();
        expect(textarea).not.toHaveAttribute('aria-describedby');

        textarea.value = 'Some text';
        fireEvent.change(textarea);
        expect(getByTestId('errorContainer')).toBeEmpty();
        expect(textarea).not.toHaveAttribute('aria-describedby');

        textarea.value = '';
        fireEvent.change(textarea);
        expect(getByTestId('errorContainer').firstChild).toHaveTextContent(
            'This field is required.'
        );
        expect(textarea).toHaveAttribute('aria-describedby', 'errorId');
    });

    it('should run textarea validators in sequence to allow for hierarchical control of validation', () => {
        const { getByLabelText, getByTestId, getByText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <div>
                        <Form.TextareaController
                            name="textTextarea"
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
                                getTextareaProps,
                                getLabelProps,
                                getErrorProps,
                                showError,
                                errorText
                            }) => {
                                return (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test textarea
                                        </label>
                                        <input
                                            {...getTextareaProps({
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
                        </Form.TextareaController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        fireEvent.click(getByText('Submit'));

        expect(getByTestId('errorContainer').firstChild).toHaveTextContent(
            'This field is required.'
        );

        const textarea = getByLabelText('Test textarea');
        textarea.value = 'A';
        fireEvent.change(textarea);
        expect(getByTestId('errorContainer').firstChild).toHaveTextContent(
            'The entry text should be longer than 5 characters'
        );

        textarea.value = 'Abcde';
        fireEvent.change(textarea);
        expect(getByTestId('errorContainer').firstChild).toHaveTextContent(
            'The entry text should be longer than 5 characters'
        );

        textarea.value = 'Abcdef';
        fireEvent.change(textarea);
        expect(getByTestId('errorContainer')).toBeEmpty();
    });

    it('should allow a specific validator to be ignored', () => {
        const { getByLabelText, getByTestId, getByText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <div>
                        <Form.TextareaController
                            name="testTextarea"
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
                                getTextareaProps,
                                getLabelProps,
                                getErrorProps,
                                showError,
                                errorText
                            }) => {
                                return (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test textarea
                                        </label>
                                        <input
                                            {...getTextareaProps({
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
                        </Form.TextareaController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        fireEvent.click(getByText('Submit'));
        expect(getByTestId('errorContainer')).toBeEmpty();

        const textarea = getByLabelText('Test textarea');
        textarea.value = 'A';
        fireEvent.change(textarea);
        expect(getByTestId('errorContainer').firstChild).toHaveTextContent(
            'The entry text should be longer than 5 characters'
        );
    });

    it('should allow the user to specify a content hint', () => {
        const { getByLabelText, getByTestId } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <Form.TextareaController name="testTextarea">
                        {({
                            getTextareaProps,
                            getLabelProps,
                            getContentHintProps
                        }) => {
                            return (
                                <div>
                                    <label {...getLabelProps()}>
                                        Test textarea
                                    </label>
                                    <input
                                        {...getTextareaProps({
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
                    </Form.TextareaController>
                )}
            </Form>
        );

        expect(getByLabelText('Test textarea')).toHaveAttribute(
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
                        <Form.TextareaController
                            name="textTextarea"
                            validators={[
                                validator(isRequired, 'It is required')
                            ]}
                        >
                            {({
                                getTextareaProps,
                                getLabelProps,
                                getErrorProps,
                                getContentHintProps,
                                errorText,
                                showError
                            }) => {
                                return (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test textarea
                                        </label>
                                        <input
                                            {...getTextareaProps({
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
                        </Form.TextareaController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        fireEvent.click(getByText('Submit'));

        expect(getByLabelText('Test textarea')).toHaveAttribute(
            'aria-describedby',
            'contentHintId errorId'
        );

        const textarea = getByLabelText('Test textarea');
        textarea.value = 'A';
        fireEvent.change(textarea);

        expect(getByLabelText('Test textarea')).toHaveAttribute(
            'aria-describedby',
            'contentHintId'
        );
    });

    it('should only display errors after one submit attempt', () => {
        const { getByLabelText, getByText, queryByTestId } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <div>
                        <Form.TextareaController
                            name="testTextarea"
                            validators={[
                                validator(isRequired, 'It is required')
                            ]}
                        >
                            {({
                                getTextareaProps,
                                getLabelProps,
                                getErrorProps,
                                getContentHintProps,
                                errorText,
                                showError
                            }) => {
                                return (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test textarea
                                        </label>
                                        <input
                                            {...getTextareaProps({
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
                        </Form.TextareaController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        expect(getByLabelText('Test textarea')).toHaveAttribute(
            'aria-describedby',
            'contentHintId'
        );

        expect(queryByTestId('errorContainer')).toBeNull();

        fireEvent.click(getByText('Submit'));

        expect(getByLabelText('Test textarea')).toHaveAttribute(
            'aria-describedby',
            'contentHintId errorId'
        );

        expect(queryByTestId('errorContainer')).not.toBeNull();
    });

    it('should display errors always when alwaysShowErrors is on', () => {
        const { getByLabelText, queryByTestId } = render(
            <Form onSubmit={jest.fn()} alwaysShowErrors={true}>
                {() => (
                    <div>
                        <Form.TextareaController
                            name="testTextarea"
                            validators={[
                                validator(isRequired, 'It is required')
                            ]}
                        >
                            {({
                                getTextareaProps,
                                getLabelProps,
                                getErrorProps,
                                getContentHintProps,
                                errorText,
                                showError
                            }) => {
                                return (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test textarea
                                        </label>
                                        <input
                                            {...getTextareaProps({
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
                        </Form.TextareaController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        expect(getByLabelText('Test textarea')).toHaveAttribute(
            'aria-describedby',
            'contentHintId errorId'
        );

        expect(queryByTestId('errorContainer')).not.toBeNull();
    });
});

describe('Form.SelectController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        uuidv4
            .mockReturnValueOnce('selectId')
            .mockReturnValueOnce('contentHintId')
            .mockReturnValueOnce('errorId');
    });

    afterEach(cleanup);

    it('should render a standard select and label and decorate with standard props', () => {
        const { getByLabelText, getByText, debug } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <Form.SelectController name="testSelect">
                        {({ getSelectProps, getLabelProps }) => (
                            <div>
                                <label {...getLabelProps()}>Test select</label>
                                <select {...getSelectProps()}>
                                    <option value="1">One</option>
                                    <option value="2">One</option>
                                </select>
                            </div>
                        )}
                    </Form.SelectController>
                )}
            </Form>
        );

        const testLabel = getByText('Test select');
        expect(testLabel).toHaveAttribute('for', 'selectId');
        expect(testLabel.attributes.length).toBe(1);

        const testSelect = getByLabelText('Test select');
        expect(testSelect).toHaveAttribute('id', 'selectId');
        expect(testSelect).toHaveAttribute('name', 'testSelect');
        expect(testSelect.value).toBe('1');
        expect(testSelect.attributes.length).toBe(2);
    });

    it('should spawn standard and ARIA props for a disabled select', () => {
        const { getByLabelText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <Form.SelectController name="testSelect">
                        {({ getSelectProps, getLabelProps }) => (
                            <div>
                                <label {...getLabelProps()}>Test select</label>
                                <select
                                    {...getSelectProps({
                                        disabled: 'disabled'
                                    })}
                                >
                                    <option value="1">One</option>
                                    <option value="2">One</option>
                                </select>
                            </div>
                        )}
                    </Form.SelectController>
                )}
            </Form>
        );

        const testSelect = getByLabelText('Test select');
        expect(testSelect).toHaveAttribute('disabled');
        expect(testSelect).toHaveAttribute('aria-disabled', 'true');
        expect(testSelect.attributes.length).toBe(4);
    });

    it('should spawn standard and ARIA props for a required select', () => {
        const { getByLabelText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <Form.SelectController name="testSelect">
                        {({ getSelectProps, getLabelProps }) => (
                            <div>
                                <label {...getLabelProps()}>Test select</label>
                                <select
                                    {...getSelectProps({
                                        required: 'required'
                                    })}
                                >
                                    <option value="1">One</option>
                                    <option value="2">One</option>
                                </select>
                            </div>
                        )}
                    </Form.SelectController>
                )}
            </Form>
        );

        const testSelect = getByLabelText('Test select');
        expect(testSelect).toHaveAttribute('required');
        expect(testSelect).toHaveAttribute('aria-required', 'true');
        expect(testSelect.attributes.length).toBe(4);
    });

    it('should validate a select and set an error text when appropriate', () => {
        const { getByLabelText, getByTestId, getByText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <div>
                        <Form.SelectController
                            name="testSelect"
                            validators={[
                                validator(isRequired, 'This field is required.')
                            ]}
                        >
                            {({
                                getSelectProps,
                                getLabelProps,
                                getErrorProps,
                                showError,
                                errorText
                            }) => {
                                return (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test select
                                        </label>
                                        <select
                                            {...getSelectProps({
                                                required: 'required'
                                            })}
                                        >
                                            <option value="">Default</option>
                                            <option value="1">One</option>
                                            <option value="2">One</option>
                                        </select>
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
                        </Form.SelectController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        fireEvent.click(getByText('Submit'));

        const select = getByLabelText('Test select');

        expect(getByTestId('errorContainer').firstChild).toHaveTextContent(
            'This field is required.'
        );

        expect(getByTestId('errorContainer').firstChild).toHaveAttribute(
            'id',
            'errorId'
        );

        expect(select).toHaveAttribute('aria-describedby', 'errorId');

        select.value = '1';
        fireEvent.change(select);
        expect(getByTestId('errorContainer')).toBeEmpty();
        expect(select).not.toHaveAttribute('aria-describedby');
    });

    it('should allow a validator to be ignored', () => {
        const { getByLabelText, getByTestId, getByText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <div>
                        <Form.SelectController
                            name="testSelect"
                            validators={[
                                validator(
                                    isRequired,
                                    'This field is required.',
                                    true
                                )
                            ]}
                        >
                            {({
                                getSelectProps,
                                getLabelProps,
                                getErrorProps,
                                showError,
                                errorText
                            }) => {
                                return (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test select
                                        </label>
                                        <select
                                            {...getSelectProps({
                                                required: 'required'
                                            })}
                                        >
                                            <option value="1">One</option>
                                            <option value="2">One</option>
                                        </select>
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
                        </Form.SelectController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        fireEvent.click(getByText('Submit'));
        expect(getByTestId('errorContainer')).toBeEmpty();
        expect(getByLabelText('Test select')).not.toHaveAttribute(
            'aria-describedby'
        );
    });

    it('should allow the user to specify a content hint', () => {
        const { getByLabelText, getByTestId } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <Form.SelectController name="testSelect">
                        {({
                            getSelectProps,
                            getLabelProps,
                            getContentHintProps
                        }) => {
                            return (
                                <div>
                                    <label {...getLabelProps()}>
                                        Test select
                                    </label>
                                    <select
                                        {...getSelectProps({
                                            required: 'required'
                                        })}
                                    >
                                        <option value="1">One</option>
                                        <option value="2">One</option>
                                    </select>
                                    <div data-testid="contentHintContainer">
                                        <span {...getContentHintProps()}>
                                            Some content hint
                                        </span>
                                    </div>
                                </div>
                            );
                        }}
                    </Form.SelectController>
                )}
            </Form>
        );

        expect(getByLabelText('Test select')).toHaveAttribute(
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
                        <Form.SelectController
                            name="testSelect"
                            validators={[
                                validator(isRequired, 'It is required')
                            ]}
                        >
                            {({
                                getSelectProps,
                                getLabelProps,
                                getErrorProps,
                                getContentHintProps,
                                errorText,
                                showError
                            }) => {
                                return (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test select
                                        </label>
                                        <select
                                            {...getSelectProps({
                                                required: 'required'
                                            })}
                                        >
                                            <option value="">Default</option>
                                            <option value="1">One</option>
                                            <option value="2">One</option>
                                        </select>
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
                        </Form.SelectController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        fireEvent.click(getByText('Submit'));

        expect(getByLabelText('Test select')).toHaveAttribute(
            'aria-describedby',
            'contentHintId errorId'
        );

        const select = getByLabelText('Test select');
        select.value = '1';
        fireEvent.change(select);

        expect(getByLabelText('Test select')).toHaveAttribute(
            'aria-describedby',
            'contentHintId'
        );
    });

    it('should only display errors after one submit attempt', () => {
        const { getByLabelText, getByText, queryByTestId } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <div>
                        <Form.SelectController
                            name="testSelect"
                            validators={[
                                validator(isRequired, 'It is required')
                            ]}
                        >
                            {({
                                getSelectProps,
                                getLabelProps,
                                getErrorProps,
                                getContentHintProps,
                                errorText,
                                showError
                            }) => {
                                return (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test select
                                        </label>
                                        <select
                                            {...getSelectProps({
                                                required: 'required'
                                            })}
                                        >
                                            <option value="">Default</option>
                                            <option value="1">One</option>
                                            <option value="2">One</option>
                                        </select>
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
                        </Form.SelectController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        expect(getByLabelText('Test select')).toHaveAttribute(
            'aria-describedby',
            'contentHintId'
        );

        expect(queryByTestId('errorContainer')).toBeNull();

        fireEvent.click(getByText('Submit'));

        expect(getByLabelText('Test select')).toHaveAttribute(
            'aria-describedby',
            'contentHintId errorId'
        );

        expect(queryByTestId('errorContainer')).not.toBeNull();
    });

    it('should display errors always when alwaysShowErrors is on', () => {
        const { getByLabelText, queryByTestId } = render(
            <Form onSubmit={jest.fn()} alwaysShowErrors={true}>
                {() => (
                    <div>
                        <Form.SelectController
                            name="testSelect"
                            validators={[
                                validator(isRequired, 'It is required')
                            ]}
                        >
                            {({
                                getSelectProps,
                                getLabelProps,
                                getErrorProps,
                                getContentHintProps,
                                errorText,
                                showError
                            }) => {
                                return (
                                    <div>
                                        <label {...getLabelProps()}>
                                            Test select
                                        </label>
                                        <select
                                            {...getSelectProps({
                                                required: 'required'
                                            })}
                                        >
                                            <option value="">Default</option>
                                            <option value="1">One</option>
                                            <option value="2">One</option>
                                        </select>
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
                        </Form.SelectController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        expect(getByLabelText('Test select')).toHaveAttribute(
            'aria-describedby',
            'contentHintId errorId'
        );

        expect(queryByTestId('errorContainer')).not.toBeNull();
    });
});

describe('Form.RadioGroupController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        uuidv4
            .mockReturnValueOnce('inputLabelId')
            .mockReturnValueOnce('contentHintId')
            .mockReturnValueOnce('errorId')
            .mockReturnValueOnce('legendId')
            .mockReturnValueOnce('containerId');
    });

    afterEach(cleanup);

    it('should render a standard radiogroup and decorate with standard props', () => {
        const { container, getByLabelText, getByText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <Form.RadioGroupController name="testRadio">
                        {({
                            getRadioButtonProps,
                            getRadioGroupProps,
                            getLegendProps,
                            getLabelProps
                        }) => (
                            <fieldset>
                                <legend {...getLegendProps()}>
                                    Test radio
                                </legend>
                                <div {...getRadioGroupProps()}>
                                    <input
                                        {...getRadioButtonProps({
                                            value: 'one'
                                        })}
                                    />
                                    <label
                                        {...getLabelProps({
                                            autoIdPostfix: 'one'
                                        })}
                                    >
                                        One
                                    </label>
                                    <input
                                        {...getRadioButtonProps({
                                            value: 'two'
                                        })}
                                    />
                                    <label
                                        {...getLabelProps({
                                            autoIdPostfix: 'two'
                                        })}
                                    >
                                        Two
                                    </label>
                                </div>
                            </fieldset>
                        )}
                    </Form.RadioGroupController>
                )}
            </Form>
        );

        const legend = getByText('Test radio');
        expect(legend).toHaveAttribute('id', 'legendId');

        const radioGroup = container.querySelector('[role="radiogroup"]');
        expect(radioGroup).toHaveAttribute('aria-labelledby', 'legendId');
        expect(radioGroup).toHaveAttribute('id', 'containerId');
        expect(radioGroup).toHaveAttribute('tabindex', '-1');
        expect(radioGroup.attributes.length).toBe(4);

        const inputOne = getByLabelText('One');
        expect(inputOne).toHaveAttribute('id', 'inputLabelId-one');
        expect(inputOne).toHaveAttribute('name', 'testRadio-one');
        expect(inputOne).toHaveAttribute('value', 'one');
        expect(inputOne.attributes.length).toBe(4);

        const inputTwo = getByLabelText('Two');
        expect(inputTwo).toHaveAttribute('id', 'inputLabelId-two');
        expect(inputTwo).toHaveAttribute('name', 'testRadio-two');
        expect(inputTwo).toHaveAttribute('value', 'two');
        expect(inputTwo.attributes.length).toBe(4);
    });

    it('should spawn standard and ARIA props for a disabled radio button', () => {
        const { getByLabelText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <Form.RadioGroupController name="testRadio">
                        {({
                            getRadioButtonProps,
                            getRadioGroupProps,
                            getLegendProps,
                            getLabelProps
                        }) => (
                            <fieldset>
                                <legend {...getLegendProps()}>
                                    Test radio
                                </legend>
                                <div {...getRadioGroupProps()}>
                                    <input
                                        {...getRadioButtonProps({
                                            value: 'one',
                                            disabled: 'disabled'
                                        })}
                                    />
                                    <label
                                        {...getLabelProps({
                                            autoIdPostfix: 'one'
                                        })}
                                    >
                                        One
                                    </label>
                                    <input
                                        {...getRadioButtonProps({
                                            value: 'two'
                                        })}
                                    />
                                    <label
                                        {...getLabelProps({
                                            autoIdPostfix: 'two'
                                        })}
                                    >
                                        Two
                                    </label>
                                </div>
                            </fieldset>
                        )}
                    </Form.RadioGroupController>
                )}
            </Form>
        );

        const inputOne = getByLabelText('One');
        expect(inputOne).toHaveAttribute('disabled');
        expect(inputOne).toHaveAttribute('aria-disabled', 'true');
        expect(inputOne.attributes.length).toBe(6);

        const inputTwo = getByLabelText('Two');
        expect(inputTwo).not.toHaveAttribute('disabled');
        expect(inputTwo).not.toHaveAttribute('aria-disabled');
        expect(inputTwo.attributes.length).toBe(4);
    });

    it('should spawn standard and ARIA props for a required radio group', () => {
        const { container } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <Form.RadioGroupController name="testRadio">
                        {({
                            getRadioButtonProps,
                            getRadioGroupProps,
                            getLegendProps,
                            getLabelProps
                        }) => (
                            <fieldset>
                                <legend {...getLegendProps()}>
                                    Test radio
                                </legend>
                                <div
                                    {...getRadioGroupProps({
                                        required: 'required'
                                    })}
                                >
                                    <input
                                        {...getRadioButtonProps({
                                            value: 'one'
                                        })}
                                    />
                                    <label
                                        {...getLabelProps({
                                            autoIdPostfix: 'one'
                                        })}
                                    >
                                        One
                                    </label>
                                    <input
                                        {...getRadioButtonProps({
                                            value: 'two'
                                        })}
                                    />
                                    <label
                                        {...getLabelProps({
                                            autoIdPostfix: 'two'
                                        })}
                                    >
                                        Two
                                    </label>
                                </div>
                            </fieldset>
                        )}
                    </Form.RadioGroupController>
                )}
            </Form>
        );

        const radioGroup = container.querySelector('[role="radiogroup"]');
        expect(radioGroup).toHaveAttribute('aria-required', 'true');
        expect(radioGroup.attributes.length).toBe(5);
    });

    it('should validate a radiogroup and set an error text when appropriate', () => {
        const { container, getByLabelText, getByText, getByTestId } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <div>
                        <Form.RadioGroupController
                            name="testRadio"
                            validators={[
                                validator(isRequired, 'This field is required.')
                            ]}
                        >
                            {({
                                getRadioButtonProps,
                                getRadioGroupProps,
                                getLegendProps,
                                getLabelProps,
                                getErrorProps,
                                errorText,
                                showError
                            }) => (
                                <fieldset>
                                    <legend {...getLegendProps()}>
                                        Test radio
                                    </legend>
                                    <div
                                        {...getRadioGroupProps({
                                            required: 'required'
                                        })}
                                    >
                                        <input
                                            {...getRadioButtonProps({
                                                value: 'one'
                                            })}
                                        />
                                        <label
                                            {...getLabelProps({
                                                autoIdPostfix: 'one'
                                            })}
                                        >
                                            One
                                        </label>
                                        <input
                                            {...getRadioButtonProps({
                                                value: 'two'
                                            })}
                                        />
                                        <label
                                            {...getLabelProps({
                                                autoIdPostfix: 'two'
                                            })}
                                        >
                                            Two
                                        </label>
                                    </div>
                                    <div data-testid="errorContainer">
                                        {showError ? (
                                            <span {...getErrorProps()}>
                                                {errorText}
                                            </span>
                                        ) : null}
                                    </div>
                                </fieldset>
                            )}
                        </Form.RadioGroupController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        fireEvent.click(getByText('Submit'));

        const radioGroup = container.querySelector('[role="radiogroup"]');

        expect(getByTestId('errorContainer').firstChild).toHaveTextContent(
            'This field is required.'
        );

        expect(getByTestId('errorContainer').firstChild).toHaveAttribute(
            'id',
            'errorId'
        );

        expect(radioGroup).toHaveAttribute('aria-describedby', 'errorId');

        fireEvent.click(getByLabelText('One'));
        expect(getByTestId('errorContainer')).toBeEmpty();
        expect(radioGroup).not.toHaveAttribute('aria-describedby');
    });

    it('should allow a specific validator to be ignored', () => {
        const { container, getByText, getByTestId } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <div>
                        <Form.RadioGroupController
                            name="testRadio"
                            validators={[
                                validator(
                                    isRequired,
                                    'This field is required.',
                                    true
                                )
                            ]}
                        >
                            {({
                                getRadioButtonProps,
                                getRadioGroupProps,
                                getLegendProps,
                                getLabelProps,
                                getErrorProps,
                                errorText,
                                showError
                            }) => (
                                <fieldset>
                                    <legend {...getLegendProps()}>
                                        Test radio
                                    </legend>
                                    <div
                                        {...getRadioGroupProps({
                                            required: 'required'
                                        })}
                                    >
                                        <input
                                            {...getRadioButtonProps({
                                                value: 'one'
                                            })}
                                        />
                                        <label
                                            {...getLabelProps({
                                                autoIdPostfix: 'one'
                                            })}
                                        >
                                            One
                                        </label>
                                        <input
                                            {...getRadioButtonProps({
                                                value: 'two'
                                            })}
                                        />
                                        <label
                                            {...getLabelProps({
                                                autoIdPostfix: 'two'
                                            })}
                                        >
                                            Two
                                        </label>
                                    </div>
                                    <div data-testid="errorContainer">
                                        {showError ? (
                                            <span {...getErrorProps()}>
                                                {errorText}
                                            </span>
                                        ) : null}
                                    </div>
                                </fieldset>
                            )}
                        </Form.RadioGroupController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        fireEvent.click(getByText('Submit'));

        const radioGroup = container.querySelector('[role="radiogroup"]');
        expect(getByTestId('errorContainer')).toBeEmpty();
        expect(radioGroup).not.toHaveAttribute('aria-describedby');
    });

    it('should allow the user to specify a content hint', () => {
        const { container, getByTestId } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <div>
                        <Form.RadioGroupController name="testRadio">
                            {({
                                getRadioButtonProps,
                                getRadioGroupProps,
                                getLegendProps,
                                getLabelProps,
                                getContentHintProps
                            }) => (
                                <fieldset>
                                    <legend {...getLegendProps()}>
                                        Test radio
                                    </legend>
                                    <div
                                        {...getRadioGroupProps({
                                            required: 'required'
                                        })}
                                    >
                                        <input
                                            {...getRadioButtonProps({
                                                value: 'one'
                                            })}
                                        />
                                        <label
                                            {...getLabelProps({
                                                autoIdPostfix: 'one'
                                            })}
                                        >
                                            One
                                        </label>
                                        <input
                                            {...getRadioButtonProps({
                                                value: 'two'
                                            })}
                                        />
                                        <label
                                            {...getLabelProps({
                                                autoIdPostfix: 'two'
                                            })}
                                        >
                                            Two
                                        </label>
                                    </div>
                                    <div data-testid="contentHintContainer">
                                        <span {...getContentHintProps()}>
                                            Some content hint
                                        </span>
                                    </div>
                                </fieldset>
                            )}
                        </Form.RadioGroupController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        expect(container.querySelector('[role="radiogroup"]')).toHaveAttribute(
            'aria-describedby',
            'contentHintId'
        );
        expect(getByTestId('contentHintContainer').firstChild).toHaveAttribute(
            'id',
            'contentHintId'
        );
    });

    it('should properly link both a content hint and an error message accessibly', () => {
        const { container, getByText, getByLabelText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <div>
                        <Form.RadioGroupController
                            name="testRadio"
                            validators={[
                                validator(isRequired, 'This field is required.')
                            ]}
                        >
                            {({
                                getRadioButtonProps,
                                getRadioGroupProps,
                                getLegendProps,
                                getLabelProps,
                                getContentHintProps,
                                getErrorProps,
                                errorText,
                                showError
                            }) => (
                                <fieldset>
                                    <legend {...getLegendProps()}>
                                        Test radio
                                    </legend>
                                    <div
                                        {...getRadioGroupProps({
                                            required: 'required'
                                        })}
                                    >
                                        <input
                                            {...getRadioButtonProps({
                                                value: 'one'
                                            })}
                                        />
                                        <label
                                            {...getLabelProps({
                                                autoIdPostfix: 'one'
                                            })}
                                        >
                                            One
                                        </label>
                                        <input
                                            {...getRadioButtonProps({
                                                value: 'two'
                                            })}
                                        />
                                        <label
                                            {...getLabelProps({
                                                autoIdPostfix: 'two'
                                            })}
                                        >
                                            Two
                                        </label>
                                    </div>
                                    <div data-testid="contentHintContainer">
                                        <span {...getContentHintProps()}>
                                            Some content hint
                                        </span>
                                    </div>
                                    <div data-testid="errorContainer">
                                        {showError ? (
                                            <span {...getErrorProps()}>
                                                {errorText}
                                            </span>
                                        ) : null}
                                    </div>
                                </fieldset>
                            )}
                        </Form.RadioGroupController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        fireEvent.click(getByText('Submit'));

        expect(container.querySelector('[role="radiogroup"]')).toHaveAttribute(
            'aria-describedby',
            'contentHintId errorId'
        );

        fireEvent.click(getByLabelText('One'));

        expect(container.querySelector('[role="radiogroup"]')).toHaveAttribute(
            'aria-describedby',
            'contentHintId'
        );
    });

    it('should only display errors after one submit attempt', () => {
        const { container, getByText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <div>
                        <Form.RadioGroupController
                            name="testRadio"
                            validators={[
                                validator(isRequired, 'This field is required.')
                            ]}
                        >
                            {({
                                getRadioButtonProps,
                                getRadioGroupProps,
                                getLegendProps,
                                getLabelProps,
                                getContentHintProps,
                                getErrorProps,
                                errorText,
                                showError
                            }) => (
                                <fieldset>
                                    <legend {...getLegendProps()}>
                                        Test radio
                                    </legend>
                                    <div
                                        {...getRadioGroupProps({
                                            required: 'required'
                                        })}
                                    >
                                        <input
                                            {...getRadioButtonProps({
                                                value: 'one'
                                            })}
                                        />
                                        <label
                                            {...getLabelProps({
                                                autoIdPostfix: 'one'
                                            })}
                                        >
                                            One
                                        </label>
                                        <input
                                            {...getRadioButtonProps({
                                                value: 'two'
                                            })}
                                        />
                                        <label
                                            {...getLabelProps({
                                                autoIdPostfix: 'two'
                                            })}
                                        >
                                            Two
                                        </label>
                                    </div>
                                    <div data-testid="contentHintContainer">
                                        <span {...getContentHintProps()}>
                                            Some content hint
                                        </span>
                                    </div>
                                    <div data-testid="errorContainer">
                                        {showError ? (
                                            <span {...getErrorProps()}>
                                                {errorText}
                                            </span>
                                        ) : null}
                                    </div>
                                </fieldset>
                            )}
                        </Form.RadioGroupController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        expect(container.querySelector('[role="radiogroup"]')).toHaveAttribute(
            'aria-describedby',
            'contentHintId'
        );

        fireEvent.click(getByText('Submit'));

        expect(container.querySelector('[role="radiogroup"]')).toHaveAttribute(
            'aria-describedby',
            'contentHintId errorId'
        );
    });

    it('should display errors always when alwaysShowErrors is on', () => {
        const { container } = render(
            <Form onSubmit={jest.fn()} alwaysShowErrors={true}>
                {() => (
                    <div>
                        <Form.RadioGroupController
                            name="testRadio"
                            validators={[
                                validator(isRequired, 'This field is required.')
                            ]}
                        >
                            {({
                                getRadioButtonProps,
                                getRadioGroupProps,
                                getLegendProps,
                                getLabelProps,
                                getContentHintProps,
                                getErrorProps,
                                errorText,
                                showError
                            }) => (
                                <fieldset>
                                    <legend {...getLegendProps()}>
                                        Test radio
                                    </legend>
                                    <div
                                        {...getRadioGroupProps({
                                            required: 'required'
                                        })}
                                    >
                                        <input
                                            {...getRadioButtonProps({
                                                value: 'one'
                                            })}
                                        />
                                        <label
                                            {...getLabelProps({
                                                autoIdPostfix: 'one'
                                            })}
                                        >
                                            One
                                        </label>
                                        <input
                                            {...getRadioButtonProps({
                                                value: 'two'
                                            })}
                                        />
                                        <label
                                            {...getLabelProps({
                                                autoIdPostfix: 'two'
                                            })}
                                        >
                                            Two
                                        </label>
                                    </div>
                                    <div data-testid="contentHintContainer">
                                        <span {...getContentHintProps()}>
                                            Some content hint
                                        </span>
                                    </div>
                                    <div data-testid="errorContainer">
                                        {showError ? (
                                            <span {...getErrorProps()}>
                                                {errorText}
                                            </span>
                                        ) : null}
                                    </div>
                                </fieldset>
                            )}
                        </Form.RadioGroupController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        expect(container.querySelector('[role="radiogroup"]')).toHaveAttribute(
            'aria-describedby',
            'contentHintId errorId'
        );
    });
});

describe('Form.CheckboxController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        uuidv4
            .mockReturnValueOnce('inputLabelId')
            .mockReturnValueOnce('contentHintId')
            .mockReturnValueOnce('errorId');
    });

    afterEach(cleanup);

    it('should render a standard checkbox and label and decorate with standard props', () => {
        const { getByLabelText, getByText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <Form.CheckboxController name="testCheckbox">
                        {({ getCheckboxProps, getLabelProps }) => (
                            <div>
                                <input {...getCheckboxProps()} />
                                <label {...getLabelProps()}>
                                    Test checkbox
                                </label>
                            </div>
                        )}
                    </Form.CheckboxController>
                )}
            </Form>
        );

        const testLabel = getByText('Test checkbox');
        expect(testLabel).toHaveAttribute('for', 'inputLabelId');
        expect(testLabel.attributes.length).toBe(1);

        const testInput = getByLabelText('Test checkbox');
        expect(testInput).toHaveAttribute('id', 'inputLabelId');
        expect(testInput).toHaveAttribute('name', 'testCheckbox');
        expect(testInput.attributes.length).toBe(3);
    });

    it('should spawn standard and ARIA props for a disabled checkbox', () => {
        const { getByLabelText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <Form.CheckboxController name="testCheckbox">
                        {({ getCheckboxProps, getLabelProps }) => (
                            <div>
                                <input
                                    {...getCheckboxProps({
                                        disabled: 'disabled'
                                    })}
                                />
                                <label {...getLabelProps()}>
                                    Test checkbox
                                </label>
                            </div>
                        )}
                    </Form.CheckboxController>
                )}
            </Form>
        );

        const testInput = getByLabelText('Test checkbox');
        expect(testInput).toHaveAttribute('disabled');
        expect(testInput).toHaveAttribute('aria-disabled', 'true');
        expect(testInput.attributes.length).toBe(5);
    });

    it('should spawn standard and ARIA props for a required checkbox', () => {
        const { getByLabelText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <Form.CheckboxController name="testCheckbox">
                        {({ getCheckboxProps, getLabelProps }) => (
                            <div>
                                <input
                                    {...getCheckboxProps({
                                        required: 'required'
                                    })}
                                />
                                <label {...getLabelProps()}>
                                    Test checkbox
                                </label>
                            </div>
                        )}
                    </Form.CheckboxController>
                )}
            </Form>
        );

        const testInput = getByLabelText('Test checkbox');
        expect(testInput).toHaveAttribute('required');
        expect(testInput).toHaveAttribute('aria-required', 'true');
        expect(testInput.attributes.length).toBe(5);
    });

    it('should validate a checkbox and set an error text when appropriate', () => {
        const { getByLabelText, getByTestId, getByText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <div>
                        <Form.CheckboxController
                            name="testCheckbox"
                            validators={[
                                validator(
                                    value => value === true,
                                    'This field is required.'
                                )
                            ]}
                        >
                            {({
                                getCheckboxProps,
                                getLabelProps,
                                getErrorProps,
                                showError,
                                errorText
                            }) => {
                                return (
                                    <div>
                                        <input
                                            {...getCheckboxProps({
                                                required: 'required'
                                            })}
                                        />
                                        <label {...getLabelProps()}>
                                            Test checkbox
                                        </label>
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
                        </Form.CheckboxController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        fireEvent.click(getByText('Submit'));

        const input = getByLabelText('Test checkbox');

        expect(getByTestId('errorContainer').firstChild).toHaveTextContent(
            'This field is required.'
        );

        expect(getByTestId('errorContainer').firstChild).toHaveAttribute(
            'id',
            'errorId'
        );

        expect(input).toHaveAttribute('aria-describedby', 'errorId');

        fireEvent.click(input);

        expect(getByTestId('errorContainer')).toBeEmpty();
        expect(input).not.toHaveAttribute('aria-describedby');

        fireEvent.click(input);
        expect(getByTestId('errorContainer').firstChild).toHaveTextContent(
            'This field is required.'
        );
        expect(input).toHaveAttribute('aria-describedby', 'errorId');
    });

    it('should allow a specific validator to be ignored', () => {
        const { getByTestId, getByText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <div>
                        <Form.CheckboxController
                            name="testCheckbox"
                            validators={[
                                validator(
                                    value => value === true,
                                    'This field is required.',
                                    true
                                )
                            ]}
                        >
                            {({
                                getCheckboxProps,
                                getLabelProps,
                                getErrorProps,
                                showError,
                                errorText
                            }) => {
                                return (
                                    <div>
                                        <input
                                            {...getCheckboxProps({
                                                required: 'required'
                                            })}
                                        />
                                        <label {...getLabelProps()}>
                                            Test checkbox
                                        </label>
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
                        </Form.CheckboxController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        fireEvent.click(getByText('Submit'));
        expect(getByTestId('errorContainer')).toBeEmpty();
    });

    it('should allow the user to specify a content hint', () => {
        const { getByLabelText, getByTestId } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <Form.CheckboxController name="testCheckbox">
                        {({
                            getCheckboxProps,
                            getLabelProps,
                            getContentHintProps
                        }) => {
                            return (
                                <div>
                                    <input
                                        {...getCheckboxProps({
                                            required: 'required'
                                        })}
                                    />
                                    <label {...getLabelProps()}>
                                        Test checkbox
                                    </label>
                                    <div data-testid="contentHintContainer">
                                        <span {...getContentHintProps()}>
                                            Some content hint
                                        </span>
                                    </div>
                                </div>
                            );
                        }}
                    </Form.CheckboxController>
                )}
            </Form>
        );

        expect(getByLabelText('Test checkbox')).toHaveAttribute(
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
                        <Form.CheckboxController
                            name="testCheckbox"
                            validators={[
                                validator(
                                    value => value === true,
                                    'It is required'
                                )
                            ]}
                        >
                            {({
                                getCheckboxProps,
                                getLabelProps,
                                getErrorProps,
                                getContentHintProps,
                                errorText,
                                showError
                            }) => {
                                return (
                                    <div>
                                        <input
                                            {...getCheckboxProps({
                                                required: 'required'
                                            })}
                                        />
                                        <label {...getLabelProps()}>
                                            Test checkbox
                                        </label>
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
                        </Form.CheckboxController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        fireEvent.click(getByText('Submit'));

        expect(getByLabelText('Test checkbox')).toHaveAttribute(
            'aria-describedby',
            'contentHintId errorId'
        );

        const input = getByLabelText('Test checkbox');
        fireEvent.click(input);

        expect(getByLabelText('Test checkbox')).toHaveAttribute(
            'aria-describedby',
            'contentHintId'
        );
    });

    it('should only display errors after one submit attempt', () => {
        const { getByLabelText, getByText, queryByTestId } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <div>
                        <Form.CheckboxController
                            name="testCheckbox"
                            validators={[
                                validator(
                                    value => value === true,
                                    'It is required'
                                )
                            ]}
                        >
                            {({
                                getCheckboxProps,
                                getLabelProps,
                                getErrorProps,
                                getContentHintProps,
                                errorText,
                                showError
                            }) => {
                                return (
                                    <div>
                                        <input
                                            {...getCheckboxProps({
                                                required: 'required'
                                            })}
                                        />
                                        <label {...getLabelProps()}>
                                            Test checkbox
                                        </label>
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
                        </Form.CheckboxController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        expect(getByLabelText('Test checkbox')).toHaveAttribute(
            'aria-describedby',
            'contentHintId'
        );

        expect(queryByTestId('errorContainer')).toBeNull();

        fireEvent.click(getByText('Submit'));

        expect(getByLabelText('Test checkbox')).toHaveAttribute(
            'aria-describedby',
            'contentHintId errorId'
        );

        expect(queryByTestId('errorContainer')).not.toBeNull();
    });

    it('should display errors always when alwaysShowErrors is on', () => {
        const { getByLabelText, queryByTestId } = render(
            <Form onSubmit={jest.fn()} alwaysShowErrors={true}>
                {() => (
                    <div>
                        {' '}
                        <Form.CheckboxController
                            name="testCheckbox"
                            validators={[
                                validator(
                                    value => value === true,
                                    'It is required'
                                )
                            ]}
                        >
                            {({
                                getCheckboxProps,
                                getLabelProps,
                                getErrorProps,
                                getContentHintProps,
                                errorText,
                                showError
                            }) => {
                                return (
                                    <div>
                                        <input
                                            {...getCheckboxProps({
                                                required: 'required'
                                            })}
                                        />
                                        <label {...getLabelProps()}>
                                            Test checkbox
                                        </label>
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
                        </Form.CheckboxController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        expect(getByLabelText('Test checkbox')).toHaveAttribute(
            'aria-describedby',
            'contentHintId errorId'
        );

        expect(queryByTestId('errorContainer')).not.toBeNull();
    });
});

describe('Form.CheckboxGroupController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        uuidv4
            .mockReturnValueOnce('inputLabelId')
            .mockReturnValueOnce('contentHintId')
            .mockReturnValueOnce('errorId')
            .mockReturnValueOnce('legendId')
            .mockReturnValueOnce('containerId');
    });

    afterEach(cleanup);

    it('should render a standard checkbox group and decorate with standard props', () => {
        const { container, getByLabelText, getByText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <Form.CheckboxGroupController name="textCheck">
                        {({
                            getCheckboxProps,
                            getCheckboxGroupProps,
                            getLegendProps,
                            getLabelProps
                        }) => (
                            <fieldset>
                                <legend {...getLegendProps()}>
                                    Test check
                                </legend>
                                <div {...getCheckboxGroupProps()}>
                                    <input
                                        {...getCheckboxProps({
                                            name: 'one'
                                        })}
                                    />
                                    <label
                                        {...getLabelProps({
                                            autoIdPostfix: 'one'
                                        })}
                                    >
                                        One
                                    </label>
                                    <input
                                        {...getCheckboxProps({
                                            name: 'two'
                                        })}
                                    />
                                    <label
                                        {...getLabelProps({
                                            autoIdPostfix: 'two'
                                        })}
                                    >
                                        Two
                                    </label>
                                </div>
                            </fieldset>
                        )}
                    </Form.CheckboxGroupController>
                )}
            </Form>
        );

        const legend = getByText('Test check');
        expect(legend).toHaveAttribute('id', 'legendId');

        const checkGroup = container.querySelector('[role="group"]');
        expect(checkGroup).toHaveAttribute('aria-labelledby', 'legendId');
        expect(checkGroup).toHaveAttribute('id', 'containerId');
        expect(checkGroup).toHaveAttribute('tabindex', '-1');
        expect(checkGroup.attributes.length).toBe(4);

        const inputOne = getByLabelText('One');
        expect(inputOne).toHaveAttribute('id', 'inputLabelId-one');
        expect(inputOne).toHaveAttribute('name', 'one');
        expect(inputOne).toHaveAttribute('type', 'checkbox');
        expect(inputOne.attributes.length).toBe(3);

        const inputTwo = getByLabelText('Two');
        expect(inputTwo).toHaveAttribute('id', 'inputLabelId-two');
        expect(inputTwo).toHaveAttribute('name', 'two');
        expect(inputTwo).toHaveAttribute('type', 'checkbox');
        expect(inputTwo.attributes.length).toBe(3);
    });

    it('should bundle checked boxes into an array of checked boxes by name', () => {
        let submitData = {};
        const { container, getByLabelText, getByText } = render(
            <Form
                onSubmit={data => {
                    submitData = data;
                }}
            >
                {() => (
                    <Form.CheckboxGroupController name="textCheck">
                        {({
                            getCheckboxProps,
                            getCheckboxGroupProps,
                            getLegendProps,
                            getLabelProps
                        }) => (
                            <fieldset>
                                <legend {...getLegendProps()}>
                                    Test check
                                </legend>
                                <div {...getCheckboxGroupProps()}>
                                    <input
                                        {...getCheckboxProps({
                                            name: 'one'
                                        })}
                                    />
                                    <label
                                        {...getLabelProps({
                                            autoIdPostfix: 'one'
                                        })}
                                    >
                                        One
                                    </label>
                                    <input
                                        {...getCheckboxProps({
                                            name: 'two'
                                        })}
                                    />
                                    <label
                                        {...getLabelProps({
                                            autoIdPostfix: 'two'
                                        })}
                                    >
                                        Two
                                    </label>
                                </div>
                                <button type="submit">Submit</button>
                            </fieldset>
                        )}
                    </Form.CheckboxGroupController>
                )}
            </Form>
        );

        fireEvent.click(getByText('Submit'));

        expect(submitData).toEqual({ textCheck: [] });

        fireEvent.click(getByLabelText('One'));
        fireEvent.click(getByText('Submit'));

        expect(submitData).toEqual({ textCheck: ['one'] });

        fireEvent.click(getByLabelText('Two'));
        fireEvent.click(getByText('Submit'));

        expect(submitData).toEqual({ textCheck: ['one', 'two'] });

        fireEvent.click(getByLabelText('One'));
        fireEvent.click(getByText('Submit'));

        expect(submitData).toEqual({ textCheck: ['two'] });
    });

    it('should spawn standard and ARIA props for a disabled checkbox', () => {
        const { getByLabelText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <Form.CheckboxGroupController name="testCheck">
                        {({
                            getCheckboxProps,
                            getCheckboxGroupProps,
                            getLegendProps,
                            getLabelProps
                        }) => (
                            <fieldset>
                                <legend {...getLegendProps()}>
                                    Test radio
                                </legend>
                                <div {...getCheckboxGroupProps()}>
                                    <input
                                        {...getCheckboxProps({
                                            name: 'one',
                                            disabled: 'disabled'
                                        })}
                                    />
                                    <label
                                        {...getLabelProps({
                                            autoIdPostfix: 'one'
                                        })}
                                    >
                                        One
                                    </label>
                                    <input
                                        {...getCheckboxProps({
                                            name: 'two'
                                        })}
                                    />
                                    <label
                                        {...getLabelProps({
                                            autoIdPostfix: 'two'
                                        })}
                                    >
                                        Two
                                    </label>
                                </div>
                            </fieldset>
                        )}
                    </Form.CheckboxGroupController>
                )}
            </Form>
        );

        const inputOne = getByLabelText('One');
        expect(inputOne).toHaveAttribute('disabled');
        expect(inputOne).toHaveAttribute('aria-disabled', 'true');
        expect(inputOne.attributes.length).toBe(5);

        const inputTwo = getByLabelText('Two');
        expect(inputTwo).not.toHaveAttribute('disabled');
        expect(inputTwo).not.toHaveAttribute('aria-disabled');
        expect(inputTwo.attributes.length).toBe(3);
    });

    it('should validate a checkbox group and set an error text when appropriate', () => {
        const { container, getByLabelText, getByText, getByTestId } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <div>
                        <Form.CheckboxGroupController
                            name="testCheck"
                            validators={[
                                validator(
                                    value => value.length > 0,
                                    'This field is required.'
                                )
                            ]}
                        >
                            {({
                                getCheckboxProps,
                                getCheckboxGroupProps,
                                getLegendProps,
                                getLabelProps,
                                getErrorProps,
                                errorText,
                                showError
                            }) => (
                                <fieldset>
                                    <legend {...getLegendProps()}>
                                        Test check
                                    </legend>
                                    <div {...getCheckboxGroupProps()}>
                                        <input
                                            {...getCheckboxProps({
                                                name: 'one'
                                            })}
                                        />
                                        <label
                                            {...getLabelProps({
                                                autoIdPostfix: 'one'
                                            })}
                                        >
                                            One
                                        </label>
                                        <input
                                            {...getCheckboxProps({
                                                name: 'two'
                                            })}
                                        />
                                        <label
                                            {...getLabelProps({
                                                autoIdPostfix: 'two'
                                            })}
                                        >
                                            Two
                                        </label>
                                    </div>
                                    <div data-testid="errorContainer">
                                        {showError ? (
                                            <span {...getErrorProps()}>
                                                {errorText}
                                            </span>
                                        ) : null}
                                    </div>
                                </fieldset>
                            )}
                        </Form.CheckboxGroupController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        fireEvent.click(getByText('Submit'));

        const checkBoxGroup = container.querySelector('[role="group"]');

        expect(getByTestId('errorContainer').firstChild).toHaveTextContent(
            'This field is required.'
        );

        expect(getByTestId('errorContainer').firstChild).toHaveAttribute(
            'id',
            'errorId'
        );

        expect(checkBoxGroup).toHaveAttribute('aria-describedby', 'errorId');

        fireEvent.click(getByLabelText('One'));
        expect(getByTestId('errorContainer')).toBeEmpty();
        expect(checkBoxGroup).not.toHaveAttribute('aria-describedby');
    });

    it('should allow a specific validator to be ignored', () => {
        const { container, getByText, getByTestId } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <div>
                        <Form.CheckboxGroupController
                            name="textCheck"
                            validators={[
                                validator(
                                    value => value.length > 0,
                                    'This field is required.',
                                    true
                                )
                            ]}
                        >
                            {({
                                getCheckboxProps,
                                getCheckboxGroupProps,
                                getLegendProps,
                                getLabelProps,
                                getErrorProps,
                                errorText,
                                showError
                            }) => (
                                <fieldset>
                                    <legend {...getLegendProps()}>
                                        Test radio
                                    </legend>
                                    <div {...getCheckboxGroupProps()}>
                                        <input
                                            {...getCheckboxProps({
                                                name: 'one'
                                            })}
                                        />
                                        <label
                                            {...getLabelProps({
                                                autoIdPostfix: 'one'
                                            })}
                                        >
                                            One
                                        </label>
                                        <input
                                            {...getCheckboxProps({
                                                name: 'two'
                                            })}
                                        />
                                        <label
                                            {...getLabelProps({
                                                autoIdPostfix: 'two'
                                            })}
                                        >
                                            Two
                                        </label>
                                    </div>
                                    <div data-testid="errorContainer">
                                        {showError ? (
                                            <span {...getErrorProps()}>
                                                {errorText}
                                            </span>
                                        ) : null}
                                    </div>
                                </fieldset>
                            )}
                        </Form.CheckboxGroupController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        fireEvent.click(getByText('Submit'));

        const checkboxGroup = container.querySelector('[role="group"]');
        expect(getByTestId('errorContainer')).toBeEmpty();
        expect(checkboxGroup).not.toHaveAttribute('aria-describedby');
    });

    it('should allow the user to specify a content hint', () => {
        const { container, getByTestId } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <div>
                        <Form.CheckboxGroupController name="testCheck">
                            {({
                                getCheckboxProps,
                                getCheckboxGroupProps,
                                getLegendProps,
                                getLabelProps,
                                getContentHintProps
                            }) => (
                                <fieldset>
                                    <legend {...getLegendProps()}>
                                        Test radio
                                    </legend>
                                    <div {...getCheckboxGroupProps()}>
                                        <input
                                            {...getCheckboxProps({
                                                name: 'one'
                                            })}
                                        />
                                        <label
                                            {...getLabelProps({
                                                autoIdPostfix: 'one'
                                            })}
                                        >
                                            One
                                        </label>
                                        <input
                                            {...getCheckboxProps({
                                                name: 'two'
                                            })}
                                        />
                                        <label
                                            {...getLabelProps({
                                                autoIdPostfix: 'two'
                                            })}
                                        >
                                            Two
                                        </label>
                                    </div>
                                    <div data-testid="contentHintContainer">
                                        <span {...getContentHintProps()}>
                                            Some content hint
                                        </span>
                                    </div>
                                </fieldset>
                            )}
                        </Form.CheckboxGroupController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        expect(container.querySelector('[role="group"]')).toHaveAttribute(
            'aria-describedby',
            'contentHintId'
        );
        expect(getByTestId('contentHintContainer').firstChild).toHaveAttribute(
            'id',
            'contentHintId'
        );
    });

    it('should properly link both a content hint and an error message accessibly', () => {
        const { container, getByText, getByLabelText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <div>
                        <Form.CheckboxGroupController
                            name="testCheck"
                            validators={[
                                validator(
                                    value => value.length > 0,
                                    'This field is required.'
                                )
                            ]}
                        >
                            {({
                                getCheckboxProps,
                                getCheckboxGroupProps,
                                getLegendProps,
                                getLabelProps,
                                getContentHintProps,
                                getErrorProps,
                                errorText,
                                showError
                            }) => (
                                <fieldset>
                                    <legend {...getLegendProps()}>
                                        Test radio
                                    </legend>
                                    <div {...getCheckboxGroupProps()}>
                                        <input
                                            {...getCheckboxProps({
                                                name: 'one'
                                            })}
                                        />
                                        <label
                                            {...getLabelProps({
                                                autoIdPostfix: 'one'
                                            })}
                                        >
                                            One
                                        </label>
                                        <input
                                            {...getCheckboxProps({
                                                name: 'two'
                                            })}
                                        />
                                        <label
                                            {...getLabelProps({
                                                autoIdPostfix: 'two'
                                            })}
                                        >
                                            Two
                                        </label>
                                    </div>
                                    <div data-testid="contentHintContainer">
                                        <span {...getContentHintProps()}>
                                            Some content hint
                                        </span>
                                    </div>
                                    <div data-testid="errorContainer">
                                        {showError ? (
                                            <span {...getErrorProps()}>
                                                {errorText}
                                            </span>
                                        ) : null}
                                    </div>
                                </fieldset>
                            )}
                        </Form.CheckboxGroupController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        fireEvent.click(getByText('Submit'));

        expect(container.querySelector('[role="group"]')).toHaveAttribute(
            'aria-describedby',
            'contentHintId errorId'
        );

        fireEvent.click(getByLabelText('One'));

        expect(container.querySelector('[role="group"]')).toHaveAttribute(
            'aria-describedby',
            'contentHintId'
        );
    });

    it('should only display errors after one submit attempt', () => {
        const { container, getByText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <div>
                        <Form.CheckboxGroupController
                            name="testCheck"
                            validators={[
                                validator(
                                    value => value > 0,
                                    'This field is required.'
                                )
                            ]}
                        >
                            {({
                                getCheckboxProps,
                                getCheckboxGroupProps,
                                getLegendProps,
                                getLabelProps,
                                getContentHintProps,
                                getErrorProps,
                                errorText,
                                showError
                            }) => (
                                <fieldset>
                                    <legend {...getLegendProps()}>
                                        Test radio
                                    </legend>
                                    <div {...getCheckboxGroupProps()}>
                                        <input
                                            {...getCheckboxProps({
                                                name: 'one'
                                            })}
                                        />
                                        <label
                                            {...getLabelProps({
                                                autoIdPostfix: 'one'
                                            })}
                                        >
                                            One
                                        </label>
                                        <input
                                            {...getCheckboxProps({
                                                name: 'two'
                                            })}
                                        />
                                        <label
                                            {...getLabelProps({
                                                autoIdPostfix: 'two'
                                            })}
                                        >
                                            Two
                                        </label>
                                    </div>
                                    <div data-testid="contentHintContainer">
                                        <span {...getContentHintProps()}>
                                            Some content hint
                                        </span>
                                    </div>
                                    <div data-testid="errorContainer">
                                        {showError ? (
                                            <span {...getErrorProps()}>
                                                {errorText}
                                            </span>
                                        ) : null}
                                    </div>
                                </fieldset>
                            )}
                        </Form.CheckboxGroupController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        expect(container.querySelector('[role="group"]')).toHaveAttribute(
            'aria-describedby',
            'contentHintId'
        );

        fireEvent.click(getByText('Submit'));

        expect(container.querySelector('[role="group"]')).toHaveAttribute(
            'aria-describedby',
            'contentHintId errorId'
        );
    });

    it('should display errors always when alwaysShowErrors is on', () => {
        const { container } = render(
            <Form onSubmit={jest.fn()} alwaysShowErrors={true}>
                {() => (
                    <div>
                        <Form.RadioGroupController
                            name="testRadio"
                            validators={[
                                validator(isRequired, 'This field is required.')
                            ]}
                        >
                            {({
                                getRadioButtonProps,
                                getRadioGroupProps,
                                getLegendProps,
                                getLabelProps,
                                getContentHintProps,
                                getErrorProps,
                                errorText,
                                showError
                            }) => (
                                <fieldset>
                                    <legend {...getLegendProps()}>
                                        Test radio
                                    </legend>
                                    <div
                                        {...getRadioGroupProps({
                                            required: 'required'
                                        })}
                                    >
                                        <input
                                            {...getRadioButtonProps({
                                                value: 'one'
                                            })}
                                        />
                                        <label
                                            {...getLabelProps({
                                                autoIdPostfix: 'one'
                                            })}
                                        >
                                            One
                                        </label>
                                        <input
                                            {...getRadioButtonProps({
                                                value: 'two'
                                            })}
                                        />
                                        <label
                                            {...getLabelProps({
                                                autoIdPostfix: 'two'
                                            })}
                                        >
                                            Two
                                        </label>
                                    </div>
                                    <div data-testid="contentHintContainer">
                                        <span {...getContentHintProps()}>
                                            Some content hint
                                        </span>
                                    </div>
                                    <div data-testid="errorContainer">
                                        {showError ? (
                                            <span {...getErrorProps()}>
                                                {errorText}
                                            </span>
                                        ) : null}
                                    </div>
                                </fieldset>
                            )}
                        </Form.RadioGroupController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        expect(container.querySelector('[role="radiogroup"]')).toHaveAttribute(
            'aria-describedby',
            'contentHintId errorId'
        );
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
});
