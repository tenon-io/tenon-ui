import React from 'react';
import { render, cleanup } from 'react-testing-library';
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
});
