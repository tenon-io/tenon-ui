jest.mock('uuid/v4');

import React from 'react';
import { cleanup, fireEvent, render } from 'react-testing-library';
import 'jest-dom/extend-expect';
import Form from '../Form';
import { validator } from '../../../utils/helpers/validationHelpers';
import { isRequired } from '../../../utils/data/validation';
import uuidv4 from 'uuid/v4';

describe('Form.RadioGroupController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        uuidv4
            .mockReturnValueOnce('inputLabelId')
            .mockReturnValueOnce('contentHintId');
    });

    afterEach(cleanup);

    it('should render a standard radiogroup, provide a focus element and decorate with standard props', () => {
        const { getByLabelText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <Form.RadioGroupController name="testRadio">
                        {({ getRadioButtonProps, getLabelProps }) => (
                            <fieldset>
                                <legend>Test radio</legend>
                                <div>
                                    <input
                                        {...getRadioButtonProps({
                                            value: 'one',
                                            focusElement: true
                                        })}
                                    />
                                    <label {...getLabelProps()}>One</label>
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
        expect(inputOne).toHaveAttribute('id', 'inputLabelId');
        expect(inputOne).toHaveAttribute('name', 'testRadio');
        expect(inputOne).toHaveAttribute('value', 'one');
        expect(inputOne.attributes.length).toBe(4);

        const inputTwo = getByLabelText('Two');
        expect(inputTwo).toHaveAttribute('id', 'inputLabelId-two');
        expect(inputTwo).toHaveAttribute('name', 'testRadio');
        expect(inputTwo).toHaveAttribute('value', 'two');
        expect(inputTwo.attributes.length).toBe(4);
    });

    it('should run a custom onChange handler, when given', () => {
        let eventValue = '';

        let submitData = null;

        const onChangeSpy = jest.fn(e => {
            eventValue = e.target.value;
        });

        const { getByLabelText, getByText } = render(
            <Form
                onSubmit={data => {
                    submitData = data;
                }}
            >
                {() => (
                    <Form.RadioGroupController name="testRadio">
                        {({ getRadioButtonProps, getLabelProps }) => (
                            <fieldset>
                                <legend>Test check</legend>
                                <div>
                                    <input
                                        {...getRadioButtonProps({
                                            name: 'one',
                                            value: 'one',
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
                    </Form.RadioGroupController>
                )}
            </Form>
        );

        fireEvent.click(getByLabelText('One'));
        fireEvent.click(getByText('Submit'));

        expect(submitData).toEqual({ testRadio: 'one' });

        expect(onChangeSpy).toHaveBeenCalled();
        expect(eventValue).toBe('one');
    });

    it('should allow view injection via the component prop', () => {
        const RadioGroup = ({
            getRadioButtonProps,
            getLabelProps,
            legendText
        }) => (
            <fieldset>
                <legend>{legendText}</legend>
                <div>
                    <input
                        {...getRadioButtonProps({
                            value: 'one',
                            focusElement: true
                        })}
                    />
                    <label {...getLabelProps()}>One</label>
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
        );
        const { getByLabelText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <Form.RadioGroupController
                        name="testRadio"
                        legendText="Test radio"
                        component={RadioGroup}
                    />
                )}
            </Form>
        );

        const inputOne = getByLabelText('One');
        expect(inputOne).toHaveAttribute('id', 'inputLabelId');
        expect(inputOne).toHaveAttribute('name', 'testRadio');
        expect(inputOne).toHaveAttribute('value', 'one');
        expect(inputOne.attributes.length).toBe(4);

        const inputTwo = getByLabelText('Two');
        expect(inputTwo).toHaveAttribute('id', 'inputLabelId-two');
        expect(inputTwo).toHaveAttribute('name', 'testRadio');
        expect(inputTwo).toHaveAttribute('value', 'two');
        expect(inputTwo.attributes.length).toBe(4);
    });

    it('should spawn standard and ARIA props for a disabled radio button', () => {
        const { getByLabelText } = render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <Form.RadioGroupController name="testRadio">
                        {({ getRadioButtonProps, getLabelProps }) => (
                            <fieldset>
                                <legend>Test radio</legend>
                                <div>
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
                                getLabelProps,
                                errorText,
                                showError
                            }) => (
                                <fieldset>
                                    <legend>Test radio</legend>
                                    <div>
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
                                    {showError ? (
                                        <span className="error-container">
                                            {errorText}
                                        </span>
                                    ) : null}
                                </fieldset>
                            )}
                        </Form.RadioGroupController>
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
                        <Form.RadioGroupController
                            name="testRadio"
                            validators={[
                                validator(isRequired, 'This field is required.')
                            ]}
                        >
                            {({
                                getRadioButtonProps,
                                getLabelProps,
                                errorText,
                                showError
                            }) => (
                                <fieldset>
                                    <legend>Test radio</legend>
                                    <div>
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
                                    {showError ? (
                                        <span className="error-container">
                                            {errorText}
                                        </span>
                                    ) : null}
                                </fieldset>
                            )}
                        </Form.RadioGroupController>
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
