import { useEffect } from "react";
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
import { ThemeProvider } from "@/context/ThemeContext";
import "@/styles/globals.css";

const App = () => {
  const dispatch = useAppDispatch();
  const token = GetToken();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    document.title = "Yatirly";
    
    // Add meta theme-color tag if it doesn't exist
    if (!document.querySelector('meta[name="theme-color"]')) {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = '#1a1d2d';
      document.head.appendChild(meta);
    }

    if (token && !user && !isLoading) {
      dispatch(verifyUser());
    }
  }, [token, isLoading, user, dispatch]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
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
          <Toaster theme="system" />
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
};

export default App;
