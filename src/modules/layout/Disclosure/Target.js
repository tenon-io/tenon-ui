import React from 'react';
import DisclosureContext from './DisclosureContext';

const Target = ({ children, useHidden, deactivate }) => (
    <DisclosureContext.Consumer>
        {({ expanded }) =>
            useHidden === true || useHidden === 'true'
                ? React.Children.map(children, child =>
                      React.cloneElement(child, {
                          hidden: expanded || deactivate ? null : 'hidden'
                      })
                  )
                : expanded || deactivate
                ? children
                : null
        }
    </DisclosureContext.Consumer>
);

export default Target;
