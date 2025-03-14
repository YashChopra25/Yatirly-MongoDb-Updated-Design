import { useAppSelector } from "@/store/auth.store";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { RiDashboardLine } from "react-icons/ri";
import { FiLogIn, FiUserPlus } from "react-icons/fi";
import ThemeSwitcher from "./ThemeSwitcher";
import { useTheme } from "@/context/ThemeContext";

const Navbar = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { colors } = useTheme();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300"
      style={{
        backgroundColor: `${colors.background.start}80`,
        borderColor: `${colors.card.border}30`,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center gap-2">
              <div className="relative">
                <div 
                  className="absolute inset-0 blur-lg rounded-full"
                  style={{ backgroundColor: `${colors.primary.from}20` }}
                />
                <span 
                  className="relative text-3xl font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${colors.primary.from}, ${colors.primary.to})`,
                  }}
                >
                  Yatirly
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            
            {user && user.name ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300"
                  style={{
                    backgroundColor: `${colors.primary.from}10`,
                    borderColor: `${colors.primary.from}30`,
                    color: colors.text.primary,
                  }}
                >
                  <RiDashboardLine className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>
              </motion.div>
            ) : (
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/auth/login" 
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300"
                    style={{
                      background: `linear-gradient(to right, ${colors.primary.from}, ${colors.primary.to})`,
                      color: colors.primary.text,
                    }}
                  >
                    <FiLogIn className="w-5 h-5" />
                    <span className="font-medium">Login</span>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/auth/signup" 
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300"
                    style={{
                      backgroundColor: `${colors.primary.from}10`,
                      borderColor: `${colors.primary.from}30`,
                      color: colors.text.primary,
                    }}
                  >
                    <FiUserPlus className="w-5 h-5" />
                    <span className="font-medium">Sign Up</span>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
