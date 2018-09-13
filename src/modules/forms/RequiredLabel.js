import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

/**
 * @component
 * A label component that autodetects if the linked form control
 * has the required attribute. If so, the given required text
 * is also shown in the label.
 *
 * @prop required {React nodes} children - The normal content
 * of a label.
 * @prop {string} requiredText - The text to show when the field
 * is required.
 * @prop {string} className - The class to put on the label.
 */
class RequiredLabel extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        requiredText: PropTypes.string,
        className: PropTypes.string
    };

    state = {
        isRequired: false
    };

    static getDerivedStateFromProps(props) {
        const linkedControl = document.querySelector(`[id="${props.htmlFor}"]`);
        return {
            isRequired: linkedControl && linkedControl.hasAttribute('required')
        };
    }

    render() {
        const { children, requiredText, className, ...props } = this.props;
        const { isRequired } = this.state;
        return (
            <label
                className={
                    classNames(className, { required: isRequired }) || null
                }
                {...props}
            >
                {children}
                {isRequired ? (
                    <span aria-hidden="true" className="required">
                        {requiredText || ''}
                    </span>
                ) : null}
            </label>
        );
    }
}

export default RequiredLabel;
