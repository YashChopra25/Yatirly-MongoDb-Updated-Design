import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axiosInstance from "@/api/axiosInstance";
import Redirection from "@/pages/Redirection";
import { renderWithProviders } from "../test-utils";

vi.mock("@/api/axiosInstance", () => ({ default: { get: vi.fn() } }));
vi.mock("@/components/Toaster", () => ({ default: vi.fn() }));

const replace = vi.fn();

beforeEach(() => {
  vi.mocked(axiosInstance.get).mockReset();
  replace.mockReset();
  vi.stubGlobal("location", { ...window.location, replace });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const renderAt = (code: string) => renderWithProviders(<Redirection />, { path: "/:shortLink", route: `/${code}` });

describe("Redirection page", () => {
  it("looks up the short code and redirects to the destination", async () => {
    vi.mocked(axiosInstance.get).mockResolvedValue({ data: { success: true, redirectOn: "https://example.com/dest" } });
    renderAt("AbCdEfGhIj");

    expect(screen.getByText("Redirecting you…")).toBeInTheDocument();
    await waitFor(() => expect(replace).toHaveBeenCalledWith("https://example.com/dest"));
    expect(axiosInstance.get).toHaveBeenCalledWith("/api/v1/urls/AbCdEfGhIj");
  });

  it("shows an invalid-link screen for an unknown code", async () => {
    vi.mocked(axiosInstance.get).mockResolvedValue({ data: { success: false, message: "Url is not found" } });
    renderAt("missing");

    expect(await screen.findByText("Invalid link")).toBeInTheDocument();
    expect(screen.getByText("/missing")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("goes home from the error screen", async () => {
    vi.mocked(axiosInstance.get).mockResolvedValue({ data: { success: false, message: "Url is not found" } });
    renderAt("missing");
    await userEvent.click(await screen.findByRole("button", { name: /go home/i }));
    expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
  });

  it("lets the visitor cancel the redirect", async () => {
    vi.mocked(axiosInstance.get).mockReturnValue(new Promise(() => {}));
    renderAt("AbCdEfGhIj");
    await userEvent.click(screen.getByRole("button", { name: /cancel redirect/i }));
    expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
  });
});
