import { useAppSelector } from "@/store/auth.store";
import { Link, NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, LogIn, Plus } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

const links = [
  { to: "/?tool=link", label: "Shorten", tool: "link" },
  { to: "/?tool=qr_code", label: "QR Codes", tool: "qr_code" },
  { to: "/dashboard?tab=history", label: "History", tool: null },
];

const Navbar = ({ minimal = false }: { minimal?: boolean }) => {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();
  const activeTool = new URLSearchParams(location.search).get("tool") ?? "link";

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center gap-6">
        <Logo />

        {!minimal && (
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const active = location.pathname === "/" && link.tool === activeTool;
              return (
                <NavLink
                  key={link.label}
                  to={link.to}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
        )}

        <div className="ml-auto flex items-center gap-2">
          <span className="chip hidden lg:inline-flex">
            <span className="dot" />
            Live
          </span>
          <ThemeSwitcher />
          {!minimal &&
            (user?.name ? (
              <Link to="/dashboard" className="btn-primary">
                <LayoutDashboard className="h-4 w-4" />
                <span className="max-sm:hidden">Dashboard</span>
              </Link>
            ) : (
              <>
                <Link to="/auth/login" className="btn-ghost max-sm:hidden">
                  <LogIn className="h-4 w-4" />
                  Log in
                </Link>
                <Link to="/auth/signup" className="btn-primary">
                  <Plus className="h-4 w-4" />
                  <span>
                    Sign up<span className="max-sm:hidden"> free</span>
                  </span>
                </Link>
              </>
            ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
