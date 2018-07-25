import { keyCodes, keyNames } from '../constants/keyCodes';

/**
 * @function
 * Returns a compatible keyboard code that allows for deprecation of
 * e.keyCode in browsers.
 *
 * @param {SyntheticKeyboardEvent} e
 * @returns {string}
 */
export const getKey = e =>
    e.nativeEvent.code ? keyNames[e.nativeEvent.code] : keyCodes[e.keyCode];
