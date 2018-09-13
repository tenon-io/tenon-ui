import React from 'react';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import Select from '../Select';

describe('Select', () => {
    afterEach(cleanup);

    it('should render an input and label only', () => {
        const { container } = render(
            <Select
                getLabelProps={() => ({ htmlFor: 'foo' })}
                getSelectProps={() => ({ id: 'foo' })}
                labelText="Test select"
            >
                <option value="one">One</option>
                <option value="two">Two</option>
            </Select>
        );

        expect(container.firstChild).toMatchSnapshot();
    });

    it('should render an error text when invalid', () => {
        const { container } = render(
            <Select
                getLabelProps={() => ({ htmlFor: 'foo' })}
                getSelectProps={() => ({
                    id: 'foo',
                    'aria-describedby': 'bar'
                })}
                getErrorProps={() => ({ id: 'bar' })}
                labelText="Test select"
                errorText="Test error"
                showError={true}
            >
                <option value="one">One</option>
                <option value="two">Two</option>
            </Select>
        );

        expect(container.firstChild).toMatchSnapshot();
    });

    it('should render a content hint if given', () => {
        const { container } = render(
            <Select
                contentHintText="Content hint test"
                getLabelProps={() => ({ htmlFor: 'foo' })}
                getSelectProps={() => ({
                    id: 'foo',
                    'aria-describedby': 'bar'
                })}
                getContentHintProps={() => ({ id: 'bar' })}
                labelText="Test select"
            >
                <option value="one">One</option>
                <option value="two">Two</option>
            </Select>
        );

        expect(container.firstChild).toMatchSnapshot();
    });

    it('should allow for easy overriding of default props', () => {
        const { getByLabelText, getByText } = render(
            <Select
                getLabelProps={() => ({ htmlFor: 'foo' })}
                getSelectProps={() => ({ id: 'foo' })}
                labelText="Test select"
                id="foo"
                labelProps={{ htmlFor: 'foo' }}
            >
                {' '}
                <option value="one">One</option>
                <option value="two">Two</option>
            </Select>
        );

        expect(getByLabelText('Test select')).toHaveAttribute('id', 'foo');
        expect(getByText('Test select')).toHaveAttribute('for', 'foo');
    });
});
