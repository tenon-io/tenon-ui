import React, { Component, createContext } from 'react';
import classNames from 'classnames';

const DisclosureContext = createContext();

const callAll = (...fns) => (...args) => {
    fns.forEach(fn => fn && fn(...args));
};

const Trigger = ({ onClick, children, className, expandedClass, ...props }) => (
    <DisclosureContext.Consumer>
        {({ expanded, onExpandToggleHandler }) => (
            <button
                aria-expanded={expanded}
                className={
                    expandedClass
                        ? classNames(className, { [expandedClass]: expanded })
                        : className
                }
                onClick={callAll(onClick, onExpandToggleHandler)}
                {...props}
            >
                {typeof children === 'function' ? children(expanded) : children}
            </button>
        )}
    </DisclosureContext.Consumer>
);

const Target = ({ children, useHidden, deactivate }) => (
    <DisclosureContext.Consumer>
        {({ expanded }) =>
            useHidden
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
