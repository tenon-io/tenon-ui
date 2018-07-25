import React, { Component, Fragment } from 'react';
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
        onClick: PropTypes.func.isRequired,
        onBusyClick: PropTypes.func,
        spinnerImgSrc: PropTypes.string
    };

    state = {
        showVisualSpinner: false,
        statusMessage: ''
    };

    standardSpinnerSvg =
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTgiIGhlaWdodD0iNTgiIHZpZXdCb3g9IjAgMCA1OCA1OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4gICAgICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIgMSkiIHN0cm9rZT0iI0ZGRiIgc3Ryb2tlLXdpZHRoPSIxLjUiPiAgICAgICAgICAgIDxjaXJjbGUgY3g9IjQyLjYwMSIgY3k9IjExLjQ2MiIgcj0iNSIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsPSIjZmZmIj4gICAgICAgICAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iZmlsbC1vcGFjaXR5IiAgICAgICAgICAgICAgICAgICAgIGJlZ2luPSIwcyIgZHVyPSIxLjNzIiAgICAgICAgICAgICAgICAgICAgIHZhbHVlcz0iMTswOzA7MDswOzA7MDswIiBjYWxjTW9kZT0ibGluZWFyIiAgICAgICAgICAgICAgICAgICAgIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPiAgICAgICAgICAgIDwvY2lyY2xlPiAgICAgICAgICAgIDxjaXJjbGUgY3g9IjQ5LjA2MyIgY3k9IjI3LjA2MyIgcj0iNSIgZmlsbC1vcGFjaXR5PSIwIiBmaWxsPSIjZmZmIj4gICAgICAgICAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iZmlsbC1vcGFjaXR5IiAgICAgICAgICAgICAgICAgICAgIGJlZ2luPSIwcyIgZHVyPSIxLjNzIiAgICAgICAgICAgICAgICAgICAgIHZhbHVlcz0iMDsxOzA7MDswOzA7MDswIiBjYWxjTW9kZT0ibGluZWFyIiAgICAgICAgICAgICAgICAgICAgIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPiAgICAgICAgICAgIDwvY2lyY2xlPiAgICAgICAgICAgIDxjaXJjbGUgY3g9IjQyLjYwMSIgY3k9IjQyLjY2MyIgcj0iNSIgZmlsbC1vcGFjaXR5PSIwIiBmaWxsPSIjZmZmIj4gICAgICAgICAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iZmlsbC1vcGFjaXR5IiAgICAgICAgICAgICAgICAgICAgIGJlZ2luPSIwcyIgZHVyPSIxLjNzIiAgICAgICAgICAgICAgICAgICAgIHZhbHVlcz0iMDswOzE7MDswOzA7MDswIiBjYWxjTW9kZT0ibGluZWFyIiAgICAgICAgICAgICAgICAgICAgIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPiAgICAgICAgICAgIDwvY2lyY2xlPiAgICAgICAgICAgIDxjaXJjbGUgY3g9IjI3IiBjeT0iNDkuMTI1IiByPSI1IiBmaWxsLW9wYWNpdHk9IjAiIGZpbGw9IiNmZmYiPiAgICAgICAgICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJmaWxsLW9wYWNpdHkiICAgICAgICAgICAgICAgICAgICAgYmVnaW49IjBzIiBkdXI9IjEuM3MiICAgICAgICAgICAgICAgICAgICAgdmFsdWVzPSIwOzA7MDsxOzA7MDswOzAiIGNhbGNNb2RlPSJsaW5lYXIiICAgICAgICAgICAgICAgICAgICAgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIC8+ICAgICAgICAgICAgPC9jaXJjbGU+ICAgICAgICAgICAgPGNpcmNsZSBjeD0iMTEuMzk5IiBjeT0iNDIuNjYzIiByPSI1IiBmaWxsLW9wYWNpdHk9IjAiIGZpbGw9IiNmZmYiPiAgICAgICAgICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJmaWxsLW9wYWNpdHkiICAgICAgICAgICAgICAgICAgICAgYmVnaW49IjBzIiBkdXI9IjEuM3MiICAgICAgICAgICAgICAgICAgICAgdmFsdWVzPSIwOzA7MDswOzE7MDswOzAiIGNhbGNNb2RlPSJsaW5lYXIiICAgICAgICAgICAgICAgICAgICAgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIC8+ICAgICAgICAgICAgPC9jaXJjbGU+ICAgICAgICAgICAgPGNpcmNsZSBjeD0iNC45MzgiIGN5PSIyNy4wNjMiIHI9IjUiIGZpbGwtb3BhY2l0eT0iMCIgZmlsbD0iI2ZmZiI+ICAgICAgICAgICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImZpbGwtb3BhY2l0eSIgICAgICAgICAgICAgICAgICAgICBiZWdpbj0iMHMiIGR1cj0iMS4zcyIgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM9IjA7MDswOzA7MDsxOzA7MCIgY2FsY01vZGU9ImxpbmVhciIgICAgICAgICAgICAgICAgICAgICByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4gICAgICAgICAgICA8L2NpcmNsZT4gICAgICAgICAgICA8Y2lyY2xlIGN4PSIxMS4zOTkiIGN5PSIxMS40NjIiIHI9IjUiIGZpbGwtb3BhY2l0eT0iMCIgZmlsbD0iI2ZmZiI+ICAgICAgICAgICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImZpbGwtb3BhY2l0eSIgICAgICAgICAgICAgICAgICAgICBiZWdpbj0iMHMiIGR1cj0iMS4zcyIgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM9IjA7MDswOzA7MDswOzE7MCIgY2FsY01vZGU9ImxpbmVhciIgICAgICAgICAgICAgICAgICAgICByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4gICAgICAgICAgICA8L2NpcmNsZT4gICAgICAgICAgICA8Y2lyY2xlIGN4PSIyNyIgY3k9IjUiIHI9IjUiIGZpbGwtb3BhY2l0eT0iMCIgZmlsbD0iI2ZmZiI+ICAgICAgICAgICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImZpbGwtb3BhY2l0eSIgICAgICAgICAgICAgICAgICAgICBiZWdpbj0iMHMiIGR1cj0iMS4zcyIgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM9IjA7MDswOzA7MDswOzA7MSIgY2FsY01vZGU9ImxpbmVhciIgICAgICAgICAgICAgICAgICAgICByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4gICAgICAgICAgICA8L2NpcmNsZT4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg==';

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
     * @param {Object} prevProps
     */
    componentDidUpdate(prevProps) {
        const { isBusy, busyText } = this.props;

        if (isBusy !== prevProps.isBusy) {
            if (isBusy) {
                this.starterTimeout = setTimeout(() => {
                    this.setState({
                        showVisualSpinner: true,
                        statusMessage: busyText
                    });
                }, 100);
            } else {
                clearTimeout(this.starterTimeout);
                this.starterTimeout = null;
                this.setState({
                    showVisualSpinner: false,
                    statusMessage: ''
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
            onClick();
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
            onClick,
            isBusy,
            onBusyClick,
            ...rest
        } = this.props;
        const { showVisualSpinner, statusMessage } = this.state;
        return (
            <Fragment>
                <div className="visually-hidden" role="status">
                    {statusMessage}
                </div>
                <button {...rest} onClick={this.onClickHandler}>
                    {children}
                    {showVisualSpinner ? (
                        <img
                            className="button-spinner-icon"
                            src={
                                spinnerImgSrc
                                    ? spinnerImgSrc
                                    : this.standardSpinnerSvg
                            }
                            alt={busyText}
                        />
                    ) : null}
                </button>
            </Fragment>
        );
    }
}

export default SpinnerButton;
