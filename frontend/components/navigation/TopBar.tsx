"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Bell, Languages, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn bg-primary text-primary-foreground shadow-sm">
            <Sprout className="h-5 w-5" />
          </div>
          <span className="font-heading text-lg font-bold tracking-tight text-foreground">
            Krishiva <span className="text-primary">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Custom Language Selector Dropdown */}
          <div className="relative z-40 select-none">
            <Select value={language} onValueChange={(val) => { if (val) setLanguage(val as any); }}>
              <SelectTrigger className="h-8 text-[11px] font-bold rounded-btn border border-border bg-card px-2.5 flex items-center gap-1.5 cursor-pointer">
                <Languages className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="te">తెలుగు</SelectItem>
                <SelectItem value="hi">हिन्दी</SelectItem>
              </SelectContent>
            </Select>
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
