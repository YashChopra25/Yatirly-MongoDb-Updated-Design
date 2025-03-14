import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ToastFn from "@/components/Toaster";
import axiosInstance, { ApiResponse } from "@/api/axiosInstance";
import { ApiResponseCreateLink } from "@/Types";
import { isAxiosError } from "axios";
import { motion } from "framer-motion";
import { FaLink, FaCopy, FaCheck } from "react-icons/fa6";

const LinkGenerator = () => {
  const [inputValue, setInputValue] = React.useState("");
  const [shortURl, setshortURl] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() === "") {
      ToastFn("error", "Error", "Please enter a valid link");
      return;
    }
    setIsLoading(true);
    try {
      const { data: responseData } = await axiosInstance.post<
        ApiResponse<ApiResponseCreateLink>
      >("/api/v1/urls/create", {
        longUrl: inputValue,
      });
      if (!responseData.success) {
        ToastFn("error", "Failed", responseData.message);
        setshortURl("");
        return;
      }
      if (!responseData.data) return;
      setshortURl(
        `${import.meta.env.VITE_FRONTEND_URL}/${
          responseData.data.ShortURL as string
        }`
      );
    } catch (error: unknown | ApiResponse<ApiResponseCreateLink> | unknown) {
      if (isAxiosError(error)) {
        ToastFn(
          "error",
          "Error",
          error.response?.data.message || "Something went wrong"
        );
      }
      ToastFn("error", "Error", "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortURl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    ToastFn("success", "Success", "Link copied to clipboard!");
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-theme-primary/20 mb-4">
          <FaLink className="w-8 h-8 text-theme-primary" />
        </div>
        <h2 className="text-2xl font-bold theme-text-gradient mb-2">
          Transform Your Links
        </h2>
        <p className="text-theme-primary/60">
          Enter your long URL below and get a shortened version instantly
        </p>
      </motion.div>

      <motion.form
        className="space-y-6"
        onSubmit={submitHandler}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <Input
            type="text"
            id="shorterURL-link"
            placeholder="Paste your long URL here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required
            className="h-14 px-4 bg-card/50 border-border/30 text-foreground placeholder:text-theme-primary/40 rounded-xl focus:ring-2 focus:ring-theme-primary/30"
          />
        </div>

        <Button
          type="submit"
          variant="default"
          disabled={isLoading}
          className="w-full h-12 rounded-xl theme-gradient hover:opacity-90 text-white transition-all duration-300"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Generating...</span>
            </div>
          ) : (
            "Generate Short Link"
          )}
        </Button>
      </motion.form>

      {shortURl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 rounded-xl bg-card/50 border border-border/30"
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-theme-primary/60">
              Your shortened URL is ready!
            </label>
            <div className="flex items-center gap-3">
              <Input
                value={shortURl}
                readOnly
                className="h-12 bg-background border-border/30 text-foreground rounded-xl"
              />
              <Button
                type="button"
                onClick={handleCopy}
                variant="outline"
                className="h-12 px-6 rounded-xl border-theme-primary/30 hover:bg-theme-primary/10 text-theme-primary transition-all duration-300"
              >
                {copied ? (
                  <FaCheck className="w-5 h-5 text-green-500" />
                ) : (
                  <FaCopy className="w-5 h-5 text-theme-primary" />
                )}
              </Button>
            </div>
            <a
              href={shortURl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-theme-primary hover:text-theme-primary/80 transition-colors duration-300"
            >
              Open in new tab →
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LinkGenerator;
