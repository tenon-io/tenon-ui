import React, { Component, Fragment, forwardRef } from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';
import memoize from 'memoize-one';
import deepEqual from 'lodash.isequal';
import Heading from '../layout/Heading';
import { keyNames } from '../utils/constants/keyCodes';
import { getKey } from '../utils/helpers/eventHelpers';

/**
 * @component
 * Tab component. To be used exclusively with the Tabs component.
 *
 * Note that the Tab control uses the Tenon Heading component. It
 * will automatically calculate heading levels in an application where
 * the Heading component is used. Otherwise a level can be set with the
 * headingLevel prop.
 *
 * @prop {React.Node} children - React child content. The Tab component
 *                  is a container component.
 * @prop required {string} title - The title of the Tab.
 * @prop {string} tabId - The ID of the controlling clickable tab.
 * @prop {string} panelId - The ID of the tab panel the content will be
 *                  rendered into.
 * @prop {boolean} isHidden - Indicates id the tab is visible or CSS hidden.
 * @prop {string | number} headingLevel - The level of <h> element to render.
 *                  The default is <h2>.
 */
export const Tab = forwardRef(
    (
        {
            children,
            title,
            tabId,
            panelId,
            isHidden,
            headingLevel,
            noHeading,
            className
        },
        ref
    ) => {
        return (
            <Heading.LevelBoundary
                levelOverride={headingLevel ? headingLevel : null}
            >
                <section
                    id={panelId}
                    role="tabpanel"
                    tabIndex="0"
                    ref={ref}
                    className={className ? className : null}
                    aria-describedby={tabId}
                    hidden={isHidden ? 'hidden' : null}
                >
                    <div
                        tabIndex="-1"
                        onFocus={e => {
                            e.stopPropagation();
                        }}
                        style={{ outline: 'none' }}
                    >
                        {noHeading ? null : <Heading.H>{title}</Heading.H>}
                        {children}
                    </div>
                </section>
            </Heading.LevelBoundary>
        );
    }
);

Tab.propTypes = {
    title: PropTypes.string.isRequired,
    tabId: PropTypes.string,
    panelId: PropTypes.string,
    isHidden: PropTypes.bool,
    headingLevel: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    noHeading: PropTypes.bool,
    className: PropTypes.string
};

Tab.displayName = 'Tabs.Tab';

/**
 * @component
 * Compound component exposing the managing Tabs component as well as
 * the Tab container component.
 *
 * @example
 * <Tabs>
 *     <Tabs.Tab title="My Title">
 *         <p>Some panel content</span>
 *     </Tabs.Tab>
 * </Tabs>
 */
class Tabs extends Component {
    static propTypes = {
        toggleRender: PropTypes.func,
        onTabActivated: PropTypes.func
    };

    static Tab = Tab;

    state = {
        activeTabId: ''
    };

    tabsById = [];
    panelIdByTabId = {};
    tabRefs = {};
    panelRefs = {};

    /**
     * @function
     * Event handler function for the onKeyUp event on the tab controller
     * elements.
     *
     * Handles the following keystrokes:
     *
     * ArrowLeft: Cycles active tabs counter clockwise.
     *
     * ArrowRight: cycles active tabs clockwise.
     *
     * ArrowDown: Sets focus to the controlled tab panel of the currently
     *          active Tab.
     *
     * @param {SyntheticKeyboardEvent} e
     */
    onKeyUpHandler = e => {
        const { activeTabId } = this.state;
        const currentSelectedIndex = this.tabsById.reduce(
            (prev, cur, index) => (cur.tabId === activeTabId ? index : prev),
            0
        );

        let newIndex = 0;

        switch (getKey(e)) {
            case keyNames.ArrowLeft:
                newIndex =
                    currentSelectedIndex > 0
                        ? currentSelectedIndex - 1
                        : this.tabsById.length - 1;
                break;
            case keyNames.ArrowRight:
                newIndex =
                    currentSelectedIndex === this.tabsById.length - 1
                        ? 0
                        : currentSelectedIndex + 1;
                break;
            case keyNames.ArrowDown:
                this.panelRefs[activeTabId || this.tabsById[0].tabId].focus();
                return;
            default:
                return;
        }

        this.setState(
            {
                activeTabId: this.tabsById[newIndex].tabId
            },
            () => {
                this.tabRefs[this.tabsById[newIndex].tabId].focus();
            }
        );

        this.callActivateHandler(this.tabsById[newIndex].name);
    };

    /**
     * @function
     * Event handler function for the click event on the tab controller
     * elements.
     *
     * Activates the tab.
     *
     * @param {SyntheticPointerEvent} e
     * @param {Object} tab
     */
    onClickHandler = (e, tab) => {
        e.preventDefault();
        this.setState({ activeTabId: tab.tabId });
        this.callActivateHandler(tab.name);
    };

    /**
     * @function
     * If defined, this handler gets called with the given tab name
     * when the tab is activated.
     *
     * @param {string} name
     */
    callActivateHandler = name => {
        const { onTabActivated } = this.props;

        if (onTabActivated) {
            onTabActivated(name);
        }
    };

