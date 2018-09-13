import React from 'react';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import RequiredLegend from '../RequiredLegend';

describe('RequiredLegend', () => {
    afterEach(cleanup);

    it('should render without the required indicator', () => {
        const { container } = render(
            <div>
                <RequiredLegend
                    id="legendId"
                    className="label-class"
                    requiredText="( required )"
                >
                    Test legend
                </RequiredLegend>
                <div aria-labelledby="legendId" />
            </div>
        );

        expect(container.querySelector('legend.label-class').innerHTML).toBe(
            'Test legend'
        );
    });

    it('should render with the required indicator', () => {
        const { container, rerender } = render(
            <div>
                <RequiredLegend
                    id="legendId"
                    className="label-class"
                    requiredText="( required )"
                >
                    Test legend
                </RequiredLegend>
                <div aria-labelledby="legendId" required />
            </div>
        );

        //The tenon-ui elements will always update at least once when the
        //controllers update their props.
        rerender(
            <div>
                <RequiredLegend
                    id="legendId"
                    className="label-class"
                    requiredText="( required )"
                >
                    Test legend
                </RequiredLegend>
                <div aria-labelledby="legendId" required />
            </div>
        );

        expect(
            container.querySelector('legend.label-class.required').innerHTML
        ).toBe(
            'Test legend<span aria-hidden="true" class="required">( required )</span>'
        );
    });

    it('should render with no requiredText', () => {
        const { container, rerender } = render(
            <div>
                <RequiredLegend id="legendId" className="label-class">
                    Test legend
                </RequiredLegend>
                <div aria-labelledby="legendId" required />
            </div>
        );

        //The tenon-ui elements will always update at least once when the
        //controllers update their props.
        rerender(
            <div>
                <RequiredLegend id="legendId" className="label-class">
                    Test legend
                </RequiredLegend>
                <div aria-labelledby="legendId" required />
            </div>
        );

        expect(
            container.querySelector('legend.label-class.required').innerHTML
        ).toBe('Test legend<span aria-hidden="true" class="required"></span>');
    });
});
