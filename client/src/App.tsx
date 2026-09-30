import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Redirection from "./pages/Redirection";
import ProtectedRoute from "./utils/ProtectedRoute";
import Home from "@/Home";
import { verifyUser } from "./slices/auth.slice";
import { useAppDispatch, useAppSelector } from "./store/auth.store";
import { GetToken } from "./utils/GetToken";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

const ThemedToaster = () => {
  const { theme } = useTheme();
  return (
    <Toaster
      theme={theme}
      toastOptions={{
        className: "!rounded-xl !font-sans",
      }}
    />
  );
};

const App = () => {
  const dispatch = useAppDispatch();
  const token = GetToken();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const verifiedToken = useRef<string>();

  useEffect(() => {
    // Verify each token once; retrying on every isLoading flip loops forever when the API is unreachable.
    if (token && !user && !isLoading && verifiedToken.current !== token) {
      verifiedToken.current = token;
      dispatch(verifyUser());
    }
  }, [token, isLoading, user, dispatch]);

  return (
    <ThemeProvider>
      <div className="min-h-screen text-foreground">
        <BrowserRouter>
          <Routes>
            <Route element={<Home />} path="/" />
            <Route
              path="/auth/login"
              element={
                <ProtectedRoute>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path="/auth/signup"
              element={
                <ProtectedRoute>
                  <Signup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardHome />
                </ProtectedRoute>
              }
            />
            <Route path="/:shortLink" element={<Redirection />} />
          </Routes>
          <ThemedToaster />
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
};

export default App;
