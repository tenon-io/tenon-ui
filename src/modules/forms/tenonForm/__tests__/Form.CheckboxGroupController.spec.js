jest.mock('uuid/v4');

import React from 'react';
import { cleanup, fireEvent, render } from 'react-testing-library';
import 'jest-dom/extend-expect';
import Form from '../Form';
import { validator } from '../../../utils/helpers/validationHelpers';
import uuidv4 from 'uuid/v4';

describe('Form.CheckboxGroupController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        uuidv4
            .mockReturnValueOnce('inputLabelId')
            .mockReturnValueOnce('contentHintId');
    });

    afterEach(cleanup);

    it('should render a standard checkbox group, provide a focus element and decorate with standard props', () => {
        const { getByLabelText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <Form.CheckboxGroupController name="textCheck">
                        {({ getCheckboxProps, getLabelProps }) => (
                            <fieldset>
                                <legend>Test check</legend>
                                <div>
                                    <input
                                        {...getCheckboxProps({
                                            name: 'one',
                                            focusElement: true
                                        })}
                                    />
                                    <label {...getLabelProps()}>One</label>
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
        expect(inputOne).toHaveAttribute('id', 'inputLabelId');
        expect(inputOne).toHaveAttribute('name', 'one');
        expect(inputOne).toHaveAttribute('type', 'checkbox');
        expect(inputOne.attributes.length).toBe(3);

        const inputTwo = getByLabelText('Two');
        expect(inputTwo).toHaveAttribute('id', 'inputLabelId-two');
        expect(inputTwo).toHaveAttribute('name', 'two');
        expect(inputTwo).toHaveAttribute('type', 'checkbox');
        expect(inputTwo.attributes.length).toBe(3);
    });

    it('should allow view injection via the component prop', () => {
        const CheckboxGroup = ({
            getCheckboxProps,
            getLabelProps,
            legendText
        }) => (
            <fieldset>
                <legend>{legendText}</legend>
                <div>
                    <input
                        {...getCheckboxProps({
                            name: 'one',
                            focusElement: true
                        })}
                    />
                    <label {...getLabelProps()}>One</label>
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
        );

        const { getByLabelText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <Form.CheckboxGroupController
                        name="textCheck"
                        legendText="Test check"
                        component={CheckboxGroup}
                    />
                )}
            </Form>
        );

        const inputOne = getByLabelText('One');
        expect(inputOne).toHaveAttribute('id', 'inputLabelId');
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
        const { getByLabelText, getByText } = render(
            <Form
                onSubmit={data => {
                    submitData = data;
                }}
            >
                {() => (
                    <Form.CheckboxGroupController name="textCheck">
                        {({ getCheckboxProps, getLabelProps }) => (
                            <fieldset>
                                <legend>Test check</legend>
                                <div>
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

    it('should run a custom onChange handler, when given', () => {
        let eventValue = '';

        let submitData = null;

        const onChangeSpy = jest.fn(e => {
            eventValue = e.target.checked;
        });

        const { getByLabelText, getByText } = render(
            <Form
                onSubmit={data => {
                    submitData = data;
                }}
            >
                {() => (
                    <Form.CheckboxGroupController name="textCheck">
                        {({ getCheckboxProps, getLabelProps }) => (
                            <fieldset>
                                <legend>Test check</legend>
                                <div>
                                    <input
                                        {...getCheckboxProps({
                                            name: 'one',
                                            onChange: onChangeSpy
                                        })}
                                    />
                                    <label
                                        {...getLabelProps({
                                            autoIdPostfix: 'one'
                                        })}
                                    >
                                        One
                                    </label>
                                </div>
                                <button type="submit">Submit</button>
                            </fieldset>
                        )}
                    </Form.CheckboxGroupController>
                )}
            </Form>
        );

        fireEvent.click(getByLabelText('One'));
        fireEvent.click(getByText('Submit'));

        expect(submitData).toEqual({ textCheck: ['one'] });

        expect(onChangeSpy).toHaveBeenCalled();
        expect(eventValue).toBe(true);
    });

    it('should spawn standard and ARIA props for a disabled checkbox', () => {
        const { getByLabelText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <Form.CheckboxGroupController name="testCheck">
                        {({ getCheckboxProps, getLabelProps }) => (
                            <fieldset>
                                <legend>Test radio</legend>
                                <div>
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
                                getLabelProps,
                                errorText,
                                showError
                            }) => (
                                <fieldset>
                                    <legend>Test radio</legend>
                                    <div>
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
                                    {showError ? (
                                        <span className="error-container">
                                            {errorText}
                                        </span>
                                    ) : null}
                                </fieldset>
                            )}
                        </Form.CheckboxGroupController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        expect(container.querySelector('span.error-container')).toBeNull();

        fireEvent.click(getByText('Submit'));

        expect(container.querySelector('span.error-container').innerHTML).toBe(
            'This field is required.'
        );
    });

    it('should display errors always when alwaysShowErrors is on', () => {
        const { container } = render(
            <Form onSubmit={jest.fn()} alwaysShowErrors={true}>
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
                                getLabelProps,
                                errorText,
                                showError
                            }) => (
                                <fieldset>
                                    <legend>Test check</legend>
                                    <div>
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
                                    {showError ? (
                                        <span className="error-container">
                                            {errorText}
                                        </span>
                                    ) : null}
                                </fieldset>
                            )}
                        </Form.CheckboxGroupController>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </Form>
        );

        expect(container.querySelector('span.error-container').innerHTML).toBe(
            'This field is required.'
        );
    });
});
