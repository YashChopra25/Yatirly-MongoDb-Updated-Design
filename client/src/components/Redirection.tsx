import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "@/api/axiosInstance";
import ToastFn from "./Toaster";
import { FaLink, FaArrowRight } from "react-icons/fa6";

const Redirection = () => {
  const { shortId } = useParams();
  const navigate = useNavigate();
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(3);

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/v1/urls/${shortId}`);
        if (data.success) {
          setUrl(data.data.longURL);
          // Start countdown
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                window.location.href = data.data.longURL;
              }
              return prev - 1;
            });
          }, 1000);

          return () => clearInterval(timer);
        } else {
          setError(true);
          ToastFn("error", "Error", data.message);
        }
      } catch (error) {
        setError(true);
        ToastFn("error", "Error", "Invalid URL or something went wrong");
      }
    };

    fetchUrl();
  }, [shortId]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <FaLink className="w-8 h-8 text-red-500" />
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
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full mx-auto px-4"
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
          <div className="w-full h-full rounded-2xl theme-gradient relative overflow-hidden">
            <div className="absolute inset-0 bg-background/10 backdrop-blur-sm"></div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-8 text-center">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold theme-text-gradient mb-4"
          >
            Redirecting you to your destination
          </motion.h1>

          {/* URL Display */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="max-w-md truncate text-theme-primary/60">
              {url}
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="relative">
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 3, ease: "linear" }}
              className="h-1 theme-gradient rounded-full"
            />
          </div>

          {/* Countdown and Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex items-center justify-center gap-2 text-theme-primary/60"
          >
            <span>Redirecting in {countdown} seconds</span>
            <FaArrowRight className="animate-bounce-x" />
          </motion.div>

          {/* Safety Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-sm text-theme-primary/40"
          >
            Make sure you trust this link before proceeding
          </motion.p>
        </div>

        {/* Cancel Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <button
            onClick={() => navigate("/")}
            className="text-theme-primary/60 hover:text-theme-primary transition-colors"
          >
            Cancel Redirect
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Redirection; 