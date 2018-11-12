import React from 'react';

/**
 * @component
 * The implementation of React differs from the DOM spec in that the
 * focus and blur events are bubbled in the React DOM, while they
 * don't get bubbled in a normal HTML application.
 *
 * The reason for this is to allow acting on these functions on
 * parent container elements, which comes in very handy in a component
 * based application.
 *
 * However, as side-effect, this could mean that clicking one elements
 * could inadvertently focus a parent container that exists to manage
 * keyboard focus. If the focus outline is properly implemented,
 * this can lead to a distracting flash of focus switching. Or that
 * elements unexpectedly gets marked as focused when this is visually
 * unhandy.
 *
 * This component create a barrier that stops the focus event from
 * bubbling higher, thereby isolating the container and allowing
 * both click and keyboard events to behave as expected with regards
 * to the focus outline.
 */
const FocusCatcher = ({ children }) => (
    <div
        tabIndex="-1"
        onFocus={e => {
            e.stopPropagation();
        }}
        style={{ outline: 'none' }}
    >
        {children}
    </div>
);

export default FocusCatcher;
