"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Log = {
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
};

interface LogUser {
    attributes: {
        type: string;
        url: string;
    };
    Name: string;
}

export const columns: ColumnDef<Log>[] = [
    {
        accessorKey: "LogUser.Name",
        header: "Log User",
    },
    {
        accessorKey: "Application",
        header: "Application",
    },
    {
        accessorKey: "Operation",
        header: "Operation",
    },
    {
        accessorKey: "StartTime",
        header: "Start Time",
        cell: ({ row }) => {
            const date = new Date(row.getValue("StartTime"));
            const dateString = date.toLocaleDateString();
            const timeString = date.toLocaleTimeString();
            return `${dateString} ${timeString}`;
        },
    },
    {
        accessorKey: "Status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("Status");
            return status === "Success" ? (
                <span className="text-green-300">{status}</span>
            ) : (
                <span className="text-red-300">{status}</span>
            );
        },
    },
    {
        accessorKey: "LogLength",
        header: "Size (B)",
    },
];
