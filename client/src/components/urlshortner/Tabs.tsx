import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LinkGenerator from "./LinkGenerator";
import QRcodeGenerator from "./QRcodeGenerator";
import { FaLink, FaArrowRight } from "react-icons/fa6";
import { BsQrCodeScan } from "react-icons/bs";
import { useTheme } from "@/context/ThemeContext";
import { useSearchParams, useNavigate } from "react-router-dom";

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description,
  isActive, 
  onClick 
}: { 
  icon: React.ElementType; 
  title: string;
  description: string;
  isActive: boolean; 
  onClick: () => void;
}) => {
  const { theme } = useTheme();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative overflow-hidden cursor-pointer rounded-2xl ${
        isActive 
          ? "bg-theme-primary shadow-lg shadow-theme-primary/25" 
          : "bg-card hover:bg-theme-primary/10 border border-border/30"
      } transition-all duration-500 group`}
    >
      {/* Glass Effect Overlay */}
      <div className={`absolute inset-0 backdrop-blur-[2px] ${
        isActive ? "bg-white/10" : "bg-background/50"
      }`} />
      
      {/* Content */}
      <div className="relative p-6 h-full">
        <div className="flex flex-col h-full">
          <div className={`p-3 rounded-xl w-fit ${
            isActive 
              ? "bg-white/20" 
              : "bg-theme-primary/10"
          }`}>
            <Icon className={`w-6 h-6 ${
              isActive 
                ? "text-white" 
                : "text-theme-primary"
            }`} />
          </div>
          
          <h3 className={`mt-4 text-xl font-semibold ${
            isActive 
              ? "text-white" 
              : "text-foreground"
          }`}>
            {title}
          </h3>
          
          <p className={`mt-2 text-sm ${
            isActive 
              ? "text-white/90" 
              : theme === 'dark' ? "text-foreground/60" : "text-foreground/80"
          }`}>
            {description}
          </p>
          
          <div className={`mt-4 flex items-center gap-2 ${
            isActive 
              ? "text-white" 
              : "text-theme-primary"
          }`}>
            <span className="text-sm font-medium">
              {isActive ? "Currently Selected" : "Click to Select"}
            </span>
            <FaArrowRight className={`w-4 h-4 transition-transform duration-300 ${
              isActive ? "translate-x-1" : "group-hover:translate-x-1"
            }`} />
          </div>
        </div>
      </div>

      {/* Animated Border */}
      {isActive && (
        <motion.div
          layoutId="activeFeature"
          className="absolute inset-0 border-2 border-theme-primary rounded-2xl"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.div>
  );
};

const ContentArea = ({ activeTab }: { activeTab: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="relative bg-card/50 rounded-2xl p-8 border border-border/30 shadow-lg dark:bg-transparent"
  >
    {/* Glass Effect */}
    <div className="absolute inset-0 bg-background/50 dark:bg-background/5 backdrop-blur-[1px] rounded-2xl" />
    
    {/* Content */}
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "link" ? <LinkGenerator /> : <QRcodeGenerator />}
        </motion.div>
      </AnimatePresence>
    </div>
  </motion.div>
);

const Tabs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get initial tab from URL or default to "link"
  const [activeTab, setActiveTab] = React.useState(() => {
    const tabFromUrl = searchParams.get("tool");
    return tabFromUrl === "qr_code" ? "qr_code" : "link";
  });

  const features = [
    {
      id: "link",
      title: "URL Shortener",
      description: "Create memorable, branded short links that drive more clicks and increase engagement.",
      icon: FaLink
    },
    {
      id: "qr_code",
      title: "QR Code Generator",
      description: "Generate dynamic QR codes that connect your physical and digital presence seamlessly.",
      icon: BsQrCodeScan
    }
  ];

  // Update URL when tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tool: tabId });
  };

  // Handle direct URL navigation
  useEffect(() => {
    const tabFromUrl = searchParams.get("tool");
    if (tabFromUrl && features.some(f => f.id === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    } else if (tabFromUrl) {
      // If invalid tab parameter, redirect to default
      navigate("/?tool=link", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="w-full space-y-6">
      {/* Feature Selection */}
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            isActive={activeTab === feature.id}
            onClick={() => handleTabChange(feature.id)}
          />
        ))}
      </div>

      {/* Content Display */}
      <ContentArea activeTab={activeTab} />
    </div>
  );
};

export default Tabs;
