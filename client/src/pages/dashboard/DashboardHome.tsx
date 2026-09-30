import Navigation from "@/components/dashboard/Navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { items } from "@/utils/NavbarOptions";
import axiosInstance from "@/api/axiosInstance";
import ToastFn from "@/components/Toaster";
import Logo from "@/components/common/Logo";
import Backdrop from "@/components/common/Backdrop";
import ThemeSwitcher from "@/components/common/ThemeSwitcher";
import { useAppSelector } from "@/store/auth.store";

const DashboardHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get("tab");
  const initialTab = items.some((item) => item.query === tabFromUrl) ? (tabFromUrl as string) : "home";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Keep ?tab= in sync with the active tab without adding history entries.
  useEffect(() => {
    navigate({ pathname: location.pathname, search: `?tab=${activeTab}` }, { replace: true });
  }, [activeTab, location.pathname, navigate]);

  const handleTabClick = async (query: string) => {
    try {
      if (query === "logout") {
        const { data } = await axiosInstance.get("/api/v1/auth/user/logout");
        if (!data.success) {
          ToastFn("error", "Error", data.message);
          return;
        }
        navigate("/");
        return;
      }
    } catch (error) {
      console.error("Error updating active tab:", error);
    } finally {
      setActiveTab(query);
    }
  };

  const active = items.find((item) => item.query === activeTab);
  const initials = (user?.name ?? "Y")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <SidebarProvider className="relative">
      <Backdrop streaks={false} />
      <Sidebar className="border-sidebar-border">
        <SidebarHeader className="px-4 pb-2 pt-5">
          <Logo />
        </SidebarHeader>
        <SidebarContent className="px-2">
          <Navigation handlerClick={handleTabClick} activeTab={activeTab} />
        </SidebarContent>
        <SidebarFooter className="p-3">
          <div className="panel-inset flex items-center gap-3 p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-theme-primary font-mono text-xs font-semibold text-theme-primary-foreground">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold capitalize">{user?.name ?? "Yatifer"}</p>
              <p className="truncate font-mono text-[11px] text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border/70 bg-background/70 px-4 backdrop-blur-xl sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Dashboard <span className="mx-1 text-border">/</span>
            <span className="text-foreground">{active?.title ?? activeTab}</span>
          </p>
          <div className="ml-auto flex items-center gap-2">
            <ThemeSwitcher />
            <Link to="/" className="btn-primary">
              <Plus className="h-4 w-4" />
              <span className="max-sm:hidden">New link</span>
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {active?.component}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardHome;
