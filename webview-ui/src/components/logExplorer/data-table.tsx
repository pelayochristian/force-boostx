import { vscode } from "../../utilities/vscode";
import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
    getSortedRowModel,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RefreshCw, Filter } from "lucide-react";
import { Log } from "./columns";
import eventBus from "../../lib/eventBus";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    });

    window.addEventListener("message", (event) => {
        const message = event.data;
        switch (message.command) {
            case "constructDebugLogsTable":
                setIsLoading(false);
                break;
        }
    });

    const getDebugLogById = (event: any) => {
        const id = event.currentTarget.id;
        vscode.postMessage({
            command: "get-debug-log-by-id",
            data: id,
        });
    };

    const getDebugLogs = () => {
        eventBus.emit("reset-logs-data", true);
        setIsLoading(true);

        vscode.postMessage({
            command: "get-debug-logs",
        });
    };

    return (
        <div>
            <div
                className="flex items-center mb-1 bg-background"
                style={{ position: "sticky", top: 0, zIndex: 1 }}>
                <Filter className="mr-2 h-4 w-4" />
                <Input
                    placeholder="Search Log User..."
                    value={(table.getColumn("LogUser_Name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("LogUser_Name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-full h-7 text-xs rounded-none"
                />
                <Button className="h-7 rounded-none text-xs" onClick={getDebugLogs}>
                    {/* <RefreshCw className="mr-2 h-4 w-4" /> Retrieve */}
                    {isLoading ? (
                        "Loading..."
                    ) : (
                        <>
                            <RefreshCw className="mr-2 h-4 w-4" /> Retrieve
                        </>
                    )}
                </Button>
            </div>
            <div className="rounded-md border">
                <Table className="text-xs font-light">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="h-8">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => {
                                // get the original data for this row
                                const original = row.original as Log;
                                // assign the original Id to the row's key
                                const rowId = original.Id;
                                return (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        id={rowId}
                                        onClick={getDebugLogById}>
                                        {row.getVisibleCells().map((cell) => {
                                            return (
                                                <TableCell key={cell.id} className="p-2">
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
