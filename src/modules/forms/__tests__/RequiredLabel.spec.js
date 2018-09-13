import React from 'react';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import RequiredLabel from '../RequiredLabel';

describe('RequiredLabel', () => {
    afterEach(cleanup);

    it('should render without the required indicator', () => {
        const { container } = render(
            <div>
                <RequiredLabel
                    htmlFor="testInput"
                    className="label-class"
                    requiredText="( required )"
                >
                    Test input
                </RequiredLabel>
                <input id="testInput" />
            </div>
        );

        expect(container.querySelector('label.label-class').innerHTML).toBe(
            'Test input'
        );
    });

    it('should render with no requiredText', () => {
        const { container, rerender } = render(
            <div>
                <RequiredLabel htmlFor="testInput" className="label-class">
                    Test input
                </RequiredLabel>
                <input id="testInput" required />
            </div>
        );

        //The tenon-ui elements will always update at least once when the
        //controllers update their props.
        rerender(
            <div>
                <RequiredLabel htmlFor="testInput" className="label-class">
                    Test input
                </RequiredLabel>
                <input id="testInput" required />
            </div>
        );

        expect(
            container.querySelector('label.label-class.required').innerHTML
        ).toBe('Test input<span aria-hidden="true" class="required"></span>');
    });
});
