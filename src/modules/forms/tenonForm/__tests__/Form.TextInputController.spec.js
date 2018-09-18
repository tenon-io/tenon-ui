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
