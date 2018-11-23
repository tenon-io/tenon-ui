import React, { Component } from 'react';
import Target from './Target';
import Trigger from './Trigger';
import DisclosureContext from './DisclosureContext';

class Disclosure extends Component {
    static Trigger = Trigger;
    static Target = Target;

    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            onExpandToggleHandler: this.onExpandToggleHandler
        };
    }

    componentDidMount() {
        this.setState({
            expanded: !!this.props.isExpanded
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.isExpanded !== this.props.isExpanded) {
            this.setState({
                expanded: this.props.isExpanded
            });
        }
    }

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
