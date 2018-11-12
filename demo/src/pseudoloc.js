const options = {
    prepend: '[!!',
    append: '!!]',
    delimiter: '%',
    startDelimiter: '',
    endDelimiter: '',
    extend: 30,
    override: undefined
};

const table = {
    A: String.fromCharCode(
        192,
        193,
        194,
        195,
        196,
        197,
        256,
        258,
        260,
        506,
        512,
        514
    ),
    a: String.fromCharCode(
        224,
        225,
        226,
        227,
        228,
        229,
        257,
        259,
        261,
        507,
        513,
        515
    ),
    B: String.fromCharCode(223, 385, 579, 665),
    b: String.fromCharCode(384, 386, 387, 388, 389, 595),
    C: String.fromCharCode(262, 264, 266, 268),
    c: String.fromCharCode(263, 265, 267, 269),
    D: String.fromCharCode(270, 272, 393, 394),
    d: String.fromCharCode(271, 273),
    E: String.fromCharCode(274, 276, 278, 280, 282, 516, 518),
    e: String.fromCharCode(275, 277, 279, 281, 283, 517, 519),
    F: String.fromCharCode(401),
    f: String.fromCharCode(402),
    G: String.fromCharCode(284, 286, 288, 290),
    g: String.fromCharCode(285, 287, 289, 291),
    H: String.fromCharCode(292, 294),
    h: String.fromCharCode(293, 295),
    I: String.fromCharCode(296, 298, 300, 302, 304),
    i: String.fromCharCode(297, 299, 301, 303, 305),
    J: String.fromCharCode(309),
    j: String.fromCharCode(308),
    K: String.fromCharCode(310, 408),
    k: String.fromCharCode(311, 312, 409),
    L: String.fromCharCode(313, 315, 317, 319, 321),
    l: String.fromCharCode(314, 316, 318, 320, 322),
    N: String.fromCharCode(323, 325, 327, 330, 413),
    n: String.fromCharCode(324, 326, 328, 329, 331, 414),
    O: String.fromCharCode(332, 334, 336, 416),
    o: String.fromCharCode(333, 335, 337, 417),
    P: String.fromCharCode(420),
    p: String.fromCharCode(421, 447),
    Q: String.fromCharCode(490, 492),
    q: String.fromCharCode(491, 493, 587),
    R: String.fromCharCode(340, 342, 344, 422),
    r: String.fromCharCode(341, 343, 345),
    S: String.fromCharCode(346, 348, 350, 352),
    s: String.fromCharCode(347, 349, 351, 353),
    T: String.fromCharCode(354, 356, 358),
    t: String.fromCharCode(355, 357, 359),
    U: String.fromCharCode(360, 362, 364, 366, 368, 370),
    u: String.fromCharCode(361, 363, 365, 367, 369, 371),
    W: String.fromCharCode(372),
    w: String.fromCharCode(373),
    Y: String.fromCharCode(374, 376, 435, 562, 590),
    y: String.fromCharCode(375, 436, 563, 591),
    Z: String.fromCharCode(377, 379, 381, 437),
    z: String.fromCharCode(378, 380, 382, 438)
};

const pad = (str, percent) => {
    const appendString = 'one two three four';

    let len = Math.floor(str.length * (percent / 100));

    let copyString = appendString;
    while (len > copyString.length) {
        copyString = `${copyString} ${appendString}`;
    }

    return `${str}${copyString.substr(0, len)}`;
};

export const str = str => {
    let opts = options,
        startdelim = opts.startDelimiter || opts.delimiter,
        enddelim = opts.endDelimiter || opts.delimiter,
        re = new RegExp(startdelim + '\\s*[\\w\\.\\s*]+\\s*' + enddelim, 'g'),
        m,
        tokens = [],
        i = 0,
        tokenIdx = 0,
        result = '',
        c,
        pc;
    while ((m = re.exec(str))) {
        tokens.push(m);
    }
    let token = tokens[tokenIdx++] || {
        index: -1
    };
    while (i < str.length) {
        if (token.index === i) {
            result += token[0];
            i += token[0].length;
            token = tokens[tokenIdx++] || {
                index: -1
            };
            continue;
        }
        c = opts.override !== undefined ? opts.override : str[i];
        pc = table[c];
        result += pc ? pc[(Math.random() * pc.length) | 0] : c;
        i++;
    }
    return opts.prepend + pad(result, opts.extend) + opts.append;
};
