"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS } from "@/constants/navigation";
import { Sprout, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { t } = useLanguage();

  // Safely read and persist collapse state to localStorage on client-side
  React.useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("krishiva_sidebar_collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  const handleToggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem("krishiva_sidebar_collapsed", String(nextState));
  };

  if (!mounted) {
    // Avoid layout hydration flashing by rendering a basic placeholder
    return (
      <aside className="hidden md:flex h-screen w-64 flex-col border-r border-border bg-card p-4 sticky top-0" />
    );
  }

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 88 : 264 }}
      transition={{ type: "spring", stiffness: 350, damping: 35 }}
      className={cn(
        "hidden md:flex h-screen flex-col border-r border-border bg-card sticky top-0 relative z-30 shrink-0",
        isCollapsed ? "p-3" : "p-4"
      )}
    >
      {/* Brand Header */}
      <div className={cn("flex items-center select-none min-h-[64px] mb-4 py-4", isCollapsed ? "justify-center px-0" : "px-3 gap-2.5")}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn bg-primary text-primary-foreground shadow-sm">
          <Sprout className="h-5 w-5" />
        </div>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="font-heading text-lg font-bold tracking-tight text-foreground whitespace-nowrap"
          >
            Krishiva <span className="text-primary">AI</span>
          </motion.span>
        )}
      </div>

      {/* Collapse Action Button */}
      <Button
        onClick={handleToggleCollapse}
        variant="outline"
        size="icon"
        aria-label={isCollapsed ? t("Expand Sidebar") : t("Collapse Sidebar")}
        className="absolute -right-3 top-6 h-6.5 w-6.5 rounded-full border border-border bg-card flex items-center justify-center cursor-pointer shadow-sm hover:bg-muted z-45"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </Button>

      {/* Navigation menu list */}
      <nav className="flex-1 overflow-y-auto space-y-1.5 py-2 pr-1 scrollbar-thin select-none">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center rounded-[18px] py-3.5 text-xs font-semibold text-muted-foreground transition-all duration-200 hover:bg-primary/5 hover:text-foreground cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary",
                isCollapsed ? "justify-center px-0 gap-0" : "px-4.5 py-3.5 gap-3",
                isActive && "text-primary bg-primary/10 hover:bg-primary/10 hover:text-primary"
              )}
            >
              {/* Left active line indicator */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute left-0 top-1/4 bottom-1/4 w-1.25 bg-primary rounded-r-full"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}

              {/* Icon */}
              <Icon className={cn("h-[22px] w-[22px] shrink-0 transition-all duration-200 group-hover:scale-110", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} strokeWidth={2.1} />

              {/* Text label */}
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="whitespace-nowrap truncate"
                >
                  {t(item.label)}
                </motion.span>
              )}

              {/* Beautiful Hover Tooltip when collapsed */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-popover text-popover-foreground border border-border text-[10px] font-bold rounded-btn shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 whitespace-nowrap z-50">
                  {t(item.label)}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile and Version Section */}
      <div className={cn("border-t border-border pt-4 mt-auto flex flex-col gap-3 shrink-0", isCollapsed ? "items-center" : "px-3")}>
        <div className="flex items-center gap-3">
          {/* Avatar icon */}
          <Link 
            href="/profile"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-extrabold text-xs cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
          >
            SR
          </Link>
          {/* Farmer Details */}
          {!isCollapsed && (
            <div className="text-left min-w-0 flex-1">
              <span className="font-bold text-[11px] block text-foreground truncate leading-normal">K. Srinivasa Rao</span>
              <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[8.5px] font-extrabold bg-amber-500/10 text-amber-600 border border-amber-500/20 mt-0.5">
                {t("Premium Farmer")}
              </span>
            </div>
          )}
        </div>

        {/* System Version */}
        <div className="text-[10px] text-muted-foreground/60 text-center select-none font-semibold">
          {isCollapsed ? "v1.0.4" : t("Krishiva Version 1.0.4")}
        </div>
      </div>
    </motion.aside>
  );
}
