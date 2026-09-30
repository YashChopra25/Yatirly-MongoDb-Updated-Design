import { cn } from "@/lib/utils";

// Fixed positions keep the streak field identical between renders.
const STREAKS = [
  { top: "8%", left: "78%", width: 180, delay: 0, dur: 6, accent: true },
  { top: "18%", left: "92%", width: 120, delay: 1.4, dur: 5, accent: false },
  { top: "30%", left: "70%", width: 220, delay: 2.6, dur: 7, accent: true },
  { top: "42%", left: "88%", width: 140, delay: 0.8, dur: 5.5, accent: false },
  { top: "54%", left: "64%", width: 200, delay: 3.2, dur: 6.5, accent: true },
  { top: "12%", left: "58%", width: 100, delay: 4.1, dur: 5, accent: false },
  { top: "66%", left: "96%", width: 160, delay: 1.9, dur: 6, accent: true },
  { top: "36%", left: "50%", width: 90, delay: 5, dur: 5, accent: false },
  { top: "74%", left: "80%", width: 130, delay: 2.2, dur: 7, accent: false },
  { top: "4%", left: "40%", width: 110, delay: 3.8, dur: 6, accent: true },
];

/** Full-viewport ambient layer: accent glow, fading grid and diagonal light streaks. */
const Backdrop = ({ className, streaks = true }: { className?: string; streaks?: boolean }) => (
  <div aria-hidden="true" className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden", className)}>
    <div
      className="absolute -left-[10%] -top-[20%] h-[70vh] w-[70vw] animate-aurora rounded-full opacity-60 blur-[120px] dark:opacity-40"
      style={{ background: "radial-gradient(closest-side, rgb(var(--tp) / 0.35), transparent)" }}
    />
    <div
      className="absolute -bottom-[25%] -right-[10%] h-[70vh] w-[60vw] animate-aurora rounded-full opacity-50 blur-[120px] [animation-delay:-9s] dark:opacity-40"
      style={{ background: "radial-gradient(closest-side, rgb(124 92 255 / 0.3), transparent)" }}
    />
    <div className="bg-grid mask-radial absolute inset-0" />
    {streaks &&
      STREAKS.map((s, i) => (
        <span
          key={i}
          className="absolute h-px animate-streak"
          style={{
            top: s.top,
            left: s.left,
            width: s.width,
            rotate: "-32deg",
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
            background: s.accent
              ? "linear-gradient(90deg, rgb(var(--tp)), transparent)"
              : "linear-gradient(90deg, rgb(139 120 255), transparent)",
            boxShadow: s.accent ? "0 0 8px rgb(var(--tp) / 0.8)" : "0 0 8px rgb(139 120 255 / 0.7)",
          }}
        />
      ))}
    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
  </div>
);

export default Backdrop;
