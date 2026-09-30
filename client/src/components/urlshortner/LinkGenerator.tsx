import React from "react";
import ToastFn from "@/components/Toaster";
import axiosInstance, { ApiResponse } from "@/api/axiosInstance";
import { ApiResponseCreateLink } from "@/Types";
import { isAxiosError } from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Copy, ExternalLink, Link2 } from "lucide-react";
import Spinner from "@/components/common/Spinner";

interface GeneratedLink {
  short: string;
  long: string;
}

const shortenDisplay = (url: string, max = 38) =>
  url.length > max ? `${url.slice(0, max - 12)}…${url.slice(-10)}` : url;

const LinkGenerator = () => {
  const [inputValue, setInputValue] = React.useState("");
  const [links, setLinks] = React.useState<GeneratedLink[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [copied, setCopied] = React.useState<string | null>(null);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() === "") {
      ToastFn("error", "Error", "Please enter a valid link");
      return;
    }
    setIsLoading(true);
    try {
      const { data: responseData } = await axiosInstance.post<ApiResponse<ApiResponseCreateLink>>(
        "/api/v1/urls/create",
        { longUrl: inputValue }
      );
      if (!responseData.success) {
        ToastFn("error", "Failed", responseData.message);
        return;
      }
      if (!responseData.data) return;
      const short = `${import.meta.env.VITE_FRONTEND_URL}/${responseData.data.ShortURL as string}`;
      setLinks((prev) => [{ short, long: inputValue }, ...prev.filter((l) => l.short !== short)].slice(0, 4));
      setInputValue("");
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        ToastFn("error", "Error", error.response?.data.message || "Something went wrong");
      } else {
        ToastFn("error", "Error", "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
    ToastFn("success", "Success", "Link copied to clipboard!");
  };

  const [latest, ...earlier] = links;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="headline text-3xl sm:text-4xl">Transform your links.</h2>
        <p className="text-muted-foreground">Paste a long URL and get a short one instantly.</p>
      </div>

      <form onSubmit={submitHandler} className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Long URL</span>
          <Link2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            id="shorterURL-link"
            placeholder="https://paste-a-very-long-link.com/goes/here"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required
            className="field h-14 pl-11 font-mono text-[13px]"
          />
        </label>
        <button type="submit" disabled={isLoading} className="btn-primary h-14 px-6 text-[15px]">
          {isLoading ? (
            <>
              <Spinner /> Generating…
            </>
          ) : (
            <>
              Shorten link <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <AnimatePresence mode="popLayout">
        {latest && (
          <motion.div
            key={latest.short}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="glow relative overflow-hidden rounded-2xl border border-theme-primary/40 bg-background/70 p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="eyebrow text-accent-ink">
                <span className="dot" /> Short link ready
              </span>
              <span className="rounded-md border border-border px-2 py-1 font-mono text-[11px] text-muted-foreground" title={latest.long}>
                FROM {shortenDisplay(latest.long, 30)}
              </span>
            </div>
            <a
              href={latest.short}
              target="_blank"
              rel="noopener noreferrer"
              className="num mt-4 block break-all text-2xl font-semibold hover:text-accent-ink sm:text-3xl"
            >
              {latest.short.replace(/^https?:\/\//, "")}
            </a>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={() => handleCopy(latest.short)} className="btn-primary">
                {copied === latest.short ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === latest.short ? "Copied" : "Copy link"}
              </button>
              <a href={latest.short} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                Open <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {earlier.length > 0 && (
        <div className="space-y-3">
          <p className="eyebrow">Earlier this session</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {earlier.map((link) => (
              <div key={link.short} className="panel-inset flex items-center justify-between gap-3 p-3">
                <div className="min-w-0">
                  <p className="num truncate text-sm">{link.short.replace(/^https?:\/\//, "")}</p>
                  <p className="truncate text-xs text-muted-foreground">{link.long}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(link.short)}
                  className="shrink-0 rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                  aria-label="Copy short link"
                >
                  {copied === link.short ? <Check className="h-4 w-4 text-accent-ink" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkGenerator;
