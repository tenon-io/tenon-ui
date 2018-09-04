import { validator } from '../validationHelpers';

describe('validator', () => {
    it('should return a Tenon validation friendly object', () => {
        const mockFunction = jest.fn();
        const validatorObj = validator(
            mockFunction,
            'Validation message',
            true
        );

        expect(validatorObj.message).toBe('Validation message');
        expect(validatorObj.ignore).toBeTruthy();

        validatorObj.func();
        expect(mockFunction).toHaveBeenCalled();
    });
});
