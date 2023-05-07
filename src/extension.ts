import { commands, ExtensionContext } from "vscode";
import { DebugLogsExplorer } from "./panels/DebugLogsExplorer";

export function activate(context: ExtensionContext) {
  // Create the show hello world command
  const showHelloWorldCommand = commands.registerCommand("force-boostx.showHelloWorld", () => {
    DebugLogsExplorer.render(context.extensionUri);
  });

  // Add command to the extension context
  context.subscriptions.push(showHelloWorldCommand);
}
