/**
 * @function
 * Helper function to compose validators for the smart form controls.
 *
 * @param {function} func
 * @param {string} message
 * @param {boolean} ignore
 * @returns {object} - A validator configuration object.
 */
export const validator = (func, message, ignore) => ({
    func,
    message,
    ignore
});
