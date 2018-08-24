jest.mock('uuid/v4');

import React from 'react';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import Spinner from '../Spinner';
import uuidv4 from 'uuid/v4';

describe('spinner', () => {
    afterEach(cleanup);

    it('should render a spinner', () => {
        uuidv4.mockReturnValueOnce('testId');

        const { container } = render(<Spinner title="Working" />);

        const svg = container.querySelector('svg');

        expect(svg).toHaveAttribute('aria-describedby', 'testId');
        expect(svg).toHaveAttribute('role', 'img');

        const title = svg.querySelector('title');

        expect(title.innerHTML).toBe('Working');
        expect(title).toHaveAttribute('id', 'testId');

        expect(container).toMatchSnapshot();
    });

    it('should accept a custome CSS class', () => {
        uuidv4.mockReturnValueOnce('testId');

        const { container } = render(
            <Spinner title="Working" className="test-class" />
        );

        const svg = container.querySelector('svg');

        expect(svg).toHaveAttribute('class', 'test-class');
    });
});
