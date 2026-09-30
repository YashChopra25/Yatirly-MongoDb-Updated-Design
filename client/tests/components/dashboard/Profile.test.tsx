import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axiosInstance from "@/api/axiosInstance";
import Profile from "@/components/dashboard/Profile";
import { renderWithProviders, testUser } from "../../test-utils";

vi.mock("@/api/axiosInstance", () => ({ default: { put: vi.fn() } }));

beforeEach(() => {
  vi.mocked(axiosInstance.put).mockReset().mockResolvedValue({ data: { success: true } });
});

describe("Profile", () => {
  it("splits the stored name into first and last name", () => {
    renderWithProviders(<Profile />, { user: { ...testUser, name: "mary jane watson" } });
    expect(screen.getByLabelText("First name")).toHaveValue("mary");
    expect(screen.getByLabelText("Last name")).toHaveValue("jane watson");
    expect(screen.getByLabelText("Email address")).toHaveValue("jane@example.com");
  });

  it("keeps fields read-only until editing starts", async () => {
    renderWithProviders(<Profile />, { user: testUser });
    expect(screen.getByLabelText("First name")).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: /edit profile/i }));
    expect(screen.getByLabelText("First name")).toBeEnabled();
    expect(screen.getByLabelText("Email address")).toBeDisabled();
  });

  it("saves the edited name", async () => {
    renderWithProviders(<Profile />, { user: testUser });
    await userEvent.click(screen.getByRole("button", { name: /edit profile/i }));
    const first = screen.getByLabelText("First name");
    await userEvent.clear(first);
    await userEvent.type(first, "Janet");
    await userEvent.click(screen.getByRole("button", { name: /save changes/i }));

    expect(axiosInstance.put).toHaveBeenCalledWith("/api/v1/auth/user/update", {
      first_name: "Janet",
      last_name: "doe",
      email: "jane@example.com",
    });
    expect(screen.getByLabelText("First name")).toBeDisabled();
  });

  it("cancels editing without saving", async () => {
    renderWithProviders(<Profile />, { user: testUser });
    await userEvent.click(screen.getByRole("button", { name: /edit profile/i }));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(axiosInstance.put).not.toHaveBeenCalled();
    expect(screen.getByLabelText("First name")).toBeDisabled();
  });
});
