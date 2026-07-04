"use client";

import * as React from "react";
import { TopBar } from "@/components/navigation/TopBar";
import { Footer } from "@/components/navigation/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Cookie, Shield, Eye, AlertTriangle } from "lucide-react";

export default function AiAndCookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <TopBar />
        
        <main className="max-w-4xl mx-auto px-4 py-10 md:py-14 space-y-8 select-text">
          {/* Header */}
          <div className="space-y-2 text-center md:text-left select-none">
            <Badge variant="success" className="text-[9px] font-bold px-2 py-0.5 uppercase tracking-wide">Usage Details</Badge>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">AI & Cookie Policy</h1>
            <p className="text-xs text-muted-foreground">Last Updated: October 2026</p>
          </div>

          <div className="space-y-6">
            {/* Cookie Policy Card */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-border/40 select-none">
                <Cookie className="h-5 w-5 text-primary shrink-0" />
                <h2 className="text-base font-bold text-foreground">1. Cookies & local Storage</h2>
              </div>
              <div className="space-y-3.5 text-xs text-muted-foreground leading-relaxed">
                <p>
                  Krishiva utilizes small text cookies and local browser storage to keep the interface functioning correctly and recall preferences. We classify our cookie usage into:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-foreground">Essential Cookies:</strong> Utilized to hold authentication tokens and session security parameters. Disabling them will log you out of the dashboards.
                  </li>
                  <li>
                    <strong className="text-foreground">Theme & Language Cookies:</strong> Retain choices like Light/Dark mode toggles and accent colors selected inside Settings.
                  </li>
                  <li>
                    <strong className="text-foreground">User Consent:</strong> Your choices are saved locally. You can manage or delete cookies via your browser settings.
                  </li>
                </ul>
              </div>
            </Card>

            {/* AI Transparency Card */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-border/40 select-none">
                <Bot className="h-5 w-5 text-primary shrink-0" />
                <h2 className="text-base font-bold text-foreground">2. AI Transparency</h2>
              </div>
              <div className="space-y-3.5 text-xs text-muted-foreground leading-relaxed">
                <p>
                  Krishiva integrates Large Language Models (Google Gemini) and vision models to automate agricultural diagnostics:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-foreground">Voice Processing Transparency:</strong> Audio files spoken to the Vira Voice Assistant are streamed to transcribers and language processing pipelines. These recordings are not utilized for training third-party advertising.
                  </li>
                  <li>
                    <strong className="text-foreground">Crop Image Processing:</strong> Photos submitted to the Disease Diagnostic Camera are examined for structural leaf damage (such as rust, blight, or pests). Analysis is fully automated.
                  </li>
                  <li>
                    <strong className="text-foreground">Location Usage:</strong> GPS coordinates are combined with prompt parameters so Gemini delivers localized suggestions.
                  </li>
                </ul>
              </div>
            </Card>

            {/* AI Limitations Card */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-border/40 select-none">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                <h2 className="text-base font-bold text-foreground">3. AI Limitations</h2>
              </div>
              <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                <p>
                  Large Language Models can experience hallucinations or produce incorrect diagnostic matches. Botanical models might misidentify disease symptoms depending on photographic lighting and camera blur.
                </p>
                <p>
                  All generated outputs must be double-checked by a qualified agricultural expert before introducing heavy pesticides or changing soil treatments.
                </p>
              </div>
            </Card>

            {/* Security & Retention Card */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-border/40 select-none">
                <Shield className="h-5 w-5 text-primary shrink-0" />
                <h2 className="text-base font-bold text-foreground">4. Security Measures & Data Retention</h2>
              </div>
              <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                <p>
                  We keep analytical prompts and diagnosis photos for 90 days to generate historical trend reports and refine local predictions. You can purge your history via your Profile dashboard.
                </p>
                <p>
                  All AI interfaces are governed by Google Cloud security protocols, ensuring enterprise-grade protection over all data pipelines.
                </p>
              </div>
            </Card>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
