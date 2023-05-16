import {
    Disposable, Webview, WebviewViewProvider,
    WebviewViewResolveContext, Uri, CancellationToken,
    WebviewView
} from "vscode";
import { getNonce } from "../utilities/getNonce";
import { getUri } from "../utilities/getUri";
import { getDebugLogById, getDebugLogs } from "../services/LogExplorerService";


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

            localResourceRoots: [this._extensionUri]
        };

        // Set the HTML content for the webview panel
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview, this._extensionUri);

        // Set an event listener to listen for messages passed from the webview context
        this._setWebviewMessageListener(this._view?.webview);
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
                if (!this._view) { return; };

                const command = message.command;
                const data = message.data;
                switch (command) {
                    case "get-debug-logs":
                        getDebugLogs(this._view);
                        return;
                    case 'get-debug-log-by-id':
                        getDebugLogById(this._view, data);
                        return;
                }
            },
            undefined,
            this._disposables
        );
    }
}