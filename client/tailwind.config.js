import animate from "tailwindcss-animate";

/** Every token is stored as space-separated RGB channels so opacity modifiers (bg-card/60) work. */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      fontFamily: {
        sans: ['"Inter Tight"', "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Inter Tight"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        border: token("border"),
        input: token("input"),
        ring: token("ring"),
        background: token("background"),
        foreground: token("foreground"),
        primary: { DEFAULT: token("primary"), foreground: token("primary-foreground") },
        secondary: { DEFAULT: token("secondary"), foreground: token("secondary-foreground") },
        card: { DEFAULT: token("card"), foreground: token("card-foreground") },
        accent: { DEFAULT: token("accent"), foreground: token("accent-foreground") },
        popover: { DEFAULT: token("popover"), foreground: token("popover-foreground") },
        muted: { DEFAULT: token("muted"), foreground: token("muted-foreground") },
        destructive: { DEFAULT: token("destructive"), foreground: token("destructive-foreground") },
        sidebar: {
          DEFAULT: token("sidebar-background"),
          foreground: token("sidebar-foreground"),
          primary: token("sidebar-primary"),
          "primary-foreground": token("sidebar-primary-foreground"),
          accent: token("sidebar-accent"),
          "accent-foreground": token("sidebar-accent-foreground"),
          border: token("sidebar-border"),
          ring: token("sidebar-ring"),
        },
        "theme-primary": { DEFAULT: token("tp"), foreground: token("tp-fg") },
        "theme-accent": token("ta"),
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        streak: {
          from: { transform: "translate3d(0,0,0)", opacity: "0" },
          "15%": { opacity: "1" },
          to: { transform: "translate3d(-420px,260px,0)", opacity: "0" },
        },
        aurora: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "33%": { transform: "translate3d(6%,-8%,0) scale(1.15)" },
          "66%": { transform: "translate3d(-6%,6%,0) scale(0.9)" },
        },
        shimmer: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(100%)" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        scan: {
          "0%": { top: "0%", opacity: "0" },
          "10%, 90%": { opacity: "1" },
          "100%": { top: "100%", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "ping-slow": {
          "75%, 100%": { transform: "scale(2.2)", opacity: "0" },
        },
        "bounce-x": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(5px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        streak: "streak 5s linear infinite",
        aurora: "aurora 18s ease-in-out infinite",
        shimmer: "shimmer 2.2s ease-in-out infinite",
        "gradient-pan": "gradient-pan 6s ease infinite",
        scan: "scan 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "ping-slow": "ping-slow 2.4s cubic-bezier(0,0,0.2,1) infinite",
        "spin-slow": "spin 14s linear infinite",
        "bounce-x": "bounce-x 1s infinite",
      },
    },
  },
  plugins: [animate],
};
