import axiosInstance from "@/api/axiosInstance";
import ToastFn from "@/components/Toaster";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, TriangleAlert } from "lucide-react";
import Backdrop from "@/components/common/Backdrop";
import SignalLoader from "@/components/common/SignalLoader";

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
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <Backdrop streaks={false} />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel w-full max-w-md p-8 text-center"
        >
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive">
            <TriangleAlert className="h-6 w-6" />
          </span>
          <p className="eyebrow mt-6 justify-center">Error · 404</p>
          <h1 className="headline mt-2 text-3xl">Invalid link</h1>
          <p className="mt-2 text-muted-foreground">
            The link you're trying to access doesn't exist or has expired.
          </p>
          <p className="num mt-4 rounded-lg border border-border bg-background/60 px-3 py-2 text-sm text-muted-foreground">
            /{shortLink}
          </p>
          <button onClick={() => navigate("/")} className="btn-primary mt-6 w-full">
            Go home <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-8 p-4 text-center">
      <Backdrop />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <SignalLoader />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-3">
        <p className="eyebrow justify-center">
          <span className="dot" /> Resolving /{shortLink}
        </p>
        <h2 className="headline text-4xl">Redirecting you…</h2>
        <p className="text-muted-foreground">Please wait while we redirect you to your destination.</p>
      </motion.div>
      <div className="progress-track w-56">
        <div className="progress-fill w-1/2 animate-shimmer" />
      </div>
      <button onClick={() => navigate("/")} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
        Cancel redirect
      </button>
    </div>
  );
};

export default Redirection;
