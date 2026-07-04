"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sprout, LayoutDashboard, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GuestSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("guest_sidebar_collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  const handleToggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem("guest_sidebar_collapsed", String(nextState));
  };

  if (!mounted) {
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
            Krishiva <span className="text-primary">Guest</span>
          </motion.span>
        )}
      </div>

      {/* Collapse Action Button */}
      <Button
        onClick={handleToggleCollapse}
        variant="outline"
        size="icon"
        aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
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
        <Link
          href="/guest/dashboard"
          className={cn(
            "group relative flex items-center rounded-[18px] py-3.5 text-xs font-semibold text-muted-foreground transition-all duration-200 hover:bg-primary/5 hover:text-foreground cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary",
            isCollapsed ? "justify-center px-0 gap-0" : "px-4.5 py-3.5 gap-3",
            "text-primary bg-primary/10"
          )}
        >
          <motion.div
            layoutId="guest-sidebar-active"
            className="absolute left-0 top-1/4 bottom-1/4 w-1.25 bg-primary rounded-r-full"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />

          <LayoutDashboard className="h-5.2 w-5.2 shrink-0 text-primary" strokeWidth={2.2} />

          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="whitespace-nowrap truncate"
            >
              Demo Dashboard
            </motion.span>
          )}
        </Link>
      </nav>

      {/* Bottom Sign Out */}
      <div className={cn("border-t border-border pt-4 mt-auto flex flex-col gap-3 shrink-0", isCollapsed ? "items-center" : "px-3")}>
        <Link
          href="/login"
          className={cn(
            "flex items-center gap-3 text-xs font-semibold text-rose-500 hover:bg-rose-500/5 py-2.5 rounded-btn transition-all duration-200 w-full",
            isCollapsed ? "justify-center px-0" : "px-3"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </Link>

        <div className="text-[10px] text-muted-foreground/60 text-center select-none font-semibold">
          {isCollapsed ? "v1.0.4" : "Krishiva Version 1.0.4"}
        </div>
      </div>
    </motion.aside>
  );
}
