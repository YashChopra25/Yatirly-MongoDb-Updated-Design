import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  RowData,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Copy, Download, Eye, Link2, MoreHorizontal, Plus, QrCode, Search } from "lucide-react";
import QRCodeStyling from "qr-code-styling";
import QRPreviewDialog from "./QRPreviewDialog";
import { buildQrOptions } from "@/config/qr";
import { Link } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import ToastFn from "../Toaster";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import PageHeader from "@/components/common/PageHeader";
import { cn } from "@/lib/utils";

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

type TypeFilter = "all" | "link" | "qr";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    onPreviewQr?: (item: HistoryItem) => void;
  }
}

const toShortUrl = (code: string) => `${import.meta.env.VITE_FRONTEND_URL}/${code}`;

const copy = async (text: string, what: string) => {
  await navigator.clipboard.writeText(text);
  ToastFn("success", "Copied!", `${what} copied to clipboard`);
};

const SortHeader = ({ label, sorted, onClick }: { label: string; sorted: false | "asc" | "desc"; onClick: () => void }) => (
  <button onClick={onClick} className="inline-flex items-center gap-1.5 hover:text-foreground">
    {label}
    {sorted === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className={cn("h-3 w-3", !sorted && "opacity-40")} />}
  </button>
);

const downloadQr = (item: HistoryItem) => {
  try {
    new QRCodeStyling(buildQrOptions(toShortUrl(item.ShortURL), undefined, 1024)).download({
      extension: "png",
      name: `qr-${item.ShortURL}`,
    });
  } catch (error) {
    console.error("Error downloading QR code:", error);
    ToastFn("error", "Error", "Failed to download QR code");
  }
};

const columns: ColumnDef<HistoryItem>[] = [
  {
    id: "sno",
    header: "S.No",
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      const indexOnPage = table.getRowModel().rows.findIndex((r) => r.id === row.id);
      return <span className="num text-sm text-muted-foreground">{pageIndex * pageSize + indexOnPage + 1}</span>;
    },
  },
  {
    id: "type",
    header: "Type",
    cell: ({ row, table }) =>
      row.original.isQR ? (
        <button
          type="button"
          onClick={() => table.options.meta?.onPreviewQr?.(row.original)}
          title="Preview QR code"
          aria-label="Preview QR code"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-violet-400/30 bg-violet-400/10 text-violet-400 transition-colors hover:bg-violet-400/20"
        >
          <QrCode className="h-4 w-4" />
        </button>
      ) : (
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-theme-primary/30 bg-theme-primary/10 text-accent-ink">
          <Link2 className="h-4 w-4" />
        </span>
      ),
  },
  {
    accessorKey: "ShortURL",
    header: "Short URL",
    cell: ({ row }) => {
      const shortUrl = toShortUrl(row.getValue("ShortURL"));
      return (
        <div className="flex items-center gap-1.5">
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[13px] font-medium hover:text-accent-ink"
          >
            {shortUrl.replace(/^https?:\/\//, "")}
          </a>
          <button
            onClick={() => copy(shortUrl, "Short URL")}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Copy short URL"
          >
            <Copy className="h-3.5 w-3.5" />
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
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title={url}
          className="block max-w-[280px] truncate text-sm text-muted-foreground hover:text-foreground"
        >
          {url}
        </a>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortHeader label="Created" sorted={column.getIsSorted()} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {new Date(row.getValue("createdAt")).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
    ),
  },
  {
    id: "clicks",
    accessorFn: (row) => row._count?.visits ?? 0,
    header: ({ column }) => (
      <SortHeader label="Clicks" sorted={column.getIsSorted()} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
    ),
    cell: ({ getValue }) => <span className="num text-sm font-semibold">{(getValue() as number).toLocaleString()}</span>,
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const { longURL, ShortURL, isQR } = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Open menu">
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="eyebrow px-2">Actions</DropdownMenuLabel>
            {isQR && (
              <>
                <DropdownMenuItem onClick={() => table.options.meta?.onPreviewQr?.(row.original)}>
                  <Eye /> Preview QR code
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadQr(row.original)}>
                  <Download /> Export QR (PNG)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={() => copy(longURL, "Original URL")}>
              <Copy /> Copy original URL
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => copy(toShortUrl(ShortURL), "Short URL")}>
              <Link2 /> Copy short URL
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const TableComponent = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<TypeFilter>("all");
  const [data, setData] = React.useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [previewItem, setPreviewItem] = React.useState<HistoryItem | null>(null);

  React.useEffect(() => {
    const fetchUserUrls = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance("api/v1/auth/user/fetch-urls");
        if (data.success) setData(data.data);
      } catch (error) {
        console.log("error in fetchin the data of the user-created urls", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserUrls();
  }, []);

  const counts = React.useMemo(
    () => ({
      all: data.length,
      link: data.filter((d) => !d.isQR).length,
      qr: data.filter((d) => d.isQR).length,
    }),
    [data]
  );

  const filtered = React.useMemo(
    () => (typeFilter === "all" ? data : data.filter((d) => (typeFilter === "qr" ? d.isQR : !d.isQR))),
    [data, typeFilter]
  );

  const table = useReactTable({
    data: filtered,
    columns,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, value: string) => {
      const q = value.toLowerCase();
      return row.original.longURL.toLowerCase().includes(q) || row.original.ShortURL.toLowerCase().includes(q);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, globalFilter },
    meta: { onPreviewQr: setPreviewItem },
  });

  const pills: { id: TypeFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "link", label: "Links" },
    { id: "qr", label: "QR codes" },
  ];

  const rows = table.getRowModel().rows;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="History"
        title="Link history"
        description="Every short link and QR code you've created, with live click counts."
        actions={
          <Link to="/" className="btn-primary">
            <Plus className="h-4 w-4" /> Create new
          </Link>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {pills.map((pill) => {
            const active = typeFilter === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => {
                  setTypeFilter(pill.id);
                  table.setPageIndex(0);
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {pill.label}
                <span className={cn("font-mono text-[11px]", active ? "opacity-60" : "opacity-70")}>{counts[pill.id]}</span>
              </button>
            );
          })}
        </div>
        <label className="relative w-full sm:w-72">
          <span className="sr-only">Search links</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search short or original URL"
            className="field h-10 pl-10"
          />
        </label>
      </div>

      {/* Table */}
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="border-b border-border">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/60 last:border-0">
                    <td colSpan={columns.length} className="px-4 py-3">
                      <div className="h-9 animate-pulse rounded-lg bg-secondary" />
                    </td>
                  </tr>
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-16 text-center">
                    <p className="font-semibold">Nothing here yet</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {data.length === 0 ? "Create your first short link to see it on the board." : "No links match your filters."}
                    </p>
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-accent/50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="font-mono text-xs text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="btn-ghost h-8 w-8 px-0"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="btn-ghost h-8 w-8 px-0"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <QRPreviewDialog
        url={previewItem ? toShortUrl(previewItem.ShortURL) : null}
        code={previewItem?.ShortURL}
        onOpenChange={(open) => !open && setPreviewItem(null)}
      />
    </div>
  );
};

export default TableComponent;
