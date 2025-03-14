import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GetToken } from "@/utils/GetToken";
import { useAppDispatch, useAppSelector } from "@/store/auth.store";
import { verifyUser } from "@/slices/auth.slice";
import LoadingScreen from "@/components/ui/loading-screen";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = GetToken();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  // List of public routes that don't require authentication
  const publicRoutes = ["/auth/login", "/auth/signup"];

  useEffect(() => {
    if (!token || !user) {
      dispatch(verifyUser());
    }
  }, [token, user, dispatch]);

  useEffect(() => {
    if (isLoading) return;

    // Allow access to public routes
    if (publicRoutes.includes(location.pathname)) {
      // If user is already logged in and tries to access login/signup, redirect to dashboard
      if (token && user?.name) {
        navigate("/dashboard?tab=home", { replace: true });
      }
      return;
    }

    // For protected routes
    if (!token || !user?.name) {
      // Save the intended path and search params
      navigate("/auth/login", { 
        state: { from: { pathname: location.pathname, search: location.search } },
        replace: true 
      });
    }

    // After successful login, redirect to the intended path
    if (token && user && location.pathname === "/auth/login") {
      const intendedPath = location.state?.from?.pathname || "/dashboard";
      const intendedSearch = location.state?.from?.search || "?tab=home";
      navigate(`${intendedPath}${intendedSearch}`, { replace: true });
    }
  }, [location, token, user, isLoading, navigate]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return children;
};

export default ProtectedRoute;
