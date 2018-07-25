import { callAll } from '../functionHelpers';

describe('callAll', () => {
    it('should call all given functions', () => {
        const mockFunc1 = jest.fn();
        const mockFunc2 = jest.fn();
        const mockFunc3 = jest.fn();

        callAll(mockFunc1, mockFunc2, mockFunc3)();
        expect(mockFunc1).toHaveBeenCalled();
        expect(mockFunc2).toHaveBeenCalled();
        expect(mockFunc3).toHaveBeenCalled();
    });

    it('should call all given functions with the given parameters', () => {
        const mockFunc1 = jest.fn();
        const mockFunc2 = jest.fn();
        const mockFunc3 = jest.fn();

        callAll(mockFunc1, mockFunc2, mockFunc3)('Text', 123, true);
        expect(mockFunc1).toHaveBeenCalledWith('Text', 123, true);
        expect(mockFunc2).toHaveBeenCalledWith('Text', 123, true);
        expect(mockFunc3).toHaveBeenCalledWith('Text', 123, true);
    });
});
