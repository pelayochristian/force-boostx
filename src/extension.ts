import { commands, ExtensionContext } from "vscode";
import * as vscode from 'vscode';
import { DebugLogsExplorer } from "./panels/DebugLogsExplorer";
import { LogsExplorerProvider } from "./providers/LogsExplorerProvider";

export function activate(context: ExtensionContext) {
	// Custom Provider
	const provider = new LogsExplorerProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(LogsExplorerProvider.viewType, provider));

	// Create the show hello world command
	const showHelloWorldCommand = commands.registerCommand("force-boostx.showLogExplorer", () => {
		DebugLogsExplorer.render(context.extensionUri);
	});

	// Add command to the extension context
	context.subscriptions.push(showHelloWorldCommand);
}
