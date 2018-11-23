import React from 'react';
import DisclosureContext from './DisclosureContext';
import classNames from 'classnames';
import { callAll } from '../../utils/helpers/functionHelpers';

const Trigger = ({ onClick, children, className, expandedClass, ...props }) => (
    <DisclosureContext.Consumer>
        {({ expanded, onExpandToggleHandler }) => (
            <button
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

export default Trigger;
