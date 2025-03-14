import React, { useState } from "react";
import { isAxiosError } from "axios";
import axiosInstance, { ApiResponse } from "@/api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { FiMail, FiLock, FiUser, FiArrowRight } from "react-icons/fi";
import AuthNavbar from "@/components/auth/AuthNavbar";

const Signup: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { colors } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await axiosInstance.post<ApiResponse<unknown>>(
        "/api/v1/auth/user/create",
        { name, email, password }
      );

      if (!data.success) {
        setError(data.message);
        return;
      }

      navigate("/dashboard");
    } catch (error: unknown) {
      let message = "An error occurred during signup. Please try again.";
      if (isAxiosError(error)) {
        message = error.response?.data.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthNavbar />
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background pt-16">
        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Animated gradient circles */}
          <div 
            className="absolute top-0 -left-4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"
            style={{ background: `linear-gradient(45deg, ${colors.primary.from}30, ${colors.primary.to}30)` }}
          />
          <div 
            className="absolute -top-4 -right-4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"
            style={{ background: `linear-gradient(135deg, ${colors.primary.to}30, ${colors.primary.from}30)` }}
          />
          <div 
            className="absolute -bottom-8 left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"
            style={{ background: `linear-gradient(225deg, ${colors.primary.from}30, ${colors.primary.to}30)` }}
          />
          
          {/* Grid pattern overlay */}
          <div 
            className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"
            style={{ 
              maskImage: 'radial-gradient(circle at center, transparent 0%, black 100%)',
              WebkitMaskImage: 'radial-gradient(circle at center, transparent 0%, black 100%)'
            }}
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative px-4"
        >
          <div 
            className="backdrop-blur-xl rounded-3xl p-8 shadow-2xl border"
            style={{ 
              backgroundColor: `${colors.background.start}70`,
              borderColor: `${colors.card.border}20`,
            }}
          >
            {/* Logo or Brand Icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl theme-gradient flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1 
                }}
                className="text-white text-2xl font-bold"
              >
                Y
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h2 className="text-4xl font-bold theme-text-gradient mb-3">Create Account</h2>
              <p className="text-foreground/60">Join us and start your journey</p>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6"
              >
                <p className="text-red-500 text-center text-sm">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div 
                className="relative group"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 transition-colors duration-200 text-foreground/40 group-focus-within:text-theme-primary" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 border bg-background/50 rounded-xl transition-all duration-200 placeholder:text-foreground/40 focus:outline-none"
                  style={{ 
                    borderColor: `${colors.card.border}30`,
                    '--theme-primary': colors.primary.from,
                  } as React.CSSProperties}
                  placeholder="Enter your name"
                />
                <div 
                  className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-200 opacity-0 group-focus-within:opacity-100"
                  style={{ 
                    boxShadow: `0 0 0 2px ${colors.primary.from}30`,
                  }}
                />
              </motion.div>

              <motion.div 
                className="relative group"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 transition-colors duration-200 text-foreground/40 group-focus-within:text-theme-primary" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 border bg-background/50 rounded-xl transition-all duration-200 placeholder:text-foreground/40 focus:outline-none"
                  style={{ 
                    borderColor: `${colors.card.border}30`,
                    '--theme-primary': colors.primary.from,
                  } as React.CSSProperties}
                  placeholder="Enter your email"
                />
                <div 
                  className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-200 opacity-0 group-focus-within:opacity-100"
                  style={{ 
                    boxShadow: `0 0 0 2px ${colors.primary.from}30`,
                  }}
                />
              </motion.div>

              <motion.div 
                className="relative group"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 transition-colors duration-200 text-foreground/40 group-focus-within:text-theme-primary" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 border bg-background/50 rounded-xl transition-all duration-200 placeholder:text-foreground/40 focus:outline-none"
                  style={{ 
                    borderColor: `${colors.card.border}30`,
                    '--theme-primary': colors.primary.from,
                  } as React.CSSProperties}
                  autoComplete="off"
                  placeholder="Create a password"
                />
                <div 
                  className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-200 opacity-0 group-focus-within:opacity-100"
                  style={{ 
                    boxShadow: `0 0 0 2px ${colors.primary.from}30`,
                  }}
                />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="relative w-full py-3.5 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                style={{
                  background: `linear-gradient(to right, ${colors.primary.from}, ${colors.primary.to})`,
                  color: colors.primary.text,
                }}
              >
                <div className="relative flex items-center justify-center">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign Up</span>
                      <FiArrowRight className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </div>
              </motion.button>
            </form>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center text-foreground/60"
            >
              Already have an account?{" "}
              <Link 
                to="/auth/login" 
                className="font-medium hover:underline theme-text-gradient"
              >
                Log in
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Signup;
