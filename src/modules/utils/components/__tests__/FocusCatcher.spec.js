import React from 'react';
import { render, cleanup, fireEvent } from 'react-testing-library';
import 'jest-dom/extend-expect';
import FocusCatcher from '../FocusCatcher';

describe('FocusCatcher', () => {
    afterEach(cleanup);

    it('should stop the propagation of the onFocus event', () => {
        const outerFocus = jest.fn();
        const { getByText } = render(
            <div onFocus={outerFocus} tabIndex="-1">
                <FocusCatcher>
                    <label
                        htmlFor="testInput"
                        onClick={() => {
                            console.log('clicked');
                        }}
                    >
                        Click me
                    </label>
                    <input id="testInput" />
                </FocusCatcher>
            </div>
        );

        fireEvent.focus(getByText('Click me'));

        expect(outerFocus).not.toHaveBeenCalled();
    });
});
