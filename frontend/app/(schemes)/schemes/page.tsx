"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, Clock, Sparkles, Save, Share2, 
  HelpingHand, Landmark, ChevronRight, ChevronLeft, 
  CheckCircle2, ShieldAlert, MapPin
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { apiClient } from "@/services/apiClient";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type PhaseType = "wizard" | "loading" | "result";

interface WizardState {
  state: string;
  district: string;
  farmSize: "marginal" | "small" | "medium" | "large";
  landOwnership: "owner" | "tenant" | "sharecropper";
  cropType: string;
  irrigationType: "drip" | "sprinkler" | "canal" | "rainfed";
  incomeRange: "low" | "mid-low" | "mid-high" | "high";
  insuranceStatus: "insured" | "uninsured";
}

const matchLogs = [
  "Matching land ownership details with Pradhan Mantri Kisan Samman Nidhi database...",
  "Applying dryland category algorithms for PM-KUSUM Solar pump grants...",
  "Matching Drip irrigation parameters with Per Drop More Crop (PDMC) subsidies...",
  "Cross-referencing crop insurance policy databases for PMFBY premium covers...",
  "Calculating state agricultural solar power connection discount criteria...",
  "Validating organic soil certification bonuses...",
  "Synthesizing personalized government aid compensation dossiers..."
];

const schemesDatabase = [
  {
    name: "PM-KISAN (Income Support Scheme)",
    benefit: "₹6,000 / Year",
    score: "100%",
    deadline: "July 31, 2026",
    approval: "14 Days",
    priority: "High",
    desc: "Direct benefit transfer of ₹6,000 per year in three equal installments to bank accounts of land-holding farmer families.",
    documents: "Aadhaar, Land Records (7/12), Bank Passbook"
  },
  {
    name: "PM-KUSUM (Solar Pump Subsidy)",
    benefit: "60% Subsidy (₹24,500 value)",
    score: "95%",
    deadline: "June 30, 2026",
    approval: "25 Days",
    priority: "High",
    desc: "Financial assistance to install solar water pumps, cutting farm electricity costs by 90% and securing irrigation feeds.",
    documents: "Land records, Aadhaar, Farmer ID certificate"
  },
  {
    name: "Per Drop More Crop (Micro Irrigation)",
    benefit: "50% Drip Kit Subsidy",
    score: "90%",
    deadline: "August 15, 2026",
    approval: "30 Days",
    priority: "Medium",
    desc: "Subsidies for drip and sprinkler irrigation installations. Restores water usage efficiencies in rain-deficit zones.",
    documents: "Irrigation details, Land survey map, Aadhaar"
  },
  {
    name: "PM Fasal Bima Yojana (Crop Insurance)",
    benefit: "Premium subsidy, ₹45k cover",
    score: "88%",
    deadline: "July 15, 2026",
    approval: "10 Days",
    priority: "Medium",
    desc: "Yield insurance coverage against weather risks, floods, dry spells, and pest outbreaks with subsidized premium rates.",
    documents: "Crop Sowing certificate, Aadhaar, Bank details"
  }
];

