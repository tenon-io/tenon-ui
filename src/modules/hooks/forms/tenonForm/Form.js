import React, {
    useReducer,
    useEffect,
    useRef,
    useMemo,
    useState
} from 'react';
import PropTypes from 'prop-types';
import FormContext from './FormContext';
import deepEqual from 'react-fast-compare';

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
 * @prop {object} formData - An object mirroring the form's submit data
 * object. If provided this is used to prefill the form with data. If changed
 * the new data will overwrite what is currently in the form. Partial updates
 * are possible.
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
const Form = ({
    children,
    onSubmit,
    formData,
    onRawSubmit,
    alwaysShowErrors,
    className
}) => {
    const controlActions = {
        register: 'REGISTER',
        deregister: 'DEREGISTER',
        setValue: 'SET_VALUE',
        setValidity: 'SET_VALIDITY',
        loadFormData: 'LOAD_FORM-DATA'
    };

    const calculateValidityAll = formControls =>
        Object.keys(formControls).every(
            control => formControls[control].validity
        );

    const controlsReducer = (state = {}, action) => {
        const { name, controlId, value, validity } = action;
        switch (action.type) {
            case controlActions.register:
                return {
                    ...state,
                    [name]: {
                        controlId,
                        value:
                            formData && formData.hasOwnProperty(name)
                                ? formData[name]
                                : value,
                        validity: validity.validity,
                        errorText: validity.errorText
                    }
                };
            case controlActions.deregister:
                let newState = { ...state };
                delete newState[name];
                return newState;
            case controlActions.setValue:
                return {
                    ...state,
                    [name]: {
                        ...state[name],
                        value
                    }
                };
            case controlActions.setValidity:
                return {
                    ...state,
                    [name]: {
                        ...state[name],
                        validity: validity.validity,
                        errorText: validity.errorText
                    }
                };
            case controlActions.loadFormData:
                return Object.keys(formData).reduce(
                    (combinedState, key) => {
                        if (combinedState.hasOwnProperty(key)) {
                            combinedState[key].value = formData[key];
                        }
                        return combinedState;
                    },
                    { ...state }
                );
            default:
                return state;
        }
    };

    const [formState, formStateDispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case controlActions.register:
                case controlActions.setValue:
                    return {
                        ...state,
                        formControls: controlsReducer(
                            state.formControls,
                            action
                        )
                    };
                case controlActions.setValidity:
                case controlActions.deregister:
                case controlActions.loadFormData:
                    const formControls = controlsReducer(
                        state.formControls,
                        action
                    );
                    return {
                        formControls,
                        validity: calculateValidityAll(formControls)
                    };
                default:
                    return state;
            }
        },
        {
            formControls: {},
            validity: true
        }
    );

    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        if (formData && !deepEqual(prevFormData.current, formData)) {
            formStateDispatch({
                type: controlActions.loadFormData,
                formData
            });
        }
    });

    const prevFormData = useRef();

    useEffect(() => {
        prevFormData.current = formData;
    });

    const onSubmitHandler = e => {
        const { formControls } = formState;
        e.preventDefault();

        setHasSubmitted(true);

        if (onRawSubmit) {
            onRawSubmit(formControls, formState.validity);
        }

        if (formState.validity) {
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

    const registerControl = (name, controlId, value, validity, errorText) => {
        formStateDispatch({
            type: controlActions.register,
            name,
            controlId,
            value,
            validity: {
                validity,
                errorText
            }
        });
    };

    const deregisterControl = name => {
        formStateDispatch({
            type: controlActions.deregister,
            name
        });
    };

    const setControlValue = (name, value) => {
        formStateDispatch({
            type: controlActions.setValue,
            name,
            value
        });
    };

    const getControlValue = name =>
        formState.formControls[name] ? formState.formControls[name].value : '';

    const setControlValidity = (name, validity) => {
        formStateDispatch({
            type: controlActions.setValidity,
            name,
            validity
        });
    };

    const getControlValidity = name =>
        formState.formControls[name]
            ? formState.formControls[name].validity
            : true;

    const getControlErrorText = name =>
        formState.formControls[name]
            ? formState.formControls[name].errorText
            : '';

    const registerErrors = alwaysShowErrors || hasSubmitted;

    const contextValue = useMemo(
        () => ({
            registerControl,
            deregisterControl,
            setControlValue,
            getControlValue,
            setControlValidity,
            getControlValidity,
            getControlErrorText,
            registerErrors
        }),
        [registerErrors, formState]
    );

    const { formControls, validity } = formState;
    return (
        <FormContext.Provider value={contextValue}>
            <form
                noValidate={true}
                onSubmit={onSubmitHandler}
                className={className || null}
            >
                {children({
                    formControls,
                    validity,
                    hasSubmitted
                })}
            </form>
        </FormContext.Provider>
    );
};

Form.displayName = 'Form';

Form.propTypes = {
    children: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    formData: PropTypes.object,
    onRawSubmit: PropTypes.func,
    alwaysShowErrors: PropTypes.bool,
    className: PropTypes.string
};

export default Form;
