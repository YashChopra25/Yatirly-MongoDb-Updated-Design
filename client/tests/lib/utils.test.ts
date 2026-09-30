import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins class names and drops falsy values", () => {
    const isActive = false;
    expect(cn("a", isActive && "b", undefined, null, "c")).toBe("a c");
  });

  it("lets later Tailwind classes win conflicts", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("supports object syntax", () => {
    expect(cn({ active: true, hidden: false })).toBe("active");
  });
});
