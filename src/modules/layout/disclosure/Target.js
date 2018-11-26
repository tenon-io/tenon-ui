import React, { Children, cloneElement } from 'react';
import DisclosureContext from './DisclosureContext';
import PropTypes from 'prop-types';

/**
 * @component
 * This component is to be used as a child of the Disclosure component.
 * It contains the content that should be hidden / shown on toggle.
 *
 * The component can contain any number of children. All will be toggled
 * safely.
 *
 * @prop {boolean, string} useHidden - Indicates if the hiding should be
 * done with CSS instead of removal / reinsertion into the DOM.
 * @prop {boolean} deactivate - Deactivate the hide / show of the content.
 * Useful in a small number of cases, for example when the Targets are
 * rendered with an Array.map and the first target should always show.
 */
const Target = ({ children, useHidden, deactivate }) => (
    <DisclosureContext.Consumer>
        {({ expanded, globalHidden }) => {
            const isExpanded = globalHidden ? false : expanded;
            return useHidden === true || useHidden === 'true'
                ? Children.map(children, child =>
                      cloneElement(child, {
                          hidden: isExpanded || deactivate ? null : 'hidden'
                      })
                  )
                : isExpanded || deactivate
                ? children
                : null;
        }}
    </DisclosureContext.Consumer>
);

Target.propTypes = {
    useHidden: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.oneOf(['true', 'false'])
    ]),
    deactivate: PropTypes.bool
};

export default Target;
