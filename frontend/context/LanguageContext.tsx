"use client";

import * as React from "react";
import { Language, translations } from "@/constants/translations";
import { apiClient } from "@/services/apiClient";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
  loading: boolean;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<Language>("en");
  const [loading, setLoading] = React.useState(true);

  // Initialize language from localStorage or backend
  React.useEffect(() => {
    async function initializeLanguage() {
      if (typeof window === "undefined") return;

      const savedLang = localStorage.getItem("krishiva_language") as Language;
      if (savedLang && ["en", "te", "hi"].includes(savedLang)) {
        setLanguageState(savedLang);
        setLoading(false);
        return;
      }

      // If no local storage but logged in, sync from backend settings
      const token = localStorage.getItem("krishiva_token");
      if (token) {
        try {
          const settings = await apiClient.get<any>("/settings");
          if (settings && settings.language && ["en", "te", "hi"].includes(settings.language)) {
            const dbLang = settings.language as Language;
            setLanguageState(dbLang);
            localStorage.setItem("krishiva_language", dbLang);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn("Failed to fetch backend language settings during initialization", err);
        }
      }

      // Fallback default
      setLanguageState("en");
      localStorage.setItem("krishiva_language", "en");
      setLoading(false);
    }

    initializeLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
    if (!["en", "te", "hi"].includes(lang)) return;

    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("krishiva_language", lang);
      
      // Update vira farmer context language dynamically
      if (window.KrishivaFarmer) {
        window.KrishivaFarmer.language = lang;
      }
    }

    // Synchronize to backend if authenticated
    const token = typeof window !== "undefined" ? localStorage.getItem("krishiva_token") : null;
    if (token) {
      try {
        await apiClient.patch("/settings", { language: lang });
        console.log("Synchronized language preference to backend successfully.");
      } catch (err) {
        console.warn("Failed to synchronize language preference to backend", err);
      }
    }
  };

  const t = (key: string): string => {
    const dict = translations[language];
    if (dict && dict[key] !== undefined) {
      return dict[key];
    }
    // Fallback to English dictionary
    const engDict = translations["en"];
    if (engDict && engDict[key] !== undefined) {
      return engDict[key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, loading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
