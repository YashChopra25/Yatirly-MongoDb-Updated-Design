import { describe, expect, it } from "vitest";
import { BsAndroid } from "react-icons/bs";
import { FaChrome, FaLink, FaQrcode, FaWindows } from "react-icons/fa6";
import { getIcon } from "@/utils/general";

describe("getIcon", () => {
  it.each([
    ["qrcode", FaQrcode],
    ["chrome", FaChrome],
    ["windows", FaWindows],
    ["android", BsAndroid],
    ["mobile chrome", FaChrome],
  ])("maps %j to its icon", (name, icon) => {
    expect(getIcon(name)).toBe(icon);
  });

  it("is case- and whitespace-insensitive", () => {
    expect(getIcon("  Chrome ")).toBe(FaChrome);
    expect(getIcon("WINDOWS")).toBe(FaWindows);
  });

  it("falls back to the link icon for unknown names", () => {
    expect(getIcon("Firefox")).toBe(FaLink);
    expect(getIcon("")).toBe(FaLink);
  });
});
