import { vscode } from "../utilities/vscode";
import { useEffect, useState } from "react";
import { Log, columns } from "./logExplorer/columns";
import { DataTable } from "./logExplorer/data-table";

const DebugLogsTable = () => {
    const [data, setData] = useState<Log[] | null>(null);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        handleHowdyClick();
    }, []);

    // Handle messages sent from the extension to the webview
    window.addEventListener("message", (event) => {
        const message = event.data; // The json data that the extension sent
        switch (message.command) {
            case "constructDebugLogsTable":
                setData(JSON.parse(message.data).result);
                setLoading(false);
                break;
        }
    });

    const handleHowdyClick = () => {
        setLoading(true);
        setData(null);
        vscode.postMessage({
            command: "get-debug-logs",
        });
    };

    const convertDTtoReadable = (datetime: string) => {
        const date = new Date(datetime);
        const dateString = date.toLocaleDateString();
        const timeString = date.toLocaleTimeString();
        return `${dateString} ${timeString}`;
    };

    return <div>{data && <DataTable columns={columns} data={data} />}</div>;
};

export default DebugLogsTable;
