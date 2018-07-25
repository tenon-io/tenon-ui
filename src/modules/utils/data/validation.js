/**
 * @function
 * Tests if the given value is not empty.
 *
 * @param {string} value
 * @returns {boolean}
 */
export const isRequired = value => (value && !!value.trim()) || false;

/**
 * @function
 * Tests if the given value is longer than the given length
 *
 * @param {string} value
 * @param {number} length
 * @returns {boolean}
 */
export const isLongerThan = (value, length) => !value || value.length > length;