    /**
     * @function
     * Registers the React ref related to the clickable control
     * for each Tab.
     *
     * This is required to set focus on it later when navigating with
     * keyboard.
     *
     * @param {string} tabId
     * @param {React.Ref} ref
     */
    registerTabRef = (tabId, ref) => {
        this.tabRefs[tabId] = ref;
    };

    /**
     * @function
     * Registers the React ref related to the panels for each Tab.
     *
     * This is required to set focus on it later when navigating with
     * keyboard.
     *
     * @param {string} panelId
     * @param {React.Ref} ref
     */
    registerPanelRef = (panelId, ref) => {
        this.panelRefs[panelId] = ref;
    };

    /**
     * @function
     * Calculates and assigns ID's based on the containing Tab
     * components used.
     *
     * This function is memoized as it should only be run when the
     * children of the Tabs component changes.
     *
     * NOTE: That the panels need to take into account null/undefined
     * values for conditionally rendered children.
     *
     *@param {Object} tabChildren - Array of all tab children titles and
     *            names.
     *
     *@returns {Object} Metadata object containing two arrays:
     *            tabMetadata: Metadata to use for the tabs.
     *            renderedTabs: Metadata to use for the tab panels.
     */
    calcTabMetadata = memoize(tabChildren => {
        this.tabRefs = {};
        this.panelRefs = {};

        const tabPanelMetadata = tabChildren.map(
            child =>
                child
                    ? {
                          title: child.title,
                          name: child.name,
                          tabId: uuidv4(),
                          panelId: uuidv4()
                      }
                    : {}
        );

        const tabMetadata = tabPanelMetadata.filter(tab => !!tab.tabId);

        this.tabsById = tabMetadata.map(tab => ({
            tabId: tab.tabId,
            name: tab.name
        }));

        this.panelIdByTabId = tabMetadata.reduce(
            (prev, cur) => ({
                ...prev,
                [cur.tabId]: cur.panelId
            }),
            {}
        );

        return { tabPanelMetadata, tabMetadata };
    }, deepEqual);

    /**
     * @function
     * Calculates a corrected active tab index, taking into acount first time
     * render and changing the internal children. In these cases the first tab
     * is to be activated.
     *
     * @params {string} activeTabIndex - String representing the unadjusted id
     *                  of the estimated active tab.
     * @param {array} tabsById - Array of tab configuration objects.
     *
     * @returns {string} - The id of the tab that should be rendered as active.
     */
    getSelectedTab = memoize(
        (activeTabId, tabsById) =>
            tabsById.filter(tab => tab.tabId === activeTabId).length === 0
                ? this.tabsById[0].tabId
                : activeTabId,
        deepEqual
    );

    render() {
        const { children, toggleRender } = this.props;

        //If a name is not given as prop on the Tab component, the tab gets
        //an autoassigned name based on the child index.
        const tabs = this.calcTabMetadata(
            React.Children.map(children, (child, i) => ({
                title: child ? child.props.title : '',
                name:
                    child && child.props.name
                        ? child.props.name
                        : `tab${i.toString()}`
            }))
        );

        const { activeTabId } = this.state;
        const selectedTabId = this.getSelectedTab(activeTabId, this.tabsById);

        return (
            <Fragment>
                <ul role="tablist">
                    {tabs.tabMetadata.map(tab => (
                        <li key={tab.tabId} role="presentation">
                            <div
                                id={tab.tabId}
                                role="tab"
                                ref={anchor =>
                                    this.registerTabRef(tab.tabId, anchor)
                                }
                                tabIndex={
                                    tab.tabId === selectedTabId ? '0' : '-1'
                                }
                                onClick={e => {
                                    this.onClickHandler(e, tab);
                                }}
                                aria-controls={this.panelIdByTabId[tab.tabId]}
                                onKeyUp={this.onKeyUpHandler}
                                aria-selected={
                                    tab.tabId === selectedTabId ? 'true' : null
                                }
                            >
                                {toggleRender ? (
                                    toggleRender({
                                        title: tab.title,
                                        name: tab.name,
                                        isActive: tab.tabId === selectedTabId
                                    })
                                ) : (
                                    <span>{tab.title}</span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
                {React.Children.map(
                    children,
                    (child, i) =>
                        child
                            ? React.cloneElement(child, {
                                  key: tabs.tabPanelMetadata[i].tabId,
                                  tabId: tabs.tabPanelMetadata[i].tabId,
                                  panelId: tabs.tabPanelMetadata[i].panelId,
                                  ref: panel => {
                                      this.registerPanelRef(
                                          tabs.tabPanelMetadata[i].tabId,
                                          panel
                                      );
                                  },
                                  isHidden:
                                      tabs.tabPanelMetadata[i].tabId !==
                                      selectedTabId
                              })
                            : child
                )}
            </Fragment>
        );
    }
}

export default Tabs;
