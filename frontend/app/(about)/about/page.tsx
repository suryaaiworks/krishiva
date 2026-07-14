"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { 
  Sprout, ArrowLeft, Heart, Shield, Cpu, Award, Users, Code, BookOpen
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-16 text-left">
        
        {/* Header Block */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-muted border border-border cursor-pointer"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              {t("About Krishiva")} <Sprout className="h-5 w-5 text-primary animate-pulse" />
            </h1>
            <p className="text-xs text-muted-foreground">
              {t("Learn about our vision, tech stack, and commitment to rural agricultural empowerment.")}
            </p>
          </div>
        </div>

        {/* Brand Mission center */}
        <div className="relative overflow-hidden rounded-[24px] border border-emerald-500/10 bg-gradient-to-r from-amber-500/5 via-emerald-600/5 to-transparent p-8 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sprout className="h-8 w-8" />
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl font-extrabold text-foreground">{t("Empowering Farmers with AI")}</h2>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              {t("Krishiva is a world-class, AI-first agricultural operating system designed to elevate smallholder and marginal farmers. By combining satellite telemetry, foliage diagnostics, B2B price comparisons, and voice-assisted translations, we minimize harvest losses and bypass crop brokerage barriers.")}
            </p>
          </div>
        </div>

        {/* Tech Stack and Core values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tech Stack Details */}
          <Card title="" animate={false} className="p-6 space-y-4 bg-card border border-border/80 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <Cpu className="h-5 w-5 text-primary shrink-0" />
              <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">{t("Technical Architecture")}</h4>
            </div>

            <div className="space-y-3.5 text-xs text-muted-foreground leading-normal">
              <div className="flex items-start gap-3">
                <Code className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block">{t("Frontend Stack")}</strong>
                  Next.js 15 (Turbopack), React 19, TypeScript, Tailwind CSS v4, Framer Motion, and shadcn/ui.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Cpu className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block">{t("Backend APIs")}</strong>
                  FastAPI REST server, Pydantic v2 validation settings, and Uvicorn hot-reload.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block">{t("AI & Agent Orchestrator")}</strong>
                  LangGraph StateGraphs routing, Vertex AI Google Gemini Pro API models, Google Cloud Translation, and GCloud Speech-to-Text.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block">{t("Database & Storage")}</strong>
                  Google Cloud Firestore and Firebase Admin SDK connections.
                </div>
              </div>
            </div>
          </Card>

          {/* Core Principles */}
          <Card title="" animate={false} className="p-6 space-y-4 bg-card border border-border/80 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <Award className="h-5 w-5 text-primary shrink-0" />
              <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">{t("Design & Product Principles")}</h4>
            </div>

            <div className="space-y-3.5 text-xs text-muted-foreground leading-normal">
              <div className="flex items-start gap-3">
                <Heart className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block">{t("Accessibility First")}</strong>
                  Large touch bounds, voice assistance, and regional language support specifically tailored for rural, low-literacy farmers.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block">{t("Data Integrity & Privacy")}</strong>
                  All land titles, transaction telemetry, and diagnostic logs are pre-encrypted using industry-standard Firebase JWT parameters.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookOpen className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block">{t("Open Collaboration")}</strong>
                  Designed for integration with regional RSK (Rythu Seva Kendra) blocks and authorized farming cooperatives.
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Hackathon Project credits */}
        <div className="bg-muted/50 p-6 rounded-card border border-border/60 text-center space-y-2">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">Google AI Hackathon 2026</span>
          <h3 className="font-heading text-sm font-bold text-foreground">Developed by Aura-Build Team</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            Krishiva was built specifically for the Google Hackathon to demonstrate GCloud Run scalability, Google Earth Engine satellite analysis, and Gemini conversational UI compatibility.
          </p>
        </div>

      </div>
    </MainLayout>
  );
}
