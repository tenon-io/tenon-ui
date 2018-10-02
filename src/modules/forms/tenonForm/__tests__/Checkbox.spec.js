import React, { createRef } from 'react';
import { cleanup, render } from 'react-testing-library';
import 'jest-dom/extend-expect';
import Checkbox from '../Checkbox';

describe('Checkbox', () => {
    afterEach(cleanup);

    it('should render a checkbox and label only', () => {
        const { container } = render(
            <Checkbox
                getLabelProps={() => ({ htmlFor: 'foo' })}
                getCheckboxProps={() => ({ id: 'foo', type: 'checkbox' })}
                labelText="Test checkbox"
            />
        );

        expect(container.firstChild).toMatchSnapshot();
    });

    it('should render an error text when invalid', () => {
        const { container } = render(
            <Checkbox
                getLabelProps={() => ({ htmlFor: 'foo' })}
                getCheckboxProps={() => ({
                    id: 'foo',
                    'aria-describedby': 'bar',
                    type: 'checkbox'
                })}
                getErrorProps={() => ({ id: 'bar' })}
                labelText="Test checkbox"
                errorText="Test error"
                showError={true}
            />
        );

        expect(container.firstChild).toMatchSnapshot();
    });

    it('should render a content hint if given', () => {
        const { container } = render(
            <Checkbox
                contentHintText="Content hint test"
                getLabelProps={() => ({ htmlFor: 'foo' })}
                getCheckboxProps={() => ({
                    id: 'foo',
                    'aria-describedby': 'bar',
                    type: 'checkbox'
                })}
                getContentHintProps={() => ({ id: 'bar' })}
                labelText="Test checkbox"
            />
        );

        expect(container.firstChild).toMatchSnapshot();
    });

    it('should allow for easy overriding of default props', () => {
        const { getByLabelText, getByText } = render(
            <Checkbox
                getLabelProps={() => ({ htmlFor: 'foo' })}
                getCheckboxProps={() => ({ id: 'foo', type: 'checkbox' })}
                labelText="Test checkbox"
                labelProps={{ htmlFor: 'foo' }}
            />
        );

        expect(getByLabelText('Test checkbox')).toHaveAttribute('id', 'foo');
        expect(getByText('Test checkbox')).toHaveAttribute('for', 'foo');
    });

    it('should allow easy focus of the internal input', () => {
        const inPutRef = createRef();

        const { getByLabelText } = render(
            <Checkbox
                ref={inPutRef}
                getLabelProps={() => ({ htmlFor: 'foo' })}
                getCheckboxProps={() => ({ id: 'foo', type: 'checkbox' })}
                labelText="Test checkbox"
            />
        );

        expect(getByLabelText('Test checkbox')).toEqual(inPutRef.current);
    });

    it('should render a required text with a fallback', () => {
        const { container, rerender } = render(
            <Checkbox
                getLabelProps={() => ({ htmlFor: 'foo' })}
                getCheckboxProps={() => ({ id: 'foo', type: 'checkbox' })}
                labelText="Test checkbox"
                required={true}
            />
        );

        expect(container.querySelector('span.required').innerHTML).toBe(
            '&nbsp;*'
        );

        rerender(
            <Checkbox
                getLabelProps={() => ({ htmlFor: 'foo' })}
                getCheckboxProps={() => ({ id: 'foo', type: 'checkbox' })}
                labelText="Test checkbox"
                required={true}
                requiredText="required"
            />
        );

        expect(container.querySelector('span.required').innerHTML).toBe(
            '&nbsp;required'
        );
    });
});
