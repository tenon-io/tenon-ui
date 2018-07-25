import { isRequired, isLongerThan } from '../validation';

describe('isRequired', () => {
    it('should fail for empty values', () => {
        expect(isRequired('')).toBeFalsy();
        expect(isRequired(null)).toBeFalsy();
        expect(isRequired(undefined)).toBeFalsy();
    });

    it('should pass for any non empty value', () => {
        expect(isRequired('A')).toBeTruthy();
        expect(isRequired('1')).toBeTruthy();
        expect(isRequired('Something else')).toBeTruthy();
    });
});

describe('isLongerThan', () => {
    it('should pass for empty values', () => {
        expect(isLongerThan('', 5)).toBeTruthy();
        expect(isLongerThan(null, 5)).toBeTruthy();
        expect(isLongerThan(undefined, 5)).toBeTruthy();
    });

    it('should fail for values shorter or equal to the given length', () => {
        expect(isLongerThan(' ', 5)).toBeFalsy();
        expect(isLongerThan('  ', 5)).toBeFalsy();
        expect(isLongerThan('   ', 5)).toBeFalsy();
        expect(isLongerThan('    ', 5)).toBeFalsy();
        expect(isLongerThan('     ', 5)).toBeFalsy();
        expect(isLongerThan('A', 5)).toBeFalsy();
        expect(isLongerThan('AB', 5)).toBeFalsy();
        expect(isLongerThan('ABC', 5)).toBeFalsy();
        expect(isLongerThan('ABCD', 5)).toBeFalsy();
        expect(isLongerThan('ACBDE', 5)).toBeFalsy();
    });

    it('should pass for values longer than the given length', () => {
        expect(isLongerThan('      ', 5)).toBeTruthy();
        expect(isLongerThan('123456', 5)).toBeTruthy();
        expect(isLongerThan('ABCDEF', 5)).toBeTruthy();
    });
});
