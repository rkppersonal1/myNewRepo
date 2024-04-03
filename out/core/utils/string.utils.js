"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapText = exports.inlineLineBreaks = exports.escapeQuoteChars = exports.replaceQuoteChars = void 0;
function replaceQuoteChars(text, targetQuoteChar) {
    const currentQuoteChar = text[0];
    if (currentQuoteChar === targetQuoteChar) {
        return text;
    }
    const innerText = text.substring(currentQuoteChar.length, text.length - currentQuoteChar.length);
    const replacedAndEscaped = escapeQuoteChars(innerText, currentQuoteChar, targetQuoteChar);
    return `${targetQuoteChar}${replacedAndEscaped}${targetQuoteChar}`;
}
exports.replaceQuoteChars = replaceQuoteChars;
function escapeQuoteChars(text, currentQuoteChar, targetQuoteChar) {
    return text
        .replace(new RegExp(`\\\\${currentQuoteChar}`, 'g'), currentQuoteChar)
        .replace(new RegExp(`${targetQuoteChar}`, 'g'), `\\${targetQuoteChar}`);
}
exports.escapeQuoteChars = escapeQuoteChars;
function inlineLineBreaks(text) {
    return text.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
}
exports.inlineLineBreaks = inlineLineBreaks;
function wrapText(text, wrapper) {
    return `${wrapper}${text}${wrapper}`;
}
exports.wrapText = wrapText;
//# sourceMappingURL=string.utils.js.map