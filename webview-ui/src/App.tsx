import SplitPane from "react-split-pane";
import "./App.css";
import DebugLogsTable from "./components/DebugLogsTable";
import LogsViewer from "./components/LogsViewer";
import { useState } from "react";

const App = () => {
    const [secondPanelSize, setSecondPanelSize] = useState<number | null>(400);

    return (
        <SplitPane
            split="horizontal"
            defaultSize={490}
            maxSize={490}
            primary="first"
            onChange={(size) => setSecondPanelSize(size)}
            style={{ maxHeight: "100vh", boxSizing: "border-box" }}>
            <div className="w-full border border-teal-300 border-1">
                <DebugLogsTable />
            </div>
            <div
                className="logViewerPanel"
                style={{ height: `calc(100vh - ${secondPanelSize}px)`, overflowY: "auto" }}>
                <LogsViewer />
            </div>
        </SplitPane>
    );
};

export default App;
