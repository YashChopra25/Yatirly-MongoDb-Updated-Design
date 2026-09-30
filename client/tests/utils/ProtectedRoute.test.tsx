import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import ProtectedRoute from "@/utils/ProtectedRoute";
import { LocationProbe, makeStore, testUser } from "../test-utils";
import type { User } from "@/slices/auth.slice";

vi.mock("@/api/axiosInstance", () => ({ default: { get: vi.fn() } }));

const LoginProbe = () => (
  <ProtectedRoute>
    <p>login form</p>
  </ProtectedRoute>
);

const renderAt = (route: string, user: User | null) =>
  render(
    <Provider store={makeStore(user)}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <p>secret dashboard</p>
              </ProtectedRoute>
            }
          />
          <Route path="/auth/login" element={<LoginProbe />} />
          <Route path="*" element={<LocationProbe />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

beforeEach(() => {
  vi.mocked(axiosInstance.get).mockReset();
});

describe("ProtectedRoute", () => {
  it("renders the page for a logged-in user with a token", async () => {
    document.cookie = "token=abc";
    renderAt("/dashboard?tab=home", testUser);
    expect(await screen.findByText("secret dashboard")).toBeInTheDocument();
    expect(axiosInstance.get).not.toHaveBeenCalled();
  });

  it("sends anonymous visitors to login", async () => {
    vi.mocked(axiosInstance.get).mockRejectedValue(new Error("401"));
    renderAt("/dashboard?tab=history", null);
    expect(await screen.findByText("login form")).toBeInTheDocument();
    expect(screen.queryByText("secret dashboard")).not.toBeInTheDocument();
  });

  it("restores the session from a token cookie before deciding", async () => {
    document.cookie = "token=abc";
    vi.mocked(axiosInstance.get).mockResolvedValue({ data: { data: testUser } });
    renderAt("/dashboard", null);
    expect(await screen.findByText("secret dashboard")).toBeInTheDocument();
    expect(axiosInstance.get).toHaveBeenCalledWith("/api/v1/auth/user/verify");
  });

  it("shows a loading screen while the session is checked", () => {
    vi.mocked(axiosInstance.get).mockReturnValue(new Promise(() => {}));
    renderAt("/dashboard", null);
    expect(screen.getByText(/syncing your session/i)).toBeInTheDocument();
  });

  it("lets anonymous visitors see the login page", async () => {
    vi.mocked(axiosInstance.get).mockRejectedValue(new Error("401"));
    renderAt("/auth/login", null);
    expect(await screen.findByText("login form")).toBeInTheDocument();
  });

  it("sends logged-in users away from login to the dashboard", async () => {
    document.cookie = "token=abc";
    renderAt("/auth/login", testUser);
    expect(await screen.findByText("secret dashboard")).toBeInTheDocument();
  });
});
