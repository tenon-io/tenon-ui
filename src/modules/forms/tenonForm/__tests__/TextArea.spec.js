import React, { createRef } from 'react';
import { cleanup, render } from 'react-testing-library';
import 'jest-dom/extend-expect';
import TextArea from '../TextArea';

describe('TextArea', () => {
    afterEach(cleanup);

    it('should render a textarea and label only', () => {
        const { container } = render(
            <TextArea
                getLabelProps={() => ({ htmlFor: 'foo' })}
                getTextareaProps={() => ({ id: 'foo' })}
                labelText="Test textarea"
            />
        );

        expect(container.firstChild).toMatchSnapshot();
    });

    it('should render an error text when invalid', () => {
        const { container } = render(
            <TextArea
                getLabelProps={() => ({ htmlFor: 'foo' })}
                getTextareaProps={() => ({
                    id: 'foo',
                    'aria-describedby': 'bar'
                })}
                getErrorProps={() => ({ id: 'bar' })}
                labelText="Test textarea"
                errorText="Test error"
                showError={true}
            />
        );

        expect(container.firstChild).toMatchSnapshot();
    });

    it('should render a content hint if given', () => {
        const { container } = render(
            <TextArea
                contentHintText="Content hint test"
                getLabelProps={() => ({ htmlFor: 'foo' })}
                getTextareaProps={() => ({
                    id: 'foo',
                    'aria-describedby': 'bar'
                })}
                getContentHintProps={() => ({ id: 'bar' })}
                labelText="Test textarea"
            />
        );

        expect(container.firstChild).toMatchSnapshot();
    });

    it('should allow for easy overriding of default props', () => {
        const { getByLabelText, getByText } = render(
            <TextArea
                getLabelProps={() => ({ htmlFor: 'foo' })}
                getTextareaProps={() => ({ id: 'foo' })}
                labelText="Test textarea"
                id="foo"
                labelProps={{ htmlFor: 'foo' }}
            />
        );

        expect(getByLabelText('Test textarea')).toHaveAttribute('id', 'foo');
        expect(getByText('Test textarea')).toHaveAttribute('for', 'foo');
    });

    it('should allow easy focus of the internal textarea', () => {
        const textareaRef = createRef();

        const { getByLabelText } = render(
            <TextArea
                ref={textareaRef}
                getLabelProps={() => ({ htmlFor: 'foo' })}
                getTextareaProps={() => ({ id: 'foo' })}
                labelText="Test textarea"
            />
        );

        expect(getByLabelText('Test textarea')).toEqual(textareaRef.current);
    });

    it('should render a required text with a fallback', () => {
        const { container, rerender } = render(
            <TextArea
                getLabelProps={() => ({ htmlFor: 'foo' })}
                getTextareaProps={() => ({ id: 'foo' })}
                labelText="Test textarea"
                required={true}
            />
        );

        expect(container.querySelector('span.required').innerHTML).toBe(
            '&nbsp;*'
        );

        rerender(
            <TextArea
                getLabelProps={() => ({ htmlFor: 'foo' })}
                getTextareaProps={() => ({ id: 'foo' })}
                labelText="Test textarea"
                required={true}
                requiredText="required"
            />
        );

        expect(container.querySelector('span.required').innerHTML).toBe(
            '&nbsp;required'
        );
    });
});
