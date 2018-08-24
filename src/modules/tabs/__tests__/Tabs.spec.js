jest.mock('uuid/v4');

import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { render, fireEvent, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import Tabs from '../Tabs';
import uuidv4 from 'uuid/v4';

describe('Tabs render', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        uuidv4
            .mockReturnValueOnce('tabId1')
            .mockReturnValueOnce('panelId1')
            .mockReturnValueOnce('tabId2')
            .mockReturnValueOnce('panelId2');
    });

    afterEach(cleanup);

    it('should render a set of tabs with the first tab active by default', () => {
        const { container } = render(
            <Tabs>
                <Tabs.Tab title="Panel 1">
                    <p>This is panel 1</p>
                </Tabs.Tab>
                <Tabs.Tab title="Panel 2">
                    <p>This is panel 2</p>
                </Tabs.Tab>
            </Tabs>
        );

        const list = container.querySelector('ul');
        const listItems = list.querySelectorAll('li[role="presentation"]');
        const firstTab = list.querySelector('div#tabId1');
        const secondTab = list.querySelector('div#tabId2');
        const firstPanel = container.querySelector('section#panelId1');
        const secondPanel = container.querySelector('section#panelId2');

        expect(list).toHaveAttribute('role', 'tablist');

        expect(listItems.length).toBe(2);

        expect(firstTab).toHaveAttribute('aria-controls', 'panelId1');
        expect(firstTab).toHaveAttribute('aria-selected', 'true');
        expect(firstTab).toHaveAttribute('role', 'tab');
        expect(firstTab).toHaveAttribute('tabindex', '0');
        expect(firstTab.innerHTML).toBe('<span>Panel 1</span>');

        expect(secondTab).toHaveAttribute('aria-controls', 'panelId2');
        expect(secondTab).not.toHaveAttribute('aria-selected');
        expect(secondTab).toHaveAttribute('role', 'tab');
        expect(secondTab).toHaveAttribute('tabindex', '-1');
        expect(secondTab.innerHTML).toBe('<span>Panel 2</span>');

        expect(firstPanel).toHaveAttribute('aria-describedby', 'tabId1');
        expect(firstPanel).not.toHaveAttribute('hidden');
        expect(firstPanel.querySelector('h2').innerHTML).toBe('Panel 1');
        expect(firstPanel.querySelector('p').innerHTML).toBe('This is panel 1');

        expect(secondPanel).toHaveAttribute('aria-describedby', 'tabId2');
        expect(secondPanel.querySelector('h2').innerHTML).toBe('Panel 2');
        expect(secondPanel).toHaveAttribute('hidden');
        expect(secondPanel.querySelector('p').innerHTML).toBe(
            'This is panel 2'
        );
    });
});

describe('Tabs rerender', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        uuidv4
            .mockReturnValueOnce('tabId1')
            .mockReturnValueOnce('panelId1')
            .mockReturnValueOnce('tabId2')
            .mockReturnValueOnce('panelId2')
            .mockReturnValueOnce('tabId12')
            .mockReturnValueOnce('panelId12')
            .mockReturnValueOnce('tabId22')
            .mockReturnValueOnce('panelId22');
    });

    afterEach(cleanup);

    it('should re-activate the first tab when the children changes', () => {
        const { container, rerender } = render(
            <Tabs>
                <Tabs.Tab title="Panel 1">
                    <p>This is panel 1</p>
                </Tabs.Tab>
                <Tabs.Tab title="Panel 2">
                    <p>This is panel 2</p>
                </Tabs.Tab>
            </Tabs>
        );

        let list = container.querySelector('ul');
        let firstTab = list.querySelector('div#tabId1');
        let secondTab = list.querySelector('div#tabId2');

        fireEvent.click(secondTab);

        expect(firstTab).not.toHaveAttribute('aria-selected');
        expect(secondTab).toHaveAttribute('aria-selected', 'true');

        rerender(
            <Tabs>
                <Tabs.Tab title="Panel 1">
                    <p>This is panel 1</p>
                </Tabs.Tab>
                <Tabs.Tab title="Panel 3">
                    <p>This is panel 2</p>
                </Tabs.Tab>
            </Tabs>
        );

        list = container.querySelector('ul');
        firstTab = list.querySelector('div#tabId12');
        secondTab = list.querySelector('div#tabId22');

        expect(firstTab).toHaveAttribute('aria-selected', 'true');
        expect(secondTab).not.toHaveAttribute('aria-selected');
    });
});

