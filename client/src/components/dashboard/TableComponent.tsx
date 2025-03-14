"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { motion } from "framer-motion";
import {
  FaLink,
  FaQrcode,
  FaRegCopy,
  FaArrowUp,
  FaArrowDown,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";
import ToastFn from "../Toaster";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";

interface HistoryItem {
  id: string;
  ShortURL: string;
  longURL: string;
  isQR: boolean;
  createdAt: string;
  _count: {
    visits: number;
  };
}

const columns: ColumnDef<HistoryItem>[] = [
  {
    header: "Type",
    cell: ({ row }) => {
      const isQR = row.original.isQR;
      return (
        <div className="flex items-center justify-center">
          {isQR ? (
            <div className="p-2 rounded-lg bg-purple-500/10">
              <FaQrcode className="w-4 h-4 text-purple-500" />
            </div>
          ) : (
            <div className="p-2 rounded-lg bg-blue-500/10">
              <FaLink className="w-4 h-4 text-blue-500" />
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "ShortURL",
    header: "Short URL",
    cell: ({ row }) => {
      const shortUrl = `${import.meta.env.VITE_FRONTEND_URL}/${row.getValue("ShortURL")}`;
      const handleCopy = async () => {
        await navigator.clipboard.writeText(shortUrl);
        ToastFn("success", "Copied!", "URL copied to clipboard");
        setTimeout(() => {
          // Remove copiedId state as it's no longer needed
        }, 2000);
      };

      return (
        <div className="flex items-center gap-2">
          <Link
            to={shortUrl}
            target="_blank"
            className="text-sm font-medium hover:text-theme-primary transition-colors"
          >
            {shortUrl}
          </Link>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-theme-primary/10 transition-colors"
          >
            <FaRegCopy className="w-3.5 h-3.5 text-theme-primary/60" />
          </button>
        </div>
      );
    },
  },
  {
    accessorKey: "longURL",
    header: "Original URL",
    cell: ({ row }) => {
      const url = row.getValue("longURL") as string;
      return (
        <div className="max-w-[300px] truncate">
          <Link
            to={url}
            target="_blank"
            className="text-sm font-medium hover:text-theme-primary transition-colors"
            title={url}
          >
            {url}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2"
        >
          Created
          {column.getIsSorted() === "asc" ? (
            <FaArrowUp className="w-3 h-3" />
          ) : (
            <FaArrowDown className="w-3 h-3" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-sm text-theme-primary/60">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "_count",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2"
        >
          Clicks
          {column.getIsSorted() === "asc" ? (
            <FaArrowUp className="w-3 h-3" />
          ) : (
            <FaArrowDown className="w-3 h-3" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const counts: { visits: number } = row.getValue("_count");
      return (
        <div className="text-center font-medium">{counts?.visits || 0}</div>
      );
    },
  },
  {
    id: "actions",
    // enableHiding: false,
    cell: ({ row }) => {
      const ResponseType = row.original;
      const longURL = ResponseType?.longURL;
      const ShortURL = `${import.meta.env.VITE_FRONTEND_URL}/${
        ResponseType?.ShortURL
      }`;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 ">
              <span className="sr-only"> Open menu </span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="">
            <DropdownMenuLabel>Actions </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(longURL)}
            >
              Copy LongURl
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(ShortURL)}
            >
              Copy Short Url
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const TableComponent = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchUserUrls = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance("api/v1/auth/user/fetch-urls");
        if (data.success) setData(data.data);
      } catch (error) {
        console.log(
          "error in fetchin the data of the user-created urls",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserUrls();
  }, []);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  if (isLoading) {
    return <div className="w-full">Loading.........</div>;
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold theme-text-gradient">
            Link History
          </h2>
          <p className="text-theme-primary/60 mt-1">
            View and manage all your shortened URLs and QR codes
          </p>
        </div>
        <Link
          to="/"
          className="px-4 py-2 rounded-xl bg-theme-primary text-white hover:bg-theme-primary/90 transition-colors"
        >
          Create New
        </Link>
      </div>

      {/* Table */}
      <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-left p-4 text-sm font-medium text-theme-primary/60"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border/50 hover:bg-theme-primary/5 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="w-8 h-8 p-0"
            >
              <FaChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="w-8 h-8 p-0"
            >
              <FaChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-sm text-theme-primary/60">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TableComponent;
