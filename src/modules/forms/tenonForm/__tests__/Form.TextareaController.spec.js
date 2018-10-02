jest.mock('uuid/v4');

import React from 'react';
import { cleanup, fireEvent, render } from 'react-testing-library';
import 'jest-dom/extend-expect';
import Form from '../Form';
import { validator } from '../../../utils/helpers/validationHelpers';
import { isLongerThan, isRequired } from '../../../utils/data/validation';
import uuidv4 from 'uuid/v4';

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
                    <Form.TextareaController
                        name="testTextarea"
                        required={true}
                    >
                        {({ getTextareaProps, getLabelProps }) => (
                            <div>
                                <label {...getLabelProps()}>
                                    Test textarea
                                </label>
                                <input {...getTextareaProps()} />
                            </div>
                        )}
                    </Form.TextareaController>
                )}
            </Form>
        );

        const testTextarea = getByLabelText('Test textarea');
        expect(testTextarea).toHaveAttribute('aria-required', 'true');
        expect(testTextarea.attributes.length).toBe(4);
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
