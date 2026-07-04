"use client";

import * as React from "react";
import { TopBar } from "@/components/navigation/TopBar";
import { Footer } from "@/components/navigation/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, Lock, FileText, Bot, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <TopBar />
        
        <main className="max-w-4xl mx-auto px-4 py-10 md:py-14 space-y-8 select-text">
          {/* Header */}
          <div className="space-y-2 text-center md:text-left select-none">
            <Badge variant="success" className="text-[9px] font-bold px-2 py-0.5 uppercase tracking-wide">Legal Registry</Badge>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Privacy Policy</h1>
            <p className="text-xs text-muted-foreground">Last Updated: October 2026</p>
          </div>

          <div className="space-y-6">
            {/* Information We Collect Card */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-border/40 select-none">
                <Eye className="h-5 w-5 text-primary shrink-0" />
                <h2 className="text-base font-bold text-foreground">1. Information We Collect</h2>
              </div>
              <div className="space-y-3.5 text-xs text-muted-foreground leading-relaxed">
                <p>
                  To deliver premium agricultural advisory, B2B marketplace matchmaking, and machinery rental coordination, Krishiva collects the following categories of information:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-foreground">Farmer Profile Data:</strong> Registration name, verified phone number, local community hubs, language preferences, and roles.
                  </li>
                  <li>
                    <strong className="text-foreground">Farm & Crop Data:</strong> Total acreage, soil category profiles, historical sowing logs, and crop harvest yields.
                  </li>
                  <li>
                    <strong className="text-foreground">Location Access:</strong> Precise GPS coordinates utilized for fetching weather alerts, regional fertilizer advisory, and local APMC market prices.
                  </li>
                  <li>
                    <strong className="text-foreground">Voice Recordings:</strong> Voice queries submitted to the Vira AI Voice Assistant for transcription and processing.
                  </li>
                  <li>
                    <strong className="text-foreground">Uploaded Images:</strong> Plant leaf photography uploaded to the Disease Diagnostic Camera tool for botanical analysis.
                  </li>
                  <li>
                    <strong className="text-foreground">Device Information:</strong> Browser type, operating system version, and IP addresses to maintain session integrity.
                  </li>
                  <li>
                    <strong className="text-foreground">Cookies:</strong> Session cookies utilized to retain visual preferences and authentication states.
                  </li>
                </ul>
              </div>
            </Card>

            {/* AI Processing using Gemini Card */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-border/40 select-none">
                <Bot className="h-5 w-5 text-primary shrink-0" />
                <h2 className="text-base font-bold text-foreground">2. AI Processing (Google Gemini)</h2>
              </div>
              <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                <p>
                  Krishiva leverages the Google Gemini API to analyze soil data, transcribe multilingual voice queries, diagnose plant diseases, and generate custom farming recommendations.
                </p>
                <p>
                  Voice recordings and leaf images are securely transmitted to Google Gemini API servers for diagnostic processing. Transmitted payloads do not contain personal identifiers such as legal names or phone numbers.
                </p>
              </div>
            </Card>

            {/* Data Encryption & Security */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-border/40 select-none">
                <Lock className="h-5 w-5 text-primary shrink-0" />
                <h2 className="text-base font-bold text-foreground">3. Data Encryption & Security</h2>
              </div>
              <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                <p>
                  All data in transit is protected using SSL/TLS encryption. Data stored within our cloud database architecture is protected using AES-256 standard encryption.
                </p>
                <p>
                  Security audits are conducted quarterly to verify system robustness, firewalls, and data access policies.
                </p>
              </div>
            </Card>

            {/* User Rights & Data Deletion */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-border/40 select-none">
                <Shield className="h-5 w-5 text-primary shrink-0" />
                <h2 className="text-base font-bold text-foreground">4. User Rights & Data Deletion</h2>
              </div>
              <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                <p>
                  You retain complete ownership over your farm profiles. You have the right to inspect, edit, or purge your records from our systems at any time.
                </p>
                <p>
                  To request complete deletion of your account and personal farm history, please contact our support team at <span className="font-bold text-primary">support@krishiva.ai</span>. Deletion requests are processed within 7 business days.
                </p>
              </div>
            </Card>

            {/* Third-party services */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-border/40 select-none">
                <FileText className="h-5 w-5 text-primary shrink-0" />
                <h2 className="text-base font-bold text-foreground">5. Third-Party Services</h2>
              </div>
              <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                <p>
                  We coordinate with trusted partner services for authentication providers (e.g. Supabase Auth), secure database hosting, and Google AI services. Third-party providers are legally bound to protect your data and are barred from selling farm profile records.
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
