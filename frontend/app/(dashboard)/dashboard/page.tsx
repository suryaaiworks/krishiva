"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Sprout, CloudSun, Brain, TrendingUp, FileText, 
  HeartHandshake, ShoppingBag, Sparkles, Camera,
  Send, Loader2, Tractor, CheckSquare, 
  ArrowUpRight, ArrowDownRight, Mic, Volume2, 
  Bot, X, AlertTriangle, ShieldCheck, Wind, Droplets, Sun
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useThemeContext } from "@/components/layout/ThemeProvider";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/chip";
import { apiClient } from "@/services/apiClient";
import { useLanguage } from "@/context/LanguageContext";

// Quick Actions Configuration
const QUICK_ACTIONS = [
  { label: "AI Assistant", desc: "Chat with Vira AI", icon: Sparkles, color: "text-primary bg-primary/10", href: "/assistant" },
  { label: "Crop Advisor", desc: "Soil recommendations", icon: Sprout, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20", href: "/crops" },
  { label: "Disease Scan", desc: "Camera leaf diagnosis", icon: Camera, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20", href: "/disease" },
  { label: "Weather Intel", desc: "Farming climate forecasts", icon: CloudSun, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/20", href: "/weather" },
  { label: "Market Prices", desc: "Mandi price index", icon: TrendingUp, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20", href: "/market" },
  { label: "Govt Schemes", desc: "Financial assistance", icon: FileText, color: "text-teal-600 bg-teal-50 dark:bg-teal-950/20", href: "/schemes" },
  { label: "Relief Hub", desc: "Disaster recovery help", icon: HeartHandshake, color: "text-rose-600 bg-rose-50 dark:bg-rose-950/20", href: "/relief" },
  { label: "Buyer Market", desc: "Sell crop directly", icon: ShoppingBag, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/20", href: "/marketplace" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { isDemoDrawerOpen } = useThemeContext();
  const { t, language } = useLanguage();
  
  const [isPageLoading, setIsPageLoading] = React.useState(true);
  const [showWelcomeCard, setShowWelcomeCard] = React.useState(false);

  const [isVoiceActive, setIsVoiceActive] = React.useState(false);
  const [typedPrompt, setTypedPrompt] = React.useState("");
  const [aiResponse, setAiResponse] = React.useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  
  // Rotating Tips State
  const [currentTipIdx, setCurrentTipIdx] = React.useState(0);
  
  // Dashboard Brief and Lists State
  const [dashboardBrief, setDashboardBrief] = React.useState<any>(null);
  const [machinery, setMachinery] = React.useState<any[]>([]);
  const [buyers, setBuyers] = React.useState<any[]>([]);
  const [schemes, setSchemes] = React.useState<any[]>([]);
  const [tasks, setTasks] = React.useState<any[]>([]);

  // Vira Floating Assistant State
  const [viraState, setViraState] = React.useState<"idle" | "speaking" | "thinking">("idle");
  const [showViraBubble, setShowViraBubble] = React.useState(true);

  // Today's Farming Tips Ticker data
  const FARMING_TIPS = React.useMemo(() => [
    t("Tip of the Day: Schedule fertilization and micro-irrigation after 6:00 PM to avoid evaporation losses under high day temperatures."),
    t("AI Suggestion: Foliage moisture indices show moderate crop leaf rust risks. Apply biological controls to Zone B."),
    t("Market Alert: Chilli demand indexes indicate a 4% spot price rise at Guntur APMC Mandi. Ideal window to lock in buyer quotes."),
    t("Weather Warning: An upcoming dry spell starts tomorrow for 5 days. Increase soil mulching to conserve moisture in root zones.")
  ], [t]);

  // Nearby Machinery Rental data
  const MACHINERY_LIST = React.useMemo(() => [
    { name: t("John Deere 5050D Tractor"), price: "₹800/hr", dist: "1.2 km", owner: "Srinivasa K.", status: t("Available Now"), icon: Tractor },
    { name: t("Pneumatic Seed Drill"), price: "₹500/hr", dist: "0.8 km", owner: "Ramanayya P.", status: t("Available Now"), icon: Sprout },
    { name: t("Multicrop Combine Harvester"), price: "₹1,500/hr", dist: "2.5 km", owner: "Prasad Rao", status: t("In Use"), icon: Tractor }
  ], [t]);

  // Crop Buyer Match data
  const BUYERS_LIST = React.useMemo(() => [
    { company: t("Vijayawada Sugar Refineries Ltd"), crop: t("Chilli (Guntur Teja)"), qty: "12 Tons", price: "₹18,500/Ton", dist: "4.2 km", match: "96%", rating: "4.8" },
    { company: t("Andhra Biofuels Hub"), crop: t("Chilli Stalks"), qty: "5 Tons", price: "₹1,400/Ton", dist: "8.5 km", match: "88%", rating: "4.4" }
  ], [t]);

  // Eligible Subsidy Schemes data
  const SCHEMES_LIST = React.useMemo(() => [
    { name: t("PM-Kisan Samman Nidhi"), payout: "₹6,000/Year", eligibility: "98% Match", deadline: t("July 15, 2026"), docsMissing: 1 },
    { name: t("PM-Kusum Solar Pump Subsidy"), payout: t("60% Pump Cost"), eligibility: "92% Match", deadline: t("July 20, 2026"), docsMissing: 2 }
  ], [t]);

  const [farmerName, setFarmerName] = React.useState("Srinivasa");

  // Page Load Timer
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("krishiva_farmer_name");
      if (savedName) setFarmerName(savedName);
    }
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  // Vira Welcome Experience Trigger
  React.useEffect(() => {
    if (isPageLoading) return;

    const hasGreeted = sessionStorage.getItem("krishiva_greeted_session") === "true";
    if (hasGreeted) return;

    const welcomeTimer = setTimeout(() => {
      // Animate floating assistant button
      const viraBtn = document.querySelector(".vira-btn");
      if (viraBtn) {
        viraBtn.classList.add("animate-bounce");
        setTimeout(() => {
          viraBtn.classList.remove("animate-bounce");
        }, 3000);
      }

      // Show welcome card
      setShowWelcomeCard(true);
      sessionStorage.setItem("krishiva_greeted_session", "true");

      // Voice greeting
      let greetingText = "";
      let locale = "en-IN";
      if (language === "te") {
        greetingText = "నమస్కారం! క్రిషివాకు స్వాగతం. నేను వీరా. ఈ రోజు మీకు ఎలా సహాయం చేయగలను?";
        locale = "te-IN";
      } else if (language === "hi") {
        greetingText = "नमस्ते! कृषिवा में आपका स्वागत है। मैं वीरा हूँ। आज मैं आपकी कैसे मदद कर सकती हूँ?";
        locale = "hi-IN";
      } else {
        greetingText = "Welcome to Krishiva. I'm Vira. How can I help you today?";
        locale = "en-IN";
      }

      if (typeof window !== "undefined" && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance(greetingText);
          utter.lang = locale;
          utter.rate = 0.95;
          utter.pitch = 1.0;
          
          const voices = window.speechSynthesis.getVoices();
          const voice = voices.find(v => v.lang.toLowerCase() === locale.toLowerCase()) ||
                        voices.find(v => v.lang.toLowerCase().startsWith(locale.substring(0, 2))) ||
                        voices[0];
          if (voice) {
            utter.voice = voice;
          }
          window.speechSynthesis.speak(utter);
        } catch (err) {
          console.warn("speechSynthesis error:", err);
        }
      }
    }, 1000);

    return () => clearTimeout(welcomeTimer);
  }, [isPageLoading, language]);

  // Rotate tips automatically
  React.useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIdx((prev) => (prev + 1) % FARMING_TIPS.length);
    }, 8000);
    return () => clearInterval(tipInterval);
  }, []);

  // Fetch all dashboard data from API
  React.useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const brief = await apiClient.get<any>("/dashboard/brief");
        setDashboardBrief(brief);
      } catch (e) {
        console.warn("Failed to load dashboard brief", e);
      }

      try {
        const list = await apiClient.get<any[]>("/tasks");
        setTasks(list.map(t => ({ id: t.id, text: t.text, done: t.is_done })));
      } catch (e) {
        console.warn("Failed to load tasks, using defaults", e);
        setTasks([
          { id: 1, text: t("Apply nitrogen fertilizer mix to Chilli Zone B"), done: false },
          { id: 2, text: t("Inspect Chilli foliage root zones for borer tunnels"), done: true },
          { id: 3, text: t("Schedule tractor rental booking for tomorrow's weeding"), done: false },
          { id: 4, text: t("Submit micro-irrigation documents on PM-Kisan portal"), done: false }
        ]);
      }

      try {
        const mach = await apiClient.get<any[]>("/machinery");
        setMachinery(mach);
      } catch (e) {
        console.warn("Failed to load machinery", e);
      }

      try {
        const b = await apiClient.get<any[]>("/market/buyers");
        setBuyers(b);
      } catch (e) {
        console.warn("Failed to load buyers", e);
      }

      try {
        const s = await apiClient.get<any[]>("/schemes/match");
        setSchemes(s);
      } catch (e) {
        console.warn("Failed to load schemes", e);
      }
    };
    loadDashboardData();
  }, []);

  const handlePromptClick = (promptText: string) => {
    setTypedPrompt(promptText);
    triggerMockAiResponse(promptText);
  };

  const handleVoiceToggle = () => {
    const nextState = !isVoiceActive;
    setIsVoiceActive(nextState);
    if (nextState) {
      setViraState("thinking");
      setAiResponse(null);
      setTimeout(() => {
        setIsVoiceActive(false);
        setViraState("speaking");
        triggerMockAiResponse("Show today's market prices.");
      }, 3500);
    } else {
      setViraState("idle");
    }
  };

  const handleSendPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedPrompt.trim()) return;
    triggerMockAiResponse(typedPrompt);
  };

  const triggerMockAiResponse = (query: string) => {
    setIsAiLoading(true);
    setViraState("thinking");
    setAiResponse(null);
    
    setTimeout(() => {
      setIsAiLoading(false);
      setViraState("speaking");
      const q = query.toLowerCase();
      if (q.includes("crop")) {
        setAiResponse(t("Based on your soil test (Sandy Loam, pH 6.5) and low rainfall forecasts, I recommend sowing Chilli or Groundnut. These crops match your nitrogen-phosphorus profile perfectly."));
      } else if (q.includes("diagnose") || q.includes("disease")) {
        setAiResponse(t("For diagnosis, please tap the Camera Button below to snap a picture. Common risks right now in Guntur include Chilli leaf curl virus vectors."));
      } else if (q.includes("rain") || q.includes("weather")) {
        setAiResponse(t("Weather analysis shows 62% humidity with light shower probability (10%) later this evening. A dry spell warning is active for June 28 - July 2. Secure soil moisture."));
      } else if (q.includes("price") || q.includes("market")) {
        setAiResponse(t("Chilli (Teja Grade) is trading at ₹18,500/Quintal (+2.5%) in Guntur Mandi. Cotton is trading at ₹7,200/Quintal (-2.0%) in Adoni Mandi."));
      } else {
        setAiResponse(t("Sure, I can help you with your query. For best results, configure your farm size (currently set at 15.5 Acres) in your profile page."));
      }
    }, 1800);
  };

  const toggleTask = async (id: any) => {
    try {
      await apiClient.patch(`/tasks/${id}/toggle`, {});
      setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    } catch (e) {
      console.warn("Offline or sync failed. Toggling locally.", e);
      setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    }
  };

  const completedTasksCount = tasks.filter(t => t.done).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  const displayedMachinery = machinery.length > 0 ? machinery.map(m => ({
    name: m.name,
    price: m.price,
    dist: m.dist,
    owner: m.owner,
    phone: m.phone,
    status: m.status === 'available' ? 'Available Now' : 'In Use',
    icon: Tractor
  })) : MACHINERY_LIST;

  const displayedBuyers = buyers.length > 0 ? buyers.map(b => ({
    company: b.companyName,
    crop: b.cropRequired,
    qty: b.quantityRequired,
    price: `₹${b.offeredPrice}/${b.unit}`,
    dist: b.distance,
    match: "96%",
    rating: "4.8"
  })) : BUYERS_LIST;

  const displayedSchemes = schemes.length > 0 ? schemes.map(s => ({
    name: s.name,
    payout: s.benefit,
    eligibility: s.eligibility_score,
    deadline: s.deadline,
    docsMissing: s.required_documents.length
  })) : SCHEMES_LIST;

  if (isPageLoading) {
    return (
      <MainLayout>
        <div className="space-y-8 pb-16">
          {/* Skeleton Hero Banner */}
          <div className="h-48 rounded-[24px] bg-muted/40 animate-pulse border border-border p-6 flex flex-col justify-end space-y-3">
            <div className="h-4 w-1/4 bg-muted-foreground/15 rounded animate-pulse" />
            <div className="h-6 w-1/2 bg-muted-foreground/25 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-muted-foreground/15 rounded animate-pulse" />
          </div>
          
          {/* Skeleton Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-40 rounded-[24px] bg-muted/40 border border-border animate-pulse" />
            <div className="h-40 rounded-[24px] bg-muted/40 border border-border animate-pulse" />
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-32 rounded-[24px] bg-muted/40 border border-border animate-pulse" />
              <div className="h-64 rounded-[24px] bg-muted/40 border border-border animate-pulse" />
            </div>
            <div className="h-[400px] rounded-[24px] bg-muted/40 border border-border animate-pulse" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in pb-16">
        
        {/* VIRA WELCOME EXPERIENCING CARD */}
        <AnimatePresence>
          {showWelcomeCard && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              className="relative overflow-hidden rounded-[24px] border border-primary/25 bg-primary/5 p-5 md:p-6 shadow-sm flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="relative shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
                  <span className="absolute inset-0 rounded-full border border-primary animate-ping opacity-25" />
                  <Bot className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <div className="space-y-2 text-left">
                  <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
                    {t("Hello! I'm Vira")}
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </h3>
                  <p className="text-xs md:text-sm font-semibold text-muted-foreground leading-relaxed max-w-2xl">
                    {language === "te" 
                      ? "నమస్కారం! క్రిషివాకు స్వాగతం. నేను వీరా. ఈ రోజు మీకు ఎలా సహాయం చేయగలను?"
                      : language === "hi"
                        ? "नमस्ते! कृषिवा में आपका स्वागत है। मैं वीरा हूँ। आज मैं आपकी कैसे मदद कर सकती हूँ?"
                        : "Welcome to Krishiva. I'm Vira. How can I help you today?"}
                  </p>
                  
                  {/* Quick Suggestion Chips */}
                  <div className="flex flex-wrap gap-2 pt-1 select-none">
                    {[
                      { label: t("Diagnose Crop"), emoji: "🌾", href: "/disease" },
                      { label: t("Weather Intelligence"), emoji: "🌦️", href: "/weather" },
                      { label: t("Market Prices"), emoji: "📈", href: "/market" },
                      { label: t("Government Schemes"), emoji: "🏛️", href: "/schemes" },
                      { label: t("Machinery Rental"), emoji: "🚜", href: "/machinery" },
                      { label: t("Buyer Marketplace"), emoji: "🤝", href: "/marketplace" }
                    ].map((chip) => (
                      <button
                        key={chip.href}
                        onClick={() => router.push(chip.href)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card hover:bg-primary/5 hover:border-primary/30 transition-all text-[11px] font-bold text-foreground cursor-pointer shadow-sm"
                      >
                        <span>{chip.emoji}</span>
                        <span>{chip.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full border border-border/60 hover:bg-muted shrink-0"
                onClick={() => setShowWelcomeCard(false)}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SECTION 1: HERO DYNAMIC BANNER */}
        <div className="relative overflow-hidden rounded-[24px] border border-emerald-500/10 bg-gradient-to-r from-amber-500/5 via-emerald-600/5 to-transparent p-6 md:p-8 shadow-sm">

          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {t("Live Telemetry Connected")} • Guntur Chilli Plot
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                {t("Good Morning")} {farmerName}.
              </h1>
              {/* Daily Farm Brief */}
              <div className="text-sm md:text-base text-muted-foreground font-medium space-y-1.5 leading-relaxed">
                <p>🟢 {t("Your chilli crops are")} <span className="font-bold text-foreground">{t("healthy")}</span>.</p>
                <p>🌧️ {t("Light rain forecast is expected")} <span className="font-bold text-foreground">{t("after 5:00 PM today")}</span>.</p>
                <p>📈 {t("Chilli prices")} <span className="font-bold text-foreground">{t("increased by 2.5%")}</span> {t("at Guntur Mandi")}.</p>
                <p>🏛️ {t("You qualify for")} <span className="font-bold text-primary underline cursor-pointer" onClick={() => router.push("/schemes")}>{t("2 eligible government schemes")}</span>.</p>
                <p>🤖 {t("Vira has")} <span className="font-bold text-primary underline cursor-pointer" onClick={() => handlePromptClick("Recommend crops")}>{t("3 pending recommendations")}</span> {t("waiting for you")}.</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: TODAY'S FARMING TIP BANNER */}
        <div className="overflow-hidden rounded-[16px] border border-primary/20 bg-emerald-500/5 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-btn bg-primary/10 text-primary">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div className="text-xs md:text-sm font-semibold text-foreground">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTipIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {FARMING_TIPS[currentTipIdx]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 shrink-0 rounded-full hover:bg-primary/10 text-primary"
            onClick={() => alert(`TTS Announcement: ${FARMING_TIPS[currentTipIdx]}`)}
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>

        {/* SECTION 3: TOP METRICS (WEATHER & CROP HEALTH) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weather Card */}
          <div className="relative overflow-hidden rounded-[24px] border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Live Weather Forecast
                </span>
                <h3 className="text-xl font-bold text-foreground">Guntur Farm, AP</h3>
                <p className="text-xs text-muted-foreground">Updated 10 mins ago</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-extrabold text-foreground">28°C</span>
                {/* SVG Weather Animation */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="h-10 w-10 text-amber-500"
                >
                  <Sun className="h-full w-full" />
                </motion.div>
              </div>
            </div>

            {/* Grid Metrics */}
            <div className="grid grid-cols-3 gap-4 my-5 pt-4 border-t border-border/40">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground block">HUMIDITY</span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Droplets className="h-3.5 w-3.5 text-blue-500" />
                  62%
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground block">WIND SPEED</span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Wind className="h-3.5 w-3.5 text-slate-500" />
                  14 km/h
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground block">RAIN PROB.</span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <CloudSun className="h-3.5 w-3.5 text-sky-500" />
                  10%
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-muted/50 rounded-[16px] p-3 text-xs border border-border/30 space-y-1.5">
              <div className="flex justify-between">
                <span className="font-bold text-foreground">Best Irrigation Window:</span>
                <span className="text-primary font-bold">6 PM - 8 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-foreground">Work Status:</span>
                <span className="text-emerald-600 font-bold">Favorable for Spraying</span>
              </div>
            </div>
          </div>

          {/* Farm Health summary card */}
          <div className="relative overflow-hidden rounded-[24px] border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Farming Status Summary
                </span>
                <h3 className="text-xl font-bold text-foreground">Chilli Zone A</h3>
              </div>
              <Badge variant="success" className="font-bold px-2.5 py-0.5 text-xs bg-emerald-500/10 text-emerald-600 border-none">
                Optimal
              </Badge>
            </div>

            {/* Health ring and metrics stats */}
            <div className="flex items-center gap-6 my-4">
              {/* Circular indicator mock */}
              <div className="relative h-20 w-20 shrink-0 flex items-center justify-center">
                {/* SVG Progress Ring */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="34" className="stroke-emerald-100 dark:stroke-emerald-950/20 fill-none stroke-[6]" />
                  <motion.circle 
                    cx="40" 
                    cy="40" 
                    r="34" 
                    className="stroke-emerald-500 fill-none stroke-[6]"
                    strokeDasharray="213"
                    initial={{ strokeDashoffset: 213 }}
                    animate={{ strokeDashoffset: 213 - (213 * 92) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-lg font-extrabold text-foreground leading-none">92%</span>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wide">Health</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs flex-1">
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground block">WATER LEVEL</span>
                  <span className="font-bold text-foreground">88% (Adequate)</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground block">GROWTH STAGE</span>
                  <span className="font-bold text-foreground">Vegetative (Wk 14)</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground block">DISEASE RISK</span>
                  <span className="font-bold text-emerald-600">Low (12%)</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground block">AI CONFIDENCE</span>
                  <span className="font-bold text-foreground">96%</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/40 flex items-start gap-2.5 text-xs">
              <Brain className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5 animate-pulse" />
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-bold text-foreground">AI Advisor:</span> Water levels are optimal. Soil moisture levels are secure for the upcoming heat zone forecast.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 4: QUICK ACTIONS GRID */}
        <div>
          <SectionHeader 
            title={t("Quick Actions")} 
            description={t("Access agricultural helpers and B2B marketplace paths.")} 
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
            {QUICK_ACTIONS.map((action, idx) => {
              const ActionIcon = action.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  onClick={() => router.push(action.href)}
                  className="p-4 rounded-[20px] border border-border bg-card flex flex-col justify-between items-start gap-4 cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all duration-300 h-32"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-btn ${action.color}`}>
                    <ActionIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-bold text-foreground truncate">
                      {t(action.label)}
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                      {t(action.desc)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* SECTION 5: MIDDLE ROW (MARKET SNAPSHOT & ALERTS) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Snapshot Card */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-[24px] border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Commodity spot insights
                  </span>
                  <h3 className="text-lg font-bold text-foreground">Market Prices Snapshot</h3>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => router.push("/market")}
                  className="text-[10px] font-bold h-7 rounded-btn cursor-pointer bg-card px-2.5"
                >
                  Mandi Panel
                </Button>
              </div>

              {/* Sparkline table */}
              <div className="space-y-4.5 text-xs pt-2">
                {/* Item 1 */}
                <div className="flex items-center justify-between py-1 border-b border-border/30">
                  <div className="w-1/4 text-left">
                    <span className="font-bold text-foreground block">{t("Chilli (Teja)")}</span>
                    <span className="text-[9px] text-muted-foreground">{t("Guntur Mandi")}</span>
                  </div>
                  <div className="w-1/4 text-center">
                    <span className="font-bold text-foreground">₹18,500/Qtl</span>
                    <span className="text-[9px] text-emerald-600 block flex items-center justify-center gap-0.5">
                      <ArrowUpRight className="h-3 w-3" /> +2.5%
                    </span>
                  </div>
                  {/* Sparkline mini chart */}
                  <div className="w-1/4 h-8 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 30">
                      <polyline
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="2"
                        points="0,25 20,22 40,15 60,18 80,10 100,5"
                      />
                    </svg>
                  </div>
                  <div className="w-1/4 text-right">
                    <span className="font-bold text-foreground block">{t("Demand: High")}</span>
                    <span className="text-[9px] text-muted-foreground">{t("AI Suggests: Hold")}</span>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-center justify-between py-1 border-b border-border/30">
                  <div className="w-1/4 text-left">
                    <span className="font-bold text-foreground block">{t("Long Cotton")}</span>
                    <span className="text-[9px] text-muted-foreground">{t("Adoni Mandi")}</span>
                  </div>
                  <div className="w-1/4 text-center">
                    <span className="font-bold text-foreground">₹7,200/Qtl</span>
                    <span className="text-[9px] text-rose-500 block flex items-center justify-center gap-0.5">
                      <ArrowDownRight className="h-3 w-3" /> -2.0%
                    </span>
                  </div>
                  {/* Sparkline mini chart */}
                  <div className="w-1/4 h-8 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 30">
                      <polyline
                        fill="none"
                        stroke="var(--error)"
                        strokeWidth="2"
                        points="0,5 20,8 40,18 60,12 80,22 100,28"
                      />
                    </svg>
                  </div>
                  <div className="w-1/4 text-right">
                    <span className="font-bold text-foreground block">Demand: Medium</span>
                    <span className="text-[9px] text-muted-foreground">AI Suggests: Sell</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/40 text-xs flex justify-between items-center text-muted-foreground">
              <span>MSP Base: ₹7,000/Qtl</span>
              <span className="font-bold text-foreground">Arbitrage Potential: Yes</span>
            </div>
          </div>

          {/* Important Alerts Feed */}
          <div className="relative overflow-hidden rounded-[24px] border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Disaster & Warning Timeline
              </span>
              <h3 className="text-lg font-bold text-foreground mb-4">Important Alerts</h3>

              <div className="space-y-3.5">
                {/* Alert 1 */}
                <div className="flex items-center gap-3.5 p-3 rounded-[16px] border border-border/40 bg-muted/10 hover:bg-muted/20 transition-all duration-200">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                    <AlertTriangle className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="font-bold text-foreground truncate text-xs">Dry Spell Warning</span>
                      <span className="text-[9px] text-muted-foreground shrink-0 font-medium">Just now</span>
                    </div>
                    <p className="text-muted-foreground leading-normal text-[11px]">
                      Zero rain forecasted for next 5 days. Secure drip lines.
                    </p>
                    <div className="pt-1.5 flex justify-between items-center">
                      <Button
                        onClick={() => router.push("/weather")}
                        variant="link"
                        className="text-[10px] text-primary hover:underline font-extrabold p-0 h-auto self-start leading-none"
                      >
                        Action Plan →
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Alert 2 */}
                <div className="flex items-center gap-3.5 p-3 rounded-[16px] border border-border/40 bg-muted/10 hover:bg-muted/20 transition-all duration-200">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                    <AlertTriangle className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="font-bold text-foreground truncate text-xs">Stem Borer Risk</span>
                      <span className="text-[9px] text-muted-foreground shrink-0 font-medium">3 hours ago</span>
                    </div>
                    <p className="text-muted-foreground leading-normal text-[11px]">
                      Humidity indices match pest migration profiles in Zone A.
                    </p>
                    <div className="pt-1.5 flex justify-between items-center">
                      <Button
                        onClick={() => router.push("/disease")}
                        variant="link"
                        className="text-[10px] text-primary hover:underline font-extrabold p-0 h-auto self-start leading-none"
                      >
                        Scan Stalks →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => router.push("/relief")}
              variant="link" 
              className="text-primary font-bold text-xs self-start p-0 h-auto mt-4 hover:no-underline"
            >
              Relief Command Center →
            </Button>
          </div>
        </div>

        {/* SECTION 6: DAILY TASKS & NEARBY MACHINERY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daily Tasks Checkbox Card */}
          <div className="relative overflow-hidden rounded-[24px] border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Farm Operations Tasklist
                </span>
                <h3 className="text-lg font-bold text-foreground">Daily Tasks</h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-foreground">{completedTasksCount}/{tasks.length} Completed</span>
                <div className="h-1.5 w-24 bg-muted rounded-full mt-1.5 overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary rounded-full" 
                    animate={{ width: `${progressPercent}%` }} 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {tasks.map(task => (
                <div 
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="flex items-center gap-3 p-3 rounded-[16px] border border-border/30 hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-btn border ${task.done ? "bg-primary border-primary text-white" : "border-border/80 text-transparent"}`}>
                    <CheckSquare className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                  <span className={`text-xs font-medium leading-tight ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Machinery Rental Card */}
          <div className="relative overflow-hidden rounded-[24px] border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Equipment matching logistics
                  </span>
                  <h3 className="text-lg font-bold text-foreground">Nearby Machinery</h3>
                </div>
                <Badge variant="outline" className="font-bold text-[10px] bg-card text-muted-foreground px-2 h-6 border-border">
                  3 Centers Active
                </Badge>
              </div>

              {/* Machinery list */}
              <div className="space-y-3.5 pt-1">
                {displayedMachinery.map((mach, idx) => {
                  const Icon = mach.icon;
                  return (
                    <div key={idx} className="flex justify-between items-center p-2.5 rounded-[16px] border border-border/30 bg-muted/20">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-btn bg-emerald-500/10 text-emerald-600">
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <div className="space-y-0.5 text-xs">
                          <span className="font-bold text-foreground block">{mach.name}</span>
                          <span className="text-[10px] text-muted-foreground">{mach.dist} • Owner: {mach.owner}</span>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <span className="text-xs font-bold text-foreground block">{mach.price}</span>
                        <span className="text-[9px] font-bold text-emerald-600 block">{mach.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Button 
              onClick={() => router.push("/machinery")}
              className="w-full mt-5 rounded-btn h-9 cursor-pointer text-xs font-bold bg-primary text-white"
            >
              Book Machinery Rental
            </Button>
          </div>
        </div>

        {/* SECTION 7: BUYER MARKETPLACE & SUBSIDY SCHEMES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buyer Marketplace Summary */}
          <div className="relative overflow-hidden rounded-[24px] border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Commercial procurement matches
                  </span>
                  <h3 className="text-lg font-bold text-foreground">Buyer Marketplace</h3>
                </div>
                <Button 
                  onClick={() => router.push("/marketplace")}
                  variant="outline" 
                  size="sm" 
                  className="text-[10px] font-bold h-7 rounded-btn cursor-pointer bg-card px-2.5"
                >
                  Direct Hub
                </Button>
              </div>

              {/* Buyers matching */}
              <div className="space-y-3.5 pt-1">
                {displayedBuyers.map((buyer, idx) => (
                  <div key={idx} className="p-3 rounded-[16px] border border-border/30 bg-card space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="font-bold text-xs text-foreground block flex items-center gap-1.5 font-semibold">
                          {buyer.company}
                          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                        </span>
                        <span className="text-[10px] text-muted-foreground">{buyer.crop} • {buyer.dist} away</span>
                      </div>
                      <Badge variant="outline" className="font-bold text-[9px] text-primary border-primary/20 bg-primary/5">
                        {buyer.match} AI Match
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-medium text-muted-foreground font-semibold">Required: <strong className="text-foreground">{buyer.qty}</strong></span>
                      <span className="font-medium text-muted-foreground font-semibold">Offered: <strong className="text-foreground">{buyer.price}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={() => router.push("/marketplace")}
              className="w-full mt-5 rounded-btn h-9 cursor-pointer text-xs font-bold bg-primary text-white"
            >
              Negotiate Direct Buyer Contracts
            </Button>
          </div>

          {/* Eligible Subsidy Schemes */}
          <div className="relative overflow-hidden rounded-[24px] border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Government subsidy programs
                  </span>
                  <h3 className="text-lg font-bold text-foreground">Eligible Schemes</h3>
                </div>
                <Button 
                  onClick={() => router.push("/schemes")}
                  variant="outline" 
                  size="sm" 
                  className="text-[10px] font-bold h-7 rounded-btn cursor-pointer bg-card px-2.5"
                >
                  All Schemes
                </Button>
              </div>

              {/* Schemes matching */}
              <div className="space-y-3.5 pt-1">
                {displayedSchemes.map((sch, idx) => (
                  <div key={idx} className="p-3 rounded-[16px] border border-border/30 bg-card space-y-2">
                    <div className="flex justify-between items-start font-semibold">
                      <div className="space-y-0.5">
                        <span className="font-bold text-xs text-foreground block">{sch.name}</span>
                        <span className="text-[10px] text-muted-foreground">Payout: {sch.payout} • Deadline: {sch.deadline}</span>
                      </div>
                      <Badge variant="outline" className="font-bold text-[9px] text-emerald-600 border-emerald-500/20 bg-emerald-500/5">
                        {sch.eligibility}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground font-semibold">
                      <span>Documents: {sch.docsMissing === 0 ? "Complete" : `${sch.docsMissing} Missing`}</span>
                      <span className="text-primary font-bold cursor-pointer hover:underline" onClick={() => router.push("/schemes")}>Verify Docs</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={() => router.push("/schemes")}
              className="w-full mt-5 rounded-btn h-9 cursor-pointer text-xs font-bold bg-primary text-white"
            >
              Apply Online Subsidies
            </Button>
          </div>
        </div>

        {/* SECTION 8: FLAGSHIP AI COPILOT VOICE PANEL */}
        <div className="relative overflow-hidden rounded-[24px] border border-emerald-500/20 bg-gradient-to-tr from-primary/10 via-card to-accent/5 p-6 md:p-8 shadow-md">
          {/* Glowing gradient backdrops */}
          <div className="absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
          <div className="absolute -top-20 -right-20 h-44 w-44 rounded-full bg-accent/10 blur-[80px] pointer-events-none" />

          <div className="flex flex-col items-center max-w-2xl mx-auto space-y-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md border border-primary/10">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                Vira AI Copilot
              </h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Speak, capture root foliage photos, or request mandi predictions using voice commands.
              </p>
            </div>

            {/* AI Response Display Panel */}
            <AnimatePresence mode="wait">
              {(aiResponse || isAiLoading || isVoiceActive) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full rounded-[20px] border border-primary/20 bg-card p-5 shadow-sm text-xs leading-relaxed"
                >
                  {isVoiceActive ? (
                    <div className="flex flex-col items-center gap-3 py-2 text-center text-primary font-semibold">
                      <span className="font-bold animate-pulse">Listening to voice query...</span>
                      <p className="text-[10px] text-muted-foreground">Say &quot;Diagnose chilli disease&quot; or &quot;Show Guntur mandi price&quot;</p>
                    </div>
                  ) : isAiLoading ? (
                    <div className="flex items-center justify-center gap-2.5 py-4 font-semibold">
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                      <span className="font-bold text-muted-foreground animate-pulse font-semibold">AI reasoning with Gemini...</span>
                    </div>
                  ) : (
                    <div className="space-y-3.5 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.01] p-4.5 rounded-[16px] border-l-4 border-l-primary text-xs leading-normal font-semibold">
                      <div className="flex items-center justify-between border-b border-primary/15 pb-2">
                        <span className="font-bold text-primary flex items-center gap-1.5 text-sm">
                          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                          Vira AI Advisory Feedback
                        </span>
                        <Button 
                          onClick={() => setAiResponse(null)}
                          variant="ghost" 
                          className="h-6 text-[10px] px-2 rounded-btn font-semibold hover:bg-muted"
                        >
                          Clear
                        </Button>
                      </div>
                      <p className="text-foreground leading-normal font-semibold text-left">{aiResponse}</p>
                    </div>

                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Controls */}
            <form onSubmit={handleSendPrompt} className="w-full flex items-center gap-3 bg-card border border-border p-2.5 rounded-full shadow-sm max-w-lg">
              <input
                type="text"
                placeholder="Ask about chilli, soil, weather..."
                value={typedPrompt}
                onChange={(e) => setTypedPrompt(e.target.value)}
                className="flex-1 bg-transparent px-4 text-sm focus:outline-none placeholder:text-muted-foreground text-foreground"
              />

              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePromptClick("Diagnose leaf disease risk.")}
                  className="h-9 w-9 rounded-full hover:bg-primary/10 text-primary border border-border"
                  title="Upload crop photo"
                >
                  <Camera className="h-4.5 w-4.5" />
                </Button>

                <Button
                  type="submit"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Waveform and Mic controls */}
            <div className="flex flex-col items-center gap-4">
              {/* Vertical Bouncing Bars Waveform */}
              {isVoiceActive && (
                <div className="flex items-end justify-center gap-1 h-8 w-44">
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: [4, Math.random() * 28 + 4, 4]
                      }}
                      transition={{
                        duration: 0.6 + i * 0.05,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-1.5 bg-primary rounded-full"
                    />
                  ))}
                </div>
              )}
              
              <div className="flex flex-col items-center gap-2">
                <motion.button
                  type="button"
                  onClick={handleVoiceToggle}
                  className={`relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg focus:outline-none cursor-pointer ${isVoiceActive ? "bg-red-500 hover:bg-red-600 shadow-red-500/20" : "bg-primary hover:bg-primary/90 shadow-primary/20"}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isVoiceActive ? (
                    <X className="h-6 w-6 relative z-10" />
                  ) : (
                    <Mic className="h-6 w-6 relative z-10" />
                  )}
                  {isVoiceActive && (
                    <span className="absolute -inset-1.5 rounded-full border border-red-500/35 animate-ping opacity-45 pointer-events-none" />
                  )}
                </motion.button>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  {isVoiceActive ? "Recording..." : "Tap to Speak"}
                </span>
              </div>
            </div>

            {/* Chips suggested */}
            <div className="space-y-2 text-center w-full">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Suggested voice queries
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Chip onClick={() => handlePromptClick("Will it rain tomorrow?")} className="cursor-pointer">
                  🌦 Will it rain tomorrow?
                </Chip>
                <Chip onClick={() => handlePromptClick("Show tomato prices.")} className="cursor-pointer">
                  📈 Show tomato prices.
                </Chip>
                <Chip onClick={() => handlePromptClick("Recommend fertilizer.")} className="cursor-pointer">
                  🌾 Recommend fertilizer.
                </Chip>
                <Chip onClick={() => handlePromptClick("Diagnose my crop.")} className="cursor-pointer">
                  🔬 Diagnose my crop.
                </Chip>
                <Chip onClick={() => handlePromptClick("Find nearby buyers.")} className="cursor-pointer">
                  🤝 Find nearby buyers.
                </Chip>
                <Chip onClick={() => handlePromptClick("Government schemes.")} className="cursor-pointer">
                  🏛 Government schemes.
                </Chip>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 9: RECENT ACTIVITIES LOG */}
        <div className="relative overflow-hidden rounded-[24px] border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <SectionHeader
            title={t("Recent Activity Log")}
            description={t("Logs of your recent diagnosis requests and AI discussions.")}
            className="mb-4"
          />
          <div className="divide-y divide-border text-xs">
            <div className="py-3 flex justify-between gap-4">
              <div className="space-y-1">
                <span className="font-bold text-foreground">Voice Query: &quot;Best fertilizer dosage?&quot;</span>
                <p className="text-muted-foreground">Vira AI recommended organic manure details</p>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">June 26, 4:32 PM</span>
            </div>
            <div className="py-3 flex justify-between gap-4">
              <div className="space-y-1">
                <span className="font-bold text-foreground">Leaf Diagnosis (Camera Upload)</span>
                <p className="text-muted-foreground">Diagnosis: Sugarcane rust threat detected (Severity: 12%)</p>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">June 25, 11:15 AM</span>
            </div>
            <div className="py-3 flex justify-between gap-4">
              <div className="space-y-1">
                <span className="font-bold text-foreground">Relief Scheme Application</span>
                <p className="text-muted-foreground">Drafted document checklists for PM-Kisan claims</p>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">June 24, 09:20 AM</span>
            </div>
          </div>
        </div>

      </div>

      {/* FLOATING VIRA ROBOT ASSISTANT */}
      {showViraBubble && !isDemoDrawerOpen && (
        <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 flex flex-col items-end gap-2.5">
          {/* Chat Bubble overlay */}
          <AnimatePresence>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 10 }}
              className="bg-card/95 backdrop-blur-md border border-border/80 rounded-[22px] p-5 shadow-2xl max-w-xs text-xs text-foreground relative z-10 flex flex-col gap-2.5 select-text pointer-events-auto w-72"
            >
              <div className="space-y-2 flex-1 text-left">
                <span className="font-bold text-primary flex items-center gap-1.5 text-sm">
                  <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" />
                  🌱 Vira AI
                </span>
                <div className="space-y-1">
                  <h4 className="font-bold text-foreground text-sm">{t("Namaste Srinivasa!")}</h4>
                  <p className="text-[11px] text-muted-foreground font-semibold">
                    {viraState === "idle" ? t("How can I help today?") : viraState === "thinking" ? t("Vira AI is formulating advice...") : t("Vira is speaking...")}
                  </p>
                </div>
                {viraState === "idle" ? (
                  <ul className="space-y-1 text-muted-foreground font-semibold pt-1 border-t border-border/40">
                    <li className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer" onClick={() => handlePromptClick("Scan crop leaf")}>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {t("Disease Detection")}
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer" onClick={() => handlePromptClick("Show weather forecast")}>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {t("Weather Intelligence")}
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer" onClick={() => handlePromptClick("Eligible government schemes")}>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {t("Government Schemes")}
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer" onClick={() => handlePromptClick("Market prices near me")}>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {t("Market Prices")}
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer" onClick={() => handlePromptClick("Recommend crops")}>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {t("Crop Recommendation")}
                    </li>
                  </ul>
                ) : (
                  <p className="leading-relaxed font-semibold text-primary pt-1 border-t border-border/40">
                    {viraState === "thinking" && t("Formulating advice with Gemini...")}
                    {viraState === "speaking" && t("Chilli spot prices look favorable today. You can negotiate direct buyer contracts now.")}
                  </p>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 rounded-full hover:bg-muted text-muted-foreground p-0 absolute right-3 top-3"
                onClick={() => setShowViraBubble(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </motion.div>
          </AnimatePresence>

          {/* Floating Avatar */}
          <motion.div
            animate={{ 
              y: [0, -8, 0] 
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            onClick={() => handlePromptClick("Help")}
            className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xl hover:shadow-emerald-500/30 hover:scale-[1.06] transition-all duration-300 cursor-pointer pointer-events-auto select-none overflow-visible"
          >
            {/* Pulsing Concentric rings for AI status/sparkle */}
            <span className="absolute -inset-1 rounded-full border-2 border-emerald-500/30 opacity-70 pointer-events-none animate-pulse" />
            <span className="kv-ping-slow absolute -inset-3 rounded-full border border-emerald-500/20 pointer-events-none" />

            {/* Custom agriculture leaf/wheat + sparkle SVG */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white relative z-10">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 21 3c-1.5 4-2 5.5-3.1 11.2A7 7 0 0 1 11 20z" fill="rgba(255,255,255,0.18)" />
              <path d="M9 22L11 20" />
              <path d="M11 20c2.5-2.5 5-3.5 7-7" />
            </svg>

            {/* Sparkles element */}
            <Sparkles className="absolute -top-1 -right-1 h-5.5 w-5.5 text-amber-400 bg-emerald-700 rounded-full p-0.5 border border-emerald-600 shadow-md animate-pulse z-20" />

            {/* Glowing backdrop shadow */}
            <div className="absolute inset-0 bg-emerald-500/30 blur-md rounded-full -z-10" />
          </motion.div>
        </div>
      )}


    </MainLayout>
  );
}
