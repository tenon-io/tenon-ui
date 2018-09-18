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
            'contentHintId errorId'
        );
    });
});
