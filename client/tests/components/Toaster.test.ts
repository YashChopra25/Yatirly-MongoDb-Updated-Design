import { beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "sonner";
import ToastFn from "@/components/Toaster";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn(), warning: vi.fn() },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ToastFn", () => {
  it.each(["success", "error", "info", "warning"] as const)("shows a %s toast", (type) => {
    ToastFn(type, "Title", "Details");
    expect(toast[type]).toHaveBeenCalledWith(
      "Title",
      expect.objectContaining({ description: "Details", position: "top-right", duration: 1500 })
    );
  });

  it("defaults to an info toast", () => {
    ToastFn();
    expect(toast.info).toHaveBeenCalledWith("", expect.objectContaining({ description: "" }));
  });
});
