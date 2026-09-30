import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { NavigationTypes } from "@/Types";
import { items } from "@/utils/NavbarOptions";
import { Link2, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "@/api/axiosInstance";
import ToastFn from "@/components/Toaster";
import { useAppDispatch } from "@/store/auth.store";
import { logoutFn } from "@/slices/auth.slice";
import { cn } from "@/lib/utils";

const rowClass =
  "relative h-11 gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";

const Navigation = ({ handlerClick, activeTab }: NavigationTypes) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { setOpenMobile } = useSidebar();

  const handleLogout = async () => {
    try {
      const { data } = await axiosInstance.get("/api/v1/auth/user/logout");
      if (!data.success) {
        ToastFn("error", "Error", data.message);
        return;
      }
      navigate("/");
      dispatch(logoutFn());
    } catch (error) {
      console.error("Logout error:", error);
      ToastFn("error", "Error", "Failed to logout");
    }
  };

  return (
    <div className="flex h-full flex-col gap-6 py-3">
      <div className="space-y-2">
        <p className="eyebrow px-3">Board</p>
        <SidebarMenu className="gap-1">
          {items.map((item) => {
            const isActive = activeTab === item.query;
            return (
              <SidebarMenuItem key={item.query}>
                <SidebarMenuButton asChild className={cn(rowClass, isActive && "text-foreground hover:bg-transparent")}>
                  <Link
                    to={`/dashboard?tab=${item.query}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handlerClick(item.query);
                      setOpenMobile(false);
                    }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="dashboard-nav"
                        className="absolute inset-0 rounded-xl border border-border bg-accent"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      />
                    )}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-theme-primary shadow-[0_0_10px_rgb(var(--tp))]" />
                    )}
                    <item.icon className={cn("relative h-[18px] w-[18px]", isActive && "text-accent-ink")} />
                    <span className="relative">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </div>

      <div className="space-y-2">
        <p className="eyebrow px-3">Tools</p>
        <SidebarMenu className="gap-1">
          <SidebarMenuItem>
            <SidebarMenuButton asChild className={rowClass}>
              <Link to="/">
                <Link2 className="h-[18px] w-[18px]" />
                <span>Generate new</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className={cn(rowClass, "text-destructive hover:bg-destructive/10 hover:text-destructive")}
            >
              <LogOut className="h-[18px] w-[18px]" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </div>
  );
};

export default Navigation;