export default function SchemesPage() {
  const [phase, setPhase] = React.useState<PhaseType>("wizard");
  const [wizardStep, setWizardStep] = React.useState(1);
  const [loadingProgress, setLoadingProgress] = React.useState(0);
  const [activeLogIndex, setActiveLogIndex] = React.useState(0);
  const [matchedSchemes, setMatchedSchemes] = React.useState<any[]>([]);

  // Wizard form state
  const [form, setForm] = React.useState<WizardState>({
    state: "Maharashtra",
    district: "Pune",
    farmSize: "small",
    landOwnership: "owner",
    cropType: "Sugarcane",
    irrigationType: "drip",
    incomeRange: "mid-low",
    insuranceStatus: "insured"
  });

  // Document checklist state
  const [checklist, setChecklist] = React.useState({
    aadhaar: true,
    land: true,
    passbook: true,
    farmerId: true,
    cropDetails: false,
    insurance: false
  });

  const handleCheckboxToggle = (key: keyof typeof checklist) => {
    setChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getCheckedCount = () => {
    return Object.values(checklist).filter(Boolean).length;
  };

  const getTimelineStepIndex = () => {
    const count = getCheckedCount();
    if (count < 3) return 0;
    if (count === 3 || count === 4) return 1;
    if (count === 5) return 2;
    return 3; // 6 checked
  };

  const handleNextStep = () => {
    setWizardStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setWizardStep(prev => prev - 1);
  };

  const startAnalysis = async () => {
    setPhase("loading");
    setLoadingProgress(0);
    setActiveLogIndex(0);
    try {
      const res = await apiClient.get<any[]>("/schemes/match");
      if (res && res.length > 0) {
        setMatchedSchemes(res.map((s: any) => ({
          name: s.name,
          benefit: s.benefit,
          score: s.eligibility_score,
          deadline: s.deadline,
          approval: s.approval_time,
          priority: s.priority,
          desc: s.description,
          documents: s.required_documents ? s.required_documents.join(", ") : "Aadhaar, Land Records"
        })));
      }
    } catch (err) {
      console.error("Failed to load matching schemes from backend", err);
    }
  };

  React.useEffect(() => {
    if (phase !== "loading") return;

    const duration = 4000; // 4 seconds total
    const intervalTime = 80;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => setPhase("result"), 500);
          return 100;
        }

        // Map progress percentage to active log item index
        const logIndex = Math.min(
          Math.floor((next / 100) * matchLogs.length),
          matchLogs.length - 1
        );
        setActiveLogIndex(logIndex);

        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [phase]);

  const resetWizard = () => {
    setPhase("wizard");
    setWizardStep(1);
    setChecklist({
      aadhaar: true,
      land: true,
      passbook: true,
      farmerId: true,
      cropDetails: false,
      insurance: false
    });
  };

  return (
    <MainLayout>
      <div className="space-y-8 pb-16 animate-fade-in">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <SectionHeader 
            title="AI Government Benefits Advisor" 
            description="Intelligent eligibility matching to discover government schemes, crop subsidies, and solar pump grants."
            className="mb-0"
          />
          {phase === "result" && (
            <Button onClick={resetWizard} variant="outline" className="text-xs font-bold rounded-btn cursor-pointer bg-card">
              Re-Run Advisor
            </Button>
          )}
        </div>

        <AnimatePresence mode="wait">
          
          {/* PHASE 1: WIZARD QUESTIONS */}
          {phase === "wizard" && (
            <motion.div
              key="wizard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <Card title="" animate={false} className="p-6 space-y-6">
                
                {/* Stepper Wizard Indicator */}
                <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider pb-2 border-b border-border/40">
                  <span>Step {wizardStep} of 3</span>
                  <span>
                    {wizardStep === 1 ? "Location & Land" : wizardStep === 2 ? "Crop & Category" : "Financials & Insurance"}
                  </span>
                </div>

                {/* STEP 1: LOCATION & LAND */}
                {wizardStep === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground">State</label>
                        <select 
                          value={form.state}
                          onChange={(e) => setForm({ ...form, state: e.target.value })}
                          className="w-full bg-card border border-border rounded-btn px-3.5 h-11 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                        >
                          <option value="Maharashtra">Maharashtra (Western Zone)</option>
                          <option value="Punjab">Punjab (Northern Granary)</option>
                          <option value="Gujarat">Gujarat (West Coast)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground">District</label>
                        <input 
                          type="text"
                          value={form.district}
                          onChange={(e) => setForm({ ...form, district: e.target.value })}
                          className="w-full bg-card border border-border rounded-btn px-4 h-11 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-muted-foreground/60"
                        />
                      </div>
                    </div>

                    {/* Land Ownership */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-foreground block">Land Ownership status</span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { id: "owner", label: "Owner Farmer", desc: "Own land records registered" },
                          { id: "tenant", label: "Tenant Farmer", desc: "Registered lease agreement" },
                          { id: "sharecropper", label: "Sharecropper", desc: "Verbal shareholding crop deal" }
                        ].map((item) => (
                          <div
                            key={item.id}
                            onClick={() => setForm({ ...form, landOwnership: item.id as WizardState["landOwnership"] })}
                            className={`p-4 rounded-btn border text-left cursor-pointer transition-all ${
                              form.landOwnership === item.id
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border bg-card hover:bg-muted/30 text-muted-foreground"
                            }`}
                          >
                            <div className="font-bold text-xs">{item.label}</div>
                            <div className="text-[10px] text-muted-foreground/85 mt-1">{item.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Farm Size */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-foreground block">Total Field Size</span>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                          { id: "marginal", label: "Marginal", desc: "< 2.5 Acres" },
                          { id: "small", label: "Small Holder", desc: "2.5 - 5 Acres" },
                          { id: "medium", label: "Medium", desc: "5 - 10 Acres" },
                          { id: "large", label: "Large Scale", desc: "> 10 Acres" }
                        ].map((item) => (
                          <div
                            key={item.id}
                            onClick={() => setForm({ ...form, farmSize: item.id as WizardState["farmSize"] })}
                            className={`p-4 rounded-btn border text-left cursor-pointer transition-all ${
                              form.farmSize === item.id
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border bg-card hover:bg-muted/30 text-muted-foreground"
                            }`}
                          >
                            <div className="font-bold text-xs">{item.label}</div>
                            <div className="text-[10px] text-muted-foreground/85 mt-1">{item.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: CROP & CATEGORY */}
                {wizardStep === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground">Active Crop Type</label>
                        <select 
                          value={form.cropType}
                          onChange={(e) => setForm({ ...form, cropType: e.target.value })}
                          className="w-full bg-card border border-border rounded-btn px-3.5 h-11 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                        >
                          <option value="Sugarcane">Sugarcane (Cash crop)</option>
                          <option value="Cotton">Cotton (Cash crop)</option>
                          <option value="Paddy">Paddy / Rice (Grains)</option>
                          <option value="Groundnut">Groundnut (Oilseeds)</option>
                          <option value="Vegetables">Vegetables</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground">District Head Office</label>
                        <input 
                          type="text"
                          readOnly
                          value="Shirur Taluka Block"
                          className="w-full bg-muted/30 border border-border rounded-btn px-4 h-11 text-xs text-muted-foreground outline-none"
                        />
                      </div>
                    </div>

                    {/* Irrigation Type */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-foreground block">Irrigation Infrastructure</span>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                          { id: "drip", label: "Drip System", desc: "Micro drip tubes" },
                          { id: "sprinkler", label: "Sprinklers", desc: "Sprayer nozzles" },
                          { id: "canal", label: "Canal / Flood", desc: "Canal gravity gates" },
                          { id: "rainfed", label: "Rain Dependent", desc: "Precipitation only" }
                        ].map((item) => (
                          <div
                            key={item.id}
                            onClick={() => setForm({ ...form, irrigationType: item.id as WizardState["irrigationType"] })}
                            className={`p-4 rounded-btn border text-left cursor-pointer transition-all ${
                              form.irrigationType === item.id
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border bg-card hover:bg-muted/30 text-muted-foreground"
                            }`}
                          >
                            <div className="font-bold text-xs">{item.label}</div>
                            <div className="text-[10px] text-muted-foreground/85 mt-1">{item.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: FINANCIALS & INSURANCE */}
                {wizardStep === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Annual Income */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-foreground block">Annual Farm Income Range</span>
                        <div className="grid grid-cols-1 gap-2">
                          {[
                            { id: "low", label: "Below ₹1,00,000", desc: "Marginal household tier" },
                            { id: "mid-low", label: "₹1,00,000 - ₹2,50,000", desc: "Small holder baseline" },
                            { id: "mid-high", label: "₹2,50,000 - ₹5,00,000", desc: "Medium scale crop returns" },
                            { id: "high", label: "Above ₹5,00,000", desc: "Commercial farming scales" }
                          ].map((item) => (
                            <div
                              key={item.id}
                              onClick={() => setForm({ ...form, incomeRange: item.id as WizardState["incomeRange"] })}
                              className={`p-3 rounded-btn border text-left cursor-pointer transition-all ${
                                form.incomeRange === item.id
                                  ? "border-primary bg-primary/5 text-primary"
                                  : "border-border bg-card hover:bg-muted/30 text-muted-foreground"
                              }`}
                            >
                              <div className="font-bold text-xs">{item.label}</div>
                              <div className="text-[10px] text-muted-foreground/85 mt-0.5">{item.desc}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Insurance Status */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-foreground block">PMFBY Crop Insurance Coverage</span>
                        <div className="grid grid-cols-1 gap-2">
                          {[
                            { id: "insured", label: "Insured under PMFBY", desc: "Current season premium paid" },
                            { id: "uninsured", label: "Uninsured", desc: "No crop coverage policy" }
                          ].map((item) => (
                            <div
                              key={item.id}
                              onClick={() => setForm({ ...form, insuranceStatus: item.id as WizardState["insuranceStatus"] })}
                              className={`p-3 rounded-btn border text-left cursor-pointer transition-all ${
                                form.insuranceStatus === item.id
                                  ? "border-primary bg-primary/5 text-primary"
                                  : "border-border bg-card hover:bg-muted/30 text-muted-foreground"
                              }`}
                            >
                              <div className="font-bold text-xs">{item.label}</div>
                              <div className="text-[10px] text-muted-foreground/85 mt-0.5">{item.desc}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </Card>

              {/* Wizard Navigation Controls */}
              <div className="flex justify-between items-center">
                {wizardStep > 1 ? (
                  <Button 
                    onClick={handlePrevStep}
                    variant="outline"
                    className="text-xs font-bold px-5 h-10 rounded-btn cursor-pointer bg-card"
                  >
                    <ChevronLeft className="mr-1.5 h-4 w-4" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {wizardStep < 3 ? (
                  <Button 
                    onClick={handleNextStep}
                    className="text-xs font-bold px-6 h-10 rounded-btn cursor-pointer bg-primary"
                  >
                    Next Step
                    <ChevronRight className="ml-1.5 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={startAnalysis}
                    className="text-xs font-bold px-6 h-10 rounded-btn cursor-pointer bg-primary"
                  >
                    Analyze Benefits
                    <Brain className="ml-1.5 h-4 w-4 text-white" />
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {/* PHASE 2: AI ANALYZING LOADER */}
          {phase === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto space-y-8 flex flex-col items-center justify-center text-center py-8"
            >
              {/* Pulsing gradient loader circle */}
              <div className="relative h-28 w-28 flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-emerald-400 to-accent opacity-20 blur-md"
                  animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.45, 0.2] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                />
                <div className="relative h-20 w-20 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg border border-white/20">
                  <Landmark className="h-9 w-9 text-white animate-pulse" />
                </div>
              </div>

              {/* Status checklist and progress bar */}
              <div className="w-full space-y-4">
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-75"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-foreground leading-normal min-h-[40px] px-4">
                    {matchLogs[activeLogIndex]}
                  </p>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">
                    AI SUBSIDY EVALUATION: {Math.round(loadingProgress)}%
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* PHASE 3: SCHEMES RESULTS DASHBOARD */}
          {phase === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Top Row Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                
                {/* Benefits Hero Overview Card */}
                <div className="lg:col-span-2">
                  <Card title="" animate={false} className="p-6 flex flex-col justify-between h-full relative overflow-hidden bg-gradient-to-tr from-primary/10 via-card to-accent/5">
                    <div className="absolute top-0 right-0 p-4">
                      <Badge variant="outline" className="font-bold px-2 py-0.5 bg-card border border-border text-[10px] tracking-wider uppercase">
                        Benefits Advisor Active
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Eligible Subsidies matching parameters</span>
                        <h3 className="text-3xl font-black text-foreground">₹42,500 <span className="text-xs font-semibold text-muted-foreground">/ Year (Est.)</span></h3>
                      </div>

                      {/* Schemes indices metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-border/40 text-xs">
                        <div className="space-y-0.5">
                          <span className="text-muted-foreground block text-[10px] font-bold uppercase">Matched schemes</span>
                          <strong className="text-lg font-extrabold text-primary">4 Schemes</strong>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-muted-foreground block text-[10px] font-bold uppercase">Estimated Approval</span>
                          <strong className="text-lg font-extrabold text-foreground">10-25 Days</strong>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-muted-foreground block text-[10px] font-bold uppercase">Pending Applications</span>
                          <strong className="text-lg font-extrabold text-foreground">1 application</strong>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-muted-foreground block text-[10px] font-bold uppercase">Claim success rate</span>
                          <strong className="text-lg font-extrabold text-emerald-500">98% Success</strong>
                        </div>
                      </div>
                    </div>

                    {/* AI Recommendation */}
                    <div className="mt-5 pt-3 border-t border-border/40 flex items-start gap-2.5 text-xs">
                      <Sparkles className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5 animate-pulse" />
                      <p className="text-muted-foreground leading-relaxed">
                        <strong className="text-foreground">Vira AI Recommendation:</strong> You are eligible for RKVY, PM-KISAN, and the Solar Pump Subsidy. Priority is high for **Solar Pump Subsidy** since applications close June 30. Applying for both PM-KISAN and Micro Irrigation could save you ₹30,500 this season.
                      </p>
                    </div>
                  </Card>
                </div>

                {/* Smart Alerts Feed */}
                <div>
                  <Card title="" animate={false} className="p-6 border-l-4 border-l-primary flex flex-col justify-between h-full bg-card shadow-sm border-t-0 border-r-0 border-b-0">
                    <div className="space-y-4 w-full">
                      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                        <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />
                        <h4 className="font-bold text-sm text-foreground">Subsidy Deadlines & Alerts</h4>
                      </div>

                      <div className="space-y-3.5 text-xs leading-normal">
                        <div className="flex items-start gap-2.5">
                          <span className="h-2 w-2 rounded-full bg-red-500 shrink-0 mt-1.5" />
                          <p className="text-muted-foreground">
                            <strong className="text-red-500">Solar Pump Subsidy:</strong> Deadline approaches in 4 days (June 30). Pre-application survey lock active.
                          </p>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="h-2 w-2 rounded-full bg-warning shrink-0 mt-1.5" />
                          <p className="text-muted-foreground">
                            <strong className="text-warning-foreground">Missing Document:</strong> PMFBY Crop Insurance papers not attached. Tap document assistant below.
                          </p>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                          <p className="text-muted-foreground">
                            <strong className="text-foreground">New State Scheme:</strong> ₹12,000 Organic Fertilizers grant announced for Pune district.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/30 text-[10px] text-muted-foreground">
                      * Sourced from MH state agriculture office.
                    </div>
                  </Card>
                </div>

              </div>

              {/* INTERACTIVE DOCUMENT ASSISTANT & TIMELINE GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* AI Document Assistant */}
                <Card title="" animate={false} className="lg:col-span-2 p-6 space-y-4">
                  <div className="space-y-1 pb-2 border-b border-border/50">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">AI Document Assistant</span>
                    <h4 className="text-sm font-bold text-foreground">Attach and Verify Required Payout Documents</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    
                    {/* Doc 1 */}
                    <div 
                      onClick={() => handleCheckboxToggle("aadhaar")}
                      className={`p-3 rounded-btn border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        checklist.aadhaar 
                          ? "border-primary bg-primary/5 text-primary" 
                          : "border-border bg-card hover:bg-muted/10 text-muted-foreground"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold block">Aadhaar Card Verification</span>
                        <span className="text-[10px] text-muted-foreground/80">National demographic lock linked</span>
                      </div>
                      <CheckCircle2 className={`h-5 w-5 shrink-0 ${checklist.aadhaar ? "text-primary" : "text-muted-foreground/30"}`} />
                    </div>

                    {/* Doc 2 */}
                    <div 
                      onClick={() => handleCheckboxToggle("land")}
                      className={`p-3 rounded-btn border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        checklist.land 
                          ? "border-primary bg-primary/5 text-primary" 
                          : "border-border bg-card hover:bg-muted/10 text-muted-foreground"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold block">Land Records Extract (7/12)</span>
                        <span className="text-[10px] text-muted-foreground/80">Verify acreage limits: 5.5 Acres</span>
                      </div>
                      <CheckCircle2 className={`h-5 w-5 shrink-0 ${checklist.land ? "text-primary" : "text-muted-foreground/30"}`} />
                    </div>

                    {/* Doc 3 */}
                    <div 
                      onClick={() => handleCheckboxToggle("passbook")}
                      className={`p-3 rounded-btn border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        checklist.passbook 
                          ? "border-primary bg-primary/5 text-primary" 
                          : "border-border bg-card hover:bg-muted/10 text-muted-foreground"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold block">Bank Account Passbook</span>
                        <span className="text-[10px] text-muted-foreground/80">Direct Benefit Transfer (DBT) target</span>
                      </div>
                      <CheckCircle2 className={`h-5 w-5 shrink-0 ${checklist.passbook ? "text-primary" : "text-muted-foreground/30"}`} />
                    </div>

                    {/* Doc 4 */}
                    <div 
                      onClick={() => handleCheckboxToggle("farmerId")}
                      className={`p-3 rounded-btn border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        checklist.farmerId 
                          ? "border-primary bg-primary/5 text-primary" 
                          : "border-border bg-card hover:bg-muted/10 text-muted-foreground"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold block">Farmer ID Certificate</span>
                        <span className="text-[10px] text-muted-foreground/80">District smallholder validation</span>
                      </div>
                      <CheckCircle2 className={`h-5 w-5 shrink-0 ${checklist.farmerId ? "text-primary" : "text-muted-foreground/30"}`} />
                    </div>

                    {/* Doc 5 */}
                    <div 
                      onClick={() => handleCheckboxToggle("cropDetails")}
                      className={`p-3 rounded-btn border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        checklist.cropDetails 
                          ? "border-primary bg-primary/5 text-primary" 
                          : "border-border bg-card hover:bg-muted/10 text-muted-foreground"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold block">Crop Sowing details</span>
                        <span className="text-[10px] text-muted-foreground/80">Verify Kharif Sugarcane sowing</span>
                      </div>
                      <CheckCircle2 className={`h-5 w-5 shrink-0 ${checklist.cropDetails ? "text-primary" : "text-muted-foreground/30"}`} />
                    </div>

                    {/* Doc 6 */}
                    <div 
                      onClick={() => handleCheckboxToggle("insurance")}
                      className={`p-3 rounded-btn border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        checklist.insurance 
                          ? "border-primary bg-primary/5 text-primary" 
                          : "border-border bg-card hover:bg-muted/10 text-muted-foreground"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold block">PMFBY Crop Insurance Papers</span>
                        <span className="text-[10px] text-muted-foreground/80">Verify premium deposit receipt</span>
                      </div>
                      <CheckCircle2 className={`h-5 w-5 shrink-0 ${checklist.insurance ? "text-primary" : "text-muted-foreground/30"}`} />
                    </div>

                  </div>
                </Card>

                {/* Application Progress Timeline */}
                <Card title="" animate={false} className="p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                    <Clock className="h-5 w-5 text-primary shrink-0" />
                    <h4 className="font-bold text-sm text-foreground">Application Progress</h4>
                  </div>

                  <div className="space-y-4 text-xs leading-normal">
                    <span className="text-muted-foreground block text-[10px] font-bold uppercase">Verification Stages:</span>
                    
                    <div className="flex justify-between items-center gap-2 text-[10px] font-bold text-muted-foreground">
                      <span className={getTimelineStepIndex() >= 0 ? "text-primary animate-pulse" : ""}>1. Eligibility</span>
                      <span>→</span>
                      <span className={getTimelineStepIndex() >= 1 ? "text-primary" : ""}>2. Papers</span>
                      <span>→</span>
                      <span className={getTimelineStepIndex() >= 2 ? "text-primary" : ""}>3. File</span>
                      <span>→</span>
                      <span className={getTimelineStepIndex() >= 3 ? "text-emerald-500 font-extrabold" : ""}>4. Approved</span>
                    </div>

                    <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-primary rounded-full animate-pulse"
                        animate={{ 
                          width: getTimelineStepIndex() === 0 ? "25%" : getTimelineStepIndex() === 1 ? "50%" : getTimelineStepIndex() === 2 ? "75%" : "100%" 
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    <p className="text-[11px] text-muted-foreground pt-1.5 border-t border-border/30">
                      {getTimelineStepIndex() === 0 ? (
                        "Verify matching land records to unlock stage 2 (Documents Ready)."
                      ) : getTimelineStepIndex() === 1 ? (
                        "Aadhaar, Land records, Bank details are verified. Attach sowing files to submit application dossier."
                      ) : getTimelineStepIndex() === 2 ? (
                        "Dossier ready! Submitting files directly to Shirur district officer database."
                      ) : (
                        "Dossier fully verified! Application approved for direct DBT cash compensation deposit."
                      )}
                    </p>
                  </div>
                </Card>

              </div>

              {/* AI ELIGIBILITY RESULTS (SCHEMES CATALOG LIST) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1">
                  <Landmark className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-bold text-foreground">Matched Subsidies & Benefits Catalog</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(matchedSchemes.length > 0 ? matchedSchemes : schemesDatabase).map((scheme, idx) => (
                    <div 
                      key={idx}
                      className="p-5 rounded-card border border-border bg-card flex flex-col justify-between h-56 hover:border-primary/30 transition-all shadow-sm text-xs leading-relaxed"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="font-extrabold text-sm text-foreground tracking-tight max-w-[180px]">{scheme.name}</h4>
                          <Badge variant="success" className="font-bold text-[9px] px-2 py-0.5 shrink-0 bg-primary text-white">
                            {scheme.score} Match
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-[11px] line-clamp-2">
                          {scheme.desc}
                        </p>
                      </div>

                      <div className="pt-3.5 border-t border-border/30 space-y-2 text-[11px] text-muted-foreground">
                        <div className="grid grid-cols-2 gap-3 pb-1">
                          <span>Subsidy Value: <strong className="text-emerald-500 font-bold">{scheme.benefit}</strong></span>
                          <span>Deadline: <strong className="text-foreground">{scheme.deadline}</strong></span>
                        </div>
                        <div className="flex justify-between items-center bg-muted/40 p-2 rounded-btn">
                          <span>Approval cycle: <strong className="text-foreground">{scheme.approval}</strong></span>
                          <Button 
                            onClick={() => alert(`Pre-applying for ${scheme.name}... Directing digital dossier...`)}
                            size="sm" 
                            className="h-6 rounded-btn cursor-pointer bg-primary text-white text-[9px] font-bold px-2.5"
                          >
                            Pre-Apply
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SMART ACTIONS PANEL */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 bg-muted/40 p-5 rounded-card border border-border/50 justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <HelpingHand className="h-4.5 w-4.5 text-primary" />
                  Advisor Actions:
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={() => window.location.href = "/assistant"}
                    variant="outline"
                    className="text-xs font-bold h-9 rounded-btn cursor-pointer bg-card"
                  >
                    <Sparkles className="mr-1.5 h-4 w-4 text-primary" />
                    Talk to AI
                  </Button>
                  <Button
                    onClick={() => alert("Verification checklists downloaded as PDF.")}
                    variant="outline"
                    className="text-xs font-bold h-9 rounded-btn cursor-pointer bg-card"
                  >
                    <Save className="mr-1.5 h-4 w-4 text-primary" />
                    Download Checklist
                  </Button>
                  <Button
                    onClick={() => alert("Subsidies eligibility dossier saved to profile.")}
                    variant="outline"
                    className="text-xs font-bold h-9 rounded-btn cursor-pointer bg-card"
                  >
                    <Save className="mr-1.5 h-4 w-4 text-primary" />
                    Save Eligibility
                  </Button>
                  <Button
                    onClick={() => alert("Eligibility report shared with village panchayat officer.")}
                    variant="outline"
                    className="text-xs font-bold h-9 rounded-btn cursor-pointer bg-card"
                  >
                    <Share2 className="mr-1.5 h-4 w-4 text-primary" />
                    Share Report
                  </Button>
                  <Button
                    onClick={() => window.location.href = "/offices"}
                    className="text-xs font-bold h-9 rounded-btn cursor-pointer bg-primary"
                  >
                    <MapPin className="mr-1.5 h-4 w-4 text-white" />
                    Find Local Office
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
