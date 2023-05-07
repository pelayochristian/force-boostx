import { vscode } from "./utilities/vscode";
import {
    VSCodeButton,
    VSCodeDataGrid,
    VSCodeDataGridCell,
    VSCodeDataGridRow,
    VSCodeProgressRing,
    VSCodePanels,
    VSCodePanelTab,
    VSCodePanelView,
} from "@vscode/webview-ui-toolkit/react";
import "./App.css";
import { useEffect, useState } from "react";
import { Button, Table } from "flowbite-react";

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

const App = () => {
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
            command: "hello",
        });
    };

    return (
        <main>
            <VSCodePanels>
                <VSCodePanelTab id="tab-1">LOGS EXPLORER</VSCodePanelTab>
                <VSCodePanelTab id="tab-2">OUTPUT</VSCodePanelTab>
                <VSCodePanelTab id="tab-3">DEBUG CONSOLE</VSCodePanelTab>
                <VSCodePanelTab id="tab-4">TERMINAL</VSCodePanelTab>
                <VSCodePanelView id="view-1">
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Product name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Color
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Category
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Price
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th
                                        scope="row"
                                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        Apple MacBook Pro 17"
                                    </th>
                                    <td className="px-6 py-4">Silver</td>
                                    <td className="px-6 py-4">Laptop</td>
                                    <td className="px-6 py-4">$2999</td>
                                </tr>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th
                                        scope="row"
                                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        Microsoft Surface Pro
                                    </th>
                                    <td className="px-6 py-4">White</td>
                                    <td className="px-6 py-4">Laptop PC</td>
                                    <td className="px-6 py-4">$1999</td>
                                </tr>
                                <tr className="bg-white dark:bg-gray-800">
                                    <th
                                        scope="row"
                                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        Magic Mouse 2
                                    </th>
                                    <td className="px-6 py-4">Black</td>
                                    <td className="px-6 py-4">Accessories</td>
                                    <td className="px-6 py-4">$99</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* <section>
                        <Button color="purple" pill={true} onClick={handleHowdyClick}>
                            Purple
                        </Button>
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-white max-w-max">
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
                                            <tr className=" border-b dark:bg-gray-800 dark:border-gray-700">
                                                <td
                                                    scope="row"
                                                    className="px-2 py-2 font-normal text-white whitespace-nowrap dark:text-white">
                                                    {row.LogUser.Name}
                                                </td>
                                                <td className="px-2 py-2 font-normal text-white whitespace-nowrap dark:text-white">
                                                    {row.Application}
                                                </td>
                                                <td className="px-2 py-2 font-normal text-white whitespace-nowrap dark:text-white">
                                                    {row.Operation}
                                                </td>
                                                <td className="px-2 py-2 font-normal text-white whitespace-nowrap dark:text-white">
                                                    {row.StartTime}
                                                </td>
                                                <td className="px-2 py-2 font-normal text-white whitespace-nowrap dark:text-white">
                                                    {row.Status}
                                                </td>
                                                <td className="px-2 py-2 font-normal text-white whitespace-nowrap dark:text-white">
                                                    {row.LogLength}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </section> */}
                    test asf
                </VSCodePanelView>
                <VSCodePanelView id="view-2"> ... Insert Complex Content ... </VSCodePanelView>
                <VSCodePanelView id="view-3"> ... Insert Complex Content ... </VSCodePanelView>
                <VSCodePanelView id="view-4"> ... Insert Complex Content ... </VSCodePanelView>
            </VSCodePanels>
        </main>
    );
};

export default App;
