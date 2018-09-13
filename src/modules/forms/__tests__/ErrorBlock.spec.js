jest.mock('uuid/v4');

import React from 'react';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import ErrorBlock from '../ErrorBlock';
import uuidv4 from 'uuid/v4';

describe('ErrorBlock', () => {
    afterEach(cleanup);

    beforeEach(() => {
        jest.clearAllMocks();
        uuidv4.mockReturnValueOnce('sectionId');
    });

    it('should render as an unordered list to track the number of items', () => {
        const mockControls = {
            username: {
                validity: false,
                controlId: 'usernameControl',
                errorText: 'User name is required.'
            }
        };
        const { container, getByText } = render(
            <ErrorBlock formControls={mockControls} headingText="Some errors" />
        );
        expect(getByText('User name is required.')).toHaveAttribute(
            'href',
            '#usernameControl'
        );
        expect(container).toMatchSnapshot();
    });

    it('should render the error text and a hash href for each link', () => {
        const mockControls = {
            password: {
                validity: false,
                controlId: 'passwordControl',
                errorText: 'Your password is too short.'
            },
            tfaToken: {
                validity: false,
                controlId: 'tfaControl',
                errorText: 'Please enter a TFA token.'
            }
        };
        const { getByText } = render(
            <ErrorBlock formControls={mockControls} headingText="Some errors" />
        );
        expect(getByText('Your password is too short.')).toHaveAttribute(
            'href',
            '#passwordControl'
        );
        expect(getByText('Please enter a TFA token.')).toHaveAttribute(
            'href',
            '#tfaControl'
        );
    });

    it('should only render links for invalid controls', () => {
        const mockControls = {
            username: {
                validity: true,
                controlId: 'usernameControl',
                errorText: ''
            },
            password: {
                validity: false,
                controlId: 'passwordControl',
                errorText: 'Your password is too short.'
            },
            tfaToken: {
                validity: false,
                controlId: 'tfaControl',
                errorText: 'Please enter a TFA token.'
            },
            somethingElse: {
                validity: true,
                controlId: 'somethinElseControl',
                errorText: ''
            }
        };
        const { container, getByText } = render(
            <ErrorBlock formControls={mockControls} headingText="Some errors" />
        );
        expect(getByText('Your password is too short.')).toBeInTheDocument();
        expect(getByText('Please enter a TFA token.')).toBeInTheDocument();
        const list = container.querySelector('ul');
        expect(list.querySelectorAll('a').length).toBe(2);
    });

    it('should not render for an empty object to avoid polluting the DOM with an empty ul', () => {
        const { container } = render(
            <div>
                <ErrorBlock formControls={{}} headingText="Some errors" />
            </div>
        );
        expect(container.firstChild).toBeEmpty();
    });
});
