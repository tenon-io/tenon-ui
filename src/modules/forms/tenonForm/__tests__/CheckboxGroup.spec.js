jest.mock('../../../utils/components/FocusCatcher');

import React, { createRef } from 'react';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import CheckboxGroup from '../CheckboxGroup';

describe('CheckboxGroup', () => {
    afterEach(cleanup);

    it('should render a basic checkbox group', () => {
        const { container } = render(
            <CheckboxGroup
                legend="Test checkbox group"
                options={{
                    one: 'One',
                    two: 'Two'
                }}
                getLegendProps={() => ({ id: 'bar' })}
                getLabelProps={props => ({
                    htmlFor: props.autoIdPostfix
                        ? `foo-${props.autoIdPostfix}`
                        : 'foo'
                })}
                getCheckboxProps={({ name, focusElement }) => ({
                    id: focusElement ? 'foo' : `foo-${name}`,
                    name,
                    onChange: jest.fn()
                })}
                getCheckboxGroupProps={() => ({
                    'aria-labelledby': 'bar',
                    role: 'group'
                })}
            />
        );

        expect(container.firstChild).toMatchSnapshot();
    });

    it('should render an error text when invalid', () => {
        const { container } = render(
            <CheckboxGroup
                legend="Test checkbox group"
                options={{
                    one: 'One',
                    two: 'Two'
                }}
                getLegendProps={() => ({ id: 'bar' })}
                getLabelProps={props => ({
                    htmlFor: props.autoIdPostfix
                        ? `foo-${props.autoIdPostfix}`
                        : 'foo'
                })}
                getCheckboxProps={({ name, focusElement }) => ({
                    id: focusElement ? 'foo' : `foo-${name}`,
                    name,
                    onChange: jest.fn()
                })}
                getCheckboxGroupProps={() => ({
                    'aria-describedby': 'err',
                    'aria-labelledby': 'bar',
                    role: 'group'
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
            <CheckboxGroup
                legend="Test checkbox group"
                options={{
                    one: 'One',
                    two: 'Two'
                }}
                getLegendProps={() => ({ id: 'bar' })}
                getLabelProps={props => ({
                    htmlFor: props.autoIdPostfix
                        ? `foo-${props.autoIdPostfix}`
                        : 'foo'
                })}
                getCheckboxProps={({ name, focusElement }) => ({
                    id: focusElement ? 'foo' : `foo-${name}`,
                    name,
                    onChange: jest.fn()
                })}
                getCheckboxGroupProps={() => ({
                    'aria-describedby': 'inf',
                    'aria-labelledby': 'bar',
                    role: 'group'
                })}
                getContentHintProps={() => ({ id: 'inf' })}
                contentHintText="Content hint test"
            />
        );

        expect(container.firstChild).toMatchSnapshot();
    });

    it('should allow easy focus of the internal radio group', () => {
        const checkboxGroupRef = createRef();

        const { getByLabelText } = render(
            <CheckboxGroup
                ref={checkboxGroupRef}
                legend="Test radio group"
                options={{
                    one: 'One',
                    two: 'Two'
                }}
                getLegendProps={() => ({ id: 'bar' })}
                getLabelProps={props => ({
                    htmlFor: props.autoIdPostfix
                        ? `foo-${props.autoIdPostfix}`
                        : 'foo'
                })}
                getCheckboxProps={({ name, focusElement }) => ({
                    id: focusElement ? 'foo' : `foo-${name}`,
                    name,
                    onChange: jest.fn()
                })}
                getCheckboxGroupProps={() => ({
                    'aria-labelledby': 'bar',
                    role: 'group'
                })}
            />
        );

        expect(getByLabelText('One')).toEqual(checkboxGroupRef.current);
    });
});
