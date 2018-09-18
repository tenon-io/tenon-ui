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
