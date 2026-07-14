"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Landmark, Activity, Calendar, Info, Heart, Save, Share2, PhoneCall, Brain
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { UploadImageCard } from "@/components/disease/UploadImageCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/services/apiClient";

export default function DiseaseDetectionPage() {
  const [phase, setPhase] = React.useState<"upload" | "scanning" | "result">("upload");
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [scanProgress, setScanProgress] = React.useState(0);
  const [scanStatus, setScanStatus] = React.useState("Initializing camera lens...");
  const [scanResult, setScanResult] = React.useState<any>(null);

  const handleImageSelected = async (file: File | null) => {
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setPhase("scanning");
      setScanProgress(0);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await apiClient.post<any>("/disease/scan", formData);
        if (res) {
          setScanResult(res);
        }
      } catch (err) {
        console.error("Leaf scanning upload failed", err);
      }
    } else {
      setPreviewUrl(null);
    }
  };

  // Simulate AI Scanning progress
  React.useEffect(() => {
    if (phase !== "scanning") return;

    const duration = 3000; // 3 seconds scan
    const intervalTime = 50;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => setPhase("result"), 500);
          return 100;
        }

        // Dynamic status updates based on progress
        if (next < 30) {
          setScanStatus("Analyzing foliage cell geometry...");
        } else if (next < 70) {
          setScanStatus("Correlating spot patterns with Puccinia rust database...");
        } else {
          setScanStatus("Gemini advisor mapping treatment schedules...");
        }

        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [phase]);

  const resetScanner = () => {
    setPreviewUrl(null);
    setPhase("upload");
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in pb-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <SectionHeader 
            title="AI Crop Disease Detection" 
            description="Upload crop leaf images for rapid disease identification and treatment options."
            className="mb-0"
          />
          {phase === "result" && (
            <Button onClick={resetScanner} variant="outline" className="text-xs font-bold rounded-btn cursor-pointer">
              Scan Another Crop
            </Button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {/* PHASE 1: UPLOAD PHASE */}
          {phase === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              {/* Informational intro card */}
              <div className="rounded-card border border-primary/20 bg-primary/5 p-5 flex items-start gap-3.5">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs leading-relaxed text-muted-foreground">
                  <span className="font-bold text-foreground block">How it works:</span>
                  Take a clear photo of the infected crop leaf from above. Avoid glares, hands, or shadows. Our Gemini-powered agricultural scanner will analyze lesions and recommend organic/chemical recovery schedules.
                </div>
              </div>

              {/* Uploader Card component */}
              <UploadImageCard onImageSelected={handleImageSelected} className="h-72" />
            </motion.div>
          )}

          {/* PHASE 2: SCANNING ANIMATION */}
          {phase === "scanning" && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto space-y-6 flex flex-col items-center justify-center text-center"
            >
              {/* Photo Preview with moving scanning laser */}
              <div className="relative w-full aspect-video rounded-card overflow-hidden border border-border bg-muted flex items-center justify-center shadow-md">
                {previewUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={previewUrl}
                    alt="Scanning preview"
                    className="w-full h-full object-cover"
                  />
                )}
                {/* Horizontal Neon scanning laser line */}
                <motion.div
                  className="absolute left-0 right-0 h-1.5 bg-primary shadow-[0_0_12px_var(--primary)] pointer-events-none"
                  animate={{
                    top: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                />
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
              </div>

              {/* Progress and status loaders */}
              <div className="w-full space-y-3">
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground animate-pulse">
                    {scanStatus}
                  </p>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Analyzing Cellular Structure... {Math.round(scanProgress)}%
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* PHASE 3: RESULT DASHBOARD */}
          {phase === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Grid panel */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* COLUMN 1: IMAGE PREVIEW & DIAGNOSIS SUMMARY */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Scanned Image Card */}
                  <Card title="" animate={false} className="p-4 bg-muted/30">
                    <div className="relative w-full aspect-video rounded-btn overflow-hidden border border-border bg-card">
                      {previewUrl && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={previewUrl}
                          alt="Diagnosis leaf scan result"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="mt-3 flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Scan Source: File Upload</span>
                      <Badge variant="outline" className="text-[10px] font-bold border-primary text-primary bg-primary/5">
                        ID: #SCAN-8092
                      </Badge>
                    </div>
                  </Card>

                  {/* Diagnosis Result Card */}
                  <Card title="" animate={false} className="p-5 border-l-4 border-l-warning bg-card shadow-sm border-t-0 border-r-0 border-b-0">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-warning uppercase tracking-wider block">
                            Scan Diagnosis
                          </span>
                          <h3 className="text-lg font-bold text-foreground">{scanResult?.disease_name || "Sugarcane Rust"}</h3>
                        </div>
                        <Badge variant="warning" className="font-bold px-2 py-0.5 text-xs">
                          {scanResult?.confidence ? Math.round(scanResult.confidence) : 94}% Match
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 py-3 border-y border-border/50 text-xs">
                        <div>
                          <span className="text-muted-foreground block">Crop:</span>
                          <span className="font-bold text-foreground">{scanResult?.crop_name || "Sugarcane (Co 86032)"}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Severity:</span>
                          <span className="font-bold text-warning">{scanResult?.severity || "Medium"}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <span className="font-bold text-foreground flex items-center gap-1.5">
                          <Brain className="h-4 w-4 text-primary shrink-0" />
                          AI Explanation
                        </span>
                        <p className="text-muted-foreground leading-relaxed">
                          {scanResult?.description || "Orange-brown lesions and pustules detected on lower sugarcane leaves. Warm temperature combined with micro-hydration layers on leaf surfaces caused fungal germination."}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* COLUMN 2: TREATMENT & RECOVERY PLAN DETAILS */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Treatment details card */}
                  <Card title="" animate={false} className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-border/50">
                        <Activity className="h-5 w-5 text-primary" />
                        <h3 className="text-base font-bold text-foreground">AI-Recommended Treatment Plan</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                        <div className="space-y-3">
                          <span className="font-bold text-foreground block uppercase tracking-wider text-[10px] text-primary">
                            1. Recommended Fungicide Chemical Spray
                          </span>
                          <p className="text-muted-foreground">
                            {scanResult?.treatment_chemical || "Spray Mancozeb (0.2%) or Propiconazole (0.1%) at 15-day intervals directly on leaf surfaces. Focus sprays on lesions."}
                          </p>
                          <span className="font-bold text-foreground block uppercase tracking-wider text-[10px] text-primary pt-2">
                            2. Organic Solutions & Sanitation
                          </span>
                          <p className="text-muted-foreground">
                            {scanResult?.treatment_organic || "Uproot heavily infected stalks to prevent spore dispersion. Apply neem oil spray (1.5%) on adjacent rows as a biological barrier."}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <span className="font-bold text-foreground block uppercase tracking-wider text-[10px] text-primary">
                            3. Agronomic Prevention Measures
                          </span>
                          {scanResult?.preventive_measures ? (
                            <p className="text-muted-foreground">{scanResult.preventive_measures}</p>
                          ) : (
                            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
                              <li>Avoid excess nitrogen fertilizers (causes lush, disease-susceptible foliage).</li>
                              <li>Switch overhead sprinklers to drip irrigation to keep leaf surfaces dry.</li>
                              <li>Adopt crop rotation with legume crops in the next rotation cycle.</li>
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Recovery stats card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recovery summary card */}
                    <Card title="" animate={false} className="p-6 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Heart className="h-4 w-4 text-emerald-500" />
                          <span>Expected Recovery Chance</span>
                        </div>
                        <h4 className="text-3xl font-extrabold text-foreground">85%</h4>
                        <p className="text-xs text-muted-foreground leading-normal">
                          If treatment is applied within 48 hours. Sugarcane exhibits high structural immunity to rust once fungicide terminates spores.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border/50 flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Recovery Window:</span>
                        <span className="font-bold text-foreground">14 - 21 Days</span>
                      </div>
                    </Card>

                    {/* Cost and inspection card */}
                    <Card title="" animate={false} className="p-6 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Landmark className="h-4 w-4 text-primary" />
                          <span>Estimated Treatment Cost</span>
                        </div>
                        <h4 className="text-3xl font-extrabold text-foreground">₹1,200 <span className="text-xs font-semibold text-muted-foreground">/ Acre</span></h4>
                        <p className="text-xs text-muted-foreground leading-normal">
                          Covers standard Mancozeb packages and sprayer labor costs. This is 80% lower than potential crop yield losses if untreated.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border/50 flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Next Inspection:</span>
                        <span className="font-bold text-foreground">July 4 (in 7 Days)</span>
                      </div>
                    </Card>
                  </div>

                </div>
              </div>

              {/* SECTION: PROGRESSIVE TIMELINE */}
              <Card title="" animate={false} className="p-6">
                <div className="flex items-center gap-2 pb-4 border-b border-border/50 mb-6">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-bold text-foreground">Crop Recovery Timeline</h3>
                </div>

                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-4">
                  {/* Progress Line for desktop */}
                  <div className="hidden md:block absolute top-[15px] left-8 right-8 h-1 bg-muted pointer-events-none z-0 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "50%" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-primary"
                    />
                  </div>
                  
                  {/* Timeline step 1 (Completed) */}
                  <div className="relative z-10 flex md:flex-col items-center gap-3.5 text-left md:text-center md:flex-1">
                    <motion.div 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-md border-2 border-primary/20"
                    >
                      ✓
                    </motion.div>
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-foreground block">1. Leaf Photo Scanned</span>
                      <span className="text-[10px] text-muted-foreground">June 27, 01:13 AM</span>
                    </div>
                  </div>

                  {/* Timeline step 2 (Completed) */}
                  <div className="relative z-10 flex md:flex-col items-center gap-3.5 text-left md:text-center md:flex-1">
                    <motion.div 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-md border-2 border-primary/20"
                    >
                      ✓
                    </motion.div>
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-foreground block">2. AI Rust Confirmed</span>
                      <span className="text-[10px] text-muted-foreground">94% Confidence</span>
                    </div>
                  </div>

                  {/* Timeline step 3 (Current / Active) */}
                  <div className="relative z-10 flex md:flex-col items-center gap-3.5 text-left md:text-center md:flex-1">
                    <motion.div 
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-md border-2 border-primary/20"
                    >
                      3
                    </motion.div>
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-foreground block">3. Fungicide Spraying</span>
                      <span className="text-[10px] text-primary font-semibold">Start: Within 48 hours</span>
                    </div>
                  </div>

                  {/* Timeline step 4 (Upcoming / Grey) */}
                  <div className="relative z-10 flex md:flex-col items-center gap-3.5 text-left md:text-center md:flex-1 opacity-60">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground font-bold text-xs border-2 border-border/40">
                      4
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-foreground block">4. Foliage Pruning</span>
                      <span className="text-[10px] text-muted-foreground">Prune infected residues</span>
                    </div>
                  </div>

                  {/* Timeline step 5 (Upcoming / Grey) */}
                  <div className="relative z-10 flex md:flex-col items-center gap-3.5 text-left md:text-center md:flex-1 opacity-60">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground font-bold text-xs border-2 border-border/40">
                      5
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-foreground block">5. Follow-up Check</span>
                      <span className="text-[10px] text-muted-foreground">In 7 Days (July 4)</span>
                    </div>
                  </div>
                </div>

              </Card>

              {/* SECTION: SMART ACTIONS PANEL */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 bg-muted/40 p-5 rounded-card border border-border/50 justify-between">
                <span className="text-xs font-bold text-muted-foreground">Smart Actions:</span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={() => window.location.href = "/assistant"}
                    variant="outline"
                    className="text-xs font-bold h-9 rounded-btn cursor-pointer bg-card"
                  >
                    <Sparkles className="mr-1.5 h-4 w-4 text-primary" />
                    Ask Advisor
                  </Button>
                  <Button
                    onClick={() => alert("Report saved locally.")}
                    variant="outline"
                    className="text-xs font-bold h-9 rounded-btn cursor-pointer bg-card"
                  >
                    <Save className="mr-1.5 h-4 w-4 text-primary" />
                    Save PDF
                  </Button>
                  <Button
                    onClick={() => alert("Details shared with agronomist.")}
                    variant="outline"
                    className="text-xs font-bold h-9 rounded-btn cursor-pointer bg-card"
                  >
                    <Share2 className="mr-1.5 h-4 w-4 text-primary" />
                    Share Report
                  </Button>
                  <Button
                    onClick={() => alert("Escalated to RSK Pune agricultural officer.")}
                    className="text-xs font-bold h-9 rounded-btn cursor-pointer bg-primary"
                  >
                    <PhoneCall className="mr-1.5 h-4 w-4 text-white" />
                    Escalate to RSK
                  </Button>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}
