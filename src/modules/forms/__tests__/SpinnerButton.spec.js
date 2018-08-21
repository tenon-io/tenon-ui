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
        const image = button.querySelector('img');
        expect(image).toHaveAttribute('alt', 'Working');
        expect(image).toHaveClass('button-spinner-icon');
        expect(image.getAttribute('src')).toBe(
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTgiIGhlaWdodD0iNTgiIHZpZXdCb3g9IjAgMCA1OCA1OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4gICAgICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIgMSkiIHN0cm9rZT0iI0ZGRiIgc3Ryb2tlLXdpZHRoPSIxLjUiPiAgICAgICAgICAgIDxjaXJjbGUgY3g9IjQyLjYwMSIgY3k9IjExLjQ2MiIgcj0iNSIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsPSIjZmZmIj4gICAgICAgICAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iZmlsbC1vcGFjaXR5IiAgICAgICAgICAgICAgICAgICAgIGJlZ2luPSIwcyIgZHVyPSIxLjNzIiAgICAgICAgICAgICAgICAgICAgIHZhbHVlcz0iMTswOzA7MDswOzA7MDswIiBjYWxjTW9kZT0ibGluZWFyIiAgICAgICAgICAgICAgICAgICAgIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPiAgICAgICAgICAgIDwvY2lyY2xlPiAgICAgICAgICAgIDxjaXJjbGUgY3g9IjQ5LjA2MyIgY3k9IjI3LjA2MyIgcj0iNSIgZmlsbC1vcGFjaXR5PSIwIiBmaWxsPSIjZmZmIj4gICAgICAgICAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iZmlsbC1vcGFjaXR5IiAgICAgICAgICAgICAgICAgICAgIGJlZ2luPSIwcyIgZHVyPSIxLjNzIiAgICAgICAgICAgICAgICAgICAgIHZhbHVlcz0iMDsxOzA7MDswOzA7MDswIiBjYWxjTW9kZT0ibGluZWFyIiAgICAgICAgICAgICAgICAgICAgIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPiAgICAgICAgICAgIDwvY2lyY2xlPiAgICAgICAgICAgIDxjaXJjbGUgY3g9IjQyLjYwMSIgY3k9IjQyLjY2MyIgcj0iNSIgZmlsbC1vcGFjaXR5PSIwIiBmaWxsPSIjZmZmIj4gICAgICAgICAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iZmlsbC1vcGFjaXR5IiAgICAgICAgICAgICAgICAgICAgIGJlZ2luPSIwcyIgZHVyPSIxLjNzIiAgICAgICAgICAgICAgICAgICAgIHZhbHVlcz0iMDswOzE7MDswOzA7MDswIiBjYWxjTW9kZT0ibGluZWFyIiAgICAgICAgICAgICAgICAgICAgIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPiAgICAgICAgICAgIDwvY2lyY2xlPiAgICAgICAgICAgIDxjaXJjbGUgY3g9IjI3IiBjeT0iNDkuMTI1IiByPSI1IiBmaWxsLW9wYWNpdHk9IjAiIGZpbGw9IiNmZmYiPiAgICAgICAgICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJmaWxsLW9wYWNpdHkiICAgICAgICAgICAgICAgICAgICAgYmVnaW49IjBzIiBkdXI9IjEuM3MiICAgICAgICAgICAgICAgICAgICAgdmFsdWVzPSIwOzA7MDsxOzA7MDswOzAiIGNhbGNNb2RlPSJsaW5lYXIiICAgICAgICAgICAgICAgICAgICAgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIC8+ICAgICAgICAgICAgPC9jaXJjbGU+ICAgICAgICAgICAgPGNpcmNsZSBjeD0iMTEuMzk5IiBjeT0iNDIuNjYzIiByPSI1IiBmaWxsLW9wYWNpdHk9IjAiIGZpbGw9IiNmZmYiPiAgICAgICAgICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJmaWxsLW9wYWNpdHkiICAgICAgICAgICAgICAgICAgICAgYmVnaW49IjBzIiBkdXI9IjEuM3MiICAgICAgICAgICAgICAgICAgICAgdmFsdWVzPSIwOzA7MDswOzE7MDswOzAiIGNhbGNNb2RlPSJsaW5lYXIiICAgICAgICAgICAgICAgICAgICAgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIC8+ICAgICAgICAgICAgPC9jaXJjbGU+ICAgICAgICAgICAgPGNpcmNsZSBjeD0iNC45MzgiIGN5PSIyNy4wNjMiIHI9IjUiIGZpbGwtb3BhY2l0eT0iMCIgZmlsbD0iI2ZmZiI+ICAgICAgICAgICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImZpbGwtb3BhY2l0eSIgICAgICAgICAgICAgICAgICAgICBiZWdpbj0iMHMiIGR1cj0iMS4zcyIgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM9IjA7MDswOzA7MDsxOzA7MCIgY2FsY01vZGU9ImxpbmVhciIgICAgICAgICAgICAgICAgICAgICByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4gICAgICAgICAgICA8L2NpcmNsZT4gICAgICAgICAgICA8Y2lyY2xlIGN4PSIxMS4zOTkiIGN5PSIxMS40NjIiIHI9IjUiIGZpbGwtb3BhY2l0eT0iMCIgZmlsbD0iI2ZmZiI+ICAgICAgICAgICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImZpbGwtb3BhY2l0eSIgICAgICAgICAgICAgICAgICAgICBiZWdpbj0iMHMiIGR1cj0iMS4zcyIgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM9IjA7MDswOzA7MDswOzE7MCIgY2FsY01vZGU9ImxpbmVhciIgICAgICAgICAgICAgICAgICAgICByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4gICAgICAgICAgICA8L2NpcmNsZT4gICAgICAgICAgICA8Y2lyY2xlIGN4PSIyNyIgY3k9IjUiIHI9IjUiIGZpbGwtb3BhY2l0eT0iMCIgZmlsbD0iI2ZmZiI+ICAgICAgICAgICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImZpbGwtb3BhY2l0eSIgICAgICAgICAgICAgICAgICAgICBiZWdpbj0iMHMiIGR1cj0iMS4zcyIgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM9IjA7MDswOzA7MDswOzA7MSIgY2FsY01vZGU9ImxpbmVhciIgICAgICAgICAgICAgICAgICAgICByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4gICAgICAgICAgICA8L2NpcmNsZT4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg=='
        );
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
