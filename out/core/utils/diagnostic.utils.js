"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToDiagnosticFromCode = exports.convertToDiagnostic = void 0;
const vscode = require("vscode");
function convertToDiagnostic(textDocument, replacement, messages) {
    const range = getDocumentRange(textDocument, replacement.node);
    const diagnostic = new vscode.Diagnostic(range, messages[replacement.targetType], vscode.DiagnosticSeverity.Hint);
    diagnostic.code = replacement.replacement;
    return diagnostic;
}
exports.convertToDiagnostic = convertToDiagnostic;
function convertToDiagnosticFromCode(textDocument, node, message, diagnosticCode) {
    const range = getDocumentRange(textDocument, node, { start: 1, end: -1 });
    const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Hint);
    diagnostic.code = diagnosticCode;
    return diagnostic;
}
exports.convertToDiagnosticFromCode = convertToDiagnosticFromCode;
function getDocumentRange(textDocument, node, offsets = { start: 0, end: 0 }) {
    const start = textDocument.positionAt(node.getStart() + offsets.start);
    const end = textDocument.positionAt(node.getEnd() + offsets.end);
    return new vscode.Range(start, end);
}
//# sourceMappingURL=diagnostic.utils.js.map