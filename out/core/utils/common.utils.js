"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveNodes = exports.createSourceFile = void 0;
const ts = require("typescript");
function createSourceFile(textDocument) {
    return ts.createSourceFile(textDocument.fileName, textDocument.getText(), ts.ScriptTarget.Latest, true, getScriptKind(textDocument.languageId));
}
exports.createSourceFile = createSourceFile;
function retrieveNodes(sourceFile, syntaxKinds) {
    const matchedNodes = [];
    function filterStringNodes(node) {
        if (syntaxKinds[node.kind]) {
            matchedNodes.push(node);
        }
        ts.forEachChild(node, filterStringNodes);
    }
    filterStringNodes(sourceFile);
    return matchedNodes;
}
exports.retrieveNodes = retrieveNodes;
function getScriptKind(languageId) {
    switch (languageId) {
        case "javascript":
            return ts.ScriptKind.JS;
        case "typescript":
            return ts.ScriptKind.TS;
        case "javascriptreact":
            return ts.ScriptKind.JSX;
        case "typescriptreact":
            return ts.ScriptKind.TSX;
        default:
            return ts.ScriptKind.Unknown;
    }
}
//# sourceMappingURL=common.utils.js.map