jest.mock('uuid/v4');

import React from 'react';
import { cleanup, fireEvent, render } from 'react-testing-library';
import 'jest-dom/extend-expect';
import Form from '../Form';
import { validator } from '../../../utils/helpers/validationHelpers';
import { isRequired } from '../../../utils/data/validation';
import uuidv4 from 'uuid/v4';

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
