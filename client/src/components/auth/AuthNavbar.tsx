import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import ThemeSwitcher from "@/components/common/ThemeSwitcher";

const AuthNavbar = () => {
  const { colors } = useTheme();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors duration-300"
      style={{
        backgroundColor: `${colors.background.start}80`,
        borderColor: `${colors.card.border}20`,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg theme-gradient flex items-center justify-center">
              <span className="text-white text-lg font-bold">Y</span>
            </div>
            <span className="text-xl font-bold theme-text-gradient">Yatirly</span>
          </Link>

          {/* Theme Switcher */}
          <ThemeSwitcher />
        </div>
      </div>
    </motion.nav>
  );
};

export default AuthNavbar; 