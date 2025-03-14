import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NavigationTypes } from "@/Types";
import { items } from "@/utils/NavbarOptions";
import { Link2, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "@/api/axiosInstance";
import ToastFn from "@/components/Toaster";
import { useAppDispatch } from "@/store/auth.store";
import { logoutFn } from "@/slices/auth.slice";

// Menu items.

const Navigation = ({ handlerClick, activeTab }: NavigationTypes) => {
  const navigate = useNavigate();
const dispatch = useAppDispatch();
  const handleLogout = async () => {
    try {
      const { data } = await axiosInstance.get("/api/v1/auth/user/logout");
      if (!data.success) {
        ToastFn("error", "Error", data.message);
        return;
      }
      navigate("/");
      dispatch(logoutFn())
    } catch (error) {
      console.error("Logout error:", error);
      ToastFn("error", "Error", "Failed to logout");
    }
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-4">
      <SidebarMenu>
        {items.map((item, index) => (
          <motion.div
            key={item.query}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <SidebarMenuItem className={activeTab === item.query ? "active" : ""}>
              <SidebarMenuButton
                asChild
                className={`
                  relative overflow-hidden rounded-xl transition-all duration-300
                  ${activeTab === item.query 
                    ? "bg-theme-primary text-white shadow-lg shadow-theme-primary/25" 
                    : "hover:bg-theme-primary/10"
                  }
                `}
              >
                <Link
                  to={`/dashboard?tab=${item.query}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handlerClick(item.query);
                  }}
                  className="p-4 flex items-center gap-3"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium capitalize">{item.query}</span>
                  {activeTab === item.query && (
                    <motion.div
                      className="absolute inset-0 bg-white/10"
                      layoutId="activeTab"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </motion.div>
        ))}

        {/* Generate New Link Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: items.length * 0.1 }}
        >
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                to="/"
                className="p-4 flex items-center gap-3 rounded-xl hover:bg-theme-primary/10 transition-all duration-300"
              >
                <Link2 className="w-5 h-5" />
                <span className="font-medium">Generate New</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: (items.length + 1) * 0.1 }}
        >
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="p-4 flex items-center gap-3 rounded-xl hover:bg-red-500/10 text-red-500 hover:text-red-500 transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </motion.div>
      </SidebarMenu>
    </div>
  );
};

export default Navigation;
