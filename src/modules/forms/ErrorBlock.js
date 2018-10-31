import React, { Component, forwardRef } from 'react';
import PropTypes from 'prop-types';
import Heading from '../layout/Heading';
import uuidv4 from 'uuid/v4';

/**
 * @component
 * Displays the error texts for the collection of form controls
 * and renders as <a> tags with href attributes navigating to
 * the invalid controls.
 *
 * @prop required {object} formControls
 *
 * @example
 * example
 * {
 *      formControls: {
 *          [controlName]: {
 *              [controlId]: string,
 *              [value]: string,
 *              [validity]: boolean,
 *              [errorText]: string
 *          },
 *          [validity]: boolean
 *      }
 * }
 *
 * @prop required {string} headingText - Text to show as
 *                  block heading.
 * @prop {string, number} headingLevel - The level of heading to
 *                  render if not used inside the Heading component.
 */
class ErrorBlock extends Component {
    static propTypes = {
        formControls: PropTypes.shape({
            name: PropTypes.shape({
                controlId: PropTypes.string,
                value: PropTypes.string,
                validity: PropTypes.bool,
                errorText: PropTypes.string
            })
        }).isRequired,
        headingText: PropTypes.string.isRequired,
        headingLevel: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    };

    constructor(props) {
        super(props);

        this.headingId = uuidv4();
    }

    render() {
        const {
            formControls,
            headingText,
            forwardedRef,
            headingLevel
        } = this.props;

        const controlNameArray = Object.keys(formControls);
        return controlNameArray.length > 0 ? (
            <section className="error-block" aria-labelledby={this.headingId}>
                <Heading.LevelBoundary
                    levelOverride={headingLevel ? headingLevel : null}
                >
                    <Heading.H
                        id={this.headingId}
                        className="block-heading"
                        tabIndex="-1"
                        ref={forwardedRef}
                    >
                        <span className="icon" />
                        {headingText}
                    </Heading.H>
                </Heading.LevelBoundary>
                <ul>
                    {controlNameArray
                        .filter(control => !formControls[control].validity)
                        .map(control => (
                            <li key={formControls[control].controlId}>
                                <a href={`#${formControls[control].controlId}`}>
                                    {formControls[control].errorText}
                                </a>
                            </li>
                        ))}
                </ul>
            </section>
        ) : null;
    }
}

export default forwardRef((props, ref) => (
    <ErrorBlock {...props} forwardedRef={ref} />
));
