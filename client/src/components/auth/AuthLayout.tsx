import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import AuthNavbar from "./AuthNavbar";
import Backdrop from "@/components/common/Backdrop";

interface AuthLayoutProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  error?: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}

/** Decorative sample of what a tracked link looks like on the board. Values are illustrative. */
const PreviewCard = () => (
  <div className="panel w-full max-w-sm p-5 shadow-2xl shadow-black/40">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-theme-primary/30 bg-theme-primary/10">
          <span className="h-4 w-4 rounded-full bg-theme-primary shadow-[0_0_12px_rgb(var(--tp))]" />
        </span>
        <div>
          <p className="font-mono text-xs text-accent-ink">/launch</p>
          <p className="font-semibold">Product launch</p>
        </div>
      </div>
      <span className="rounded-md border border-border px-2 py-1 font-mono text-[10px] text-muted-foreground">
        PREVIEW
      </span>
    </div>
    <p className="num mt-5 text-4xl font-semibold">
      1,284<span className="ml-1 text-sm text-muted-foreground">clicks</span>
    </p>
    <p className="text-xs text-muted-foreground">Visits · last 30 days</p>
    <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
      <span>Mobile share</span>
      <span className="num text-accent-ink">64%</span>
    </div>
    <div className="progress-track mt-2">
      <div className="progress-fill" style={{ width: "64%" }} />
    </div>
    <div className="mt-3 flex justify-between font-mono text-[11px] text-muted-foreground">
      <span>Chrome · Android</span>
      <span>iOS · Safari</span>
    </div>
  </div>
);

const AuthLayout = ({ eyebrow, title, subtitle, error, footer, children }: AuthLayoutProps) => (
  <div className="relative flex min-h-screen flex-col">
    <Backdrop />
    <AuthNavbar />
    <div className="container grid flex-1 items-center gap-12 py-12 lg:grid-cols-2">
      {/* Showcase */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden space-y-8 lg:block"
      >
        <span className="chip">
          <span className="dot" /> Yatirly board
        </span>
        <h2 className="headline max-w-lg text-6xl leading-[0.95]">
          Every click, <span className="text-accent-ink">on the record.</span>
        </h2>
        <p className="max-w-md text-lg text-muted-foreground">
          Short links, branded QR codes and live analytics — together in one place.
        </p>
        <div className="animate-float">
          <PreviewCard />
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto w-full max-w-md"
      >
        <div className="panel relative overflow-hidden p-7 sm:p-9">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgb(var(--tp)), transparent)" }}
          />
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="headline mt-3 text-4xl">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div role="alert" className="mt-6 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-7">{children}</div>
          <div className="mt-7 border-t border-border pt-6 text-center text-sm text-muted-foreground">{footer}</div>
        </div>
      </motion.div>
    </div>
  </div>
);

export default AuthLayout;
