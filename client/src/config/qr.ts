import type {
  Options,
  DrawType,
  TypeNumber,
  Mode,
  ErrorCorrectionLevel,
  DotType,
  CornerSquareType,
  CornerDotType,
  FileExtension,
} from "qr-code-styling";

export const qrPalette = [
  { name: "Ink", gradient: { from: "#0a0b08", to: "#3f3f46" }, color: "#0a0b08" },
  { name: "Lime", gradient: { from: "#4d7c0f", to: "#84cc16" }, color: "#4d7c0f" },
  { name: "Rose", gradient: { from: "#f43f5e", to: "#fb7185" }, color: "#f43f5e" },
  { name: "Blue", gradient: { from: "#3b82f6", to: "#60a5fa" }, color: "#3b82f6" },
  { name: "Purple", gradient: { from: "#8b5cf6", to: "#a78bfa" }, color: "#8b5cf6" },
  { name: "Emerald", gradient: { from: "#10b981", to: "#34d399" }, color: "#10b981" },
  { name: "Amber", gradient: { from: "#f59e0b", to: "#fbbf24" }, color: "#f59e0b" },
  { name: "Red", gradient: { from: "#ef4444", to: "#f87171" }, color: "#ef4444" },
];

export const qrFormats: FileExtension[] = ["svg", "png", "jpeg", "webp"];

/** Shared QR styling used by the generator and the history preview. */
export const buildQrOptions = (data: string, color: string = qrPalette[0].color, size = 300): Options => ({
  width: size,
  height: size,
  type: "svg" as DrawType,
  data,
  image: "",
  margin: 10,
  qrOptions: {
    typeNumber: 0 as TypeNumber,
    mode: "Byte" as Mode,
    errorCorrectionLevel: "H" as ErrorCorrectionLevel,
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 20,
    crossOrigin: "anonymous",
  },
  dotsOptions: { color, type: "rounded" as DotType },
  backgroundOptions: { color: "transparent" },
  cornersSquareOptions: { color, type: "extra-rounded" as CornerSquareType },
  cornersDotOptions: { color, type: "dot" as CornerDotType },
});