describe('Tabs', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        uuidv4
            .mockReturnValueOnce('tabId1')
            .mockReturnValueOnce('panelId1')
            .mockReturnValueOnce('tabId2')
            .mockReturnValueOnce('panelId2')
            .mockReturnValueOnce('tabId3')
            .mockReturnValueOnce('panelId3');
    });

    afterEach(cleanup);

    it('should switch tabs on click', () => {
        const { container } = render(
            <Tabs>
                <Tabs.Tab title="Panel 1">
                    <p>This is panel 1</p>
                </Tabs.Tab>
                <Tabs.Tab title="Panel 2">
                    <p>This is panel 2</p>
                </Tabs.Tab>
                <Tabs.Tab title="Panel 3">
                    <p>This is panel 3</p>
                </Tabs.Tab>
            </Tabs>
        );

        const list = container.querySelector('ul');
        const firstTab = list.querySelector('div#tabId1');
        const secondTab = list.querySelector('div#tabId2');
        const thirdTab = list.querySelector('div#tabId3');
        const firstPanel = container.querySelector('section#panelId1');
        const secondPanel = container.querySelector('section#panelId2');
        const thirdPanel = container.querySelector('section#panelId3');

        expect(firstTab).toHaveAttribute('aria-selected', 'true');
        expect(firstTab).toHaveAttribute('tabindex', '0');
        expect(secondTab).not.toHaveAttribute('aria-selected');
        expect(secondTab).toHaveAttribute('tabindex', '-1');
        expect(thirdTab).not.toHaveAttribute('aria-selected');
        expect(thirdTab).toHaveAttribute('tabindex', '-1');
        expect(firstPanel).not.toHaveAttribute('hidden');
        expect(secondPanel).toHaveAttribute('hidden');
        expect(thirdPanel).toHaveAttribute('hidden');

        fireEvent.click(secondTab);

        expect(firstTab).not.toHaveAttribute('aria-selected');
        expect(firstTab).toHaveAttribute('tabindex', '-1');
        expect(secondTab).toHaveAttribute('aria-selected', 'true');
        expect(secondTab).toHaveAttribute('tabindex', '0');
        expect(thirdTab).not.toHaveAttribute('aria-selected');
        expect(thirdTab).toHaveAttribute('tabindex', '-1');
        expect(firstPanel).toHaveAttribute('hidden');
        expect(secondPanel).not.toHaveAttribute('hidden');
        expect(thirdPanel).toHaveAttribute('hidden');
    });

    it('should rotate tabs clockwise on right arrow', () => {
        const { container } = render(
            <Tabs>
                <Tabs.Tab title="Panel 1">
                    <p>This is panel 1</p>
                </Tabs.Tab>
                <Tabs.Tab title="Panel 2">
                    <p>This is panel 2</p>
                </Tabs.Tab>
                <Tabs.Tab title="Panel 3">
                    <p>This is panel 3</p>
                </Tabs.Tab>
            </Tabs>
        );

        const list = container.querySelector('ul');
        const firstTab = list.querySelector('div#tabId1');
        const secondTab = list.querySelector('div#tabId2');
        const thirdTab = list.querySelector('div#tabId3');
        const firstPanel = container.querySelector('section#panelId1');
        const secondPanel = container.querySelector('section#panelId2');
        const thirdPanel = container.querySelector('section#panelId3');

        expect(firstTab).toHaveAttribute('aria-selected', 'true');
        expect(firstTab).toHaveAttribute('tabindex', '0');
        expect(secondTab).not.toHaveAttribute('aria-selected');
        expect(secondTab).toHaveAttribute('tabindex', '-1');
        expect(thirdTab).not.toHaveAttribute('aria-selected');
        expect(thirdTab).toHaveAttribute('tabindex', '-1');
        expect(firstPanel).not.toHaveAttribute('hidden');
        expect(secondPanel).toHaveAttribute('hidden');
        expect(thirdPanel).toHaveAttribute('hidden');

        fireEvent.keyUp(firstTab, { keyCode: 39 });

        expect(firstTab).not.toHaveAttribute('aria-selected');
        expect(firstTab).toHaveAttribute('tabindex', '-1');
        expect(secondTab).toHaveAttribute('aria-selected', 'true');
        expect(secondTab).toHaveAttribute('tabindex', '0');
        expect(thirdTab).not.toHaveAttribute('aria-selected');
        expect(thirdTab).toHaveAttribute('tabindex', '-1');
        expect(firstPanel).toHaveAttribute('hidden');
        expect(secondPanel).not.toHaveAttribute('hidden');
        expect(thirdPanel).toHaveAttribute('hidden');

        fireEvent.keyUp(secondTab, { keyCode: 39 });

        expect(firstTab).not.toHaveAttribute('aria-selected');
        expect(firstTab).toHaveAttribute('tabindex', '-1');
        expect(secondTab).not.toHaveAttribute('aria-selected');
        expect(secondTab).toHaveAttribute('tabindex', '-1');
        expect(thirdTab).toHaveAttribute('aria-selected', 'true');
        expect(thirdTab).toHaveAttribute('tabindex', '0');
        expect(firstPanel).toHaveAttribute('hidden');
        expect(secondPanel).toHaveAttribute('hidden');
        expect(thirdPanel).not.toHaveAttribute('hidden');

        fireEvent.keyUp(secondTab, { keyCode: 39 });

        expect(firstTab).toHaveAttribute('aria-selected', 'true');
        expect(firstTab).toHaveAttribute('tabindex', '0');
        expect(secondTab).not.toHaveAttribute('aria-selected');
        expect(secondTab).toHaveAttribute('tabindex', '-1');
        expect(thirdTab).not.toHaveAttribute('aria-selected');
        expect(thirdTab).toHaveAttribute('tabindex', '-1');
        expect(firstPanel).not.toHaveAttribute('hidden');
        expect(secondPanel).toHaveAttribute('hidden');
        expect(thirdPanel).toHaveAttribute('hidden');
    });

    it('should rotate tabs counter-clockwise on left arrow', () => {
        const { container } = render(
            <Tabs>
                <Tabs.Tab title="Panel 1">
                    <p>This is panel 1</p>
                </Tabs.Tab>
                <Tabs.Tab title="Panel 2">
                    <p>This is panel 2</p>
                </Tabs.Tab>
                <Tabs.Tab title="Panel 3">
                    <p>This is panel 3</p>
                </Tabs.Tab>
            </Tabs>
        );

        const list = container.querySelector('ul');
        const firstTab = list.querySelector('div#tabId1');
        const secondTab = list.querySelector('div#tabId2');
        const thirdTab = list.querySelector('div#tabId3');
        const firstPanel = container.querySelector('section#panelId1');
        const secondPanel = container.querySelector('section#panelId2');
        const thirdPanel = container.querySelector('section#panelId3');

        expect(firstTab).toHaveAttribute('aria-selected', 'true');
        expect(firstTab).toHaveAttribute('tabindex', '0');
        expect(secondTab).not.toHaveAttribute('aria-selected');
        expect(secondTab).toHaveAttribute('tabindex', '-1');
        expect(thirdTab).not.toHaveAttribute('aria-selected');
        expect(thirdTab).toHaveAttribute('tabindex', '-1');
        expect(firstPanel).not.toHaveAttribute('hidden');
        expect(secondPanel).toHaveAttribute('hidden');
        expect(thirdPanel).toHaveAttribute('hidden');

        fireEvent.keyUp(firstTab, { keyCode: 37 });

        expect(firstTab).not.toHaveAttribute('aria-selected');
        expect(firstTab).toHaveAttribute('tabindex', '-1');
        expect(secondTab).not.toHaveAttribute('aria-selected');
        expect(secondTab).toHaveAttribute('tabindex', '-1');
        expect(thirdTab).toHaveAttribute('aria-selected', 'true');
        expect(thirdTab).toHaveAttribute('tabindex', '0');
        expect(firstPanel).toHaveAttribute('hidden');
        expect(secondPanel).toHaveAttribute('hidden');
        expect(thirdPanel).not.toHaveAttribute('hidden');

        fireEvent.keyUp(firstTab, { keyCode: 37 });

        expect(firstTab).not.toHaveAttribute('aria-selected');
        expect(firstTab).toHaveAttribute('tabindex', '-1');
        expect(secondTab).toHaveAttribute('aria-selected', 'true');
        expect(secondTab).toHaveAttribute('tabindex', '0');
        expect(thirdTab).not.toHaveAttribute('aria-selected');
        expect(thirdTab).toHaveAttribute('tabindex', '-1');
        expect(firstPanel).toHaveAttribute('hidden');
        expect(secondPanel).not.toHaveAttribute('hidden');
        expect(thirdPanel).toHaveAttribute('hidden');

        fireEvent.keyUp(secondTab, { keyCode: 37 });

        expect(firstTab).toHaveAttribute('aria-selected', 'true');
        expect(firstTab).toHaveAttribute('tabindex', '0');
        expect(secondTab).not.toHaveAttribute('aria-selected');
        expect(secondTab).toHaveAttribute('tabindex', '-1');
        expect(thirdTab).not.toHaveAttribute('aria-selected');
        expect(thirdTab).toHaveAttribute('tabindex', '-1');
        expect(firstPanel).not.toHaveAttribute('hidden');
        expect(secondPanel).toHaveAttribute('hidden');
        expect(thirdPanel).toHaveAttribute('hidden');
    });

    it('should focus the panel on arrow down', () => {
        const { container } = render(
            <Tabs>
                <Tabs.Tab title="Panel 1">
                    <p>This is panel 1</p>
                </Tabs.Tab>
                <Tabs.Tab title="Panel 2">
                    <p>This is panel 2</p>
                </Tabs.Tab>
                <Tabs.Tab title="Panel 3">
                    <p>This is panel 3</p>
                </Tabs.Tab>
            </Tabs>
        );

        const list = container.querySelector('ul');
        const firstTab = list.querySelector('div#tabId1');
        const secondTab = list.querySelector('div#tabId2');

        firstTab.focus();

        expect(document.activeElement).toHaveAttribute('id', 'tabId1');

        fireEvent.keyUp(secondTab, { keyCode: 40 });

        expect(document.activeElement).toHaveAttribute('id', 'panelId1');
    });

    it('should do nothing for a key event other than the ones described', () => {
        const { container } = render(
            <Tabs>
                <Tabs.Tab title="Panel 1">
                    <p>This is panel 1</p>
                </Tabs.Tab>
                <Tabs.Tab title="Panel 2">
                    <p>This is panel 2</p>
                </Tabs.Tab>
                <Tabs.Tab title="Panel 3">
                    <p>This is panel 3</p>
                </Tabs.Tab>
            </Tabs>
        );

        const list = container.querySelector('ul');
        const firstTab = list.querySelector('div#tabId1');
        const secondTab = list.querySelector('div#tabId2');
        const thirdTab = list.querySelector('div#tabId3');
        const firstPanel = container.querySelector('section#panelId1');
        const secondPanel = container.querySelector('section#panelId2');
        const thirdPanel = container.querySelector('section#panelId3');

        expect(firstTab).toHaveAttribute('aria-selected', 'true');
        expect(firstTab).toHaveAttribute('tabindex', '0');
        expect(secondTab).not.toHaveAttribute('aria-selected');
        expect(secondTab).toHaveAttribute('tabindex', '-1');
        expect(thirdTab).not.toHaveAttribute('aria-selected');
        expect(thirdTab).toHaveAttribute('tabindex', '-1');
        expect(firstPanel).not.toHaveAttribute('hidden');
        expect(secondPanel).toHaveAttribute('hidden');
        expect(thirdPanel).toHaveAttribute('hidden');

        fireEvent.keyUp(firstTab, { keyCode: 99 });

        expect(firstTab).toHaveAttribute('aria-selected', 'true');
        expect(firstTab).toHaveAttribute('tabindex', '0');
        expect(secondTab).not.toHaveAttribute('aria-selected');
        expect(secondTab).toHaveAttribute('tabindex', '-1');
        expect(thirdTab).not.toHaveAttribute('aria-selected');
        expect(thirdTab).toHaveAttribute('tabindex', '-1');
        expect(firstPanel).not.toHaveAttribute('hidden');
        expect(secondPanel).toHaveAttribute('hidden');
        expect(thirdPanel).toHaveAttribute('hidden');
    });
});

