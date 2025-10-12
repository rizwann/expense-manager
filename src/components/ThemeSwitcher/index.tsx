import { ReactNode, useMemo } from "react";
import { MoonStar, SunMedium, Contrast } from "lucide-react";
import {
  ThemeName,
  availableThemes,
  useThemeContext,
} from "../../context/ThemeContext";

const themeLabels: Record<ThemeName, string> = {
  dark: "Dark Mode",
  normal: "Normal Mode",
  contrast: "High Contrast",
};

const themeIcons: Record<ThemeName, ReactNode> = {
  dark: <MoonStar size={18} aria-hidden="true" />,
  normal: <SunMedium size={18} aria-hidden="true" />,
  contrast: <Contrast size={18} aria-hidden="true" />,
};

// Small utility button that lets users toggle between the supported themes.
const ThemeSwitcher = () => {
  const { theme, setTheme } = useThemeContext();

  const nextTheme = useMemo<ThemeName>(() => {
    const currentIndex = availableThemes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % availableThemes.length;
    return availableThemes[nextIndex];
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(nextTheme);
  };

  return (
    <div className="theme-switcher">
      <button
        type="button"
        className="theme-switcher__trigger"
        onClick={handleToggleTheme}
        aria-label={`Switch theme. Current theme ${themeLabels[theme]}`}
        title={`Switch to ${themeLabels[nextTheme]}`}
      >
        <span className="theme-switcher__icon">
          {themeIcons[theme]}
        </span>
        <span className="theme-switcher__trigger-label">
          {themeLabels[theme]}
        </span>
      </button>
    </div>
  );
};

export default ThemeSwitcher;
