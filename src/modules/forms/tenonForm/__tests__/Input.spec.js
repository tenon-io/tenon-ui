import React, { createRef } from 'react';
import { cleanup, render } from 'react-testing-library';
import 'jest-dom/extend-expect';
import Input from '../Input';

describe('Input', () => {
    afterEach(cleanup);

    it('should render an input and label only', () => {
        const { container } = render(
            <Input
                getLabelProps={() => ({ htmlFor: 'foo' })}
                getInputProps={() => ({ id: 'foo' })}
                labelText="Test input"
            />
        );

        expect(container.firstChild).toMatchSnapshot();
    });

    it('should render an error text when invalid', () => {
        const { container } = render(
            <Input
                getLabelProps={() => ({ htmlFor: 'foo' })}
                getInputProps={() => ({ id: 'foo', 'aria-describedby': 'bar' })}
                getErrorProps={() => ({ id: 'bar' })}
                labelText="Test input"
                errorText="Test error"
                showError={true}
            />
        );

        expect(container.firstChild).toMatchSnapshot();
    });

    it('should render a content hint if given', () => {
        const { container } = render(
            <Input
                contentHintText="Content hint test"
                getLabelProps={() => ({ htmlFor: 'foo' })}
                getInputProps={() => ({ id: 'foo', 'aria-describedby': 'bar' })}
                getContentHintProps={() => ({ id: 'bar' })}
                labelText="Test input"
            />
        );

        expect(container.firstChild).toMatchSnapshot();
    });

    it('should allow for easy overriding of default props', () => {
        const { getByLabelText, getByText } = render(
            <Input
                getLabelProps={() => ({ htmlFor: 'foo' })}
                getInputProps={() => ({ id: 'foo' })}
                labelText="Test input"
                labelProps={{ htmlFor: 'foo' }}
            />
        );

        expect(getByLabelText('Test input')).toHaveAttribute('id', 'foo');
        expect(getByText('Test input')).toHaveAttribute('for', 'foo');
    });

    it('should allow easy focus of the internal input', () => {
        const inPutRef = createRef();

        const { getByLabelText } = render(
            <Input
                ref={inPutRef}
                getLabelProps={() => ({ htmlFor: 'foo' })}
                getInputProps={() => ({ id: 'foo' })}
                labelText="Test input"
            />
        );

        expect(getByLabelText('Test input')).toEqual(inPutRef.current);
    });

    it('should render a required text with a fallback', () => {
        const { container, rerender } = render(
            <Input
                getLabelProps={() => ({ htmlFor: 'foo' })}
                getInputProps={() => ({ id: 'foo' })}
                labelText="Test input"
                required={true}
            />
        );

        expect(container.querySelector('span.required').innerHTML).toBe(
            '&nbsp;*'
        );

        rerender(
            <Input
                getLabelProps={() => ({ htmlFor: 'foo' })}
                getInputProps={() => ({ id: 'foo' })}
                labelText="Test input"
                required={true}
                requiredText="required"
            />
        );

        expect(container.querySelector('span.required').innerHTML).toBe(
            '&nbsp;required'
        );
    });
});
