import { describe, expect, it } from "vitest";
import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { colorSchemes } from "@/config/themes";

const Probe = () => {
  const { theme, colorScheme, toggleTheme, setColorScheme, colors } = useTheme();
  return (
    <div>
      <p data-testid="theme">{theme}</p>
      <p data-testid="scheme">{colorScheme}</p>
      <p data-testid="primary">{colors.primary}</p>
      <button onClick={toggleTheme}>toggle</button>
      <button onClick={() => setColorScheme("rose")}>rose</button>
    </div>
  );
};

const renderProbe = () =>
  render(
    <ThemeProvider>
      <Probe />
    </ThemeProvider>
  );

describe("ThemeProvider", () => {
  it("defaults to dark mode with the lime scheme", () => {
    renderProbe();
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(screen.getByTestId("scheme")).toHaveTextContent("lime");
    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement).toHaveAttribute("data-theme", "lime");
  });

  it("toggles between dark and light and persists the choice", async () => {
    renderProbe();
    await userEvent.click(screen.getByText("toggle"));
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(document.documentElement).toHaveClass("light");
    expect(document.documentElement).not.toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("light");

    await userEvent.click(screen.getByText("toggle"));
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });

  it("changes the colour scheme and exposes its colours", async () => {
    renderProbe();
    await userEvent.click(screen.getByText("rose"));
    expect(screen.getByTestId("scheme")).toHaveTextContent("rose");
    expect(screen.getByTestId("primary")).toHaveTextContent(colorSchemes.rose.primary);
    expect(document.documentElement).toHaveAttribute("data-theme", "rose");
    expect(localStorage.getItem("colorScheme")).toBe("rose");
  });

  it("restores saved preferences", () => {
    localStorage.setItem("theme", "light");
    localStorage.setItem("colorScheme", "cyan");
    renderProbe();
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(screen.getByTestId("scheme")).toHaveTextContent("cyan");
  });

  it("ignores an invalid saved colour scheme", () => {
    localStorage.setItem("colorScheme", "not-a-scheme");
    renderProbe();
    expect(screen.getByTestId("scheme")).toHaveTextContent("lime");
  });
});

describe("useTheme", () => {
  it("throws outside a ThemeProvider", () => {
    expect(() => renderHook(() => useTheme())).toThrow("useTheme must be used within a ThemeProvider");
  });
});
