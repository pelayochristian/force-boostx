import { useState } from "react";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Filter } from "lucide-react";

interface Log {
    result: Array<{
        log: string;
    }>;
}
const LogsViewer = () => {
    const [log, setLog] = useState<Log | null>(null);
    const [searchString, setSearchString] = useState<string | null>("");
    const [debugOnly, setDebugOnly] = useState(false);

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
        const searchLines = debugOnly
            ? lines?.filter((line) => line.toLowerCase().includes("DEBUG".toLowerCase() as string))
            : lines;
        const filteredLines = searchLines?.filter((line) =>
            line.toLowerCase().includes(searchString?.toLowerCase() as string)
        );

        return filteredLines?.join("\n");
    };

    return (
        <section>
            <div
                className="bg-background flex items-center mb-1"
                style={{ position: "sticky", top: 0, zIndex: 1 }}>
                <Filter className="mr-2 h-4 w-4" />
                <Input
                    type="text"
                    value={searchString || ""}
                    onChange={handleSearchChange}
                    id="name"
                    placeholder="Search..."
                    className="max-w-full h-7 text-xs rounded-none mr-2"
                />

                <div className="flex items-center space-x-2 w-28">
                    <Checkbox
                        id="debugOnly"
                        checked={debugOnly}
                        onClick={() => setDebugOnly((prev) => !prev)}
                    />

                    <label
                        htmlFor="debugOnly"
                        className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Debug Only
                    </label>
                </div>
            </div>

            <div className="p-4 font-light">
                {log && (
                    <div>
                        <pre>
                            <code className="language-log">{filterLogs()}</code>
                        </pre>
                    </div>
                )}
            </div>
        </section>
    );
};

export default LogsViewer;
