"use client"

import { ArrowUpDown, MoreHorizontal, Pencil, ScanEye } from "lucide-react";
import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { HoverCardModal } from "./HoverCardModal";

export const columns: ColumnDef<Course>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="secondary"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    size="lg"
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <Button
                    variant="secondary"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    size="lg"
                >
                    Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("price")) || "0";

            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);
            return <div className="text-left font-medium">{formatted}</div>

        },
    },
    {
        accessorKey: "isPublished",
        header: ({ column }) => {
            return (
                <Button
                    variant="secondary"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    size="lg"
                >
                    Published
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const isPublished = row.getValue('isPublished') || false;
            return (
                <Badge className={cn(
                    "bg-slate-500 text-sm",
                    isPublished ? "bg-green-700" : ""
                )}>
                    {isPublished ? "Published" : "Draft"}
                </Badge>
            )
        }
    },
    {
        accessorKey: "description",
        header: () => { },
        cell: () => { },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const { id } = row.original;
            const description = row.getValue('description');

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{"Actions"}</DropdownMenuLabel>
                        <Link href={`/teacher/courses/${id}`}>
                            <DropdownMenuItem>
                                <Pencil /> {"Edit this course"}
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <HoverCardModal value={description} />
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
