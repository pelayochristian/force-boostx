import { vscode } from "../utilities/vscode";
import { useEffect, useState } from "react";
import { Log, columns } from "./logExplorer/columns";
import { DataTable } from "./logExplorer/data-table";
import eventBus from "../lib/eventBus";

const DebugLogsTable = () => {
    const [data, setData] = useState<Log[] | null>(null);

    useEffect(() => {
        getDebugLogs();

        // Subscribe reset-logs-data from eventBus.
        eventBus.subscribe("reset-logs-data", handleDataReceived);
        return () => {
            eventBus.events["reset-logs-data"] = eventBus.events["reset-logs-data"].filter(
                (callback: Function) => callback !== handleDataReceived
            );
        };
    }, []);

    const handleDataReceived = (isResetLogs: boolean) => {
        if (isResetLogs) setData([]);
    };

    // Handle messages sent from the extension to the webview
    window.addEventListener("message", (event) => {
        const message = event.data;
        // Panels Command
        switch (message.command) {
            case "constructDebugLogsTable":
                setData(JSON.parse(message.data).result);
                break;
        }
    });

    const getDebugLogs = () => {
        setData([]);
        vscode.postMessage({
            command: "get-debug-logs",
        });
    };

    return <div>{data != null && <DataTable columns={columns} data={data} />}</div>;
};

export default DebugLogsTable;
