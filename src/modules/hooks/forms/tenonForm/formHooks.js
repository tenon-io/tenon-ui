import { useContext, useEffect, useRef, useState } from 'react';
import FormContext from '../../../forms/tenonForm/FormContext';
import uuidv4 from 'uuid/v4';
import { callAll } from '../../../utils/helpers/functionHelpers';

export const useInput = (name, validators = []) => {
    const {
        registerErrors,
        registerControl,
        deregisterControl,
        setControlValue,
        getControlValue,
        setControlValidity,
        getControlValidity,
        getControlErrorText
    } = useContext(FormContext);

    const { current: controlId } = useRef(uuidv4());
    const { current: errorId } = useRef(uuidv4());
    const { current: contentHintId } = useRef(uuidv4());

    const contentHintRegistered = useRef(false);

    const [contentHintIdFromState, setContentHindIdFromState] = useState('');

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

        //This is required to update the component when a content hint is
        //detected so that the id linkage is established in the prop
        //getter functions.
        if (contentHintRegistered.current && !contentHintIdFromState) {
            setContentHindIdFromState(contentHintId);
        }
    });

    const onChangeHandler = e => {
        setControlValue(name, e.target.value);
    };

    const getLabelProps = ({ autoIdPostfix, ...props } = {}) => ({
        htmlFor: `${controlId}${autoIdPostfix ? `-${autoIdPostfix}` : ''}`,
        ...props
    });

    const getBaseInputProps = (props, onChange) => {
        const isValid = registerErrors ? getControlValidity(name) : true;
        const { required } = props;

        return {
            'aria-describedby': getAriaDescribedBy(isValid),
            'aria-disabled': props['disabled'] ? 'true' : null,
            'aria-invalid': isValid ? null : 'true',
            'aria-required':
                required === true || required === 'true' ? 'true' : null,
            id: controlId,
            name,
            onChange: callAll(onChange, onChangeHandler)
        };
    };

    const getInputProps = ({ onChange, ...props } = {}) => {
        return {
            ...getBaseInputProps(props, onChange),
            'aria-readonly': props['readOnly'] ? 'true' : null,
            type: 'text',
            value: getControlValue(name),
            ...props
        };
    };

    const getErrorProps = (props = {}) => ({
        id: errorId,
        ...props
    });

    const getContentHintProps = (props = {}) => {
        contentHintRegistered.current = true;

        return {
            id: contentHintIdFromState,
            ...props
        };
    };

    const getAriaDescribedBy = isValid => {
        let describedByIds = [];

        if (contentHintIdFromState) {
            describedByIds.push(contentHintIdFromState);
        }

        if (!isValid) {
            describedByIds.push(errorId);
        }

        return describedByIds.join(' ') || null;
    };

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

    return {
        getLabelProps,
        getInputProps,
        getErrorProps,
        getContentHintProps,
        showError: registerErrors ? !getControlValidity(name) : false,
        errorText: getControlErrorText(name)
    };
};
