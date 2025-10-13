import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { CssBaseline, ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material"

const themes = {
  dark: {
    background: "#121212",
    surface: "#1f1f1f",
    text: "#ffffff",
    amount: "#5dcf83",
    primary: "#8a71e6",
    secondary: "#8b949e",
    link: "#58a6ff",
    buttonText: "#ffffff",
    border: "rgba(255, 255, 255, 0.18)",
    card: "#1b1f2d",
    muted: "#9aa4c6",
    tooltipBg: "#252b45",
    inputBg: "rgba(255, 255, 255, 0.08)",
    inputBorder: "rgba(255, 255, 255, 0.24)",
    inputShadow: "rgba(0, 0, 0, 0.45)",
    chartGrid: "rgba(255, 255, 255, 0.14)",
  },
  normal: {
    background: "#e7ebf3",
    surface: "#ffffff",
    text: "#1a1f36",
    amount: "#238523",
    primary: "#006adc",
    secondary: "#5f6c7b",
    link: "#0040a8",
    buttonText: "#ffffff",
    border: "rgba(15, 23, 42, 0.08)",
    card: "#fefeff",
    muted: "#596275",
    tooltipBg: "#f1f3f8",
    inputBg: "#eef2fa",
    inputBorder: "rgba(15, 23, 42, 0.2)",
    inputShadow: "rgba(15, 23, 42, 0.12)",
    chartGrid: "rgba(0, 0, 0, 0.08)",
  },
  contrast: {
    background: "#000000",
    surface: "#111111",
    text: "#ffff00",
    amount: "#00ff00",
    primary: "#ff0000",
    secondary: "#00ff00",
    link: "#00ffff",
    buttonText: "#000000",
    border: "#ffff00",
    card: "#000000",
    muted: "#ffff66",
    tooltipBg: "#111111",
    inputBg: "#000000",
    inputBorder: "#ffff00",
    chartGrid: "#ff0000",
    inputShadow: "rgba(255, 255, 0, 0.35)",
  },
}

export const themeDefinitions = themes

export type ThemeName = keyof typeof themes

type ThemeContextValue = {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
  colors: typeof themes.dark
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const STORAGE_KEY = "expense-manager-theme"

const detectSystemTheme = (): ThemeName => {
  if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark"
    }
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "normal"
    }
  }
  return "normal"
}

const applyCssVariables = (theme: ThemeName) => {
  if (typeof document === "undefined") return

  const root = document.documentElement
  const selectedTheme = themes[theme]

  Object.entries(selectedTheme).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value)
  })

  root.setAttribute("data-theme", theme)
}

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    if (typeof window !== "undefined") {
      const cachedTheme = window.localStorage.getItem(STORAGE_KEY)
      if (cachedTheme) {
        const normalizedTheme = cachedTheme === "light" ? "normal" : cachedTheme
        if (themes[normalizedTheme as ThemeName]) {
          applyCssVariables(normalizedTheme as ThemeName)
          return normalizedTheme as ThemeName
        }
      }
      const systemTheme = detectSystemTheme()
      applyCssVariables(systemTheme)
      return systemTheme
    }
    applyCssVariables("normal")
    return "normal"
  })
  const [isUserOverride, setIsUserOverride] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return Boolean(window.localStorage.getItem(STORAGE_KEY))
    }
    return false
  })

  useEffect(() => {
    applyCssVariables(theme)
    if (typeof window !== "undefined") {
      if (isUserOverride) {
        window.localStorage.setItem(STORAGE_KEY, theme)
      } else {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [theme, isUserOverride])

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return
    }
    if (isUserOverride) {
      return
    }
    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (event: MediaQueryListEvent) => {
      setThemeState(event.matches ? "dark" : "normal")
    }
    mediaQueryList.addEventListener("change", handleChange)
    return () => {
      mediaQueryList.removeEventListener("change", handleChange)
    }
  }, [isUserOverride])

  const handleSetTheme = useCallback((nextTheme: ThemeName) => {
    setIsUserOverride(true)
    setThemeState(nextTheme)
  }, [])

  const value = useMemo<ThemeContextValue>(() => {
    return {
      theme,
      setTheme: handleSetTheme,
      colors: themes[theme],
    }
  }, [theme, handleSetTheme])

  const muiTheme = useMemo(() => {
    const baseMode =
      theme === "dark"
        ? "dark"
        : theme === "contrast"
        ? "dark"
        : "light"
    return createTheme({
      palette: {
        mode: baseMode,
        primary: {
          main: themes[theme].primary,
        },
        secondary: {
          main: themes[theme].secondary,
        },
        background: {
          default: themes[theme].background,
          paper: themes[theme].surface,
        },
        text: {
          primary: themes[theme].text,
          secondary: themes[theme].secondary,
        },
      },
      typography: {
        fontFamily: "'Fira Sans Condensed', sans-serif",
      },
    })
  }, [theme])

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeContextProvider")
  }

  return context
}

export const availableThemes = Object.keys(themes) as ThemeName[]
