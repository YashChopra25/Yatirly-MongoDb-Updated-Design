import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, QrCode } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import LinkGenerator from "./LinkGenerator";
import QRcodeGenerator from "./QRcodeGenerator";
import { cn } from "@/lib/utils";

const features = [
  {
    id: "link",
    title: "URL Shortener",
    description: "Memorable short links that drive more clicks.",
    icon: Link2,
  },
  {
    id: "qr_code",
    title: "QR Studio",
    description: "Branded QR codes that bridge print and digital.",
    icon: QrCode,
  },
];

const Tabs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = React.useState(() =>
    searchParams.get("tool") === "qr_code" ? "qr_code" : "link"
  );

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tool: tabId });
  };

  useEffect(() => {
    const tabFromUrl = searchParams.get("tool");
    if (tabFromUrl && features.some((f) => f.id === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    } else if (tabFromUrl) {
      navigate("/?tool=link", { replace: true });
    }
  }, [searchParams, navigate]);

  const active = features.find((f) => f.id === activeTab) ?? features[0];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="segmented" role="tablist" aria-label="Choose a tool">
          {features.map((feature) => {
            const isActive = feature.id === activeTab;
            return (
              <button
                key={feature.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleTabChange(feature.id)}
                className={cn("segment flex items-center gap-2", isActive && "text-foreground")}
              >
                {isActive && (
                  <motion.span
                    layoutId="tool-pill"
                    className="absolute inset-0 rounded-lg border border-border bg-accent"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <feature.icon className={cn("relative h-4 w-4", isActive && "text-accent-ink")} />
                <span className="relative">{feature.title}</span>
              </button>
            );
          })}
        </div>
        <p className="hidden text-sm text-muted-foreground sm:block">{active.description}</p>
      </div>

      {/* Console */}
      <div className="panel relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-theme-primary shadow-[0_0_10px_rgb(var(--tp))]" />
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            yatirly://{activeTab === "link" ? "shorten" : "qr-studio"}
          </span>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-60"
          style={{ background: "radial-gradient(ellipse at 50% -20%, rgb(var(--tp) / 0.18), transparent 70%)" }}
        />
        <div className="relative p-5 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "link" ? <LinkGenerator /> : <QRcodeGenerator />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
