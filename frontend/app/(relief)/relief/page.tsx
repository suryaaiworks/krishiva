"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, AlertTriangle, HeartHandshake, Brain, Clock, 
  FileText, Sparkles, Save, Share2, 
  HelpingHand, Store, PhoneCall, Landmark
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UploadImageCard } from "@/components/disease/UploadImageCard";

type PhaseType = "upload" | "scanning" | "result";

// Animated Radar Illustration representing emergency status
function RadarIllustration() {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
      {/* Concentric radar rings */}
      <motion.div 
        className="absolute h-28 w-28 rounded-full border border-red-500/20 bg-red-500/5 pointer-events-none"
        animate={{ scale: [0.8, 1.25, 0.8], opacity: [0.6, 0.15, 0.6] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute h-20 w-20 rounded-full border border-red-500/30 bg-red-500/5 pointer-events-none"
        animate={{ scale: [1.2, 0.8, 1.2], opacity: [0.2, 0.6, 0.2] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      />
      
      <div className="relative h-14 w-14 rounded-full bg-gradient-to-tr from-red-500 to-amber-500 flex items-center justify-center shadow-md border border-white/10">
        <ShieldAlert className="h-6 w-6 text-white animate-pulse" />
      </div>
    </div>
  );
}

const scanLogs = [
  "Locating geotagged plot boundary coordinates...",
  "Retrieving multispectral synthetic-aperture radar biomass values...",
  "Correlating regional flood surge levels from June 26...",
  "Evaluating foliage cell decay and water-logging percentage...",
  "Cross-referencing soil chemical buffers and root stress indices...",
  "Sourcing pre-approved state crop disaster compensation parameters...",
  "Applying PMFBY insurance payout schedules...",
  "Synthesizing emergency recovery steps and alternative rotators..."
];

export default function ReliefHubPage() {
  const [phase, setPhase] = React.useState<PhaseType>("upload");
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [scanProgress, setScanProgress] = React.useState(0);
  const [activeLogIndex, setActiveLogIndex] = React.useState(0);

  const handleImageSelected = (file: File | null) => {
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setPhase("scanning");
      setScanProgress(0);
      setActiveLogIndex(0);
    } else {
      setPreviewUrl(null);
    }
  };

  React.useEffect(() => {
    if (phase !== "scanning") return;

    const duration = 4000; // 4 seconds total
    const intervalTime = 80;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => setPhase("result"), 500);
          return 100;
        }

        // Map progress percentage to active log item index
        const logIndex = Math.min(
          Math.floor((next / 100) * scanLogs.length),
          scanLogs.length - 1
        );
        setActiveLogIndex(logIndex);

        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [phase]);

  const resetReliefScanner = () => {
    setPreviewUrl(null);
    setPhase("upload");
  };

  return (
    <MainLayout>
      <div className="space-y-8 pb-16 animate-fade-in">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <SectionHeader 
            title="Farmer Relief & Recovery Hub" 
            description="AI-powered emergency command center to help farmers evaluate crop damage and accelerate financial recovery."
            className="mb-0"
          />
          {phase === "result" && (
            <Button onClick={resetReliefScanner} variant="outline" className="text-xs font-bold rounded-btn cursor-pointer bg-card">
              Assess Another Damage
            </Button>
          )}
        </div>

        <AnimatePresence mode="wait">
          
          {/* PHASE 1: UPLOAD AND SCAN PREVIEW */}
          {phase === "upload" && (
            <motion.div
              key="relief-upload"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              {/* Left Column: Command Console & Image Upload */}
              <div className="lg:col-span-7 space-y-6 text-left">
                {/* Emergency status banner */}
                <div className="rounded-card border border-red-500/20 bg-red-500/5 p-5 flex items-start gap-4 shadow-sm">
                  <RadarIllustration />
                  <div className="space-y-1.5 text-xs leading-relaxed flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-red-500 text-sm">Disaster Advisory: High Monsoon Flooding</span>
                      <Badge variant="destructive" className="font-bold text-[9px] px-2 bg-red-500 rounded-full">Level 3 Critical</Badge>
                    </div>
                    <p className="text-muted-foreground font-semibold">
                      Severe monsoon flood levels recorded across Guntur (AP) and Western Maharashtra. Local smallholders in riverbed segments are eligible for state seed grants and PMFBY crop compensation.
                    </p>
                    <div className="text-[10.5px] text-foreground font-bold pt-1.5 border-t border-red-500/10">
                      ⚡ Action Required: Upload field photograph to generate AI Loss Assessment report.
                    </div>
                  </div>
                </div>

                {/* Live Disaster Risk Feeds */}
                <div className="grid grid-cols-2 gap-3.5">
                  <Card className="p-4 border border-border/80 shadow-inner bg-card flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-red-500 uppercase tracking-wide block">Flood Surge</span>
                      <h4 className="text-xs font-extrabold text-foreground">Guntur Delta Zone</h4>
                      <p className="text-[9.5px] text-muted-foreground font-semibold leading-normal mt-1">Water level +1.2m above warning benchmarks. Risk: HIGH.</p>
                    </div>
                  </Card>
                  <Card className="p-4 border border-border/80 shadow-inner bg-card flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wide block">Heat Wave Warning</span>
                      <h4 className="text-xs font-extrabold text-foreground">Anantapur Dryland</h4>
                      <p className="text-[9.5px] text-muted-foreground font-semibold leading-normal mt-1">Daily temperatures crossing 42°C. Ground moisture: CRITICAL.</p>
                    </div>
                  </Card>
                </div>

                {/* Uploader Card component */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block px-1">Upload Damage Scan</span>
                  <UploadImageCard onImageSelected={handleImageSelected} className="h-72" />
                </div>
              </div>

              {/* Right Column: Information & Assistance Checklist */}
              <div className="lg:col-span-5 space-y-6 text-left">
                {/* Emergency hotline numbers */}
                <Card className="p-5 border border-border shadow-sm space-y-3.5 bg-card/45">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                    <PhoneCall className="h-4.5 w-4.5 text-primary" />
                    <span className="text-[10px] font-black text-foreground uppercase tracking-wider">Emergency Hotlines</span>
                  </div>
                  <div className="space-y-2 text-xs font-bold">
                    <div className="flex justify-between items-center p-2 rounded-btn bg-red-500/[0.04] border border-red-500/10 text-red-600">
                      <span>Disaster Management Cell:</span>
                      <span className="font-mono text-xs">1078</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-btn bg-emerald-500/[0.04] border border-emerald-500/10 text-emerald-700">
                      <span>Rythu Seva Kendras (RSK):</span>
                      <span className="font-mono text-xs">1800-425-1990</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-btn bg-slate-100 dark:bg-slate-800/40 text-muted-foreground">
                      <span>Krishi Vigyan Kendras (KVK):</span>
                      <span className="font-mono text-xs">1800-180-1551</span>
                    </div>
                  </div>
                </Card>

                {/* PMFBY & Required Documents Checklist */}
                <Card className="p-5 border border-border shadow-sm space-y-3.5 bg-card/45">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                    <FileText className="h-4.5 w-4.5 text-primary" />
                    <span className="text-[10px] font-black text-foreground uppercase tracking-wider">Required Claim Documents</span>
                  </div>
                  <ul className="space-y-2 text-xs font-semibold text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="h-4.5 w-4.5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[9px] shrink-0">✓</span>
                      <span>Verified Farmer Passbook / Land Patta Document</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-4.5 w-4.5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[9px] shrink-0">✓</span>
                      <span>PMFBY Insurance policy receipt / enrollment slip</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-4.5 w-4.5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[9px] shrink-0">✓</span>
                      <span>Aadhar Card identity linkage details</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-4.5 w-4.5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[9px] shrink-0">✓</span>
                      <span>Geotagged site photograph (AI assessed)</span>
                    </li>
                  </ul>
                </Card>

                {/* Disaster recovery steps timeline */}
                <Card className="p-5 border border-border shadow-sm space-y-3 bg-card/45">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                    <Clock className="h-4.5 w-4.5 text-primary" />
                    <span className="text-[10px] font-black text-foreground uppercase tracking-wider">Compensation Payout Steps</span>
                  </div>
                  <div className="space-y-4 text-xs">
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/15 text-primary font-bold text-[10px] flex items-center justify-center shrink-0">1</div>
                      <p className="text-muted-foreground leading-normal"><strong className="text-foreground">Filing Report:</strong> Generate field loss assessment via AI scanner within 72 hours of hazard impact.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/15 text-primary font-bold text-[10px] flex items-center justify-center shrink-0">2</div>
                      <p className="text-muted-foreground leading-normal"><strong className="text-foreground">Official Audit:</strong> Joint verification by local Rythu Mitra / Grama Sachivalayam agricultural officer.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/15 text-primary font-bold text-[10px] flex items-center justify-center shrink-0">3</div>
                      <p className="text-muted-foreground leading-normal"><strong className="text-foreground">Payout Approval:</strong> DBT payout directly to Aadhar-linked bank account within 21 working days.</p>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* PHASE 2: SCANNING IMAGE SCREEN */}
          {phase === "scanning" && (
            <motion.div
              key="relief-scanning"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto space-y-6 flex flex-col items-center justify-center text-center py-6"
            >
              <div className="relative w-full aspect-video rounded-card overflow-hidden border border-border bg-muted flex items-center justify-center shadow-md">
                {previewUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={previewUrl}
                    alt="Scanning field damage"
                    className="w-full h-full object-cover"
                  />
                )}
                {/* Horizontal emergency red scanning bar */}
                <motion.div
                  className="absolute left-0 right-0 h-1.5 bg-red-500 shadow-[0_0_12px_#ef4444] pointer-events-none"
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />
                <div className="absolute inset-0 bg-black/35 pointer-events-none" />
              </div>

              {/* Progress and status loaders */}
              <div className="w-full space-y-4">
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full transition-all duration-75"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground animate-pulse min-h-[40px] px-4">
                    {scanLogs[activeLogIndex]}
                  </p>
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block">
                    AI Emergency Damage Analysis... {Math.round(scanProgress)}%
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* PHASE 3: RESULT DASHBOARD */}
          {phase === "result" && (
            <motion.div
              key="relief-result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              
              {/* PRIMARY STATS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                
                {/* Card 1: Damage Score */}
                <Card title="" animate={false} className="p-5 flex flex-col justify-between border-l-4 border-l-red-500 border-t-0 border-r-0 border-b-0">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Damage Score</span>
                    <h3 className="text-3xl font-black text-red-500">72% <span className="text-xs font-semibold text-muted-foreground">Loss</span></h3>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">Foliage rotting & mud silt deposit checked.</p>
                </Card>

                {/* Card 2: Affected Area */}
                <Card title="" animate={false} className="p-5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Affected Area</span>
                    <h3 className="text-3xl font-black text-foreground">3.8 <span className="text-xs font-semibold text-muted-foreground">Acres</span></h3>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">Total farm size registered: 5.5 Acres.</p>
                </Card>

                {/* Card 3: Emergency Level */}
                <Card title="" animate={false} className="p-5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Emergency Level</span>
                    <h3 className="text-3xl font-black text-amber-500">Critical</h3>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">Pre-eligible for state disaster compensation.</p>
                </Card>

                {/* Card 4: AI Recovery Score */}
                <Card title="" animate={false} className="p-5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">AI Recovery Score</span>
                    <h3 className="text-3xl font-black text-emerald-500">84%</h3>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">Replanting success index inside 10 days.</p>
                </Card>

                {/* Card 5: Financial Loss */}
                <Card title="" animate={false} className="p-5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Financial Loss</span>
                    <h3 className="text-3xl font-black text-foreground">₹1.45L</h3>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">Calculated from sugarcane baseline yields.</p>
                </Card>

              </div>

              {/* SECONDARY PANELS GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Column 1: AI Recovery Plan */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* AI Recovery Plan Details */}
                  <Card title="" animate={false} className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-border/50">
                        <Brain className="h-5 w-5 text-primary shrink-0" />
                        <h4 className="font-bold text-sm text-foreground">AI Replanting & Field Recovery Plan</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                        <div className="space-y-3">
                          <span className="font-bold text-primary block uppercase tracking-wider text-[10px]">
                            1. Immediate Actions
                          </span>
                          <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
                            <li>Pump standing floodwaters out of plot A within 24 hours.</li>
                            <li>Trench borders to create escape pathways.</li>
                            <li>Prune rotting sugarcane residues to block stem fungal spread.</li>
                          </ul>
                          <span className="font-bold text-primary block uppercase tracking-wider text-[10px] pt-2">
                            2. Recommended Soil Boosters
                          </span>
                          <p className="text-muted-foreground">
                            Apply potassium nitrate (20kg/Acre) and a copper-based organic fungicide to strengthen root cells against rot.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <span className="font-bold text-primary block uppercase tracking-wider text-[10px]">
                            3. Replanting & Crop Rotation
                          </span>
                          <p className="text-muted-foreground">
                            Do not sow sugarcane again. Rotate with <strong className="text-foreground">Pearl Millet (Bajra)</strong> which has low moisture stress and high recovery rates in flood-enriched alluvial deposits.
                          </p>
                          
                          <div className="p-3.5 rounded-btn bg-muted/40 border border-border/40 space-y-1 mt-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Best Replanting Date:</span>
                              <strong className="text-foreground">July 5 (8 Days)</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Est. Recovery Cost:</span>
                              <strong className="text-foreground">₹8,200 / Acre</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* NGO Support Center */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-1">
                      <HelpingHand className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-bold text-foreground">Verified NGO Support Centers</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* NGO 1 */}
                      <div className="p-4 rounded-btn border border-border bg-card flex flex-col justify-between h-44 hover:border-primary/30 transition-all shadow-sm">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-foreground block truncate">Gyan Foundation</span>
                            <Badge variant="outline" className="text-[8px] font-bold border-primary text-primary bg-primary/5">Active</Badge>
                          </div>
                          <div className="space-y-1 text-muted-foreground text-[11px]">
                            <div>Support: <strong>Free Rotator Seeds</strong></div>
                            <div>Available: <strong>20 Seed Kits</strong></div>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-border/30 flex justify-between items-center">
                          <span className="text-[10px] text-muted-foreground">5.2km away</span>
                          <Button onClick={() => alert("Free Pearl Millet seeds requested from Gyan Foundation.")} size="sm" className="text-[10px] font-bold h-7 rounded-btn cursor-pointer bg-primary text-white px-2.5">
                            Request
                          </Button>
                        </div>
                      </div>

                      {/* NGO 2 */}
                      <div className="p-4 rounded-btn border border-border bg-card flex flex-col justify-between h-44 hover:border-primary/30 transition-all shadow-sm">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-foreground block truncate">Sewa Agri Hub</span>
                            <Badge variant="outline" className="text-[8px] font-bold border-primary text-primary bg-primary/5">Active</Badge>
                          </div>
                          <div className="space-y-1 text-muted-foreground text-[11px]">
                            <div>Support: <strong>Water Pumping Kits</strong></div>
                            <div>Available: <strong>3 Diesel Pumps</strong></div>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-border/30 flex justify-between items-center">
                          <span className="text-[10px] text-muted-foreground">8.4km away</span>
                          <Button onClick={() => alert("Diesel pump request submitted to Sewa Agri Hub.")} size="sm" className="text-[10px] font-bold h-7 rounded-btn cursor-pointer bg-primary text-white px-2.5">
                            Request
                          </Button>
                        </div>
                      </div>

                      {/* NGO 3 */}
                      <div className="p-4 rounded-btn border border-border bg-card flex flex-col justify-between h-44 hover:border-primary/30 transition-all shadow-sm">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-foreground block truncate">Pune Krishi Sangha</span>
                            <Badge variant="outline" className="text-[8px] font-bold border-primary text-primary bg-primary/5">Active</Badge>
                          </div>
                          <div className="space-y-1 text-muted-foreground text-[11px]">
                            <div>Support: <strong>Replanting Labor</strong></div>
                            <div>Available: <strong>6 Volunteers</strong></div>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-border/30 flex justify-between items-center">
                          <span className="text-[10px] text-muted-foreground">12km away</span>
                          <Button onClick={() => alert("Labor volunteers request submitted to Pune Krishi Sangha.")} size="sm" className="text-[10px] font-bold h-7 rounded-btn cursor-pointer bg-primary text-white px-2.5">
                            Request
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Column 2: Government aid and Insurance claims */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* Government Relief Claims */}
                  <Card title="" animate={false} className="p-5 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                      <Landmark className="h-5 w-5 text-primary shrink-0" />
                      <h4 className="font-bold text-sm text-foreground">Government Disaster Relief</h4>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      <div className="space-y-1">
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Eligible Scheme:</span>
                        <strong className="text-foreground text-sm">Rashtriya Krishi Vikas Yojana (RKVY)</strong>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Estimated Compensation:</span>
                        <strong className="text-emerald-500 text-lg">₹24,000</strong>
                      </div>
                      <div className="space-y-1.5 text-muted-foreground">
                        <span className="text-foreground font-bold block text-[10px] uppercase">Required Documents:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                          <li>Land ownership survey extract (7/12)</li>
                          <li>Scan damage assessment PDF</li>
                          <li>Aadhaar bank link slip</li>
                        </ul>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/30 flex justify-between items-center text-xs">
                      <span>Status: <strong className="text-primary font-bold">Pre-Approved</strong></span>
                      <Button onClick={() => alert("Compensation application submitted directly to Pune collectorate RKVY portal.")} size="sm" className="h-8 rounded-btn cursor-pointer bg-primary text-white font-bold px-3">
                        Apply Now
                      </Button>
                    </div>
                  </Card>

                  {/* Insurance Assistant Card */}
                  <Card title="" animate={false} className="p-5 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                      <FileText className="h-5 w-5 text-primary shrink-0" />
                      <h4 className="font-bold text-sm text-foreground">Insurance Claim Assistant</h4>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      <div className="flex justify-between items-baseline">
                        <span className="text-muted-foreground text-[10px] uppercase font-bold">PMFBY Policy Cover:</span>
                        <strong className="text-foreground">Active</strong>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Estimated Claim:</span>
                        <strong className="text-emerald-500 text-lg">₹68,000</strong>
                      </div>

                      {/* Claim timeline progress */}
                      <div className="space-y-2 pt-1">
                        <span className="text-foreground font-bold block text-[10px] uppercase">Claim Status Timeline</span>
                        <div className="flex justify-between items-center gap-2 text-[10px] font-bold text-muted-foreground">
                          <span className="text-primary">Filed</span>
                          <span className="text-primary">→</span>
                          <span className="text-primary animate-pulse">Survey</span>
                          <span className="text-muted-foreground">→</span>
                          <span>Approved</span>
                        </div>
                        <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full w-[50%]" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/30 text-[10px] text-muted-foreground leading-normal">
                      * Agronomist inspector visit scheduled for June 29. Keep geotagged photos ready.
                    </div>
                  </Card>

                </div>

              </div>

              {/* TIMELINE WIDGET */}
              <Card title="" animate={false} className="p-6">
                <div className="flex items-center gap-2 pb-4 border-b border-border/50 mb-6">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-bold text-foreground">Disaster Recovery Timeline</h3>
                </div>

                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="hidden md:block absolute top-[15px] left-8 right-8 h-0.5 bg-border pointer-events-none z-0" />
                  
                  {/* Timeline step 1 */}
                  <div className="relative z-10 flex md:flex-col items-center gap-3.5 text-left md:text-center md:flex-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white font-bold text-xs shadow-sm">
                      ✓
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-foreground block">1. Flood Reported</span>
                      <span className="text-[10px] text-muted-foreground">June 26, 06:12 AM</span>
                    </div>
                  </div>

                  {/* Timeline step 2 */}
                  <div className="relative z-10 flex md:flex-col items-center gap-3.5 text-left md:text-center md:flex-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-sm">
                      ✓
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-foreground block">2. Damage Assessed</span>
                      <span className="text-[10px] text-muted-foreground">72% Field Loss</span>
                    </div>
                  </div>

                  {/* Timeline step 3 */}
                  <div className="relative z-10 flex md:flex-col items-center gap-3.5 text-left md:text-center md:flex-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-sm animate-pulse">
                      3
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-foreground block">3. State compensation</span>
                      <span className="text-[10px] text-primary font-semibold">Pre-approved: ₹24,000</span>
                    </div>
                  </div>

                  {/* Timeline step 4 */}
                  <div className="relative z-10 flex md:flex-col items-center gap-3.5 text-left md:text-center md:flex-1 opacity-50">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground font-bold text-xs">
                      4
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-foreground block">4. NGO seed dispatch</span>
                      <span className="text-[10px] text-muted-foreground">Pearl Millet Seed kit</span>
                    </div>
                  </div>

                  {/* Timeline step 5 */}
                  <div className="relative z-10 flex md:flex-col items-center gap-3.5 text-left md:text-center md:flex-1 opacity-50">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground font-bold text-xs">
                      5
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-foreground block">5. Replanting completed</span>
                      <span className="text-[10px] text-muted-foreground">Sowing target: July 5</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* DAMAGED CROP MARKETPLACE */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1">
                  <Store className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-bold text-foreground">Alternative Buyers for Damaged Sugarcane Stalks</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Buyer 1 */}
                  <div className="p-4 rounded-btn border border-border bg-card flex justify-between items-center gap-4 hover:border-primary/30 transition-all shadow-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-foreground text-sm">Pune Biofuels Ltd</strong>
                        <Badge variant="outline" className="text-[8px] font-bold border-primary text-primary bg-primary/5">Biofuel Plant</Badge>
                      </div>
                      <p className="text-muted-foreground text-[10px]">
                        Accepts damp/waterlogged sugarcane stalks for biomass conversion.
                      </p>
                      <div className="text-[10px] text-muted-foreground pt-1 flex gap-3">
                        <span>Distance: <strong>14km</strong></span>
                        <span>Capacity: <strong>Unlimited</strong></span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 space-y-2">
                      <div>
                        <span className="font-extrabold text-primary text-base block">₹1,100</span>
                        <span className="text-[9px] text-muted-foreground">/ Ton</span>
                      </div>
                      <Button onClick={() => alert("Arbitrage contract locked for damaged sugarcane stalks shipping with Pune Biofuels Ltd.")} size="sm" className="h-7 rounded-btn cursor-pointer bg-primary text-white font-bold text-[10px] px-3">
                        Sell Stalks
                      </Button>
                    </div>
                  </div>

                  {/* Buyer 2 */}
                  <div className="p-4 rounded-btn border border-border bg-card flex justify-between items-center gap-4 hover:border-primary/30 transition-all shadow-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-foreground text-sm">Deccan Feed Mills</strong>
                        <Badge variant="outline" className="text-[8px] font-bold border-primary text-primary bg-primary/5">Animal Feed</Badge>
                      </div>
                      <p className="text-muted-foreground text-[10px]">
                        Purchases partially damaged crops for dry poultry and cattle fodder mixtures.
                      </p>
                      <div className="text-[10px] text-muted-foreground pt-1 flex gap-3">
                        <span>Distance: <strong>24km</strong></span>
                        <span>Capacity: <strong>up to 50 Tons</strong></span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 space-y-2">
                      <div>
                        <span className="font-extrabold text-primary text-base block">₹1,400</span>
                        <span className="text-[9px] text-muted-foreground">/ Ton</span>
                      </div>
                      <Button onClick={() => alert("Direct crop shipment contract locked with Deccan Feed Mills.")} size="sm" className="h-7 rounded-btn cursor-pointer bg-primary text-white font-bold text-[10px] px-3">
                        Sell Crop
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* EMERGENCY ALERTS FEED */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Active Alerts */}
                <Card title="" animate={false} className="p-6 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                    <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                    <h4 className="font-bold text-sm text-foreground">Extreme Weather Alerts Feed</h4>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    {/* Alert 1 */}
                    <div className="p-3 rounded-btn border border-red-500/20 bg-red-500/5 flex items-start gap-2.5">
                      <ShieldAlert className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="font-bold text-red-500">Flood Surge warning</span>
                        <p className="text-muted-foreground text-[10px] leading-relaxed">
                          Mutha river discharge flows will increase on June 27. Elevate equipment.
                        </p>
                      </div>
                    </div>

                    {/* Alert 2 */}
                    <div className="p-3 rounded-btn border border-warning/20 bg-warning/5 flex items-start gap-2.5">
                      <AlertTriangle className="h-4.5 w-4.5 text-warning shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="font-bold text-warning-foreground">Pest Outbreak Alert</span>
                        <p className="text-muted-foreground text-[10px] leading-relaxed">
                          Moisture spikes in Shirur region trigger sugarcane stem borer warnings. Spray bio-fungicide.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Community and Agricultural Officers */}
                <Card title="" animate={false} className="p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                      <HeartHandshake className="h-5 w-5 text-primary shrink-0" />
                      <h4 className="font-bold text-sm text-foreground">Nearby Relief Hotlines</h4>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      {/* Officer 1 */}
                      <div className="flex items-center justify-between gap-4 p-2 rounded-btn bg-muted/40 border border-border/40">
                        <div className="space-y-0.5">
                          <span className="font-bold text-foreground">Dr. K. Patil</span>
                          <span className="text-[10px] text-muted-foreground block">District Agriculture Officer (Pune)</span>
                        </div>
                        <Button onClick={() => alert("Dialing Dr. Patil at +91 98450-XXXXX...")} variant="outline" className="h-8 w-8 p-0 rounded-full cursor-pointer bg-card">
                          <PhoneCall className="h-3.5 w-3.5 text-primary" />
                        </Button>
                      </div>

                      {/* RSK Center */}
                      <div className="flex items-center justify-between gap-4 p-2 rounded-btn bg-muted/40 border border-border/40">
                        <div className="space-y-0.5">
                          <span className="font-bold text-foreground">Rythu Seva Kendra (RSK Shirur)</span>
                          <span className="text-[10px] text-muted-foreground block">Emergency Seed and Tool Distributor</span>
                        </div>
                        <Button onClick={() => alert("Dialing RSK Shirur at +91 2138-XXXXX...")} variant="outline" className="h-8 w-8 p-0 rounded-full cursor-pointer bg-card">
                          <PhoneCall className="h-3.5 w-3.5 text-primary" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-muted-foreground pt-2">
                    * Support networks are checked weekly by village officers.
                  </div>
                </Card>
              </div>

              {/* ACTION PANEL */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 bg-muted/40 p-5 rounded-card border border-border/50 justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <HelpingHand className="h-4.5 w-4.5 text-primary" />
                  Command Center Actions:
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={() => window.location.href = "/assistant"}
                    variant="outline"
                    className="text-xs font-bold h-9 rounded-btn cursor-pointer bg-card"
                  >
                    <Sparkles className="mr-1.5 h-4 w-4 text-primary" />
                    Ask Assistant
                  </Button>
                  <Button
                    onClick={() => alert("Compensation application and damage report compiled as PDF.")}
                    variant="outline"
                    className="text-xs font-bold h-9 rounded-btn cursor-pointer bg-card"
                  >
                    <Save className="mr-1.5 h-4 w-4 text-primary" />
                    Save Report
                  </Button>
                  <Button
                    onClick={() => alert("Report shared with PMFBY insurance field officer.")}
                    variant="outline"
                    className="text-xs font-bold h-9 rounded-btn cursor-pointer bg-card"
                  >
                    <Share2 className="mr-1.5 h-4 w-4 text-primary" />
                    Share Report
                  </Button>
                  <Button
                    onClick={() => alert("Escalating dossier directly to RSK Shirur portal...")}
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
