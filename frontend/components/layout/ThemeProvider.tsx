"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

export type AccentColor = "forest" | "teal" | "blue" | "amber" | "rose";

interface ThemeContextType {
  accentColor: AccentColor;
  setAccentColor: (accent: AccentColor) => void;
  activeScenarioId: number;
  setActiveScenarioId: (id: number) => void;
  isDemoDrawerOpen: boolean;
  setIsDemoDrawerOpen: (open: boolean) => void;
}

const ThemeContext = React.createContext<ThemeContextType>({
  accentColor: "forest",
  setAccentColor: () => {},
  activeScenarioId: 1,
  setActiveScenarioId: () => {},
  isDemoDrawerOpen: false,
  setIsDemoDrawerOpen: () => {},
});

export const useThemeContext = () => React.useContext(ThemeContext);

const ACCENT_COLORS = {
  forest: {
    light: {
      primary: "oklch(0.47 0.15 142)", // Forest Green
      primaryForeground: "oklch(1 0 0)",
      ring: "oklch(0.47 0.15 142)",
    },
    dark: {
      primary: "oklch(0.67 0.18 142)",
      primaryForeground: "oklch(0.13 0.02 250)",
      ring: "oklch(0.67 0.18 142)",
    },
  },
  teal: {
    light: {
      primary: "oklch(0.55 0.15 170)", // Teal
      primaryForeground: "oklch(1 0 0)",
      ring: "oklch(0.55 0.15 170)",
    },
    dark: {
      primary: "oklch(0.70 0.15 170)",
      primaryForeground: "oklch(0.13 0.02 250)",
      ring: "oklch(0.70 0.15 170)",
    },
  },
  blue: {
    light: {
      primary: "oklch(0.55 0.18 250)", // Blue
      primaryForeground: "oklch(1 0 0)",
      ring: "oklch(0.55 0.18 250)",
    },
    dark: {
      primary: "oklch(0.70 0.16 250)",
      primaryForeground: "oklch(0.13 0.02 250)",
      ring: "oklch(0.70 0.16 250)",
    },
  },
  amber: {
    light: {
      primary: "oklch(0.68 0.18 70)", // Amber
      primaryForeground: "oklch(0.12 0.01 250)",
      ring: "oklch(0.68 0.18 70)",
    },
    dark: {
      primary: "oklch(0.78 0.18 70)",
      primaryForeground: "oklch(0.13 0.02 250)",
      ring: "oklch(0.78 0.18 70)",
    },
  },
  rose: {
    light: {
      primary: "oklch(0.60 0.20 15)", // Rose
      primaryForeground: "oklch(1 0 0)",
      ring: "oklch(0.60 0.20 15)",
    },
    dark: {
      primary: "oklch(0.72 0.18 15)",
      primaryForeground: "oklch(0.13 0.02 250)",
      ring: "oklch(0.72 0.18 15)",
    },
  },
};

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <ThemeProviderHelper>{children}</ThemeProviderHelper>
    </NextThemesProvider>
  );
}

function ThemeProviderHelper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [accentColor, setAccentColorState] = React.useState<AccentColor>("forest");
  const [activeScenarioId, setActiveScenarioIdState] = React.useState<number>(1);
  const [isDemoDrawerOpen, setIsDemoDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    const savedAccent = localStorage.getItem("krishiva_accent_color") as AccentColor;
    if (savedAccent && ACCENT_COLORS[savedAccent]) {
      setAccentColorState(savedAccent);
    }
    const savedScenario = localStorage.getItem("demo_scenario_id");
    if (savedScenario) {
      setActiveScenarioIdState(Number(savedScenario));
    }
  }, []);

  const setAccentColor = React.useCallback((accent: AccentColor) => {
    setAccentColorState(accent);
    localStorage.setItem("krishiva_accent_color", accent);
  }, []);

  const setActiveScenarioId = React.useCallback((id: number) => {
    setActiveScenarioIdState(id);
    localStorage.setItem("demo_scenario_id", String(id));
  }, []);

  React.useEffect(() => {
    if (!resolvedTheme) return;
    const mode = resolvedTheme === "dark" ? "dark" : "light";
    const colors = ACCENT_COLORS[accentColor][mode];
    
    document.documentElement.style.setProperty("--primary", colors.primary);
    document.documentElement.style.setProperty("--primary-foreground", colors.primaryForeground);
    document.documentElement.style.setProperty("--ring", colors.ring);
  }, [accentColor, resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ accentColor, setAccentColor, activeScenarioId, setActiveScenarioId, isDemoDrawerOpen, setIsDemoDrawerOpen }}>
      {children}
    </ThemeContext.Provider>
  );
}
