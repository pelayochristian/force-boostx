import {
    Disposable, Webview, WebviewViewProvider,
    WebviewViewResolveContext, Uri, CancellationToken,
    WebviewView, window, ProgressLocation
} from "vscode";
import { getNonce } from "../utilities/getNonce";
import { getUri } from "../utilities/getUri";
import { spawn } from 'child_process';


export class LogsExplorerProvider implements WebviewViewProvider {

    public static readonly viewType = 'calicoColors.colorsView';
    private _view?: WebviewView;
    private _disposables: Disposable[] = [];

    constructor(private readonly _extensionUri: Uri,) { }

    public resolveWebviewView(webviewView: WebviewView, context: WebviewViewResolveContext, _token: CancellationToken,) {
        this._view = webviewView;

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,

            localResourceRoots: [this._extensionUri ]
        };

        // Set the HTML content for the webview panel
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview, this._extensionUri);

        // Set an event listener to listen for messages passed from the webview context
        this._setWebviewMessageListener(this._view?.webview);
    }

    /**
     * Method used to retrieve the Salesforce Debug Logs and pass
     * it to the WebView.
     */
    public getDebugLogs() {
        window.withProgress({
            location: ProgressLocation.Notification,
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
                        if (this._view) {
                            this._view.webview.postMessage({ command: 'constructDebugLogsTable', data: response });
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
        window.withProgress({
            location: ProgressLocation.Notification,
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
                        if (this._view) {
                            this._view.webview.postMessage({ command: 'parseDebugLogById', data: response });
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
    private _getHtmlForWebview(webview: Webview, extensionUri: Uri) {
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