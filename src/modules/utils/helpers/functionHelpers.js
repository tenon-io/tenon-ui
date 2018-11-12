/**
 * @function
 * A curried function that calls all given functions with
 * the given args.
 *
 * @param {Array} fns
 * @param {Array} args
 */
export const callAll = (...fns) => (...args) => {
    fns.forEach(fn => fn && fn(...args));
};
