import SplitPane from "react-split-pane";
import "./App.css";
import DebugLogsTable from "./components/DebugLogsTable";
import DebugLogsViewer from "./components/DebugLogsViewer";
import { useState } from "react";

const App = () => {
    const [secondPanelSize, setSecondPanelSize] = useState<number | null>(400);

    return (
        <SplitPane
            split="horizontal"
            defaultSize={400}
            maxSize={400}
            primary="first"
            onChange={(size) => setSecondPanelSize(size)}
            style={{ maxHeight: "100vh", boxSizing: "border-box" }}>
            <div className="w-full h-full">
                <DebugLogsTable />
            </div>
            <div
                className="bg-neutral-800"
                style={{ height: `calc(100vh - ${secondPanelSize}px)`, overflowY: "auto" }}>
                <DebugLogsViewer />
            </div>
        </SplitPane>
    );
};

export default App;
