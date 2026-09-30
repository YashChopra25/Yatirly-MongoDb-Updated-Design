import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosError, type AxiosResponse } from "axios";
import axiosInstance from "@/api/axiosInstance";
import { renderWithProviders } from "../../test-utils";
import Login from "@/pages/auth/Login";

vi.mock("@/api/axiosInstance", () => ({ default: { post: vi.fn(), get: vi.fn() } }));

const renderLogin = (state?: unknown) =>
  renderWithProviders(<Login />, { path: "/auth/login", route: { pathname: "/auth/login", state } });

const fillAndSubmit = async (email: string, password: string) => {
  if (email) await userEvent.type(screen.getByLabelText("Email"), email);
  if (password) await userEvent.type(screen.getByLabelText("Password"), password);
  await userEvent.click(screen.getByRole("button", { name: /log in/i }));
};

beforeEach(() => {
  vi.mocked(axiosInstance.post).mockReset();
});

describe("Login page", () => {
  it("requires both fields before calling the API", async () => {
    renderLogin();
    await fillAndSubmit("jane@example.com", "");
    expect(screen.getByText("Both fields are required")).toBeInTheDocument();
    expect(axiosInstance.post).not.toHaveBeenCalled();
  });

  it("posts the credentials and goes to the dashboard", async () => {
    vi.mocked(axiosInstance.post).mockResolvedValue({ data: { success: true, message: "ok" } });
    renderLogin();
    await fillAndSubmit("jane@example.com", "secret");

    expect(axiosInstance.post).toHaveBeenCalledWith("/api/v1/auth/user/login", {
      email: "jane@example.com",
      password: "secret",
    });
    expect(await screen.findByTestId("location")).toHaveTextContent("/dashboard?tab=home");
  });

  it("returns to the page that redirected to login", async () => {
    vi.mocked(axiosInstance.post).mockResolvedValue({ data: { success: true, message: "ok" } });
    renderLogin({ from: { pathname: "/dashboard", search: "?tab=history" } });
    await fillAndSubmit("jane@example.com", "secret");
    expect(await screen.findByTestId("location")).toHaveTextContent("/dashboard?tab=history");
  });

  it("shows the API message when success is false", async () => {
    vi.mocked(axiosInstance.post).mockResolvedValue({ data: { success: false, message: "Account locked" } });
    renderLogin();
    await fillAndSubmit("jane@example.com", "secret");
    expect(await screen.findByText("Account locked")).toBeInTheDocument();
    expect(screen.queryByTestId("location")).not.toBeInTheDocument();
  });

  it("shows the server's error message on a failed request", async () => {
    const response = { status: 401, data: { message: "Please enter correct credentials" } } as AxiosResponse;
    vi.mocked(axiosInstance.post).mockRejectedValue(new AxiosError("401", "ERR_BAD_REQUEST", undefined, undefined, response));
    renderLogin();
    await fillAndSubmit("jane@example.com", "wrong");
    expect(await screen.findByText("Please enter correct credentials")).toBeInTheDocument();
  });

  it("shows a generic message on an unexpected error", async () => {
    vi.mocked(axiosInstance.post).mockRejectedValue(new Error("boom"));
    renderLogin();
    await fillAndSubmit("jane@example.com", "secret");
    expect(await screen.findByText(/an error occurred during login/i)).toBeInTheDocument();
  });

  it("disables the button while logging in", async () => {
    vi.mocked(axiosInstance.post).mockReturnValue(new Promise(() => {}));
    renderLogin();
    await fillAndSubmit("jane@example.com", "secret");
    await waitFor(() => expect(screen.getByRole("button", { name: /logging in/i })).toBeDisabled());
  });

  it("links to the sign-up page", () => {
    renderLogin();
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute("href", "/auth/signup");
  });
});
