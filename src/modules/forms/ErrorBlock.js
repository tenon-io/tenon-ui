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
        headingText: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        this.headingId = uuidv4();
    }

    render() {
        const { formControls, headingText, forwardedRef } = this.props;
        const controlNameArray = Object.keys(formControls);
        return controlNameArray.length > 0 ? (
            <section
                className="error-block"
                tabIndex="-1"
                ref={forwardedRef}
                aria-labelledby={this.headingId}
            >
                <Heading.H id={this.headingId} className="block-heading">
                    <span className="icon" />
                    {headingText}
                </Heading.H>
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

export default forwardRef(({ formControls, headingText }, ref) => (
    <ErrorBlock
        formControls={formControls}
        headingText={headingText}
        forwardedRef={ref}
    />
));
