import { vscode } from "../utilities/vscode";
import { useEffect, useState } from "react";
import { Button } from "flowbite-react";

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
        <section>
            <Button color="purple" pill={true} onClick={handleHowdyClick} className="mb-4">
                Purple
            </Button>
            <div id="log-table-wrapper">
                <table className="max-h-5 w-screen text-xs text-left text-gray-500 dark:text-white">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-700">
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
                                    className=" border-b dark:bg-gray-800 dark:border-gray-700"
                                    onClick={retrieveDebugLogs}
                                    id={row.Id}>
                                    <td
                                        scope="row"
                                        className="px-2 py-2 font-light text-white whitespace-nowrap dark:text-white">
                                        {row.LogUser.Name}
                                    </td>
                                    <td className="px-2 py-2 font-light text-white whitespace-nowrap dark:text-white">
                                        {row.Application}
                                    </td>
                                    <td className="px-2 py-2 font-light text-white whitespace-nowrap dark:text-white">
                                        {row.Operation}
                                    </td>
                                    <td className="px-2 py-2 font-light text-white whitespace-nowrap dark:text-white">
                                        {convertDTtoReadable(row.StartTime)}
                                    </td>
                                    <td className="px-2 py-2 font-light text-white whitespace-nowrap dark:text-white">
                                        {row.Status}
                                    </td>
                                    <td className="px-2 py-2 font-light text-white whitespace-nowrap dark:text-white">
                                        {row.LogLength}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default DebugLogsTable;
