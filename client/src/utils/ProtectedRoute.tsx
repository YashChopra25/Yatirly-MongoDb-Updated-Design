import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GetToken } from "@/utils/GetToken";
import { useAppDispatch, useAppSelector } from "@/store/auth.store";
import { verifyUser } from "@/slices/auth.slice";
import LoadingScreen from "@/components/ui/loading-screen";

// Routes that don't require authentication
const publicRoutes = ["/auth/login", "/auth/signup"];

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = GetToken();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  // Redirect decisions must wait until the session check has finished; otherwise a
  // refresh bounces to login before the user is known and the original ?tab= is lost.
  const [checked, setChecked] = useState(Boolean(user));

  useEffect(() => {
    if (!token || !user) {
      dispatch(verifyUser()).finally(() => setChecked(true));
    } else {
      setChecked(true);
    }
  }, [token, user, dispatch]);

  useEffect(() => {
    if (isLoading || !checked) return;

    const isAuthenticated = Boolean(token && user?.name);

    if (publicRoutes.includes(location.pathname)) {
      // Logged-in users on login/signup go back to where they were headed.
      if (isAuthenticated) {
        const intendedPath = location.state?.from?.pathname || "/dashboard";
        const intendedSearch = location.state?.from?.search || (intendedPath === "/dashboard" ? "?tab=home" : "");
        navigate(`${intendedPath}${intendedSearch}`, { replace: true });
      }
      return;
    }

    if (!isAuthenticated) {
      // Remember the full URL (including ?tab=) so login can return to it.
      navigate("/auth/login", {
        state: { from: { pathname: location.pathname, search: location.search } },
        replace: true,
      });
    }
  }, [location, token, user, isLoading, checked, navigate]);

  if (isLoading || !checked) {
    return <LoadingScreen />;
  }

  return children;
};

export default ProtectedRoute;
