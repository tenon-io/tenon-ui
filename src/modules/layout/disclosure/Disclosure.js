import React, { Component } from 'react';
import Target from './Target';
import Trigger from './Trigger';
import DisclosureContext from './DisclosureContext';
import PropTypes from 'prop-types';

/**
 * @component
 * Parent component for all disclosure widgets. Used to wrap the section of JSX
 * where the Disclosure is active in.
 *
 * @prop {bool, string} isExpanded: Boolean or string "true/false" to indicate
 * if the disclosure should be open or closed. Changes to this prop
 * overrides the internal toggle state.
 */
class Disclosure extends Component {
    static propTypes = {
        isExpanded: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.oneOf(['true', 'false'])
        ])
    };

    static Trigger = Trigger;
    static Target = Target;

    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            globalHidden: false,
            onExpandToggleHandler: this.onExpandToggleHandler
        };
    }

    /**
     * @function
     * Mount hook checks sets the expanded state if it is given from
     * the isExpanded prop.
     */
    componentDidMount() {
        const { isExpanded, hidden } = this.props;
        this.setState({
            globalHidden: !!hidden,
            expanded: isExpanded === true || isExpanded === 'true'
        });
    }

    /**
     * @function
     * Update hook to override the internal toggle state if the
     * isExpanded prop is changed.
     *
     * @param {object} prevProps
     */
    componentDidUpdate(prevProps) {
        if (prevProps.isExpanded !== this.props.isExpanded) {
            this.setState({
                expanded: this.props.isExpanded
            });
        }
        if (prevProps.hidden !== this.props.hidden) {
            this.setState({
                globalHidden: !!this.props.hidden
            });
        }
    }

    /**
     * @function
     * Eventhandler function to be passed into the Trigger sub components
     * to be able to toggle the internal state.
     */
    onExpandToggleHandler = () => {
        this.setState(prevState => ({
            expanded: !prevState.expanded
        }));
    };

    render() {
        return (
            <DisclosureContext.Provider value={this.state}>
                {this.props.children}
            </DisclosureContext.Provider>
        );
    }
}

export default Disclosure;
