import { useState } from "react";

interface Log {
    result: Array<{
        log: string;
    }>;
}
const LogsViewer = () => {
    const [log, setLog] = useState<Log | null>(null);
    const [searchString, setSearchString] = useState<string | null>("");

    // Handle messages sent from the extension to the webview
    window.addEventListener("message", (event) => {
        const message = event.data; // The json data that the extension sent
        switch (message.command) {
            case "parseDebugLogById":
                setLog(JSON.parse(message.data));
                break;
        }
    });

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchString(event.target.value);
    };

    const filterLogs = () => {
        const logs = log?.result[0].log;
        const lines = logs?.split("\n");
        const filteredLines = lines?.filter((line) =>
            line.toLowerCase().includes(searchString?.toLowerCase() as string)
        );
        return filteredLines?.join("\n");
    };

    return (
        <section>
            <div
                className="grid grid-cols-3 gap-3 mb-4 overflow-hidden border-b border-t dark:border-neutral-600 pb-2 pl-2 pr-2 bg-neutral-800"
                style={{ position: "sticky", top: 0, zIndex: 1 }}>
                <div className="col-span-2"></div>
                <div className="col-span-2"></div>
                <div>
                    <div className="relative float-label-input">
                        <input
                            type="text"
                            value={searchString || ""}
                            onChange={handleSearchChange}
                            id="name"
                            placeholder="Search"
                            className="block w-full bg-inherit focus:outline-none focus:shadow-outline border border-neutral-600 rounded-md py-1 px-1 appearance-none leading-normal focus:border-blue-400"
                        />
                    </div>
                </div>
            </div>
            <div className="p-4">
                {log && (
                    <div>
                        <pre>
                            <code className="language-javascript">{filterLogs()}</code>
                        </pre>
                    </div>
                )}
            </div>
        </section>
    );
};

export default LogsViewer;
