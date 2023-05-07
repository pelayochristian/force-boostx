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
                    <section>
                        <VSCodeButton onClick={handleHowdyClick}>Get Debug Logs</VSCodeButton>
                        <VSCodeDataGrid>
                            <VSCodeDataGridRow row-type="header">
                                <VSCodeDataGridCell cell-type="columnheader" grid-column="1">
                                    Application
                                </VSCodeDataGridCell>
                                <VSCodeDataGridCell cell-type="columnheader" grid-column="2">
                                    Duration (ms)
                                </VSCodeDataGridCell>
                                <VSCodeDataGridCell cell-type="columnheader" grid-column="3">
                                    Id
                                </VSCodeDataGridCell>
                                <VSCodeDataGridCell cell-type="columnheader" grid-column="4">
                                    Location
                                </VSCodeDataGridCell>
                                <VSCodeDataGridCell cell-type="columnheader" grid-column="5">
                                    Size (B)
                                </VSCodeDataGridCell>
                                <VSCodeDataGridCell cell-type="columnheader" grid-column="6">
                                    Log User
                                </VSCodeDataGridCell>
                                <VSCodeDataGridCell cell-type="columnheader" grid-column="7">
                                    Operation
                                </VSCodeDataGridCell>
                                <VSCodeDataGridCell cell-type="columnheader" grid-column="8">
                                    Request
                                </VSCodeDataGridCell>
                                <VSCodeDataGridCell cell-type="columnheader" grid-column="9">
                                    Start Time
                                </VSCodeDataGridCell>
                                <VSCodeDataGridCell cell-type="columnheader" grid-column="10">
                                    Status
                                </VSCodeDataGridCell>
                            </VSCodeDataGridRow>
                            {isLoading && !data && <VSCodeProgressRing />}

                            {!isLoading &&
                                data &&
                                data?.result.map((row) => (
                                    <VSCodeDataGridRow>
                                        <VSCodeDataGridCell grid-column="1">
                                            {row.Application}
                                        </VSCodeDataGridCell>
                                        <VSCodeDataGridCell grid-column="2">
                                            {row.DurationMilliseconds}
                                        </VSCodeDataGridCell>
                                        <VSCodeDataGridCell grid-column="3">
                                            {row.Id}
                                        </VSCodeDataGridCell>
                                        <VSCodeDataGridCell grid-column="4">
                                            {row.Location}
                                        </VSCodeDataGridCell>
                                        <VSCodeDataGridCell grid-column="5">
                                            {row.LogLength}
                                        </VSCodeDataGridCell>
                                        <VSCodeDataGridCell grid-column="6">
                                            {row.LogUser.Name}
                                        </VSCodeDataGridCell>
                                        <VSCodeDataGridCell grid-column="7">
                                            {row.Operation}
                                        </VSCodeDataGridCell>
                                        <VSCodeDataGridCell grid-column="8">
                                            {row.Request}
                                        </VSCodeDataGridCell>
                                        <VSCodeDataGridCell grid-column="9">
                                            {row.StartTime}
                                        </VSCodeDataGridCell>
                                        <VSCodeDataGridCell grid-column="10">
                                            {row.Status}
                                        </VSCodeDataGridCell>
                                    </VSCodeDataGridRow>
                                ))}
                        </VSCodeDataGrid>
                    </section>
                </VSCodePanelView>
                <VSCodePanelView id="view-2"> ... Insert Complex Content ... </VSCodePanelView>
                <VSCodePanelView id="view-3"> ... Insert Complex Content ... </VSCodePanelView>
                <VSCodePanelView id="view-4"> ... Insert Complex Content ... </VSCodePanelView>
            </VSCodePanels>
        </main>
    );
};

export default App;
