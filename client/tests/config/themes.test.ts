import { describe, expect, it } from "vitest";
import { colorSchemes, isColorScheme } from "@/config/themes";

describe("isColorScheme", () => {
  it.each(Object.keys(colorSchemes))("accepts %j", (scheme) => {
    expect(isColorScheme(scheme)).toBe(true);
  });

  it.each([null, undefined, 42, "", "purple", "LIME"])("rejects %j", (value) => {
    expect(isColorScheme(value)).toBe(false);
  });
});

describe("colorSchemes", () => {
  it("defines hex primary and accent colours for every scheme", () => {
    for (const scheme of Object.values(colorSchemes)) {
      expect(scheme.primary).toMatch(/^#[0-9a-f]{6}$/i);
      expect(scheme.accent).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});
