import React, { useState } from "react";
import { isAxiosError } from "axios";
import axiosInstance, { ApiResponse } from "@/api/axiosInstance";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthField from "@/components/auth/AuthField";
import Spinner from "@/components/common/Spinner";

const Signup: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

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

      // Return to the page that sent the user here (e.g. /dashboard?tab=history).
      const from = location.state?.from;
      navigate(from?.pathname ? `${from.pathname}${from.search ?? ""}` : "/dashboard?tab=home", { replace: true });
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
    <AuthLayout
      eyebrow="Get started"
      title="Create your account."
      subtitle="Start shortening, scanning and tracking in seconds."
      error={error}
      footer={
        <>
          Already have an account?{" "}
          <Link to="/auth/login" className="font-semibold text-accent-ink hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <AuthField
          id="name"
          label="Name"
          type="text"
          icon={User}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          autoComplete="name"
        />
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
          placeholder="Create a password"
          autoComplete="new-password"
        />
        <button type="submit" disabled={loading} className="btn-primary group h-12 w-full text-[15px]">
          {loading ? (
            <>
              <Spinner /> Creating account…
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Signup;
