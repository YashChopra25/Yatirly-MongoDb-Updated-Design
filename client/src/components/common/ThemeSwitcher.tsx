import { useTheme } from "@/context/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Check } from "lucide-react";
import { ColorScheme, colorSchemes } from "@/config/themes";
import { cn } from "@/lib/utils";

const iconButton =
  "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card/60 text-muted-foreground transition-colors hover:border-theme-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-primary/50";

const ThemeSwitcher = ({ className }: { className?: string }) => {
  const { theme, colorScheme, toggleTheme, setColorScheme, colors } = useTheme();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger className={iconButton} aria-label="Change accent color">
          <span
            className="h-4 w-4 rounded-full ring-2 ring-background"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
              boxShadow: `0 0 12px ${colors.primary}`,
            }}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="eyebrow px-2 py-1.5">Accent</DropdownMenuLabel>
          {(Object.keys(colorSchemes) as ColorScheme[]).map((scheme) => {
            const meta = colorSchemes[scheme];
            return (
              <DropdownMenuItem
                key={scheme}
                onClick={() => setColorScheme(scheme)}
                className="flex cursor-pointer items-center gap-3 py-2"
              >
                <span
                  className="h-4 w-4 rounded-full"
                  style={{ background: `linear-gradient(135deg, ${meta.primary}, ${meta.accent})` }}
                />
                <span className="flex-1 text-sm font-medium">{meta.name}</span>
                {colorScheme === scheme && <Check className="h-4 w-4 text-accent-ink" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <button
        type="button"
        onClick={toggleTheme}
        className={iconButton}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
      </button>
    </div>
  );
};

export default ThemeSwitcher;
