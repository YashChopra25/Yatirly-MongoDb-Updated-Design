import { motion } from "framer-motion";

const LoadingScreen = () => {

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
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
          className="w-16 h-16 mx-auto mb-8"
        >
          <div className="w-full h-full rounded-xl bg-gradient-to-r from-theme-primary via-theme-secondary to-theme-accent relative overflow-hidden">
            <div className="absolute inset-0 bg-background/10 backdrop-blur-sm"></div>
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold theme-text-gradient mb-4"
        >
          Yatirly
        </motion.h2>

        {/* Loading Animation */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="h-1 bg-gradient-to-r from-theme-primary via-theme-secondary to-theme-accent rounded-full max-w-[200px] mx-auto"
        />

        {/* Loading Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-theme-primary/60"
        >
          Please wait while we redirect you...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen; 