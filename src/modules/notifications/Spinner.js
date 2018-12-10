import React, { Component } from 'react';
import uuidv4 from 'uuid/v4';
import PropTypes from 'prop-types';

/**
 * @component
 * An SVG spinner component. Props get spread onto the svg tag to allow
 * for adding css classes and aria
 *
 * @prop required {string} title - The alternative title for the spinner image.
 * @prop {string} className - The CSS class to apply to the svg element.
 *
 * @returns {React Element}
 */
class Spinner extends Component {
    static propTypes = {
        title: PropTypes.string,
        className: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.svgTitleId = uuidv4();
    }

    render() {
        const { title, className, ...props } = this.props;
        return (
            <svg
                role="img"
                viewBox="-1 -1 40 40"
                xmlns="http://www.w3.org/2000/svg"
                aria-labelledby={title ? this.svgTitleId : null}
                className={className ? className : null}
                {...props}
            >
                {title ? <title id={this.svgTitleId}>{title}</title> : null}
                <g fill="none" fillRule="evenodd">
                    <g transform="translate(1 1)" strokeWidth="3">
                        <circle strokeOpacity=".4" cx="18" cy="18" r="18" />
                        <path d="M36 18c0-9.94-8.06-18-18-18">
                            <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0 18 18"
                                to="360 18 18"
                                dur="1s"
                                repeatCount="indefinite"
                            />
                        </path>
                    </g>
                </g>
            </svg>
        );
    }
}

export default Spinner;
