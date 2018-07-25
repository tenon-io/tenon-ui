import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';
import FormContext from './FormContext';
import { callAll } from '../../utils/helpers/functionHelpers';

/**
 * @component
 * Controller component for a tenon-ui smart input control.
 *
 * @prop required {function} children - The standard React children have been overridden to
 * accept render functions. This render function gets called with an object containing
 * getter functions from the smart input controller as well as as the current error text
 * and a display flag for the error container.
 *
 * @example
 * {
 *      getLabelProps: function,
 *      getInputProps: function,
 *      getErrorProps: function,
 *      getContentHintProps: function,
 *      showError: boolean,
 *      errorText: string
 * }
 *
 * @prop required {function} registerControl: Registers a control with the
 *                  smart form.
 * @prop required {function} deregisterControl: Deregisters a control with
 *                  the smart form.
 * @prop required {function} setControlValue: Sets the given control's value
 *                  to the smart form state.
 * @prop required {function} getControlValue: Gets the given control's value
 *                  from the smart form state;
 * @prop required {function} setControlValidity: Sets the given control's
 *                  validation validity to the smart form state.
 * @prop required {function} getControlValidity: Gets the given control's
 *                  validation validity from the smart form state.
 * @prop required {function} getControlErrorText: Gets the given control's
 *                  current errorMessage, if any, from the smart form state.
 * @prop {array} validators: An array of composed validators using the
 *                  validator helper function.
 * @prop required {string} name: The unique name of the control.
 */
class InnerInputController extends Component {
    static propTypes = {
        children: PropTypes.func.isRequired,
        deregisterControl: PropTypes.func.isRequired,
        registerControl: PropTypes.func.isRequired,
        setControlValue: PropTypes.func.isRequired,
        getControlValue: PropTypes.func.isRequired,
        setControlValidity: PropTypes.func.isRequired,
        getControlValidity: PropTypes.func.isRequired,
        getControlErrorText: PropTypes.func.isRequired,
        validators: PropTypes.arrayOf(PropTypes.object),
        name: PropTypes.string.isRequired
    };

    static displayName = 'InnerInputController';

    /**
     * @constructor
     * Initializes the internal component ID's
     *
     * @param props
     */
    constructor(props) {
        super(props);

        this.controlId = uuidv4();
        this.errorId = uuidv4();
        this.contentHintId = uuidv4();

        this.state = {
            contentHintId: null
        };

        this.contentHintRegistered = false;
    }

    /**
     * @function
     * Registers the control with smart form when the component
     * is successfully mounted.
     *
     * Runs an initial validation to check required validation
     * states.
     *
     * The control is registered with a unique generated ID,
     * the give name and the current validation state.
     */
    componentDidMount() {
        const {
            registerControl,
            getControlValue,
            setControlValidity,
            name
        } = this.props;
        const validationObject = this.runValidation('');
        registerControl(
            name,
            this.controlId,
            '',
            validationObject.validity,
            validationObject.errorText
        );
        setControlValidity(name, this.runValidation(getControlValue(name)));
    }

    /**
     * @function
     * Reruns the control validation on every change.
     *
     * Sets the content hint ID. This is required here because
     * the presence of a content hint is detected when a call
     * to the content hint prop getter is issued. This then needs
     * to permeate to the input prop getter as well to set an
     * aria-describedby link.
     */
    componentDidUpdate() {
        const {
            getControlValue,
            setControlValidity,
            getControlValidity,
            getControlErrorText,
            name
        } = this.props;

        const validationResult = this.runValidation(getControlValue(name));
        if (
            validationResult.validity !== getControlValidity(name) ||
            validationResult.errorText !== getControlErrorText(name)
        ) {
            setControlValidity(name, this.runValidation(getControlValue(name)));
        }

        if (this.contentHintRegistered && !this.state.contentHintId) {
            this.setState({
                contentHintId: this.contentHintId
            });
        }
    }

    /**
     * @function
     * Deregisters the control from the smart form when the
     * component is unmounted.
     */
    componentWillUnmount() {
        const { deregisterControl, name } = this.props;
        deregisterControl(name);
    }

