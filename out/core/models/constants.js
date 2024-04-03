"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosticCodes = exports.stringTypeToQuote = exports.StringType = void 0;
var StringType;
(function (StringType) {
    StringType[StringType["TEMPLATE_LITERAL"] = 0] = "TEMPLATE_LITERAL";
    StringType[StringType["SINGLE_QUOTE"] = 1] = "SINGLE_QUOTE";
    StringType[StringType["DOUBLE_QUOTE"] = 2] = "DOUBLE_QUOTE";
})(StringType || (exports.StringType = StringType = {}));
exports.stringTypeToQuote = {
    [StringType.TEMPLATE_LITERAL]: '`',
    [StringType.SINGLE_QUOTE]: '\'',
    [StringType.DOUBLE_QUOTE]: '"'
};
var DiagnosticCodes;
(function (DiagnosticCodes) {
    DiagnosticCodes[DiagnosticCodes["ADD_PLACEHOLDER"] = 0] = "ADD_PLACEHOLDER";
})(DiagnosticCodes || (exports.DiagnosticCodes = DiagnosticCodes = {}));
//# sourceMappingURL=constants.js.map