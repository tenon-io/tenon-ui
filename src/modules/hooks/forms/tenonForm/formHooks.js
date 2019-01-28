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

export const useInput = (name, validators = []) => {
    const {
        registerErrors,
        setControlValue,
        getControlValue,
        getControlValidity
    } = useContext(FormContext);

    const [controlId] = useBaseControl(name, '', validators);
    const [contentHintId, getContentHintProps] = useContentHint();
    const [errorId, getErrorProps, showError, errorText] = useError(name);

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

    return {
        getLabelProps,
        getInputProps,
        getErrorProps,
        getContentHintProps,
        showError,
        errorText
    };
};
