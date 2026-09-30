import { describe, expect, it } from "vitest";
import { buildQrOptions, qrFormats, qrPalette } from "@/config/qr";

describe("buildQrOptions", () => {
  it("encodes the given data with the default colour and size", () => {
    const options = buildQrOptions("https://yatirly.test/abc");
    expect(options.data).toBe("https://yatirly.test/abc");
    expect(options.width).toBe(300);
    expect(options.height).toBe(300);
    expect(options.dotsOptions?.color).toBe(qrPalette[0].color);
  });

  it("applies a custom colour to dots and corners", () => {
    const options = buildQrOptions("x", "#ff0000", 120);
    expect(options.width).toBe(120);
    expect(options.dotsOptions?.color).toBe("#ff0000");
    expect(options.cornersSquareOptions?.color).toBe("#ff0000");
    expect(options.cornersDotOptions?.color).toBe("#ff0000");
  });

  it("uses high error correction so codes survive styling", () => {
    expect(buildQrOptions("x").qrOptions?.errorCorrectionLevel).toBe("H");
  });
});

describe("QR constants", () => {
  it("offers the expected download formats", () => {
    expect(qrFormats).toEqual(["svg", "png", "jpeg", "webp"]);
  });

  it("has uniquely named palette entries", () => {
    const names = qrPalette.map((p) => p.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
