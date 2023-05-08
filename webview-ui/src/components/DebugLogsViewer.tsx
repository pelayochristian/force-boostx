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
        <div className="p-4">
            {log && (
                <div>
                    <pre>
                        <p className="language-javascript">{log?.result[0].log}</p>
                    </pre>
                </div>
            )}
        </div>
        // </section>
    );
};

export default DebugLogsViewer;