    /**
     * @function
     * Event handler for the onchange event of the connected
     * <input>
     *
     * Sets the current value in the smart form state.
     *
     * @param {SyntheticKeyboardEvent} e
     */
    onChangeHandler = e => {
        const { setControlValue, name } = this.props;
        setControlValue(name, e.currentTarget.value);
    };

    /**
     * @function
     * Prop getter for the <label>.
     *
     * Composes the given prop configuration object with the
     * standard control props object.
     *
     * @param {object} props
     * @returns {object}
     */
    getLabelProps = (props = {}) => ({
        htmlFor: this.controlId,
        ...props
    });

    /**
     * @function
     * Prop getter for the <input>.
     *
     * Composes the given prop configuration object with the
     * standard control props object.
     *
     * @param {object} props
     * @returns {object}
     */
    getInputProps = ({ onChange, ...props } = {}) => {
        const { name, getControlValue, getControlValidity } = this.props;
        const { contentHintId } = this.state;
        const isValid = getControlValidity(name);

        return {
            'aria-describedby':
                !isValid || contentHintId
                    ? `${contentHintId ? contentHintId : ''}${
                          !isValid && contentHintId ? ' ' : ''
                      }${isValid ? '' : this.errorId}`
                    : null,
            'aria-disabled': props['disabled'] ? 'true' : null,
            'aria-invalid': isValid ? null : 'true',
            'aria-readonly': props['readOnly'] ? 'true' : null,
            'aria-required': props['required'] ? 'true' : null,
            id: this.controlId,
            name,
            onChange: callAll(onChange, this.onChangeHandler),
            type: 'text',
            value: getControlValue(name),
            ...props
        };
    };

    /**
     * @function
     * Prop getter for the error container.
     *
     * Composes the given prop configuration object with the
     * standard control props object.
     *
     * @param {object} props
     * @returns {object}
     */
    getErrorProps = (props = {}) => ({
        id: this.errorId,
        ...props
    });

    /**
     * @function
     * Prop getter for the content hint container.
     *
     * Composes the given prop configuration object with the
     * standard control props object.
     *
     * @param {object} props
     * @returns {object}
     */
    getContentHintProps = (props = {}) => {
        this.contentHintRegistered = true;

        return {
            id: this.state.contentHintId,
            ...props
        };
    };

    /**
     * @function
     * Runs the validator functions as composed with the validator
     * validation helper function.
     *
     * Calculates the first failing validation in the array
     * in order and applies that error message.
     *
     * If all validations pass the error text is empty and the
     * control is marked as valid.
     *
     * @param {string} textValue
     * @returns {*|{validity: boolean, errorText: string}}
     */
    runValidation = textValue => {
        const { validators = [] } = this.props;
        return validators.reduce(
            (prev, cur) => {
                if (prev.errorText || cur.ignore) {
                    return prev;
                }
                const validateResult = cur.func(textValue, cur.compare);
                return !validateResult
                    ? { validity: validateResult, errorText: cur.message }
                    : prev;
            },
            { validity: true, errorText: '' }
        );
    };

    render() {
        const {
            children,
            getControlValidity,
            getControlErrorText,
            name
        } = this.props;
        return children({
            getLabelProps: this.getLabelProps,
            getInputProps: this.getInputProps,
            getErrorProps: this.getErrorProps,
            getContentHintProps: this.getContentHintProps,
            showError: !getControlValidity(name),
            errorText: getControlErrorText(name)
        });
    }
}

/**
 * @component
 * Wrapper component for InnerInputController to fetch the
 * React Context exposed functionality from the smart form
 * containing the Context provider and expose it as props
 * to InnerInputController.
 *
 * @props props
 */
const InputController = props => (
    <FormContext.Consumer>
        {contextProps => (
            <InnerInputController {...props} {...contextProps}>
                {props.children}
            </InnerInputController>
        )}
    </FormContext.Consumer>
);

InputController.propTypes = {
    children: PropTypes.func.isRequired,
    validators: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string.isRequired
};

InputController.displayName = 'InputController';

export default InputController;
