import React, { useState } from "react";
import { isAxiosError } from "axios";
import axiosInstance, { ApiResponse } from "@/api/axiosInstance";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthField from "@/components/auth/AuthField";
import Spinner from "@/components/common/Spinner";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Both fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await axiosInstance.post<ApiResponse<unknown>>(
        "/api/v1/auth/user/login",
        { email, password }
      );

      if (!data.success) {
        setError(data.message);
        return;
      }

      // Return to the page that sent the user here (e.g. /dashboard?tab=history).
      const from = location.state?.from;
      navigate(from?.pathname ? `${from.pathname}${from.search ?? ""}` : "/dashboard?tab=home", { replace: true });
    } catch (error: unknown) {
      let message = "An error occurred during login. Please try again.";
      if (isAxiosError(error)) {
        message = error.response?.data.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Sign in"
      title="Welcome back."
      subtitle="Log in to your links, QR codes and analytics."
      error={error}
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/auth/signup" className="font-semibold text-accent-ink hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <AuthField
          id="email"
          label="Email"
          type="email"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <AuthField
          id="password"
          label="Password"
          type="password"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
        />
        <button type="submit" disabled={loading} className="btn-primary group h-12 w-full text-[15px]">
          {loading ? (
            <>
              <Spinner /> Logging in…
            </>
          ) : (
            <>
              Log in
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;
