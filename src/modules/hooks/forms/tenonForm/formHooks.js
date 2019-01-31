import { useContext, useEffect, useRef, useState } from 'react';
import FormContext from '../../../forms/tenonForm/FormContext';
import uuidv4 from 'uuid/v4';
import { callAll } from '../../../utils/helpers/functionHelpers';

const useContentHint = () => {
    const [contentHintId, setContentHindId] = useState('');

    const getContentHintProps = (props = {}) => {
        if (!contentHintId) {
            setContentHindId(uuidv4());
        }

        return {
            id: contentHintId,
            ...props
        };
    };

    return [contentHintId, getContentHintProps];
};

const useError = name => {
    const {
        registerErrors,
        getControlValidity,
        getControlErrorText
    } = useContext(FormContext);
    const { current: errorId } = useRef(uuidv4());

    const getErrorProps = (props = {}) => ({
        id: errorId,
        ...props
    });

    return [
        errorId,
        getErrorProps,
        registerErrors ? !getControlValidity(name) : false,
        getControlErrorText(name)
    ];
};

const getAriaDescribedBy = (isValid, errorId, contentHintId) => {
    let describedByIds = [];

    if (contentHintId) {
        describedByIds.push(contentHintId);
    }

    if (!isValid) {
        describedByIds.push(errorId);
    }

    return describedByIds.join(' ') || null;
};

const useBaseControl = (name, defaultValue, validators) => {
    const {
        registerControl,
        deregisterControl,
        getControlValue,
        setControlValidity,
        getControlValidity,
        getControlErrorText
    } = useContext(FormContext);

    const { current: controlId } = useRef(uuidv4());

    useEffect(
        () => {
            registerControl(name, controlId, '', true, '');
            return () => {
                deregisterControl(name);
            };
        },
        [name]
    );

    useEffect(() => {
        const validationResult = runValidation(getControlValue(name));
        if (
            validationResult.validity !== getControlValidity(name) ||
            validationResult.errorText !== getControlErrorText(name)
        ) {
            setControlValidity(name, validationResult);
        }
    });

    const runValidation = textValue => {
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

    return [controlId];
};

export const useBaseInput = (name, validators, defaultValue = '') => {
    const { registerErrors, getControlValidity } = useContext(FormContext);

    const [controlId] = useBaseControl(name, defaultValue, validators);
    const [contentHintId, getContentHintProps] = useContentHint();
    const [errorId, getErrorProps, showError, errorText] = useError(name);

    const getLabelProps = (props = {}) => ({
        htmlFor: controlId,
        ...props
    });

    const getBaseInputProps = props => {
        const isValid = registerErrors ? getControlValidity(name) : true;
        const { required } = props;

        return {
            'aria-describedby': getAriaDescribedBy(
                isValid,
                errorId,
                contentHintId
            ),
            'aria-disabled': props['disabled'] ? 'true' : null,
            'aria-invalid': isValid ? null : 'true',
            'aria-required':
                required === true || required === 'true' ? 'true' : null,
            id: controlId,
            name
        };
    };

    return {
        getLabelProps,
        getBaseInputProps,
        getErrorProps,
        getContentHintProps,
        showError,
        errorText
    };
};

export const useInput = (name, validators = []) => {
    const { setControlValue, getControlValue } = useContext(FormContext);

    const { getBaseInputProps, ...baseInputRest } = useBaseInput(
        name,
        validators
    );

    const onChangeHandler = e => {
        setControlValue(name, e.target.value);
    };

    const getInputProps = ({ onChange, ...props } = {}) => {
        return {
            ...getBaseInputProps(props),
            'aria-readonly': props['readOnly'] ? 'true' : null,
            type: 'text',
            value: getControlValue(name),
            onChange: callAll(onChange, onChangeHandler),
            ...props
        };
    };

    return {
        getInputProps,
        ...baseInputRest
    };
};

export const useTextArea = (name, validators = []) => {
    const { getInputProps, ...inputRest } = useInput(name, validators);

    const getTextareaProps = (props = {}) => {
        const { type, ...propsRest } = getInputProps(props);
        return propsRest;
    };
    return { getTextareaProps, ...inputRest };
};

export const useSelect = (name, validators = []) => {
    const { getInputProps, ...inputRest } = useInput(name, validators);

    const getSelectProps = (props = {}) => {
        const { type, ...propsRest } = getInputProps(props);
        return propsRest;
    };
    return { getSelectProps, ...inputRest };
};

export const useCheckbox = (name, validators = []) => {
    const { setControlValue, getControlValue } = useContext(FormContext);
    const { getBaseInputProps, ...baseInputRest } = useBaseInput(
        name,
        validators,
        false
    );
    const onChangeHandler = e => {
        setControlValue(name, e.target.checked);
    };

    const getCheckboxProps = ({ onChange, ...props } = {}) => {
        return {
            ...getBaseInputProps(props, onChange),
            type: 'checkbox',
            checked: getControlValue(name),
            onChange: callAll(onChange, onChangeHandler),
            ...props
        };
    };

    return { getCheckboxProps, ...baseInputRest };
};
