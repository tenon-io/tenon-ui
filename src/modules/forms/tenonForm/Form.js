import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormContext from './FormContext';
import memoize from 'memoize-one';
import {
    RadioGroupController,
    SelectController,
    TextareaController,
    TextInputController
} from './FormControllers';

/**
 * @component
 * Tenon-ui smart form component. Manages data from container smart form controls.
 *
 * @prop required {function} children - The standard React children have been overridden to
 * accept render functions. This render function gets called with an object
 * representing the current state of the form controls contained in the form as
 * well as a combined validity flag for all form controls.
 * @example
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
 * @prop required {function} onSubmit - An eventhandler function to handle
 * the submit even of the smart form. This function will only get called
 * on a submit event if the total state of the form is valid. The
 * function gets called with an object representing all form controls
 * and their values at the moment of submission.
 * @prop {function} onRawSubmit - An optional eventhandler function that gets
 * called with every submit attempt of the form with the raw form data
 * and validity flag. This can be handy if something had to happen during
 * invalid form submit phases.
 * @prop {boolean} alwaysShowErrors - An optional boolean indicating
 * whether the form should always display errors, and not only once submit has
 * been clicked.
 * @prop {string} className - An optional class string to transfer to the
 * className prop of the form element.
 *
 * This component exposes functionality through React Context that is
 * meant to be used by Tenon-ui smart form controls. The functions
 * are documented below and are:
 *
 * registerControl: Registers a control with the smart form.
 * deregisterControl: Deregisters a control with the smart form.
 * setControlValue: Sets the given control's value to the smart
 *                  form state.
 * getControlValue: Gets the given control's value from the smart
 *                  form state;
 * setControlValidity: Sets the given control's validation validity
 *                  to the smart form state.
 * getControlValidity: Gets the given control's validation validity
 *                  from the smart form state.
 * getControlErrorText: Gets the given control's current errorMessage,
 *                  if any, from the smart form state.
 *
 * Context also contains a registerErrors boolean what can be used
 * by the consumers to decide when to show errors.
 *
 * This component is compound and also exposes the form controllers.
 * */
class Form extends Component {
    static TextInputController = TextInputController;
    static TextareaController = TextareaController;
    static SelectController = SelectController;
    static RadioGroupController = RadioGroupController;

    static propTypes = {
        children: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        onRawSubmit: PropTypes.func,
        alwaysShowErrors: PropTypes.bool,
        className: PropTypes.string
    };

    static displayName = 'Form';

    state = {
        formControls: {},
        validity: true,
        hasSubmitted: false
    };

    /**
     * @function
     * Event handler for the submit event of the smart form.
     *
     * @param {SyntheticEvent} e
     *
     * Constructs the submit object and calls the given
     * onSubmit event handler with this object if all
     * form controls in the scope of the smart form passes validation.
     */
    onSubmitHandler = e => {
        const { onSubmit, onRawSubmit } = this.props;
        const { validity, formControls } = this.state;
        e.preventDefault();

        this.setState({
            hasSubmitted: true
        });

        if (onRawSubmit) {
            onRawSubmit(formControls, validity);
        }

        if (validity) {
            onSubmit(
                Object.assign(
                    {},
                    ...Object.keys(formControls).map(control => ({
                        [control]: formControls[control].value
                    }))
                )
            );
        }
    };

    /**
     * @function
     * Registers a control with the smart form with the given state
     * parameters.
     *
     * @param {string} name - The unique name.
     * @param {string} controlId - The unique DOM id for the focusable element.
     * @param {string} value - The string value.
     * @param {boolean} validity - The validation validity.
     * @param {string} errorText - The validation error message.
     */
    registerControl = (name, controlId, value, validity, errorText) => {
        this.setState(prevState => ({
            formControls: Object.assign({}, prevState.formControls, {
                [name]: {
                    controlId,
                    value,
                    validity,
                    errorText
                }
            })
        }));
    };

    /**
     * @function
     * Removes a previously registered control from the smart form
     * state. Also repairs the state to exclude the data from the
     * control to be removed.
     *
     * @param {string} name - The unique name.
     */
    deregisterControl = name => {
        this.setState(prevState => {
            let newFormControls = { ...prevState.formControls };
            delete newFormControls[name];
            return {
                formControls: newFormControls,
                validity: this.calculateValidityAll(newFormControls)
            };
        });
    };

    /**
     * @function
     * Sets the control value of the given control in the smart form
     * state.
     *
     * @param name - The unique name.
     * @param value - The string value.
     */
    setControlValue = (name, value) => {
        this.setState(prevState => ({
            formControls: Object.assign({}, prevState.formControls, {
                [name]: Object.assign({}, prevState.formControls[name], {
                    value
                })
            })
        }));
    };

    /**
     * @function
     * Gets the string value from the smart form state based
     * for the given control
     *
     * @param name - The unique name.
     *
     * @returns {string} - The current string value of the
     * control
     */
    getControlValue = name =>
        this.state.formControls[name]
            ? this.state.formControls[name].value
            : '';

    /**
     * @function
     * Sets the validation validity for the give control in
     * the smart form state.
     *
     * @param name - The unique name.
     * @param validity - The validation validity.
     */
    setControlValidity = (name, validity) => {
        this.setState(prevState => {
            const newFormControls = Object.assign({}, prevState.formControls, {
                [name]: Object.assign({}, prevState.formControls[name], {
                    validity: validity.validity,
                    errorText: validity.errorText
                })
            });
            return {
                formControls: newFormControls,
                validity: this.calculateValidityAll(newFormControls)
            };
        });
    };

    /**
     * @function
     * Gets the validation validity for the given control from
     * the smart form state.
     *
     * @param name - The unique name.
     *
     * @returns {boolean} - The validation validity flag.
     */
    getControlValidity = name =>
        this.state.formControls[name]
            ? this.state.formControls[name].validity
            : true;

    /**
     * @function
     * Gets the current error message for the given control.
     *
     * @param name - The unique name.
     * @returns {string} - The current error message, if any.
     */
    getControlErrorText = name =>
        this.state.formControls[name]
            ? this.state.formControls[name].errorText
            : '';

    /**
     * @function
     * Calculates the total smart form validity from all
     * the container controls.
     *
     * @param {object} formControls - An object containing
     * the form control states.
     *
     * @returns {boolean} - The validation validity flag
     * for the entire form.
     */
    calculateValidityAll = formControls =>
        Object.keys(formControls).every(
            control => formControls[control].validity
        );

    /**
     * @function
     * Builds up the React Context value. This function
     * memoized to avoid Consumer rerenders.
     */
    getContext = memoize(registerErrors => ({
        registerControl: this.registerControl,
        deregisterControl: this.deregisterControl,
        setControlValue: this.setControlValue,
        getControlValue: this.getControlValue,
        setControlValidity: this.setControlValidity,
        getControlValidity: this.getControlValidity,
        getControlErrorText: this.getControlErrorText,
        registerErrors
    }));

    render() {
        const { alwaysShowErrors, className } = this.props;
        const { formControls, validity, hasSubmitted } = this.state;
        const context = this.getContext(alwaysShowErrors || hasSubmitted);
        return (
            <FormContext.Provider value={context}>
                <form
                    noValidate={true}
                    onSubmit={this.onSubmitHandler}
                    className={className || null}
                >
                    {this.props.children({
                        formControls,
                        validity,
                        hasSubmitted
                    })}
                </form>
            </FormContext.Provider>
        );
    }
}

export default Form;
