jest.mock('uuid/v4');

import React from 'react';
import { cleanup, fireEvent, render } from 'react-testing-library';
import 'jest-dom/extend-expect';
import Form from '../Form';
import { validator } from '../../../utils/helpers/validationHelpers';
import uuidv4 from 'uuid/v4';

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

    it('should allow view injection via the component prop', () => {
        const Checkbox = ({ getCheckboxProps, getLabelProps, labelText }) => (
            <div>
                <input {...getCheckboxProps()} />
                <label {...getLabelProps()}>{labelText}</label>
            </div>
        );

        const { getByLabelText, getByText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <Form.CheckboxController
                        name="testCheckbox"
                        labelText="Test checkbox"
                        component={Checkbox}
                    />
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
                    <Form.CheckboxController
                        name="testCheckbox"
                        required={true}
                    >
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

        const testInput = getByLabelText('Test checkbox');
        expect(testInput).toHaveAttribute('aria-required', 'true');
        expect(testInput.attributes.length).toBe(4);
    });

    it('should run a custom onChange handler, when given', () => {
        let eventValue = '';

        const onChangeSpy = jest.fn(e => {
            eventValue = e.target.checked;
        });

        const { getByLabelText, getByTestId } = render(
            <Form onSubmit={jest.fn()}>
                {({ formControls }) => (
                    <div>
                        {JSON.stringify(formControls)}
                        <span data-testid="resultContainer">
                            {formControls.testCheckbox
                                ? formControls.testCheckbox.value.toString()
                                : ''}
                        </span>
                        <Form.CheckboxController name="testCheckbox">
                            {({ getCheckboxProps, getLabelProps }) => {
                                return (
                                    <div>
                                        <input
                                            {...getCheckboxProps({
                                                onChange: onChangeSpy
                                            })}
                                        />
                                        <label {...getLabelProps()}>
                                            Test checkbox
                                        </label>
                                    </div>
                                );
                            }}
                        </Form.CheckboxController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        const input = getByLabelText('Test checkbox');

        fireEvent.click(input);

        expect(getByTestId('resultContainer')).toHaveTextContent('true');
        expect(onChangeSpy).toHaveBeenCalled();
        expect(eventValue).toBe(true);
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
