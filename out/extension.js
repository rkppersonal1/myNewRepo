'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const backtixCodeActionProvider_1 = require("./core/backtixCodeActionProvider");
const settings_utils_1 = require("./core/utils/settings.utils");
let backtixCodeActionProvider;
function activate(context) {
    const extensionSettings = getExtensionSettings();
    const languages = (0, settings_utils_1.getLanguages)(extensionSettings.languages);
    backtixCodeActionProvider = new backtixCodeActionProvider_1.BacktixCodeActionProvider(extensionSettings);
    backtixCodeActionProvider.activate(context.subscriptions);
    vscode.languages.registerCodeActionsProvider(languages, backtixCodeActionProvider);
}
exports.activate = activate;
function deactivate() {
    backtixCodeActionProvider.dispose();
}
exports.deactivate = deactivate;
function getExtensionSettings() {
    const extensionSettings = vscode.workspace.getConfiguration().get('backtix');
    if (extensionSettings === undefined) {
        throw new Error('BacktiX extension settings are undefined!');
    }
    return extensionSettings;
}
//# sourceMappingURL=extension.js.map