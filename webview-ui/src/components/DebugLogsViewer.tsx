import { useState } from "react";

interface Log {
    result: Array<{
        log: string;
    }>;
}
const DebugLogsViewer = () => {
    const [log, setLog] = useState<Log | null>(null);

    // Handle messages sent from the extension to the webview
    window.addEventListener("message", (event) => {
        const message = event.data; // The json data that the extension sent
        switch (message.command) {
            case "parseDebugLogById":
                setLog(JSON.parse(message.data));
                break;
        }
    });

    return (
        <div className="flex rounded-lg border border-gray-700 bg-gray-800 shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col">
            <div className="flex h-full flex-col justify-center gap-4 p-6">
                {log && (
                    <pre className="font-light">
                        <code className="language-javascript">{log?.result[0].log}</code>
                    </pre>
                )}
            </div>
        </div>
    );
};

export default DebugLogsViewer;
