"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTemplateExpressions = void 0;
const ts = require("typescript");
const constants_1 = require("../models/constants");
const nodeReplacement_1 = require("../models/nodeReplacement");
const string_utils_1 = require("../utils/string.utils");
function convertTemplateExpressions(nodes, targets, link = ' + ') {
    function convertNode(node) {
        function processNode(node, quoteChar) {
            function processString(text) {
                return (0, string_utils_1.wrapText)((0, string_utils_1.escapeQuoteChars)((0, string_utils_1.inlineLineBreaks)(text), constants_1.stringTypeToQuote[constants_1.StringType.TEMPLATE_LITERAL], quoteChar), quoteChar);
            }
            function processTemplateSpan(span) {
                return [span.expression.getText(), processString(span.literal.text)];
            }
            const parts = [];
            if (ts.isTemplateExpression(node)) {
                parts.push(processString(node.head.text));
                const spans = node.templateSpans
                    .map(processTemplateSpan)
                    .reduce((acc, cur) => acc.concat(cur), []);
                parts.push(...spans);
            }
            return parts
                .filter(part => part !== (0, string_utils_1.wrapText)('', quoteChar))
                .join(link);
        }
        return targets
            .filter(target => target !== constants_1.StringType.TEMPLATE_LITERAL)
            .map(target => [target, processNode(node, constants_1.stringTypeToQuote[target])])
            .map(([target, replaced]) => (0, nodeReplacement_1.createNodeReplacement)(node, target, replaced));
    }
    return nodes
        .filter(node => node.kind === ts.SyntaxKind.TemplateExpression)
        .map(node => convertNode(node))
        .reduce((acc, cur) => acc.concat(cur), []);
}
exports.convertTemplateExpressions = convertTemplateExpressions;
//# sourceMappingURL=templateExpressionConverter.js.map