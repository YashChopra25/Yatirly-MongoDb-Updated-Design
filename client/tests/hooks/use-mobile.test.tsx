import { afterEach, describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useIsMobile } from "@/hooks/use-mobile";

const originalWidth = window.innerWidth;

afterEach(() => {
  window.innerWidth = originalWidth;
});

describe("useIsMobile", () => {
  it("is true below 768px", () => {
    window.innerWidth = 500;
    expect(renderHook(() => useIsMobile()).result.current).toBe(true);
  });

  it("is false at 768px and above", () => {
    window.innerWidth = 768;
    expect(renderHook(() => useIsMobile()).result.current).toBe(false);
  });
});
