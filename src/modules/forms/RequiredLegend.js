import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

/**
 * @component
 * A legend component that autodetects if the container being
 * labelled by this legend has the required attribute. If so,
 * the given required text is also shown in the legend.
 *
 * @prop required {React nodes} children - The normal content
 * of a legend.
 * @prop {string} requiredText - The text to show when the field
 * is required.
 * @prop {string} className - The class to put on the legend.
 * @prop {boolean} isRequired - An override value for the automatic
 * check for the required flag. This is done as checkbox groups
 * cannot take the aria-required.
 */
class RequiredLegend extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        requiredText: PropTypes.string,
        className: PropTypes.string,
        isRequired: PropTypes.bool
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
                props.isRequired === false || props.isRequired === true
                    ? props.isRequired
                    : linkedContainer &&
                      linkedContainer.getAttribute('aria-required') === 'true'
        };
    }

    render() {
        const {
            children,
            requiredText,
            className,
            isRequired: requiredProp,
            ...props
        } = this.props;
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
                        {requiredText || ''}
                    </span>
                ) : null}
            </legend>
        );
    }
}

export default RequiredLegend;
