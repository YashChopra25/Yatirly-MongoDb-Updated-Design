import { useState, useEffect } from "react";
import Navigation from "./Navigation";
import { items } from "@/utils/NavbarOptions";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/auth.store";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  
  // Get the intended path from state if it exists
  const intendedPath = location.state?.from?.pathname || "";
  const intendedSearch = location.state?.from?.search || "";

  const [activeTab, setActiveTab] = useState(() => {
    // If there's an intended path, extract the tab
    if (intendedPath === "/dashboard") {
      const params = new URLSearchParams(intendedSearch);
      const tabFromIntent = params.get("tab");
      if (tabFromIntent && items.some(item => item.query === tabFromIntent)) {
        return tabFromIntent;
      }
    }

    // Otherwise, get tab from current URL
    const params = new URLSearchParams(location.search);
    const tabFromUrl = params.get("tab");
    return tabFromUrl && items.some(item => item.query === tabFromUrl) 
      ? tabFromUrl 
      : "home";
  });

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      // Save the intended path including the tab
      navigate("/auth/login", { 
        state: { from: { pathname: "/dashboard", search: `?tab=${activeTab}` } },
        replace: true 
      });
      return;
    }

    // Handle direct navigation to specific tabs
    const params = new URLSearchParams(location.search);
    const tabFromUrl = params.get("tab");
    
    if (tabFromUrl && items.some(item => item.query === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    } else if (location.pathname === "/dashboard" && !tabFromUrl) {
      // If no tab specified, redirect to home tab
      navigate("/dashboard?tab=home", { replace: true });
    }
  }, [user, isLoading, location, navigate]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    navigate(`/dashboard?tab=${tab}`, { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-theme-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold theme-text-gradient">Dashboard</h1>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[280px,1fr] gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)]"
          >
            <Navigation handlerClick={handleTabClick} activeTab={activeTab} />
          </motion.div>

          {/* Main Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="min-h-[calc(100vh-8rem)]"
          >
            {items.find((item) => item.query === activeTab)?.component}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 