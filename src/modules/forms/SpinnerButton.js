import React, { Component, Fragment } from 'react';
import Spinner from '../notifications/Spinner';
import PropTypes from 'prop-types';

/**
 * @component
 * A component to assist with the display and management of button busy states.
 *
 * The component will render an svg spinner based on an isBusy prop the user can
 * control from outside.
 *
 * Alternatively the user can provide an own spinner svg.
 *
 * Screen reader users are also notified with the busyText when the
 * spinner is activated.
 *
 * @example
 *   <SpinnerButton
 *      onClick={this.onSpinnerClickHandler}
 *      onBusyClick={this.onBusyClickHandler}
 *      spinnerImgSrc={spinnerSvg}
 *      busyText="Working"
 *      isBusy={this.state.showSpinner}
 *   >
 *      Test now
 *   </SpinnerButton>
 *
 * @prop required {boolean} isBusy - Sets the spinner on and off.
 * @prop required {string} busyText - Accessible text for spinning condition.
 * @prop required {SyntheticEvent} onClick - Function to execute on click.
 * @prop {SyntheticEvent} onBusyClick - Function to execute when the button
 *          is clicked while in a busy state. Gives an event handle so that
 *          users can be notified that the button is busy, if desired.
 * @prop {string} spinnerImgSrc - An imported SVG or SVG data string to
 *          override the spinner that is shown.
 */
class SpinnerButton extends Component {
    static propTypes = {
        isBusy: PropTypes.bool.isRequired,
        busyText: PropTypes.string.isRequired,
        completeText: PropTypes.string,
        onClick: PropTypes.func,
        onBusyClick: PropTypes.func,
        spinnerImgSrc: PropTypes.string
    };

    state = {
        showVisualSpinner: false,
        busyMessage: '',
        completeMessage: ''
    };

    /**
     * @function
     * Checks whether the isBusy state has changed.
     *
     * If the state is set to true, a 100 millisecond delay is
     * introduced before the visual spinner is shown to avoid
     * flickering on fast spinner transitions.
     *
     * If the spinner is deactivated before activation the
     * activation is cancelled.
     *
     * A done message is broadcast if provided.
     *
     * @param {Object} prevProps
     */
    componentDidUpdate(prevProps) {
        const { isBusy, busyText, completeText } = this.props;

        if (isBusy !== prevProps.isBusy) {
            if (isBusy) {
                this.starterTimeout = setTimeout(() => {
                    this.setState({
                        showVisualSpinner: true,
                        busyMessage: busyText,
                        completeMessage: ''
                    });
                }, 100);
            } else {
                clearTimeout(this.starterTimeout);
                this.starterTimeout = null;
                this.setState({
                    showVisualSpinner: false,
                    completeMessage: completeText ? completeText : '',
                    busyMessage: ''
                });
            }
        }
    }

    /**
     * @function
     * Event handler function for the button onClick event.
     * Calls the external onClick event if not in busy state
     * or the onBusyClick event if in busy state.
     *
     * This extra call enables the user of the component
     * to notify the user that the button is still busy and
     * cannot be re-activated at that time.
     */
    onClickHandler = () => {
        const { isBusy, onClick, onBusyClick } = this.props;
        if (!isBusy) {
            onClick && onClick();
        } else if (onBusyClick) {
            onBusyClick();
        }
    };

    render() {
        //Note the unused destructures so as not to
        //pollute the <button> element with invalid props.
        const {
            busyText,
            spinnerImgSrc,
            children,
            completeText,
            onClick,
            isBusy,
            onBusyClick,
            ...rest
        } = this.props;
        const { showVisualSpinner, busyMessage, completeMessage } = this.state;
        return (
            <Fragment>
                <div
                    className="visually-hidden"
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {busyMessage}
                </div>
                <div
                    className="visually-hidden"
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {completeMessage}
                </div>
                <button {...rest} onClick={this.onClickHandler}>
                    {children}
                    {showVisualSpinner ? (
                        spinnerImgSrc ? (
                            <img
                                className="button-spinner-icon"
                                src={spinnerImgSrc}
                                alt={busyText}
                            />
                        ) : (
                            <Spinner
                                className="button-spinner-icon"
                                title={busyText}
                            />
                        )
                    ) : null}
                </button>
            </Fragment>
        );
    }
}

export default SpinnerButton;
