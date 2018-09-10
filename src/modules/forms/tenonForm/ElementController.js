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
class InnerElementController extends Component {
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
        name: PropTypes.string.isRequired,
        registerErrors: PropTypes.bool
    };

    static displayName = 'InnerElementController';

    /**
     * @constructor
     * Initializes the internal component ID's
     *
     * @param props
     */
    constructor(props) {
        super(props);

        this.controlId = uuidv4();
        this.contentHintId = uuidv4();
        this.errorId = uuidv4();
        this.legendId = uuidv4();

        this.state = {
            contentHintId: ''
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

        //This is required to update the component when a content hint is
        //detected so that the id linkage is established in the prop
        //getter functions.
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
     * If an autoIdPostfix config property is provided, this
     * will be appended to the automatically generated Id. This
     * is required for radio button collections.
     *
     * @param {object} props
     * @returns {object}
     */
    getLabelProps = ({ autoIdPostfix, ...props } = {}) => ({
        htmlFor: `${this.controlId}${autoIdPostfix ? `-${autoIdPostfix}` : ''}`,
        ...props
    });

    /**
     * Calculates the aria-describedby property of the <input> tag.
     *
     * @param {boolean} isValid
     * @returns {string | null}
     */
    getAriaDescribedBy = isValid => {
        const { contentHintId } = this.state;

        let describedByIds = [];

        if (contentHintId) {
            describedByIds.push(contentHintId);
        }

        if (!isValid) {
            describedByIds.push(this.errorId);
        }

        return describedByIds.join(' ') || null;
    };

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
        const {
            name,
            getControlValue,
            getControlValidity,
            registerErrors
        } = this.props;
        const isValid = registerErrors ? getControlValidity(name) : true;

        return {
            'aria-describedby': this.getAriaDescribedBy(isValid),
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
     * Prop getter for the <textarea>.
     *
     * Composes the given prop configuration object with the
     * standard control props object.
     *
     * Direct re-export of the getInputProps function as a
     * <textarea> takes the same props as an <input>. This
     * is done to make the usage more declarative.
     *
     * @param {object} props
     * @returns {object}
     */
    getTextareaProps = (props = {}) => this.getInputProps(props);

    /**
     * @function
     * Prop getter for the <select>.
     *
     * Composes the given prop configuration object with the
     * standard control props object.
     *
     * Direct re-export of the getInputProps function as a
     * <select> takes the same props as an <input>. This
     * is done to make the usage more declarative.
     *
     * @param {object} props
     * @returns {object}
     */
    getSelectProps = (props = {}) => this.getInputProps(props);

    /**
     * @function
     * Prop getter every <input> of a groupd of radio buttons.
     *
     * Composes the given prop configuration object with the
     * standard control props object.
     *
     * Required a value config property as this is used to
     * set the value of the radio button as well as determine
     * if the radio button is checked.
     *
     * @param {object} props
     * @returns {object}
     */
    getRadioButtonProps = ({ onChange, value, ...props } = {}) => {
        const { name, getControlValue } = this.props;

        return {
            'aria-disabled': props['disabled'] ? 'true' : null,
            'aria-readonly': props['readOnly'] ? 'true' : null,
            name,
            id: `${this.controlId}${value ? `-${value}` : ''}`,
            type: 'radio',
            onChange: callAll(onChange, this.onChangeHandler),
            value,
            checked: getControlValue(name) === value,
            ...props
        };
    };

    getLegendProps = () => ({
        id: this.legendId
    });

    getRadioGroupProps = (props = {}) => {
        const { name, getControlValidity, registerErrors } = this.props;
        const isValid = registerErrors ? getControlValidity(name) : true;
        return {
            'aria-describedby': this.getAriaDescribedBy(isValid),
            'aria-invalid': isValid ? null : 'true',
            'aria-required': props['required'] ? 'true' : null,
            'aria-labelledby': this.legendId,
            role: 'radiogroup',
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
                const validateResult = cur.func(textValue);
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
            name,
            registerErrors
        } = this.props;
        return children({
            getLabelProps: this.getLabelProps,
            getLegendProps: this.getLegendProps,
            getInputProps: this.getInputProps,
            getTextareaProps: this.getTextareaProps,
            getSelectProps: this.getSelectProps,
            getRadioButtonProps: this.getRadioButtonProps,
            getRadioGroupProps: this.getRadioGroupProps,
            getErrorProps: this.getErrorProps,
            getContentHintProps: this.getContentHintProps,
            showError: registerErrors ? !getControlValidity(name) : false,
            errorText: getControlErrorText(name)
        });
    }
}

/**
 * @component
 * Wrapper component for InnerElementController to fetch the
 * React Context exposed functionality from the smart form
 * containing the Context provider and expose it as props
 * to InnerElementController.
 *
 * @props props
 */
const ElementController = props => (
    <FormContext.Consumer>
        {contextProps => (
            <InnerElementController {...props} {...contextProps}>
                {props.children}
            </InnerElementController>
        )}
    </FormContext.Consumer>
);

ElementController.propTypes = {
    children: PropTypes.func.isRequired,
    validators: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string.isRequired
};

ElementController.displayName = 'ElementController';

export default ElementController;
