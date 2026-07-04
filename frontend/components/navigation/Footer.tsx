"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Lock, Shield, Bot, Cloud, MapPin, 
  Sprout, Award, HelpCircle, Mail, BookOpen 
} from "lucide-react";

export function Footer() {
  const trustItems = [
    { icon: Lock, label: "End-to-End Encrypted" },
    { icon: Shield, label: "Secure Authentication" },
    { icon: Bot, label: "Powered by Google Gemini" },
    { icon: Cloud, label: "Secure Cloud Infrastructure" },
    { icon: MapPin, label: "Location Protected" },
    { icon: Sprout, label: "Built for Indian Farmers" },
    { icon: Award, label: "Made in India" },
    { icon: Award, label: "Google Hackathon Project" },
  ];

  return (
    <footer className="w-full bg-card border-t border-border mt-12 py-10 px-4 select-none">
      <div className="max-w-7xl mx-auto space-y-8 text-xs">
        
        {/* Trusted & Secure Badge Panel */}
        <div className="space-y-4">
          <span className="text-[10px] font-black text-primary uppercase tracking-wider block text-center sm:text-left">
            Trusted & Secure Platform
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {trustItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx} 
                  className="flex items-center gap-2 p-3.5 rounded-btn bg-muted/20 border border-border/40 hover:bg-muted/40 transition-colors"
                >
                  <Icon className="h-4.5 w-4.5 text-primary shrink-0" />
                  <span className="font-semibold text-foreground leading-normal">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation & copyright */}
        <div className="pt-6 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-5">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2.5 font-bold text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link>
            <Link href="/policies" className="hover:text-primary transition-colors">AI & Cookie Policy</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About Krishiva</Link>
            <Link href="/help" className="hover:text-primary transition-colors">Help Center</Link>
            <Link href="mailto:support@krishiva.ai" className="hover:text-primary transition-colors">Contact Us</Link>
          </div>

          <div className="text-[10.5px] text-muted-foreground/75 font-semibold text-center md:text-right">
            © {new Date().getFullYear()} Krishiva. All rights reserved. 🇮🇳
          </div>
        </div>

      </div>
    </footer>
  );
}
