jest.mock('../../../utils/components/FocusCatcher');

import React, { createRef } from 'react';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import RadioGroup from '../RadioGroup';

describe('RadioGroup', () => {
    afterEach(cleanup);

    it('should render an input and label only', () => {
        const { container, getByLabelText } = render(
            <RadioGroup
                legend="Test radio group"
                options={{
                    one: 'One',
                    two: 'Two'
                }}
                getLegendProps={() => ({ id: 'bar' })}
                getLabelProps={props => ({
                    htmlFor: `foo-${props.autoIdPostfix}`
                })}
                getRadioButtonProps={({ value }) => ({
                    id: `foo-${value}`,
                    value,
                    onChange: jest.fn()
                })}
                getRadioGroupProps={conf => ({
                    'aria-labelledby': 'bar',
                    role: 'radiogroup',
                    value: conf.value
                })}
            />
        );

        expect(getByLabelText('One').value).toBe('one');

        expect(container.firstChild).toMatchSnapshot();
    });

    it('should render an error text when invalid', () => {
        const { container } = render(
            <RadioGroup
                legend="Test radio group"
                options={{
                    one: 'One',
                    two: 'Two'
                }}
                getLegendProps={() => ({ id: 'bar' })}
                getLabelProps={props => ({
                    htmlFor: `foo-${props.autoIdPostfix}`
                })}
                getRadioButtonProps={({ value }) => ({
                    id: `foo-${value}`,
                    value,
                    onChange: jest.fn()
                })}
                getRadioGroupProps={conf => ({
                    'aria-labelledby': 'bar',
                    'aria-describedby': 'err',
                    role: 'radiogroup',
                    value: conf.value
                })}
                getErrorProps={() => ({ id: 'err' })}
                errorText="Test error"
                showError={true}
            />
        );

        expect(container.firstChild).toMatchSnapshot();
    });

    it('should render a content hint if given', () => {
        const { container } = render(
            <RadioGroup
                legend="Test radio group"
                options={{
                    one: 'One',
                    two: 'Two'
                }}
                getLegendProps={() => ({ id: 'bar' })}
                getLabelProps={props => ({
                    htmlFor: `foo-${props.autoIdPostfix}`
                })}
                getRadioButtonProps={({ value }) => ({
                    id: `foo-${value}`,
                    value,
                    onChange: jest.fn()
                })}
                getRadioGroupProps={conf => ({
                    'aria-labelledby': 'bar',
                    'aria-describedby': 'inf',
                    role: 'radiogroup',
                    value: conf.value
                })}
                getContentHintProps={() => ({ id: 'inf' })}
                contentHintText="Content hint test"
            />
        );

        expect(container.firstChild).toMatchSnapshot();
    });

    it('should allow easy focus of the internal radio group', () => {
        const radioGroupRef = createRef();

        const { container } = render(
            <RadioGroup
                ref={radioGroupRef}
                legend="Test radio group"
                options={{
                    one: 'One',
                    two: 'Two'
                }}
                getLegendProps={() => ({ id: 'bar' })}
                getLabelProps={props => ({
                    htmlFor: `foo-${props.autoIdPostfix}`
                })}
                getRadioButtonProps={({ value }) => ({
                    id: `foo-${value}`,
                    value,
                    onChange: jest.fn()
                })}
                getRadioGroupProps={conf => ({
                    'aria-labelledby': 'bar',
                    role: 'radiogroup',
                    tabIndex: '-1',
                    value: conf.value
                })}
            />
        );
        expect(container.querySelector('[role="radiogroup"]')).toEqual(
            radioGroupRef.current
        );
    });
});
