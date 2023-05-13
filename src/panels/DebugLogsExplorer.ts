import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn } from "vscode";
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";
import { spawn } from 'child_process';
import * as vscode from 'vscode';

/**
 * This class manages the state and behavior of HelloWorld webview panels.
 *
 * It contains all the data and methods for:
 *
 * - Creating and rendering HelloWorld webview panels
 * - Properly cleaning up and disposing of webview resources when the panel is closed
 * - Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
 * - Setting message listeners so data can be passed between the webview and extension
 */
export class DebugLogsExplorer {
	public static readonly viewType = 'calicoColors.colorsView';
	public static currentPanel: DebugLogsExplorer | undefined;
	private readonly _panel: WebviewPanel;
	private _disposables: Disposable[] = [];

	/**
	 * The DebugLogsExplorer class private constructor (called only from the render method).
	 *
	 * @param panel A reference to the webview panel
	 * @param extensionUri The URI of the directory containing the extension
	 */
	private constructor(panel: WebviewPanel, extensionUri: Uri) {

		this._panel = panel;

		// Set an event listener to listen for when the panel is disposed (i.e. when the user closes
		// the panel or when the panel is closed programmatically)
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Set the HTML content for the webview panel
		this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);

		// Set an event listener to listen for messages passed from the webview context
		this._setWebviewMessageListener(this._panel.webview);
	}

	/**
	 * Renders the current webview panel if it exists otherwise a new webview panel
	 * will be created and displayed.
	 *
	 * @param extensionUri The URI of the directory containing the extension.
	 */
	public static render(extensionUri: Uri) {
		if (DebugLogsExplorer.currentPanel) {
			// If the webview panel already exists reveal it
			DebugLogsExplorer.currentPanel._panel.reveal(ViewColumn.One);
		} else {
			// If a webview panel does not already exist create and show a new one
			const panel = window.createWebviewPanel(
				// Panel view type
				"showHelloWorld",
				// Panel title
				"Force Boost",
				// The editor column the panel should be displayed in
				ViewColumn.One,
				// Extra panel configurations
				{
					// Enable JavaScript in the webview
					enableScripts: true,
					// Restrict the webview to only load resources from the `out` and `webview-ui/build` directories
					localResourceRoots: [Uri.joinPath(extensionUri, "out"), Uri.joinPath(extensionUri, "webview-ui/build")],
				}
			);

			DebugLogsExplorer.currentPanel = new DebugLogsExplorer(panel, extensionUri);
		}
	}

	/**
	 * Cleans up and disposes of webview resources when the webview panel is closed.
	 */
	public dispose() {
		DebugLogsExplorer.currentPanel = undefined;

		// Dispose of the current webview panel
		this._panel.dispose();

		// Dispose of all disposables (i.e. commands) for the current webview panel
		while (this._disposables.length) {
			const disposable = this._disposables.pop();
			if (disposable) {
				disposable.dispose();
			}
		}
	}

	/**
	 * Method used to retrieve the Salesforce Debug Logs and pass
	 * it to the WebView.
	 */
	public getDebugLogs() {
		vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: "Processing Metadata",
			cancellable: true
		}, async (progress, token) => {
			token.onCancellationRequested(() => {
				console.log("User canceled the long running operation");
			});

			progress.report({
				message: 'Retrieving Debug Logs.',
			});

			const VERSION_NUM = '50.0';
			const targetOrg = 'chan-dev'; // Replace with the alias of your target org
			const command = `sfdx apex:log:list -o ${targetOrg} --json`;

			const process = spawn(command, { shell: true });
			let response: string = '';
			process.stdout.on('data', data => {
				console.log(`stdout: ${data}`);
				response += data.toString();
			});

			process.stderr.on('data', data => {
				console.error(`stderr: ${data}`);
			});

			return new Promise((resolve, reject) => {
				process.on('close', code => {
					console.log(`child process exited with code ${code}`);
					if (code === 0) {
						if (this._panel) {
							this._panel.webview.postMessage({ command: 'constructDebugLogsTable', data: response });
						}
						resolve(response);
					} else {
						reject(new Error(`Command execution failed with code ${code}`));
					}
				});
			});
		});
	}

	public getDebugLogById(logId: string) {
		vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: "Processing Metadata",
			cancellable: true
		}, async (progress, token) => {
			token.onCancellationRequested(() => {
				console.log("User canceled the long running operation");
			});

			progress.report({
				message: 'Retrieving Debug Log by Id.',
			});

			const targetOrg = 'chan-dev'; // Replace with the alias of your target org
			const command = `sfdx apex:log:get --logid ${logId} -o ${targetOrg} --json`;

			const process = spawn(command, { shell: true });
			let response: string = '';
			process.stdout.on('data', data => {
				console.log(`stdout: ${data}`);
				response += data.toString();
			});

			process.stderr.on('data', data => {
				console.error(`stderr: ${data}`);
			});

			return new Promise((resolve, reject) => {
				process.on('close', code => {
					console.log(`child process exited with code ${code}`);
					if (code === 0) {
						if (this._panel) {
							this._panel.webview.postMessage({ command: 'parseDebugLogById', data: response });
						}
						resolve(response);
					} else {
						reject(new Error(`Command execution failed with code ${code}`));
					}
				});
			});
		});
	}

	/**
	 * Defines and returns the HTML that should be rendered within the webview panel.
	 *
	 * @remarks This is also the place where references to the React webview build files
	 * are created and inserted into the webview HTML.
	 *
	 * @param webview A reference to the extension webview
	 * @param extensionUri The URI of the directory containing the extension
	 * @returns A template string literal containing the HTML that should be
	 * rendered within the webview panel
	 */
	private _getWebviewContent(webview: Webview, extensionUri: Uri) {
		// The CSS file from the React build output
		const stylesUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.css"]);
		// The JS file from the React build output
		const scriptUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.js"]);

		const nonce = getNonce();

		// Tip: Install the es6-string-html VS Code extension to enable code highlighting below
		return /*html*/ `
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
					<link rel="stylesheet" type="text/css" href="${stylesUri}">
					<title>Force Boost</title>
				</head>
				<body>
					<div id="root"></div>
					<script type="module" nonce="${nonce}" src="${scriptUri}"></script>
				</body>
			</html>
    `;
	}

	/**
	 * Sets up an event listener to listen for messages passed from the webview context and
	 * executes code based on the message that is recieved.
	 *
	 * @param webview A reference to the extension webview
	 * @param context A reference to the extension context
	 */
	private _setWebviewMessageListener(webview: Webview) {
		webview.onDidReceiveMessage(
			(message: any) => {
				const command = message.command;
				const data = message.data;

				switch (command) {
					case "get-debug-logs":
						// Code that should run in response to the hello message command
						// window.showInformationMessage(text);
						this.getDebugLogs();
						return;
					case 'get-debug-log-by-id':
						this.getDebugLogById(data);
						return;
					// Add more switch case statements here as more webview message commands
					// are created within the webview context (i.e. inside media/main.js)
				}
			},
			undefined,
			this._disposables
		);
	}
}
