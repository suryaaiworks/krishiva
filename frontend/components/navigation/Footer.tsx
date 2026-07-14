"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Lock, Shield, Bot, Cloud, 
  Sprout, Trophy, Zap, Flag
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const trustItems = [
    { icon: Lock,    label: t("End-to-End Encrypted"),      color: "text-emerald-600 dark:text-emerald-400" },
    { icon: Shield,  label: t("Secure Authentication"),      color: "text-blue-600 dark:text-blue-400" },
    { icon: Zap,     label: t("Powered by Google Gemini"),   color: "text-amber-600 dark:text-amber-400" },
    { icon: Cloud,   label: t("Secure Cloud Infrastructure"), color: "text-sky-600 dark:text-sky-400" },
    { icon: Sprout,  label: t("Built for Indian Farmers"),   color: "text-primary dark:text-primary" },
    { icon: Flag,    label: t("Made in India 🇮🇳"),           color: "text-orange-600 dark:text-orange-400" },
    { icon: Trophy,  label: t("Google Hackathon Project"),   color: "text-violet-600 dark:text-violet-400" },
    { icon: Bot,     label: t("AI-First Agriculture"),        color: "text-rose-600 dark:text-rose-400" },
  ];

  const showTrust = pathname === "/" || pathname === "/about" || pathname === "/dashboard";

  return (
    <footer className="w-full bg-card border-t border-border mt-6 py-6 px-4 select-none">
      <div className="max-w-7xl mx-auto space-y-6 text-xs">
        
        {/* Trusted & Secure Badge Panel */}
        {showTrust && (
          <div className="space-y-3 animate-fade-in text-left">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest block text-center sm:text-left">
              {t("Trusted & Secure Platform")}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {trustItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={idx} 
                    className="kv-card-hover flex items-center gap-2 p-3 rounded-[14px] bg-muted/20 border border-border/40 hover:bg-muted/40 cursor-default"
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${item.color}`} />
                    <span className="font-semibold text-foreground leading-normal">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation & copyright */}
        <div className="pt-4 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 font-bold text-muted-foreground">
            <Link href="/privacy"  className="hover:text-primary transition-colors duration-150">{t("Privacy Policy")}</Link>
            <Link href="/terms"    className="hover:text-primary transition-colors duration-150">{t("Terms & Conditions")}</Link>
            <Link href="/policies" className="hover:text-primary transition-colors duration-150">{t("AI & Cookie Policy")}</Link>
            <Link href="/about"    className="hover:text-primary transition-colors duration-150">{t("About Krishiva")}</Link>
            <Link href="/help"     className="hover:text-primary transition-colors duration-150">{t("Help Center")}</Link>
            <Link href="mailto:support@krishiva.ai" className="hover:text-primary transition-colors duration-150">{t("Contact Us")}</Link>
          </div>

          <div className="text-[10.5px] text-muted-foreground/75 font-semibold text-center md:text-right">
            © {new Date().getFullYear()} Krishiva. {t("All rights reserved.")}
          </div>
        </div>

      </div>
    </footer>
  );
}
