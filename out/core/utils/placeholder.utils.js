"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplateLiteralParts = void 0;
const ts = require("typescript");
function getTemplateLiteralParts(nodes) {
    function getTemplateExpressionParts(node) {
        const arr = [node.head];
        return arr.concat(node.templateSpans.map(s => s.literal));
    }
    const noSubstitutionTemplateLiterals = nodes
        .filter(ts.isNoSubstitutionTemplateLiteral);
    const templateExpressionParts = nodes
        .filter(ts.isTemplateExpression)
        .map(getTemplateExpressionParts)
        .reduce((acc, cur) => acc.concat(cur), []);
    return templateExpressionParts.concat(noSubstitutionTemplateLiterals);
}
exports.getTemplateLiteralParts = getTemplateLiteralParts;
//# sourceMappingURL=placeholder.utils.js.map