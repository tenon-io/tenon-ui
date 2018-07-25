import React from 'react';
import PropTypes from 'prop-types';

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
 */
const ErrorBlock = ({ formControls }) => {
    const controlNameArray = Object.keys(formControls);
    return controlNameArray.length > 0 ? (
        <div className="error-block">
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
        </div>
    ) : null;
};

ErrorBlock.propTypes = {
    formControls: PropTypes.shape({
        name: PropTypes.shape({
            controlId: PropTypes.string,
            value: PropTypes.string,
            validity: PropTypes.bool,
            errorText: PropTypes.string
        })
    }).isRequired
};

export default ErrorBlock;
