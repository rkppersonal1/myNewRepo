"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleLiteralConverterFactory = void 0;
const constants_1 = require("../models/constants");
const nodeReplacement_1 = require("../models/nodeReplacement");
function simpleLiteralConverterFactory(filterSyntaxKind, preprocessTextFunc, replaceQuoteCharsFunc) {
    return function (nodes, targets) {
        function convertNode(node) {
            const text = preprocessTextFunc(node.getText());
            return targets
                .map(target => [target, replaceQuoteCharsFunc(text, constants_1.stringTypeToQuote[target])])
                .filter(([, replaced]) => replaced !== text)
                .map(([target, replaced]) => (0, nodeReplacement_1.createNodeReplacement)(node, target, replaced));
        }
        return nodes
            .filter(node => node.kind === filterSyntaxKind)
            .map(node => convertNode(node))
            .reduce((acc, cur) => acc.concat(cur), []);
    };
}
exports.simpleLiteralConverterFactory = simpleLiteralConverterFactory;
//# sourceMappingURL=simpleLiteralConverterFactory.js.map