describe('Tabs dynamic render', () => {
    beforeEach(() => {
        jest.clearAllTimers();
    });

    afterEach(cleanup);

    it('should dynamically update the container tabs when they are changed', () => {
        uuidv4.mockReturnValueOnce('tabId1').mockReturnValueOnce('panelId1');

        let showFirstTab = false;

        const { container, rerender } = render(
            <Tabs>
                {showFirstTab ? (
                    <Tabs.Tab title="Panel 1">
                        <p>This is panel 1</p>
                    </Tabs.Tab>
                ) : null}
                <Tabs.Tab title="Panel 2">
                    <p>This is panel 2</p>
                </Tabs.Tab>
            </Tabs>
        );

        let list = container.querySelector('ul');
        let firstTab = list.querySelector('div#tabId1');
        let secondTab = list.querySelector('div#tabId2');

        expect(firstTab).toHaveAttribute('aria-selected', 'true');
        expect(secondTab).toBeNull();

        uuidv4
            .mockReturnValueOnce('tabId1')
            .mockReturnValueOnce('panelId1')
            .mockReturnValueOnce('tabId2')
            .mockReturnValueOnce('panelId2');

        showFirstTab = true;

        rerender(
            <Tabs>
                {showFirstTab ? (
                    <Tabs.Tab title="Panel 1">
                        <p>This is panel 1</p>
                    </Tabs.Tab>
                ) : null}
                <Tabs.Tab title="Panel 2">
                    <p>This is panel 2</p>
                </Tabs.Tab>
            </Tabs>
        );

        list = container.querySelector('ul');
        firstTab = list.querySelector('div#tabId1');
        secondTab = list.querySelector('div#tabId2');

        expect(firstTab).toHaveAttribute('aria-selected', 'true');
        expect(secondTab).not.toBeNull();
    });
});

