"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Bell, Languages, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { useLanguage } from "@/context/LanguageContext";

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const { language, setLanguage, t } = useLanguage();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-btn bg-primary text-primary-foreground">
            <Sprout className="h-5 w-5" />
          </div>
          <span className="font-heading text-lg font-bold tracking-tight text-foreground">
            Krishiva <span className="text-primary">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Custom Language Selector Dropdown */}
          <div className="relative flex items-center border border-border rounded-btn px-2 py-1 bg-card hover:bg-muted text-xs font-bold gap-1 text-foreground transition-colors cursor-pointer select-none">
            <Languages className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent font-sans text-xs outline-none cursor-pointer text-foreground font-bold border-none py-0.5"
            >
              <option value="en" className="bg-popover text-foreground">{t("English")}</option>
              <option value="te" className="bg-popover text-foreground">{t("Telugu")}</option>
              <option value="hi" className="bg-popover text-foreground">{t("Hindi")}</option>
            </select>
          </div>

          <Link href="/notifications">
            <Button variant="ghost" size="icon" aria-label={t("Notifications")}>
              <Bell className="h-5 w-5" />
            </Button>
          </Link>

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle Theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
