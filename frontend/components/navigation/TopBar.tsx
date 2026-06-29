"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Bell, Languages, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-btn bg-primary text-primary-foreground">
            <Sprout className="h-5 w-5" />
          </div>
          <span className="font-heading text-lg font-bold tracking-tight text-foreground">
            Kisan Alert <span className="text-primary">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" aria-label="Switch Language">
            <Languages className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>

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
