import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Filter } from "lucide-react";
import eventBus from "../lib/eventBus";

interface Log {
    result: Array<{
        log: string;
    }>;
}

interface LogsViewerProps {
    height: string;
}

const LogsViewer: React.FC<LogsViewerProps> = ({ height }) => {
    const [log, setLog] = useState<Log | null>(null);
    const [searchString, setSearchString] = useState<string | null>("");
    const [debugOnly, setDebugOnly] = useState(false);
    const [resetPanel, setResetPanel] = useState(false);

    useEffect(() => {
        // Subscribe reset-log-panel from eventBus.
        eventBus.subscribe("reset-log-panel", handleResetLogPanel);

        // Subscribe reset-logs-data from eventBus.
        eventBus.subscribe("reset-logs-data", handleResetLogsData);

        return () => {
            eventBus.events["reset-logs-data"] = eventBus.events["reset-logs-data"].filter(
                (callback: Function) => callback !== handleResetLogsData
            );

            eventBus.events["reset-log-panel"] = eventBus.events["reset-log-panel"].filter(
                (callback: Function) => callback !== handleResetLogPanel
            );
        };
    }, []);

    const handleResetLogsData = (isResetLogsData: boolean) => {
        if (!isResetLogsData) return;
        setLog(null);
        setResetPanel(false);
    };

    /**
     * Handle the subscribing reset-log-panel event.
     * @param isResetLogPanel
     */
    const handleResetLogPanel = (isResetLogPanel: boolean) => {
        if (!isResetLogPanel) return;
        setLog(null);
        setResetPanel(true);
    };

    /**
     * Handle messages sent from the extension to the webview
     */
    window.addEventListener("message", (event) => {
        const message = event.data; // The json data that the extension sent
        switch (message.command) {
            case "parseDebugLogById":
                setLog(JSON.parse(message.data));
                setResetPanel(false);
                break;
        }
    });

    /**
     * Handle the ChangeEvent of the Search Input.
     * @param event
     */
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchString(event.target.value);
    };

    /**
     * Handle the filtering logic for debug and normal search.
     * @returns
     */
    const filterLogs = () => {
        const logs = log?.result[0].log;
        const lines = logs?.split("\n");
        const searchLines = debugOnly
            ? lines?.filter((line) =>
                  line.toLowerCase().includes("|USER_DEBUG|".toLowerCase() as string)
              )
            : lines;
        const filteredLines = searchLines?.filter((line) =>
            line.toLowerCase().includes(searchString?.toLowerCase() as string)
        );

        return filteredLines?.join("\n");
    };

    return (
        <section style={{ position: "sticky", top: 0, zIndex: 1 }}>
            <div className="bg-background flex items-center mb-1">
                <Filter className="mr-2 h-4 w-4" />
                <Input
                    type="text"
                    value={searchString || ""}
                    onChange={handleSearchChange}
                    id="name"
                    placeholder="Search..."
                    className="max-w-full h-7 text-xs rounded-none mr-2"
                />

                <div className="flex items-center space-x-2 w-28">
                    <Checkbox
                        id="debugOnly"
                        checked={debugOnly}
                        onClick={() => setDebugOnly((prev) => !prev)}
                    />

                    <label
                        htmlFor="debugOnly"
                        className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Debug Only
                    </label>
                </div>
            </div>

            <div className="p-4 font-light" style={{ overflow: "auto", maxHeight: height }}>
                {log && (
                    <div>
                        <pre>
                            <code className="language-log">{filterLogs()}</code>
                        </pre>
                    </div>
                )}

                {!log && resetPanel && (
                    <div
                        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        Retrieving debug logs....
                    </div>
                )}
            </div>
        </section>
    );
};

export default LogsViewer;
