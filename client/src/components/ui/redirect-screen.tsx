import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface RedirectScreenProps {
  to: string;
  message?: string;
  delay?: number;
}

const RedirectScreen: React.FC<RedirectScreenProps> = ({ 
  to, 
  message = "Redirecting you to the right place...",
  delay = 2000 
}) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(delay / 1000);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(to, { replace: true });
    }, delay);

    const countdownInterval = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [to, delay, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto px-4"
      >
        {/* Icon */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-16 h-16 mx-auto mb-8 text-theme-primary"
        >
          <div className="w-full h-full rounded-full border-4 border-current border-t-transparent animate-spin" />
        </motion.div>

        {/* Message */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-semibold mb-3"
        >
          {message}
        </motion.h2>

        {/* Countdown */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-theme-primary/60"
        >
          Redirecting in {countdown} seconds...
        </motion.p>

        {/* Progress Bar */}
        <motion.div
          className="h-1 bg-theme-primary/20 rounded-full mt-6 overflow-hidden"
        >
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ 
              duration: delay / 1000,
              ease: "linear"
            }}
            className="h-full bg-theme-primary rounded-full"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RedirectScreen; 