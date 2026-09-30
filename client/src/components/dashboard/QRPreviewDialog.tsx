import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import QRCodeStyling, { FileExtension } from "qr-code-styling";
import { Copy, Download, X } from "lucide-react";
import { buildQrOptions, qrFormats, qrPalette } from "@/config/qr";
import ToastFn from "@/components/Toaster";
import { cn } from "@/lib/utils";

interface QRPreviewDialogProps {
  /** Full short URL the QR code encodes; null closes the dialog. */
  url: string | null;
  /** Short code, used for the downloaded file name. */
  code?: string;
  onOpenChange: (open: boolean) => void;
}

const QRPreviewDialog = ({ url, code, onOpenChange }: QRPreviewDialogProps) => {
  const qrRef = useRef<QRCodeStyling | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [color, setColor] = useState(qrPalette[0].name);
  const [fileExt, setFileExt] = useState<FileExtension>("png");

  const selected = qrPalette.find((p) => p.name === color) ?? qrPalette[0];

  // Radix mounts the content lazily, so render into the container once it exists.
  useEffect(() => {
    if (!url || !container) return;
    const options = buildQrOptions(url, selected.color, 260);
    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(options);
    } else {
      qrRef.current.update(options);
    }
    container.innerHTML = "";
    qrRef.current.append(container);
  }, [url, container, selected.color]);

  const handleOpenChange = (open: boolean) => {
    if (!open) qrRef.current = null;
    onOpenChange(open);
  };

  const handleDownload = () => {
    if (!url) return;
    try {
      // Export at a larger size than the on-screen preview for print quality.
      new QRCodeStyling(buildQrOptions(url, selected.color, 1024)).download({
        extension: fileExt,
        name: `qr-${code ?? "yatirly"}`,
      });
    } catch (error) {
      console.error("Error downloading QR code:", error);
      ToastFn("error", "Error", "Failed to download QR code");
    }
  };

  const handleCopy = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    ToastFn("success", "Copied!", "Short URL copied to clipboard");
  };

  return (
    <Dialog.Root open={Boolean(url)} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="panel fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-card p-6 shadow-2xl shadow-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">
                <span className="dot" /> QR preview
              </p>
              <Dialog.Title className="headline mt-2 text-2xl">Scan or export</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                Pick a palette and format, then download.
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div className="panel-inset relative mt-5 flex justify-center p-5">
            <div className="relative overflow-hidden rounded-2xl bg-white p-2 shadow-[0_20px_60px_-20px_rgb(var(--tp)/0.5)]">
              <div ref={setContainer} className="[&_svg]:h-auto [&_svg]:max-w-full" />
              <span className="absolute inset-x-0 h-0.5 animate-scan bg-theme-primary shadow-[0_0_14px_rgb(var(--tp))]" />
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 font-mono text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            title="Copy short URL"
          >
            <span className="truncate">{url?.replace(/^https?:\/\//, "")}</span>
            <Copy className="h-3.5 w-3.5 shrink-0" />
          </button>

          <div className="mt-5 space-y-2">
            <p className="eyebrow">Palette</p>
            <div className="flex flex-wrap gap-2">
              {qrPalette.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setColor(p.name)}
                  aria-label={p.name}
                  aria-pressed={color === p.name}
                  title={p.name}
                  className={cn(
                    "h-7 w-7 rounded-full ring-offset-2 ring-offset-card transition-all",
                    color === p.name ? "ring-2 ring-theme-primary" : "ring-1 ring-border hover:scale-110"
                  )}
                  style={{ background: `linear-gradient(135deg, ${p.gradient.from}, ${p.gradient.to})` }}
                />
              ))}
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <p className="eyebrow">Export</p>
            <div className="flex flex-wrap items-center gap-2">
              <div className="segmented">
                {qrFormats.map((ext) => (
                  <button
                    key={ext}
                    type="button"
                    onClick={() => setFileExt(ext)}
                    className={cn("segment font-mono text-xs uppercase", fileExt === ext && "bg-accent text-foreground")}
                  >
                    {ext}
                  </button>
                ))}
              </div>
              <button type="button" onClick={handleDownload} className="btn-primary h-10 flex-1">
                <Download className="h-4 w-4" /> Export
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default QRPreviewDialog;
