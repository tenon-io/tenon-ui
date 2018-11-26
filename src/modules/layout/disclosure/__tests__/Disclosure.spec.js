import React from 'react';
import { render, fireEvent, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import Disclosure from '../Disclosure';

describe('Disclosure', () => {
    afterEach(cleanup);

    it('should render a closed disclosure widget', () => {
        const { container, getByText } = render(
            <Disclosure>
                <Disclosure.Trigger>Expand-Collapse</Disclosure.Trigger>
                <Disclosure.Target>
                    <span>I am some content</span>
                </Disclosure.Target>
                <Disclosure.Target>
                    <span>I am some more content</span>
                    <span>I am some duplicate content</span>
                </Disclosure.Target>
            </Disclosure>
        );

        expect(getByText('Expand-Collapse')).toHaveAttribute(
            'aria-expanded',
            'false'
        );
        expect(getByText('Expand-Collapse')).toHaveAttribute(
            'type',
            'button'
        );
        expect(container.querySelector('span')).toBeNull();
    });

    it('should toggle expand and collapse of the widget', () => {
        const { container, getByText } = render(
            <Disclosure>
                <Disclosure.Trigger>Expand-Collapse</Disclosure.Trigger>
                <Disclosure.Target>
                    <span>I am some content</span>
                </Disclosure.Target>
                <Disclosure.Target>
                    <span>I am some more content</span>
                    <span>I am some duplicate content</span>
                </Disclosure.Target>
            </Disclosure>
        );

        const button = getByText('Expand-Collapse');
        fireEvent.click(button);

        expect(button).toHaveAttribute('aria-expanded', 'true');

        const shownSpans = container.querySelectorAll('span');

        expect(shownSpans.length).toBe(3);

        expect(shownSpans[0].textContent).toBe('I am some content');
        expect(shownSpans[1].textContent).toBe('I am some more content');
        expect(shownSpans[2].textContent).toBe('I am some duplicate content');

        fireEvent.click(button);

        expect(button).toHaveAttribute('aria-expanded', 'false');

        const hiddenSpans = container.querySelectorAll('span');

        expect(hiddenSpans.length).toBe(0);
    });

    it('should also hide by CSS hidden', () => {
        const { getByText } = render(
            <Disclosure>
                <Disclosure.Trigger>Expand-Collapse</Disclosure.Trigger>
                <Disclosure.Target useHidden="true">
                    <span>I am some content</span>
                </Disclosure.Target>
                <Disclosure.Target useHidden={true}>
                    <span>I am some other content</span>
                </Disclosure.Target>
            </Disclosure>
        );

        expect(getByText('I am some content')).toHaveAttribute('hidden');
        expect(getByText('I am some other content')).toHaveAttribute('hidden');

        fireEvent.click(getByText('Expand-Collapse'));

        expect(getByText('I am some content')).not.toHaveAttribute('hidden');
        expect(getByText('I am some other content')).not.toHaveAttribute(
            'hidden'
        );
    });

    it('should render trigger content with a render function', () => {
        const { getByTestId } = render(
            <Disclosure>
                <Disclosure.Trigger>
                    {expanded => (
                        <span data-testid="trigger-content">
                            {expanded.toString()}
                        </span>
                    )}
                </Disclosure.Trigger>
                <Disclosure.Target>
                    <span>I am some content</span>
                </Disclosure.Target>
            </Disclosure>
        );

        expect(getByTestId('trigger-content').textContent).toBe('false');

        fireEvent.click(getByTestId('trigger-content'));

        expect(getByTestId('trigger-content').textContent).toBe('true');
    });

    it('should add a expanded class to the trigger button when expanded', () => {
        const { getByText } = render(
            <Disclosure>
                <Disclosure.Trigger
                    expandedClass="is-expanded"
                    className="button"
                >
                    Expand-Collapse
                </Disclosure.Trigger>
                <Disclosure.Target>
                    <span>I am some content</span>
                </Disclosure.Target>
            </Disclosure>
        );

        expect(getByText('Expand-Collapse')).toHaveAttribute('class', 'button');

        fireEvent.click(getByText('Expand-Collapse'));

        expect(getByText('Expand-Collapse')).toHaveAttribute(
            'class',
            'button is-expanded'
        );
    });

    it('should allow deactivation of collapse / expand function', () => {
        const { container, getByText } = render(
            <Disclosure>
                <Disclosure.Trigger>Expand-Collapse</Disclosure.Trigger>
                <Disclosure.Target deactivate={true}>
                    <span>I am some content</span>
                </Disclosure.Target>
                <Disclosure.Target deactivate={true} useHidden={true}>
                    <span>I am some other content</span>
                </Disclosure.Target>
                <Disclosure.Target>
                    <span>I am yet some more content</span>
                </Disclosure.Target>
            </Disclosure>
        );

        expect(container.querySelectorAll('span').length).toBe(2);
        expect(getByText('I am some other content')).not.toHaveAttribute(
            'hidden'
        );

        fireEvent.click(getByText('Expand-Collapse'));

        expect(container.querySelectorAll('span').length).toBe(3);
        expect(getByText('I am some other content')).not.toHaveAttribute(
            'hidden'
        );
    });

    it('should allow setting expanded on mount', () => {
        const { container } = render(
            <div>
                <Disclosure isExpanded={true}>
                    <Disclosure.Trigger>Expand-Collapse</Disclosure.Trigger>
                    <Disclosure.Target>
                        <span>I am some content</span>
                    </Disclosure.Target>
                </Disclosure>
                <Disclosure isExpanded="true">
                    <Disclosure.Trigger>Expand-Collapse</Disclosure.Trigger>
                    <Disclosure.Target>
                        <span>I am some content</span>
                    </Disclosure.Target>
                </Disclosure>
            </div>
        );

        expect(container.querySelectorAll('span').length).toBe(2);
    });

    it('should override internal toggel state', () => {
        const { container, rerender } = render(
            <Disclosure isExpanded={false}>
                <Disclosure.Trigger>Expand-Collapse</Disclosure.Trigger>
                <Disclosure.Target>
                    <span>I am some content</span>
                </Disclosure.Target>
            </Disclosure>
        );

        expect(container.querySelectorAll('span').length).toBe(0);

        rerender(
            <Disclosure isExpanded={true}>
                <Disclosure.Trigger>Expand-Collapse</Disclosure.Trigger>
                <Disclosure.Target>
                    <span>I am some content</span>
                </Disclosure.Target>
            </Disclosure>
        );

        expect(container.querySelectorAll('span').length).toBe(1);
    });
});
