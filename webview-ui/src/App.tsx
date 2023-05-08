import SplitPane from "react-split-pane";
import "./App.css";
import DebugLogsTable from "./components/DebugLogsTable";
import DebugLogsViewer from "./components/DebugLogsViewer";

const App = () => {
    return (
        <section className="my-5 overflow-hidden">
            <div className="rounded-lg border bg-white dark:border-neutral-600 dark:bg-neutral-800">
                <div className="" style={{ maxHeight: "40vh" }}>
                    <DebugLogsTable />
                </div>
                <div className="hidden md:block mt-4 border-t dark:border-neutral-600">
                    <div className="overflow-x-auto" style={{ maxHeight: "53vh" }}>
                        <DebugLogsViewer />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default App;
