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
 * Note that this validator is curried.
 *
 * @param {number} minLength
 * @param {string} value
 * @returns {boolean}
 */
export const isLongerThan = minLength => value =>
    !value || value.length > minLength;

/**
 * Tests of the given value conforms to a valid web url string
 *
 * @param {string} value
 * @returns {boolean}
 */
export const isValidWebURL = value => {
    if (!value) {
        return true;
    }

    //Reference: https://mathiasbynens.be/demo/url-regex
    //Reference: https://gist.github.com/dperini/729294
    const webUrlTest = new RegExp(
        '^' +
            // protocol identifier
            '(?:(?:https?|ftp)://)' +
            // user:pass authentication
            '(?:\\S+(?::\\S*)?@)?' +
            '(?:' +
            // IP address exclusion
            // private & local networks
            '(?!(?:10|127)(?:\\.\\d{1,3}){3})' +
            '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' +
            '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})' +
            // IP address dotted notation octets
            // excludes loopback network 0.0.0.0
            // excludes reserved space >= 224.0.0.0
            // excludes network & broacast addresses
            // (first & last IP address of each class)
            '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
            '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
            '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
            '|' +
            // host name
            '(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)' +
            // domain name
            '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*' +
            // TLD identifier
            '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))' +
            // TLD may end with dot
            '\\.?' +
            ')' +
            // port number
            '(?::\\d{2,5})?' +
            // resource path
            '(?:[/?#]\\S*)?' +
            '$',
        'i'
    );

    return webUrlTest.test(value);
};
