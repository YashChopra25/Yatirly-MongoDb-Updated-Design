import axiosInstance from "@/api/axiosInstance";
import ToastFn from "@/components/Toaster";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLink, FaTriangleExclamation } from "react-icons/fa6";

const Redirection = () => {
  const { shortLink } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<boolean>(false);

  const fetchRecords = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/v1/urls/${shortLink}`);
      if (!data.success) {
        setError(true);
        ToastFn("error", "Error", data.message);
        return;
      }
      window.location.replace(data?.redirectOn);
    } catch (error) {
      setError(true);
      if (isAxiosError(error)) {
        ToastFn(
          "error",
          "Error",
          error.response?.data.message || "Something went wrong"
        );
        return;
      }
      ToastFn("error", "Error", "Something went wrong");
      navigate("/");
    }
  };

  useEffect(() => {
    if (shortLink) {
      fetchRecords();
    }
  }, [shortLink]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <FaTriangleExclamation className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Invalid Link</h1>
          <p className="text-theme-primary/60 mb-6">
            The link you're trying to access doesn't exist or has expired.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/")}
            className="px-6 py-2 rounded-xl bg-theme-primary text-white hover:bg-theme-primary/90 transition-colors"
          >
            Go Home
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        {/* Logo Animation */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-20 h-20 mx-auto mb-8"
        >
          <div className="w-full h-full rounded-2xl bg-gradient-to-r from-theme-primary via-theme-secondary to-theme-accent relative overflow-hidden">
            <div className="absolute inset-0 bg-background/10 backdrop-blur-sm"></div>
            <FaLink className="absolute inset-0 m-auto w-10 h-10 text-white/80" />
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold theme-text-gradient mb-4"
        >
          Redirecting you...
        </motion.h2>

        {/* Loading Bar */}
        <motion.div
          className="h-1 bg-theme-primary/20 rounded-full max-w-[200px] mx-auto overflow-hidden"
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ 
              repeat: Infinity,
              duration: 1,
              ease: "linear"
            }}
            className="w-full h-full bg-gradient-to-r from-theme-primary via-theme-secondary to-theme-accent"
          />
        </motion.div>

        {/* Loading Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-theme-primary/60"
        >
          Please wait while we redirect you to your destination
        </motion.p>

        {/* Cancel Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => navigate("/")}
          className="mt-8 text-sm text-theme-primary/40 hover:text-theme-primary transition-colors"
        >
          Cancel Redirect
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Redirection;
