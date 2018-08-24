jest.useFakeTimers();

import React from 'react';
import { render, cleanup, fireEvent } from 'react-testing-library';
import 'jest-dom/extend-expect';
import SpinnerButton from '../SpinnerButton';

describe('SpinnerButton', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllTimers();
    });

    it('should render in a non-busy state', () => {
        const { container } = render(
            <SpinnerButton
                isBusy={false}
                busyText="Working"
                onClick={jest.fn()}
            >
                Press me
            </SpinnerButton>
        );

        expect(container.querySelector('button').innerHTML).toBe('Press me');
        expect(container.querySelector('div.visually-hidden')).toHaveAttribute(
            'role',
            'status'
        );
        expect(container.querySelector('div.visually-hidden').innerHTML).toBe(
            ''
        );
    });

    it('should switch to a visually spinning state after a delay of 100ms', () => {
        const { container, rerender } = render(
            <SpinnerButton
                isBusy={false}
                busyText="Working"
                onClick={jest.fn()}
            >
                Press me
            </SpinnerButton>
        );

        rerender(
            <SpinnerButton isBusy={true} busyText="Working" onClick={jest.fn()}>
                Press me
            </SpinnerButton>
        );

        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 100);

        jest.runAllTimers();

        expect(container.querySelector('div.visually-hidden').innerHTML).toBe(
            'Working'
        );
        const button = container.querySelector('button');
        expect(button.innerHTML).toContain('Press me');
        const image = button.querySelector('svg');
        expect(image).toHaveClass('button-spinner-icon');
        const imageTitle = image.querySelector('title');
        expect(imageTitle.innerHTML).toBe('Working');
    });

    it('should avoid displaying the spinner of cancelled within 100ms', () => {
        const { container, rerender } = render(
            <SpinnerButton
                isBusy={false}
                busyText="Working"
                onClick={jest.fn()}
            >
                Press me
            </SpinnerButton>
        );

        rerender(
            <SpinnerButton isBusy={true} busyText="Working" onClick={jest.fn()}>
                Press me
            </SpinnerButton>
        );

        jest.advanceTimersByTime(95);

        rerender(
            <SpinnerButton
                isBusy={false}
                busyText="Working"
                onClick={jest.fn()}
            >
                Press me
            </SpinnerButton>
        );

        jest.runAllTimers();

        expect(container.querySelector('button').innerHTML).toBe('Press me');
        expect(container.querySelector('div.visually-hidden').innerHTML).toBe(
            ''
        );
    });

    it('should call the onClick handler if not busy', () => {
        const mockOnClickHandler = jest.fn();
        const mockOnBusyClickHandler = jest.fn();

        const { getByText } = render(
            <SpinnerButton
                isBusy={false}
                busyText="Working"
                onClick={mockOnClickHandler}
                onBusyClick={mockOnBusyClickHandler}
            >
                Press me
            </SpinnerButton>
        );

        const button = getByText('Press me');

        fireEvent.click(button);

        expect(mockOnClickHandler).toHaveBeenCalled();
        expect(mockOnBusyClickHandler).not.toHaveBeenCalled();
    });

    it('should not attempt to execute the onClick handler if it is not defined', () => {
        const { getByText } = render(
            <SpinnerButton isBusy={false} busyText="Working">
                Press me
            </SpinnerButton>
        );

        const button = getByText('Press me');

        fireEvent.click(button);
    });

    it('should call the onBusyClick handler if busy', () => {
        const mockOnClickHandler = jest.fn();
        const mockOnBusyClickHandler = jest.fn();

        const { container, rerender } = render(
            <SpinnerButton
                isBusy={false}
                busyText="Working"
                onClick={mockOnClickHandler}
                onBusyClick={mockOnBusyClickHandler}
            >
                Press me
            </SpinnerButton>
        );

        rerender(
            <SpinnerButton
                isBusy={true}
                busyText="Working"
                onClick={mockOnClickHandler}
                onBusyClick={mockOnBusyClickHandler}
            >
                Press me
            </SpinnerButton>
        );

        const button = container.querySelector('button');
        fireEvent.click(button);

        expect(mockOnClickHandler).not.toHaveBeenCalled();
        expect(mockOnBusyClickHandler).toHaveBeenCalled();
    });

    it('should not crash if no onBusyClick handler is provided', () => {
        const { container, rerender } = render(
            <SpinnerButton
                isBusy={false}
                busyText="Working"
                onClick={jest.fn()}
            >
                Press me
            </SpinnerButton>
        );

        rerender(
            <SpinnerButton isBusy={true} busyText="Working" onClick={jest.fn()}>
                Press me
            </SpinnerButton>
        );

        const button = container.querySelector('button');
        fireEvent.click(button);
    });

    it('should allow for a custom spinner image', () => {
        const { container, rerender } = render(
            <SpinnerButton
                isBusy={false}
                busyText="Working"
                spinnerImgSrc="someimage"
                onClick={jest.fn()}
            >
                Press me
            </SpinnerButton>
        );

        rerender(
            <SpinnerButton
                isBusy={true}
                busyText="Working"
                spinnerImgSrc="someimage"
                onClick={jest.fn()}
            >
                Press me
            </SpinnerButton>
        );

        jest.runAllTimers();

        const image = container.querySelector('img');
        expect(image.getAttribute('src')).toBe('someimage');
    });
});
