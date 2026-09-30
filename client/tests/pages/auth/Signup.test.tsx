import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosError, type AxiosResponse } from "axios";
import axiosInstance from "@/api/axiosInstance";
import { renderWithProviders } from "../../test-utils";
import Signup from "@/pages/auth/Signup";

vi.mock("@/api/axiosInstance", () => ({ default: { post: vi.fn(), get: vi.fn() } }));

const renderSignup = () => renderWithProviders(<Signup />, { path: "/auth/signup", route: "/auth/signup" });

const submitButton = () => screen.getByRole("button", { name: /sign up|create/i });

const fill = async ({ name = "Jane Doe", email = "jane@example.com", password = "secret" } = {}) => {
  if (name) await userEvent.type(screen.getByLabelText(/name/i), name);
  if (email) await userEvent.type(screen.getByLabelText("Email"), email);
  if (password) await userEvent.type(screen.getByLabelText("Password"), password);
};

beforeEach(() => {
  vi.mocked(axiosInstance.post).mockReset();
});

describe("Signup page", () => {
  it("requires every field", async () => {
    renderSignup();
    await fill({ name: "" });
    await userEvent.click(submitButton());
    expect(screen.getByText("All fields are required")).toBeInTheDocument();
    expect(axiosInstance.post).not.toHaveBeenCalled();
  });

  it("creates the account and goes to the dashboard", async () => {
    vi.mocked(axiosInstance.post).mockResolvedValue({ data: { success: true, message: "User is created" } });
    renderSignup();
    await fill();
    await userEvent.click(submitButton());

    expect(axiosInstance.post).toHaveBeenCalledWith("/api/v1/auth/user/create", {
      name: "Jane Doe",
      email: "jane@example.com",
      password: "secret",
    });
    expect(await screen.findByTestId("location")).toHaveTextContent("/dashboard?tab=home");
  });

  it("shows the server's error message", async () => {
    const response = { status: 409, data: { message: "Email already exists" } } as AxiosResponse;
    vi.mocked(axiosInstance.post).mockRejectedValue(new AxiosError("409", "ERR_BAD_REQUEST", undefined, undefined, response));
    renderSignup();
    await fill();
    await userEvent.click(submitButton());
    expect(await screen.findByText("Email already exists")).toBeInTheDocument();
  });

  it("links to the login page", () => {
    renderSignup();
    expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute("href", "/auth/login");
  });
});
