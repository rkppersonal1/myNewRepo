"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertNoSubstitutionTemplateLiterals = exports.convertStringLiterals = void 0;
const ts = require("typescript");
const string_utils_1 = require("../utils/string.utils");
const simpleLiteralConverterFactory_1 = require("./simpleLiteralConverterFactory");
const convertStringLiterals = (nodes, targets) => (0, simpleLiteralConverterFactory_1.simpleLiteralConverterFactory)(ts.SyntaxKind.StringLiteral, (text) => text, string_utils_1.replaceQuoteChars)(nodes, targets);
exports.convertStringLiterals = convertStringLiterals;
const convertNoSubstitutionTemplateLiterals = (nodes, targets) => (0, simpleLiteralConverterFactory_1.simpleLiteralConverterFactory)(ts.SyntaxKind.NoSubstitutionTemplateLiteral, string_utils_1.inlineLineBreaks, string_utils_1.replaceQuoteChars)(nodes, targets);
exports.convertNoSubstitutionTemplateLiterals = convertNoSubstitutionTemplateLiterals;
//# sourceMappingURL=simpleLiteralConverters.js.map