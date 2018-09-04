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
                viewBox="0 0 58 58"
                xmlns="http://www.w3.org/2000/svg"
                aria-describedby={title ? this.svgTitleId : null}
                className={className ? className : null}
                {...props}
            >
                {title ? <title id={this.svgTitleId}>{title}</title> : null}
                <g fill="none" fillRule="evenodd">
                    <g
                        transform="translate(2 1)"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                    >
                        <circle
                            cx="42.601"
                            cy="11.462"
                            r="5"
                            fillOpacity="1"
                            fill="#FFFFFF"
                        >
                            <animate
                                attributeName="fill-opacity"
                                begin="0s"
                                dur="1.3s"
                                values="1;0;0;0;0;0;0;0"
                                calcMode="linear"
                                repeatCount="indefinite"
                            />
                        </circle>
                        <circle
                            cx="49.063"
                            cy="27.063"
                            r="5"
                            fillOpacity="0"
                            fill="#FFFFFF"
                        >
                            <animate
                                attributeName="fill-opacity"
                                begin="0s"
                                dur="1.3s"
                                values="0;1;0;0;0;0;0;0"
                                calcMode="linear"
                                repeatCount="indefinite"
                            />
                        </circle>
                        <circle
                            cx="42.601"
                            cy="42.663"
                            r="5"
                            fillOpacity="0"
                            fill="#FFFFFF"
                        >
                            <animate
                                attributeName="fill-opacity"
                                begin="0s"
                                dur="1.3s"
                                values="0;0;1;0;0;0;0;0"
                                calcMode="linear"
                                repeatCount="indefinite"
                            />
                        </circle>
                        <circle
                            cx="27"
                            cy="49.125"
                            r="5"
                            fillOpacity="0"
                            fill="#FFFFFF"
                        >
                            <animate
                                attributeName="fill-opacity"
                                begin="0s"
                                dur="1.3s"
                                values="0;0;0;1;0;0;0;0"
                                calcMode="linear"
                                repeatCount="indefinite"
                            />
                        </circle>
                        <circle
                            cx="11.399"
                            cy="42.663"
                            r="5"
                            fillOpacity="0"
                            fill="#FFFFFF"
                        >
                            <animate
                                attributeName="fill-opacity"
                                begin="0s"
                                dur="1.3s"
                                values="0;0;0;0;1;0;0;0"
                                calcMode="linear"
                                repeatCount="indefinite"
                            />
                        </circle>
                        <circle
                            cx="4.938"
                            cy="27.063"
                            r="5"
                            fillOpacity="0"
                            fill="#FFFFFF"
                        >
                            <animate
                                attributeName="fill-opacity"
                                begin="0s"
                                dur="1.3s"
                                values="0;0;0;0;0;1;0;0"
                                calcMode="linear"
                                repeatCount="indefinite"
                            />
                        </circle>
                        <circle
                            cx="11.399"
                            cy="11.462"
                            r="5"
                            fillOpacity="0"
                            fill="#FFFFFF"
                        >
                            <animate
                                attributeName="fill-opacity"
                                begin="0s"
                                dur="1.3s"
                                values="0;0;0;0;0;0;1;0"
                                calcMode="linear"
                                repeatCount="indefinite"
                            />
                        </circle>
                        <circle
                            cx="27"
                            cy="5"
                            r="5"
                            fillOpacity="0"
                            fill="#FFFFFF"
                        >
                            <animate
                                attributeName="fill-opacity"
                                begin="0s"
                                dur="1.3s"
                                values="0;0;0;0;0;0;0;1"
                                calcMode="linear"
                                repeatCount="indefinite"
                            />
                        </circle>
                    </g>
                </g>
            </svg>
        );
    }
}

export default Spinner;
