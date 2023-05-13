import { vscode } from "../utilities/vscode";
import { useEffect, useState } from "react";

interface Data {
    result: Array<{
        Application: string;
        DurationMilliseconds: number;
        Id: string;
        Location: string;
        LogLength: number;
        LogUser: LogUser;
        Operation: string;
        Request: string;
        StartTime: string;
        Status: string;
    }>;
}

interface LogUser {
    attributes: {
        type: string;
        url: string;
    };
    Name: string;
}

const DebugLogsTable = () => {
    const [data, setData] = useState<Data | null>(null);
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
                setData(JSON.parse(message.data));
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

    const retrieveDebugLogs = (event: any) => {
        const id = event.currentTarget.id;
        vscode.postMessage({
            command: "get-debug-log-by-id",
            data: id,
        });
    };

    const convertDTtoReadable = (datetime: string) => {
        const date = new Date(datetime);
        const dateString = date.toLocaleDateString();
        const timeString = date.toLocaleTimeString();
        return `${dateString} ${timeString}`;
    };

    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div className="overflow-x-auto p-4" style={{ maxHeight: "400px" }}>
                        <table className="min-w-full text-center font-light text-xs">
                            <thead className="border-b font-medium dark:border-neutral-600">
                                <tr>
                                    <th scope="col" className="px-2 py-2">
                                        Log User
                                    </th>
                                    <th scope="col" className="px-2 py-2">
                                        Application
                                    </th>
                                    <th scope="col" className="px-2 py-2">
                                        Operation
                                    </th>
                                    <th scope="col" className="px-2 py-2">
                                        Start Time
                                    </th>
                                    <th scope="col" className="px-2 py-2">
                                        Status
                                    </th>
                                    <th scope="col" className="px-2 py-2">
                                        Size (B)
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {!isLoading &&
                                    data &&
                                    data?.result.map((row) => (
                                        <tr
                                            className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-600 dark:hover:bg-neutral-600"
                                            onClick={retrieveDebugLogs}
                                            id={row.Id}>
                                            <td className="whitespace-nowrap px-6 py-2">
                                                {row.LogUser.Name}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-2">
                                                {row.Application}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-2">
                                                {row.Operation}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-2">
                                                {convertDTtoReadable(row.StartTime)}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-2">
                                                {row.Status}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-2">
                                                {row.LogLength}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DebugLogsTable;
