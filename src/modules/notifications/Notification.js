import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ children, isActive, type }) => (
    <div
        role={type === 'error' ? 'alert' : 'status'}
        aria-atomic="true"
        className="notification"
    >
        {isActive ? <div className={type}>{children}</div> : null}
    </div>
);

Notification.propTypes = {
    isActive: PropTypes.bool.isRequired,
    type: PropTypes.oneOf(['error', 'warning', 'success', 'info']).isRequired
};

export default Notification;