describe('Tabs.Tab', () => {
    afterEach(cleanup);

    it('should render a tab panel', () => {
        const { container } = render(
            <Tabs.Tab panelId="panelId" tabId="tabId" title="Test title">
                <span>Some content</span>
            </Tabs.Tab>
        );

        const containerSection = container.querySelector('section');

        const focusTrapDiv = container.querySelector('div');

        expect(focusTrapDiv).toHaveAttribute('tabindex', '-1');
        expect(focusTrapDiv).toHaveAttribute('style', 'outline: none;');

        expect(containerSection.querySelector('h2').innerHTML).toBe(
            'Test title'
        );
        expect(containerSection.querySelector('span').innerHTML).toBe(
            'Some content'
        );
        expect(containerSection).toHaveAttribute('id', 'panelId');
        expect(containerSection).toHaveAttribute('aria-describedby', 'tabId');
        expect(containerSection).toHaveAttribute('role', 'tabpanel');
        expect(containerSection).toHaveAttribute('tabindex', '0');
        expect(containerSection.attributes.length).toBe(4);
    });

    it('should default to h2', () => {
        const { container } = render(
            <Tabs.Tab title="Test title">
                <span>Some content</span>
            </Tabs.Tab>
        );

        expect(container.querySelector('h2').innerHTML).toBe('Test title');
    });

    it('should allow the heading level to be overridden as a string', () => {
        const { container } = render(
            <Tabs.Tab title="Test title" headingLevel="1">
                <span>Some content</span>
            </Tabs.Tab>
        );

        expect(container.querySelector('h1').innerHTML).toBe('Test title');
    });

    it('should allow the heading level to be overridden as a number', () => {
        const { container } = render(
            <Tabs.Tab title="Test title" headingLevel={1}>
                <span>Some content</span>
            </Tabs.Tab>
        );

        expect(container.querySelector('h1').innerHTML).toBe('Test title');
    });

    it('should mark a section as hidden if required', () => {
        const { container } = render(
            <Tabs.Tab title="Test title" isHidden={true}>
                <span>Some content</span>
            </Tabs.Tab>
        );

        expect(container.querySelector('section')).toHaveAttribute('hidden');
        expect(container.querySelector('section').attributes.length).toBe(3);
    });

    it('should forward a ref to the section element', () => {
        let elementRef = React.createRef();

        render(
            <Tabs.Tab ref={elementRef} panelId="panelId" title="Test title">
                <span>Some content</span>
            </Tabs.Tab>
        );

        expect(elementRef.current).toHaveAttribute('id', 'panelId');
    });

    it('should trap focus on the internal div container', () => {
        const mockEventObject = {
            stopPropagation: jest.fn()
        };

        const { container } = render(
            <Tabs.Tab title="Test title">
                <span>Some content</span>
            </Tabs.Tab>
        );

        const focusDiv = container.querySelector('section div');

        ReactTestUtils.Simulate.focus(focusDiv, mockEventObject);

        expect(mockEventObject.stopPropagation).toHaveBeenCalled();
    });
});
