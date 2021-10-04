const highlight = function (src, _config) {
    let config = _config || {};
    let styles = config.styles || [
        '', // 0: not formatted
        'font-weight: bold', // 1: keywords
        '', // 2: punctuation
        'color: blue', // 3: strings and regexps
        'font-style: italic; color: gray' // 4: comments
    ];

    const isKeyword = (token) => {
        let keywords = config.keywords || [];
        let excludeKeywords = config.excludeKeywords || [];
        let re = config.keywordRe || /./;

        return keywords.includes(token) && !excludeKeywords.includes(token);
    }

    if (!(typeof src === 'string') && !(src instanceof Element)) {
        throw new Error("Invalid argument passed to highlight()");
    }

    let text = src instanceof Element ? src.textContent : src;

    let pos = 0; // current position
    let next = text[0]; // next character
    let char = 1; // current character
    let prev; // previous character
    let prev_prev; // the one before the previous
    let token = ''; // current token contents
    let result = '';

    // current token type:
    //  0: anything else (whitespaces / newlines)
    //  1: operator or brace
    //  2: closing braces (after which '/' is division not regex)
    //  3: (key)word
    //  4: regex
    //  5: string starting with "
    //  6: string starting with '
    //  7: xml comment  <!-- -->
    //  8: multiline comment /* */
    //  9: single-line comment starting with two slashes //
    // 10: single-line comment starting with hash #
    let tokenType = 0;

    // kept to determine between regex and division
    let lastTokenType = -1;
    let multichar = false;

    const shouldFinalizeToken = (currentChar) => {
        if (!currentChar) return true;
        if (tokenType < 8 && currentChar == '\n') return true;

        // finalization conditions for other tokens
        return [
            /\S/.test(currentChar),  // whitespaces get merged.
            true, // operator, consists of a single character.
            true, // brace, it consists of a single character.
            !/[$\w]/.test(currentChar), // 3: (key)word
            (prev === '/' || prev == '\n') && multichar, // 4: regex
            prev === '"' && multichar, // 5: string with double-quotes
            prev === "'" && multichar, // 6: string with single-quotes
            text[pos - 4] + prev_prev + prev == '-->', // 7: xml comment
            prev_prev + prev === '*/', // 8: multiline comment
            currentChar === '\n',
            currentChar === '\n',
        ][tokenType];
    }

    // running through characters and highlighting.
    // we escape if needed, excepting comments.

    while (prev_prev = prev, prev = (tokenType < 7 && prev == '\\') ? 1 : char) {
        char = next;
        next = text[++pos];
        multichar = token.length > 1;

        // checking if current token should be finalized
        if (shouldFinalizeToken(char)) {
            // appending the token to the result
            if (token) { // remapping token type into style // (some types are highlighted similarly)
                let styleIdx = 0;

                if (tokenType < 3) {
                    styleIdx = 2;
                }
                else if (tokenType > 6) {
                    styleIdx = 4;
                }
                else if (tokenType > 3) {
                    styleIdx = 3;
                }
                else {
                    console.log(token);
                    styleIdx = isKeyword(token) ? 1 : 0;
                }

                result += `<span style="${styles[styleIdx]}">${token}</span>`;
            }

            // saving the previous token type
            // (skipping whitespaces and comments)
            lastTokenType = (tokenType && tokenType < 7) ? tokenType : lastTokenType;

            // initializing a new token
            token = '';

            if (char == '#') tokenType = 10;
            else if (char + next == '//') tokenType = 9;
            else if (char + next == '/*') tokenType = 8;
            else if (char + next + text[pos + 1] + text[pos + 2] == '<!--') tokenType = 7;
            else if (char == "'") tokenType = 6;
            else if (char == '"') tokenType = 5;
            else if (char == '/' && (lastTokenType < 2) && prev != '<') tokenType = 4;
            else if (/[$\w]/.test(char)) tokenType = 3;
            else if (/[\])]/.test(char)) tokenType = 2;
            else if ((/[\/{}[(\-+*=<>:;|\\.,?!&@~]/.test(char))) tokenType = 1;
            else tokenType = 0;
        }

        token += char;
    }
    return result;
}

const highlightAll = (config = {}, selector = '.microlight') => {
    const elts = document.querySelectorAll(selector) || [];
    Array.from(elts).forEach(elem => {
        elem.innerHTML = highlight(elem, config);
    })
}