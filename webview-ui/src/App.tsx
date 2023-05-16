import SplitPane from "react-split-pane";
import "./App.css";
import DebugLogsTable from "./components/DebugLogsTable";
import LogsViewer from "./components/LogsViewer";
import { useState } from "react";

const App = () => {
    const [secondPanelSize, setSecondPanelSize] = useState<number | null>(300);

    return (
        <SplitPane
            split="horizontal"
            defaultSize={300}
            maxSize={300}
            primary="first"
            onChange={(size) => setSecondPanelSize(size)}
            style={{ maxHeight: "100vh", boxSizing: "border-box" }}>
            <div
                className="w-full"
                style={{ maxHeight: `${secondPanelSize}px`, overflowY: "auto" }}>
                <DebugLogsTable />
            </div>
            <div
                className="logViewerPanel"
                style={{ height: `calc(100vh - ${secondPanelSize}px)` }}>
                {secondPanelSize && (
                    <LogsViewer height={`calc((100vh - 32px) - ${secondPanelSize}px)`} />
                )}
            </div>
        </SplitPane>
    );
};

export default App;
