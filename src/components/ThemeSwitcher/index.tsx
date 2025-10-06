import { useEffect, useRef, useState } from "react"
import {
  ThemeName,
  availableThemes,
  useThemeContext,
} from "../../context/ThemeContext"

const themeLabels: Record<ThemeName, string> = {
  dark: "Dark Mode",
  normal: "Normal Mode",
  contrast: "High Contrast",
}

// Small utility button that lets users toggle between the supported themes.
const ThemeSwitcher = () => {
  const { theme, setTheme } = useThemeContext()
  const [isOpen, setIsOpen] = useState(false)
  const switcherRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        switcherRef.current &&
        !switcherRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleThemeChange = (nextTheme: ThemeName) => {
    setTheme(nextTheme)
    setIsOpen(false)
  }

  return (
    <div className="theme-switcher" ref={switcherRef}>
      <button
        type="button"
        className="theme-switcher__trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Toggle theme menu. Current theme ${themeLabels[theme]}`}
      >
        <span aria-hidden="true">🎨</span>
        <span className="theme-switcher__trigger-label">
          {themeLabels[theme]}
        </span>
      </button>
      {isOpen && (
        <div className="theme-switcher__menu" role="listbox">
          {availableThemes.map((availableTheme) => (
            <button
              key={availableTheme}
              type="button"
              role="option"
              aria-selected={theme === availableTheme}
              className={theme === availableTheme ? "is-active" : ""}
              onClick={() => handleThemeChange(availableTheme)}
            >
              {themeLabels[availableTheme]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ThemeSwitcher
