"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTargetMessages = exports.getLanguages = exports.getTargetStringTypes = void 0;
const constants_1 = require("../models/constants");
function getTargetStringTypes(targets) {
    const mapping = [
        [constants_1.StringType.TEMPLATE_LITERAL, targets.convertToBackticks],
        [constants_1.StringType.SINGLE_QUOTE, targets.convertToSingleQuotes],
        [constants_1.StringType.DOUBLE_QUOTE, targets.convertToDoubleQuotes]
    ];
    return mapping
        .filter(([, include]) => include)
        .map(([type]) => type);
}
exports.getTargetStringTypes = getTargetStringTypes;
function getLanguages(settings) {
    return Object
        .keys(settings)
        .map(key => [key, settings[key]])
        .filter(([, value]) => value === true)
        .map(([key]) => key);
}
exports.getLanguages = getLanguages;
function getTargetMessages(texts) {
    return {
        [constants_1.StringType.SINGLE_QUOTE]: texts.convertToSingleQuotes,
        [constants_1.StringType.DOUBLE_QUOTE]: texts.convertToDoubleQuotes,
        [constants_1.StringType.TEMPLATE_LITERAL]: texts.convertToBackticks,
    };
}
exports.getTargetMessages = getTargetMessages;
//# sourceMappingURL=settings.utils.js.map