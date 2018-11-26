import React from 'react';
import DisclosureContext from './DisclosureContext';
import classNames from 'classnames';
import { callAll } from '../../utils/helpers/functionHelpers';
import PropTypes from 'prop-types';

/**
 * @component
 * This component should be used as a child of the Disclosure component.
 * It houses the trigger for toggling the expand / collapse of the
 * Target(s).
 *
 * It always renders a button as this is the recommended element to use
 * as disclosure trigger.
 *
 * The button accepts any content. Also a render function that injects
 * the expanded flag to enable switching content based on the toggle
 * state.
 *
 * The button accepts all standard button props.
 *
 * @prop {string} expandedClass - A class to add to the button when the related
 * target is expanded.
 */
const Trigger = ({ children, onClick, className, expandedClass, ...props }) => (
    <DisclosureContext.Consumer>
        {({ expanded, onExpandToggleHandler }) => (
            <button
                type="button"
                aria-expanded={expanded}
                className={
                    expandedClass
                        ? classNames(className, { [expandedClass]: expanded })
                        : className
                }
                onClick={callAll(onClick, onExpandToggleHandler)}
                {...props}
            >
                {typeof children === 'function' ? children(expanded) : children}
            </button>
        )}
    </DisclosureContext.Consumer>
);

Trigger.propTypes = {
    expandedClass: PropTypes.string
};

export default Trigger;
