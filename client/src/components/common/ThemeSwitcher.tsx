import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sun, Moon, Palette } from 'lucide-react';
import { ColorScheme, themes } from '@/config/themes';

const colorSchemeNames: Record<ColorScheme, string> = {
  purple: 'Purple Dream',
  blue: 'Ocean Blue',
  green: 'Forest Green',
  rose: 'Rose Garden',
  orange: 'Sunset Orange',
};

const ThemeSwitcher = () => {
  const { theme, colorScheme, toggleTheme, setColorScheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-xl border-[#44485e]/30 hover:bg-[#635bc9]/10"
          >
            <Palette className="h-5 w-5 text-[#cfcde4]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-card border-[#44485e]/30">
          {(Object.keys(colorSchemeNames) as ColorScheme[]).map((scheme) => {
            const currentThemeColors = themes[theme][scheme];
            return (
              <DropdownMenuItem
                key={scheme}
                onClick={() => setColorScheme(scheme)}
                className={`flex items-center gap-2 cursor-pointer ${
                  colorScheme === scheme ? 'bg-[#635bc9]/10' : ''
                }`}
              >
                <div
                  className="w-16 h-4 rounded-full"
                  style={{
                    background: `linear-gradient(to right, ${currentThemeColors.primary.from}, ${currentThemeColors.primary.to})`,
                  }}
                />
                <span className="text-sm font-medium">{colorSchemeNames[scheme]}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className="h-10 w-10 rounded-xl border-[#44485e]/30 hover:bg-[#635bc9]/10"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          key={theme}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-[#cfcde4]" />
          ) : (
            <Moon className="h-5 w-5 text-[#cfcde4]" />
          )}
        </motion.div>
      </Button>
    </div>
  );
};

export default ThemeSwitcher; 