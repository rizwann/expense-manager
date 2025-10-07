import { useMemo } from "react";
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
        <span aria-hidden="true">🎨</span>
        <span className="theme-switcher__trigger-label">
          {themeLabels[theme]}
        </span>
      </button>
    </div>
  );
};

export default ThemeSwitcher;
