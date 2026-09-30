import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axiosInstance from "@/api/axiosInstance";
import ToastFn from "@/components/Toaster";
import LinkGenerator from "@/components/urlshortner/LinkGenerator";

vi.mock("@/api/axiosInstance", () => ({ default: { post: vi.fn() } }));
vi.mock("@/components/Toaster", () => ({ default: vi.fn() }));

const shorten = async (url: string) => {
  await userEvent.type(screen.getByLabelText("Long URL"), url);
  await userEvent.click(screen.getByRole("button", { name: /shorten link/i }));
};

const created = (ShortURL: string) => ({ data: { success: true, message: "Url is created", data: { ShortURL } } });

beforeEach(() => {
  vi.mocked(axiosInstance.post).mockReset();
  vi.mocked(ToastFn).mockReset();
});

describe("LinkGenerator", () => {
  it("shows an error for a blank link without calling the API", async () => {
    render(<LinkGenerator />);
    await shorten("   ");
    expect(ToastFn).toHaveBeenCalledWith("error", "Error", "Please enter a valid link");
    expect(axiosInstance.post).not.toHaveBeenCalled();
  });

  it("creates a short link and displays it", async () => {
    vi.mocked(axiosInstance.post).mockResolvedValue(created("AbCdEfGhIj"));
    render(<LinkGenerator />);
    await shorten("https://example.com/long");

    expect(axiosInstance.post).toHaveBeenCalledWith("/api/v1/urls/create", { longUrl: "https://example.com/long" });
    const link = await screen.findByRole("link", { name: "yatirly.test/AbCdEfGhIj" });
    expect(link).toHaveAttribute("href", "http://yatirly.test/AbCdEfGhIj");
    expect(screen.getByLabelText("Long URL")).toHaveValue("");
  });

  it("copies the short link to the clipboard", async () => {
    const user = userEvent.setup();
    vi.mocked(axiosInstance.post).mockResolvedValue(created("AbCdEfGhIj"));
    render(<LinkGenerator />);
    await user.type(screen.getByLabelText("Long URL"), "https://example.com");
    await user.click(screen.getByRole("button", { name: /shorten link/i }));
    await user.click(await screen.findByRole("button", { name: /copy link/i }));

    expect(await navigator.clipboard.readText()).toBe("http://yatirly.test/AbCdEfGhIj");
    expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument();
    expect(ToastFn).toHaveBeenCalledWith("success", "Success", "Link copied to clipboard!");
  });

  it("keeps earlier links from this session", async () => {
    vi.mocked(axiosInstance.post).mockResolvedValueOnce(created("FirstCodeA")).mockResolvedValueOnce(created("SecondCode"));
    render(<LinkGenerator />);
    await shorten("https://one.com");
    await screen.findByText("yatirly.test/FirstCodeA");
    await shorten("https://two.com");

    expect(await screen.findByRole("link", { name: "yatirly.test/SecondCode" })).toBeInTheDocument();
    const earlier = screen.getByText("Earlier this session").parentElement!;
    expect(within(earlier).getByText("yatirly.test/FirstCodeA")).toBeInTheDocument();
    expect(within(earlier).getByText("https://one.com")).toBeInTheDocument();
  });

  it("shows the API message when creation fails", async () => {
    vi.mocked(axiosInstance.post).mockResolvedValue({ data: { success: false, message: "Url is not valid" } });
    render(<LinkGenerator />);
    await shorten("nope");
    await waitFor(() => expect(ToastFn).toHaveBeenCalledWith("error", "Failed", "Url is not valid"));
    expect(screen.queryByText(/short link ready/i)).not.toBeInTheDocument();
  });

  it("shows a generic error when the request throws", async () => {
    vi.mocked(axiosInstance.post).mockRejectedValue(new Error("network"));
    render(<LinkGenerator />);
    await shorten("https://example.com");
    await waitFor(() => expect(ToastFn).toHaveBeenCalledWith("error", "Error", "Something went wrong"));
  });
});
