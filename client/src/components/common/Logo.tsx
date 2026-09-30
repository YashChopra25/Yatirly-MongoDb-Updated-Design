import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export const LogoMark = ({ className }: { className?: string }) => (
  <span
    className={cn(
      "relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-theme-primary text-theme-primary-foreground",
      className
    )}
    style={{ boxShadow: "0 0 24px -4px rgb(var(--tp) / 0.7)" }}
  >
    {/* Same glyph as public/favicon.svg: a bold "Y" with a QR module beside the stem. */}
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <g transform="translate(-2.5 0)" fill="currentColor">
        <path
          d="M19 15.5 L32 31 L45 15.5 M32 31 V48.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="42.5" y="41" width="7.5" height="7.5" rx="2" />
      </g>
    </svg>
  </span>
);

const Logo = ({ to = "/", compact = false }: { to?: string; compact?: boolean }) => (
  <Link to={to} className="group flex items-center gap-2.5" aria-label="Yatirly home">
    <LogoMark className="transition-transform duration-300 group-hover:-rotate-6" />
    {!compact && (
      <span className="flex flex-col leading-none">
        <span className="headline text-lg uppercase tracking-[-0.02em]">Yatirly</span>
        <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
          Link launchpad
        </span>
      </span>
    )}
  </Link>
);

export default Logo;
