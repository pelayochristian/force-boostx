
import {
    WebviewView, window, ProgressLocation, WebviewPanel
} from "vscode";
import { spawn } from 'child_process';

const targetOrg = 'chan-dev'; // Replace with the alias of your target org

/**
  * Method used to retrieve the Salesforce Debug Logs and pass
  * it to the WebView.
  */
export const getDebugLogs = (webview: WebviewView | WebviewPanel) => {
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

        const command = `sfdx apex:log:list --json`;
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
                    if (webview) {
                        webview.webview.postMessage({ command: 'constructDebugLogsTable', data: response });
                    }
                    resolve(response);
                } else {
                    reject(new Error(`Command execution failed with code ${code}`));
                }
            });
        });
    });
};

/**
  * Method used to retrieve the Salesforce Debug Log using Id and pass
  * it to the WebView.
  */
export const getDebugLogById = (webview: WebviewView | WebviewPanel, logId: string) => {
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

        const command = `sfdx apex:log:get --logid ${logId} --json`;
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
                    if (webview) {
                        webview.webview.postMessage({ command: 'parseDebugLogById', data: response });
                    }
                    resolve(response);
                } else {
                    reject(new Error(`Command execution failed with code ${code}`));
                }
            });
        });
    });
};