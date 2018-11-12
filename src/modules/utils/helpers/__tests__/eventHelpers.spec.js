import { getKey } from '../eventHelpers';

describe('getKey', () => {
    it('should translate keybordEvent.code', () => {
        expect(getKey({ nativeEvent: { code: 'ArrowLeft' } })).toBe(
            'ArrowLeft'
        );
        expect(getKey({ nativeEvent: { code: 'ArrowUp' } })).toBe('ArrowUp');
        expect(getKey({ nativeEvent: { code: 'ArrowRight' } })).toBe(
            'ArrowRight'
        );
        expect(getKey({ nativeEvent: { code: 'ArrowDown' } })).toBe(
            'ArrowDown'
        );
    });

    it('should translate keybordEvent.keyCode', () => {
        expect(getKey({ keyCode: 37, nativeEvent: {} })).toBe('ArrowLeft');
        expect(getKey({ keyCode: 38, nativeEvent: {} })).toBe('ArrowUp');
        expect(getKey({ keyCode: 39, nativeEvent: {} })).toBe('ArrowRight');
        expect(getKey({ keyCode: 40, nativeEvent: {} })).toBe('ArrowDown');
    });
});
