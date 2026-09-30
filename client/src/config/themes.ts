export type ThemeType = "dark" | "light";
export type ColorScheme = "lime" | "violet" | "cyan" | "rose" | "amber";

interface SchemeMeta {
  name: string;
  /** Hex values mirror the RGB channels in index.css; used for swatches and canvas/SVG rendering. */
  primary: string;
  accent: string;
}

export const colorSchemes: Record<ColorScheme, SchemeMeta> = {
  lime: { name: "Hood Lime", primary: "#c8f031", accent: "#a3e635" },
  violet: { name: "Nebula", primary: "#a78bfa", accent: "#818cf8" },
  cyan: { name: "Cyber", primary: "#2dd4ed", accent: "#38bdf8" },
  rose: { name: "Synth", primary: "#fb7185", accent: "#f472b6" },
  amber: { name: "Solar", primary: "#fbbf24", accent: "#fb923c" },
};

export const isColorScheme = (value: unknown): value is ColorScheme =>
  typeof value === "string" && value in colorSchemes;
