import React from 'react';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import Notification from '../Notification';

describe('Notification', () => {
    afterEach(cleanup);

    it('should render with the message inactive', () => {
        const { container } = render(
            <Notification isActive={false} type="error">
                <span>Error message</span>
            </Notification>
        );

        const liveRegion = container.querySelector('div.notification');

        expect(liveRegion).not.toBeNull();
        expect(liveRegion.innerHTML).toBe('');
        expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
    });

    it('should render with the message active', () => {
        const { container } = render(
            <Notification isActive={true} type="error">
                <span>Error Message</span>
            </Notification>
        );

        expect(container.querySelector('div.notification span').innerHTML).toBe(
            'Error Message'
        );
    });

    it('should render an alert region for error messages', () => {
        const { container } = render(
            <Notification isActive={true} type="error">
                <span>Error Message</span>
            </Notification>
        );

        const liveRegion = container.querySelector('div.notification');
        expect(liveRegion).toHaveAttribute('role', 'alert');
        expect(liveRegion).toHaveAttribute('aria-live', 'assertive');
        expect(liveRegion.querySelector('div')).toHaveAttribute(
            'class',
            'error'
        );
    });

    it('should render a status region for warning messages', () => {
        const { container } = render(
            <Notification isActive={true} type="warning">
                <span>Error Message</span>
            </Notification>
        );

        const liveRegion = container.querySelector('div.notification');
        expect(liveRegion).toHaveAttribute('role', 'status');
        expect(liveRegion).toHaveAttribute('aria-live', 'polite');
        expect(liveRegion.querySelector('div')).toHaveAttribute(
            'class',
            'warning'
        );
    });

    it('should render an alert region for success messages', () => {
        const { container } = render(
            <Notification isActive={true} type="success">
                <span>Error Message</span>
            </Notification>
        );

        const liveRegion = container.querySelector('div.notification');
        expect(liveRegion).toHaveAttribute('role', 'status');
        expect(liveRegion).toHaveAttribute('aria-live', 'polite');
        expect(liveRegion.querySelector('div')).toHaveAttribute(
            'class',
            'success'
        );
    });

    it('should render an alert region for info messages', () => {
        const { container } = render(
            <Notification isActive={true} type="info">
                <span>Error Message</span>
            </Notification>
        );

        const liveRegion = container.querySelector('div.notification');
        expect(liveRegion).toHaveAttribute('role', 'status');
        expect(liveRegion).toHaveAttribute('aria-live', 'polite');
        expect(liveRegion.querySelector('div')).toHaveAttribute(
            'class',
            'info'
        );
    });
});
