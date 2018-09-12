import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class RequiredLegend extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        requiredText: PropTypes.string,
        className: PropTypes.string
    };

    state = {
        isRequired: false
    };

    static getDerivedStateFromProps(props) {
        const linkedContainer = document.querySelector(
            `[aria-labelledby="${props.id}"]`
        );
        return {
            isRequired:
                linkedContainer && linkedContainer.hasAttribute('required')
        };
    }

    render() {
        const { children, requiredText, className, ...props } = this.props;
        const { isRequired } = this.state;
        return (
            <legend
                className={
                    classNames(className, { required: isRequired }) || null
                }
                {...props}
            >
                {children}
                {isRequired ? (
                    <span aria-hidden="true" className="required">
                        {requiredText || '( required )'}
                    </span>
                ) : null}
            </legend>
        );
    }
}

export default RequiredLegend;
