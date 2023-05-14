"use client";
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
    getPaginationRowModel,
    getSortedRowModel,
} from "@tanstack/react-table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Log } from "./columns";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    });

    const retrieveDebugLogs = (event: any) => {
        const id = event.currentTarget.id;
        vscode.postMessage({
            command: "get-debug-log-by-id",
            data: id,
        });
    };

    return (
        <div>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter Log User..."
                    value={(table.getColumn("LogUser_Name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("LogUser_Name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm h-8"
                />
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
                                        onClick={retrieveDebugLogs}>
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

            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}>
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}>
                    Next
                </Button>
            </div>
        </div>
    );
}
