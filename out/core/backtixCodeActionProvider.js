'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.BacktixCodeActionProvider = void 0;
const vscode = require("vscode");
const ts = require("typescript");
const templateExpressionConverter_1 = require("./converters/templateExpressionConverter");
const simpleLiteralConverters_1 = require("./converters/simpleLiteralConverters");
const common_utils_1 = require("./utils/common.utils");
const diagnostic_utils_1 = require("./utils/diagnostic.utils");
const placeholder_utils_1 = require("./utils/placeholder.utils");
const settings_utils_1 = require("./utils/settings.utils");
const constants_1 = require("./models/constants");
class BacktixCodeActionProvider {
    constructor(settings) {
        this.settings = settings;
        this.syntaxKinds = {
            [ts.SyntaxKind.StringLiteral]: true,
            [ts.SyntaxKind.NoSubstitutionTemplateLiteral]: true,
            [ts.SyntaxKind.TemplateExpression]: true
        };
        this.targetMessages = (0, settings_utils_1.getTargetMessages)(settings.conversionTexts);
        this.targets = (0, settings_utils_1.getTargetStringTypes)(settings.conversions);
        this.placeholderSettings = settings.placeholders;
    }
    activate(subscriptions) {
        this.convertBackticksCommand = vscode.commands.registerTextEditorCommand(BacktixCodeActionProvider.convertBackticksCommandId, this.runConvertBackticksCodeAction, this);
        this.convertSingleQuotesCommand = vscode.commands.registerTextEditorCommand(BacktixCodeActionProvider.convertSingleQuotesCommandId, this.runConvertSingleQuotesCodeAction, this);
        this.convertDoubleQuotesCommand = vscode.commands.registerTextEditorCommand(BacktixCodeActionProvider.convertDoubleQuotesCommandId, this.runConvertDoubleQuotesCodeAction, this);
        this.addPlaceholderCommand = vscode.commands.registerTextEditorCommand(BacktixCodeActionProvider.addPlaceholderCommandId, this.runAddPlaceholderCodeAction, this);
        subscriptions.push(this);
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection();
        this.registerEventHandlers(subscriptions);
        vscode.workspace.textDocuments.forEach(this.updateDiagnosticCollection, this);
    }
    dispose() {
        this.diagnosticCollection.clear();
        this.diagnosticCollection.dispose();
        this.convertBackticksCommand.dispose();
        this.convertSingleQuotesCommand.dispose();
        this.convertDoubleQuotesCommand.dispose();
        this.addPlaceholderCommand.dispose();
    }
    provideCodeActions(document, range, context) {
        return context.diagnostics.map(diagnostic => ({
            title: diagnostic.message,
            command: this.getCommand(diagnostic),
            isPreferred: false,
            kind: vscode.CodeActionKind.RefactorRewrite
        }));
    }
    registerEventHandlers(subscriptions) {
        vscode.workspace.onDidOpenTextDocument(this.updateDiagnosticCollection, this, subscriptions);
        vscode.workspace.onDidChangeTextDocument((e) => this.updateDiagnosticCollection(e.document), this, subscriptions);
        vscode.workspace.onDidCloseTextDocument((textDocument) => this.diagnosticCollection.delete(textDocument.uri), null, subscriptions);
    }
    updateDiagnosticCollection(textDocument) {
        if (!this.settings.languages[textDocument.languageId]) {
            return;
        }
        const sourceFile = (0, common_utils_1.createSourceFile)(textDocument);
        const nodes = (0, common_utils_1.retrieveNodes)(sourceFile, this.syntaxKinds);
        const replacements = new Array()
            .concat((0, templateExpressionConverter_1.convertTemplateExpressions)(nodes, this.targets))
            .concat((0, simpleLiteralConverters_1.convertNoSubstitutionTemplateLiterals)(nodes, this.targets))
            .concat((0, simpleLiteralConverters_1.convertStringLiterals)(nodes, this.targets));
        const diagnostics = replacements.map(replacement => (0, diagnostic_utils_1.convertToDiagnostic)(textDocument, replacement, this.targetMessages));
        const templateExpressionParts = (0, placeholder_utils_1.getTemplateLiteralParts)(nodes);
        const placeholderDiagnostics = this.placeholderSettings.active
            ? templateExpressionParts.map(node => (0, diagnostic_utils_1.convertToDiagnosticFromCode)(textDocument, node, this.placeholderSettings.text, constants_1.DiagnosticCodes.ADD_PLACEHOLDER))
            : [];
        this.diagnosticCollection.set(textDocument.uri, diagnostics.concat(placeholderDiagnostics));
    }
    getCommand(diagnostic) {
        return {
            title: diagnostic.message,
            command: this.getCommandId(diagnostic),
            arguments: [diagnostic]
        };
    }
    getCommandId(diagnostic) {
        switch (diagnostic.message) {
            case this.placeholderSettings.text:
                return BacktixCodeActionProvider.addPlaceholderCommandId;
            case this.targetMessages[constants_1.StringType.TEMPLATE_LITERAL]:
                return BacktixCodeActionProvider.convertBackticksCommandId;
            case this.targetMessages[constants_1.StringType.SINGLE_QUOTE]:
                return BacktixCodeActionProvider.convertSingleQuotesCommandId;
            case this.targetMessages[constants_1.StringType.DOUBLE_QUOTE]:
                return BacktixCodeActionProvider.convertDoubleQuotesCommandId;
            default:
                throw new Error('No command id found!');
        }
    }
    runConvertBackticksCodeAction(textEditor, edit, diagnostic) {
        this.applyDiagnostic(edit, diagnostic !== null && diagnostic !== void 0 ? diagnostic : this.getConvertDiagnostic(textEditor, constants_1.StringType.TEMPLATE_LITERAL));
    }
    runConvertSingleQuotesCodeAction(textEditor, edit, diagnostic) {
        this.applyDiagnostic(edit, diagnostic !== null && diagnostic !== void 0 ? diagnostic : this.getConvertDiagnostic(textEditor, constants_1.StringType.SINGLE_QUOTE));
    }
    runConvertDoubleQuotesCodeAction(textEditor, edit, diagnostic) {
        this.applyDiagnostic(edit, diagnostic !== null && diagnostic !== void 0 ? diagnostic : this.getConvertDiagnostic(textEditor, constants_1.StringType.DOUBLE_QUOTE));
    }
    runAddPlaceholderCodeAction(textEditor, edit, diagnostic) {
        diagnostic !== null && diagnostic !== void 0 ? diagnostic : (diagnostic = this.getPlaceholderDiagnostic(textEditor));
        const edits = [];
        if (!diagnostic) {
            diagnostic = this.getConvertDiagnostic(textEditor, constants_1.StringType.TEMPLATE_LITERAL);
            if (!diagnostic) {
                return;
            }
            const { start, end } = diagnostic.range;
            const replacement = diagnostic.code;
            const firstRange = new vscode.Range(start, start.translate(0, 1));
            const lastRange = new vscode.Range(end.translate(0, -1), end);
            edits.push({ range: firstRange, replacement: replacement[0] });
            edits.push({ range: lastRange, replacement: replacement.slice(-1) });
        }
        const currentSelections = textEditor.selections.slice();
        const startToken = '${';
        const endToken = '}';
        const primarySelection = currentSelections.shift();
        if (!primarySelection) {
            return;
        }
        const range = diagnostic.range.intersection(primarySelection);
        if (!range) {
            return;
        }
        const primarySelectedText = textEditor.document.getText(range);
        const replacement = `${startToken}${primarySelectedText}${endToken}`;
        edits.push({ range, replacement });
        const newFirst = new vscode.Selection(new vscode.Position(primarySelection.anchor.line, primarySelection.anchor.character + startToken.length), new vscode.Position(primarySelection.active.line, primarySelection.active.character + startToken.length));
        currentSelections.unshift(newFirst);
        textEditor
            .edit(e => edits.forEach(({ range, replacement }) => e.replace(range, replacement)))
            .then(() => textEditor.selections = currentSelections);
    }
    applyDiagnostic(edit, diagnostic) {
        if (!diagnostic) {
            return;
        }
        const range = diagnostic.range;
        const replacement = diagnostic.code;
        edit.replace(range, replacement);
    }
    getConvertDiagnostic(textEditor, stringType) {
        return this.getDiagnostic(textEditor, this.targetMessages[stringType]);
    }
    getPlaceholderDiagnostic(textEditor) {
        return this.getDiagnostic(textEditor, this.placeholderSettings.text);
    }
    getDiagnostic(textEditor, message) {
        var _a, _b;
        return (_b = (_a = this.diagnosticCollection
            .get(textEditor.document.uri)) === null || _a === void 0 ? void 0 : _a.filter(d => d.message === message).filter(d => d.range.intersection(textEditor.selection))) === null || _b === void 0 ? void 0 : _b[0];
    }
}
exports.BacktixCodeActionProvider = BacktixCodeActionProvider;
BacktixCodeActionProvider.convertBackticksCommandId = 'backtix.convertBackticks';
BacktixCodeActionProvider.convertSingleQuotesCommandId = 'backtix.convertSingleQuotes';
BacktixCodeActionProvider.convertDoubleQuotesCommandId = 'backtix.convertDoubleQuotes';
BacktixCodeActionProvider.addPlaceholderCommandId = 'backtix.addPlaceholder';
//# sourceMappingURL=backtixCodeActionProvider.js.map