import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

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
