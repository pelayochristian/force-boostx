import SplitPane from "react-split-pane";
import "./App.css";
import DebugLogsTable from "./components/DebugLogsTable";
import DebugLogsViewer from "./components/DebugLogsViewer";

const App = () => {
    return (
        <SplitPane split="horizontal" defaultSize={400} primary="first">
            <div>
                <DebugLogsTable />
            </div>
            <div className="p-3">
                <DebugLogsViewer />
            </div>
        </SplitPane>
    );
};

export default App;
