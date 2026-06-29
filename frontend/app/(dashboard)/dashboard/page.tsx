"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Sprout, CloudSun, Brain, TrendingUp, FileText, 
  HeartHandshake, ShoppingBag, Sparkles, Camera,
  Send, CircleDot, Loader2
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { WeatherCard } from "@/components/weather/WeatherCard";
import { AlertCard } from "@/components/alerts/AlertCard";
import { MarketCard } from "@/components/market/MarketCard";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/chip";
import { VoiceButton } from "@/components/assistant/VoiceButton";

const QUICK_ACTIONS = [
  { label: "AI Assistant", desc: "Chat with Kisan AI", icon: Sparkles, color: "text-primary bg-primary/10", href: "/assistant" },
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
  const [isVoiceActive, setIsVoiceActive] = React.useState(false);
  const [typedPrompt, setTypedPrompt] = React.useState("");
  const [aiResponse, setAiResponse] = React.useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = React.useState(false);

  const handlePromptClick = (promptText: string) => {
    setTypedPrompt(promptText);
    triggerMockAiResponse(promptText);
  };

  const handleVoiceToggle = () => {
    const nextState = !isVoiceActive;
    setIsVoiceActive(nextState);
    if (nextState) {
      setAiResponse(null);
      // Simulate listening and typing after 3 seconds
      setTimeout(() => {
        setIsVoiceActive(false);
        triggerMockAiResponse("Show today's market prices.");
      }, 3500);
    }
  };

  const handleSendPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedPrompt.trim()) return;
    triggerMockAiResponse(typedPrompt);
  };

  const triggerMockAiResponse = (query: string) => {
    setIsAiLoading(true);
    setAiResponse(null);
    
    // Custom responses based on query
    setTimeout(() => {
      setIsAiLoading(false);
      if (query.toLowerCase().includes("crop")) {
        setAiResponse("Based on your soil test (Clayey, pH 6.8) and low rainfall forecasts, I recommend sowing Sugarcane or Pearl Millet. These crops match your nitrogen-phosphorus profile perfectly.");
      } else if (query.toLowerCase().includes("diagnose") || query.toLowerCase().includes("disease")) {
        setAiResponse("For diagnosis, please tap the Camera Button below to snap a picture. Common risks right now in Pune include sugarcane stem borers due to high moisture levels.");
      } else if (query.toLowerCase().includes("rain") || query.toLowerCase().includes("weather")) {
        setAiResponse("Weather analysis shows 62% humidity with light shower probability (10%) later this evening. A dry spell warning is active for June 28 - July 2. Secure soil moisture.");
      } else if (query.toLowerCase().includes("price") || query.toLowerCase().includes("market")) {
        setAiResponse("Sugarcane is trading at ₹3,400/Quintal (+3.6%) in Pune Mandi. Cotton is trading at ₹7,200/Quintal (-2.0%) in Nagpur Mandi. Nagpur Cotton price shows downward trends.");
      } else {
        setAiResponse(`Sure, I can help you with "${query}". For best results, configure your farm size (currently set at 8.5 Acres) in your profile page.`);
      }
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        
        {/* SECTION 1: HEADER GREETINGS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              Good Morning, Ramesh <span className="animate-bounce">👋</span>
            </h1>
            <p className="text-sm text-muted-foreground font-semibold flex items-center gap-1.5">
              <CircleDot className="h-4 w-full max-w-[16px] text-primary fill-primary/20" />
              Your sugarcane crop looks healthy today.
            </p>
          </div>
          <Badge variant="outline" className="sm:self-center font-bold px-3 py-1 bg-card text-xs border border-border">
            Today: June 27, 2026
          </Badge>
        </div>

        {/* SECTION 2: TOP METRICS (WEATHER & CROP HEALTH) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weather Hero Card */}
          <WeatherCard
            location="Pune Farm, Maharashtra"
            temperature="28°C"
            condition="Cloudy Sky"
            humidity="62%"
            windSpeed="14 km/h"
            rainProbability="10%"
            alertMessage="Dry spell active starting tomorrow. Increase evening watering by 20%."
          />

          {/* Farm Health summary card */}
          <Card title="" animate={true} className="p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Farm Status Summary
                </span>
                <h3 className="text-xl font-bold text-foreground">Sugarcane Crop</h3>
              </div>
              <Badge variant="success" className="font-bold px-2.5 py-0.5 text-xs">
                Optimal Condition
              </Badge>
            </div>

            {/* Health ring and metrics stats */}
            <div className="flex items-center gap-6 my-5">
              {/* Circular indicator mock */}
              <div className="relative h-20 w-20 shrink-0 flex items-center justify-center rounded-full border-4 border-primary/20 border-t-primary">
                <span className="text-lg font-extrabold text-foreground">92%</span>
                <span className="absolute text-[8px] font-bold text-muted-foreground bottom-2.5 uppercase tracking-wide">Health</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-muted-foreground">Hydration Level:</span>
                  <span className="font-bold text-foreground">88% (Adequate)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                  <span className="text-muted-foreground">Soil Nitrogen:</span>
                  <span className="font-bold text-foreground">Optimal (N-P-K 4-1-2)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-muted-foreground">Pest Risk Index:</span>
                  <span className="font-bold text-foreground">Low (12%)</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/50 flex items-start gap-2.5 text-xs">
              <Brain className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5 animate-pulse" />
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-bold text-foreground">AI Advisor Suggests:</span> Schedule fertilization and light irrigation after 6 PM to prevent nutrient evaporation.
              </p>
            </div>
          </Card>
        </div>

        {/* SECTION 3: FLAGSHIP AI ASSISTANT HERO CARD */}
        <Card title="" animate={false} className="p-6 md:p-8 bg-gradient-to-tr from-primary/10 via-card to-accent/5 border-primary/20 shadow-md relative overflow-hidden">
          {/* Decorative glowing gradient sphere */}
          <div className="absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
          <div className="absolute -top-20 -right-20 h-44 w-44 rounded-full bg-accent/10 blur-[80px] pointer-events-none" />

          <div className="flex flex-col items-center max-w-2xl mx-auto space-y-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                Kisan AI Assistant
              </h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Speak, snap a photo of leaf damage, or type to get immediate diagnostic advice.
              </p>
            </div>

            {/* AI Response Display Panel */}
            <AnimatePresence mode="wait">
              {(aiResponse || isAiLoading || isVoiceActive) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full rounded-card border border-primary/20 bg-card p-5 shadow-sm text-xs leading-relaxed"
                >
                  {isVoiceActive ? (
                    <div className="flex flex-col items-center gap-3 py-2 text-center text-primary">
                      <span className="font-bold animate-pulse">Listening to voice query...</span>
                      <p className="text-[10px] text-muted-foreground">Say &quot;Diagnose my crop disease&quot; or &quot;Show mandi prices&quot;</p>
                    </div>
                  ) : isAiLoading ? (
                    <div className="flex items-center justify-center gap-2.5 py-4">
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                      <span className="font-bold text-muted-foreground animate-pulse">AI reasoning with Gemini...</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-border/50 pb-2">
                        <span className="font-bold text-primary flex items-center gap-1.5">
                          <Brain className="h-3.5 w-3.5" />
                          Advisor Feedback
                        </span>
                        <Button 
                          onClick={() => setAiResponse(null)}
                          variant="ghost" 
                          className="h-6 text-[10px] px-2 rounded-btn font-semibold hover:bg-muted"
                        >
                          Clear
                        </Button>
                      </div>
                      <p className="text-foreground leading-normal font-medium text-left">{aiResponse}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Bar & Controls */}
            <form onSubmit={handleSendPrompt} className="w-full flex items-center gap-3 bg-card border border-border p-2.5 rounded-full shadow-sm max-w-lg">
              {/* Type Button / Input */}
              <input
                type="text"
                placeholder="Ask about crops, soil, weather..."
                value={typedPrompt}
                onChange={(e) => setTypedPrompt(e.target.value)}
                className="flex-1 bg-transparent px-3 text-sm focus:outline-none placeholder:text-muted-foreground text-foreground"
              />

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Camera diagnostic mock */}
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

                {/* Submitting button */}
                <Button
                  type="submit"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Micro voice rippler button */}
            <div className="flex flex-col items-center gap-2">
              <VoiceButton isListening={isVoiceActive} onClick={handleVoiceToggle} />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                {isVoiceActive ? "Recording..." : "Tap to Speak"}
              </span>
            </div>

            {/* Suggested prompts list */}
            <div className="space-y-2 text-center w-full">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Suggested advisory queries
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Chip onClick={() => handlePromptClick("Which crop should I grow this season?")} className="cursor-pointer">
                  🌾 Crop Selection
                </Chip>
                <Chip onClick={() => handlePromptClick("Diagnose sugarcane diseases.")} className="cursor-pointer">
                  🔬 Leaf Diagnosis
                </Chip>
                <Chip onClick={() => handlePromptClick("Will it rain in Pune tomorrow?")} className="cursor-pointer">
                  🌦 Rain Forecast
                </Chip>
                <Chip onClick={() => handlePromptClick("Show Pune market prices.")} className="cursor-pointer">
                  📈 Mandi Prices
                </Chip>
              </div>
            </div>
          </div>
        </Card>

        {/* SECTION 4: QUICK ACTIONS GRID */}
        <div>
          <SectionHeader 
            title="Quick Actions" 
            description="Access AI reasoning tools and direct marketplaces." 
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {QUICK_ACTIONS.map((action, idx) => {
              const ActionIcon = action.icon;
              return (
                <Card 
                  key={idx} 
                  title="" 
                  animate={true} 
                  onClick={() => router.push(action.href)}
                  className="p-4 flex flex-col justify-between items-start gap-4 cursor-pointer hover:border-primary/40 hover:bg-card/70"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-btn ${action.color}`}>
                    <ActionIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-bold text-foreground truncate">
                      {action.label}
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                      {action.desc}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* SECTION 5: SMART ALERTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <SectionHeader 
              title="Smart Alerts" 
              description="Real-time disaster and crop warning notifications." 
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AlertCard
                severity="critical"
                title="Dry Spell & Moisture Alert"
                message="Expected dry spell in Pune for 5 consecutive days starting tomorrow. Irrigate by evening to minimize water losses."
                date="Just now"
                onActionClick={() => handlePromptClick("Tell me irrigation guidelines for dry spells.")}
              />
              <AlertCard
                severity="warning"
                title="Sugarcane Pest Warning"
                message="High air moisture matches stem borer propagation conditions. Inspect sugarcane stem bases for leaf tunnels."
                date="3 hours ago"
                onActionClick={() => handlePromptClick("How do I control stem borer pests?")}
              />
            </div>
          </div>

          {/* SECTION 6: MARKET HIGHLIGHTS */}
          <div className="space-y-4">
            <SectionHeader 
              title="Market Highlights" 
              description="Live APMC Mandi indexes." 
            />
            <div className="flex flex-col gap-4">
              <MarketCard
                cropName="Sugarcane (Grade A)"
                marketName="Pune APMC Mandi"
                price="₹3,400"
                priceChange="+₹120 (+3.6%)"
                trend="up"
                onDetailsClick={() => handlePromptClick("Show sugarcane market trend charts.")}
              />
              <MarketCard
                cropName="Long Staple Cotton"
                marketName="Nagpur APMC Mandi"
                price="₹7,200"
                priceChange="-₹150 (-2.0%)"
                trend="down"
                onDetailsClick={() => handlePromptClick("Show Nagpur cotton price projections.")}
              />
            </div>
          </div>
        </div>

        {/* SECTION 7: RECENT ACTIVITIES LIST */}
        <Card title="" animate={false} className="p-6">
          <SectionHeader
            title="Recent Activity Log"
            description="Logs of your recent diagnosis requests and AI discussions."
            className="mb-4"
          />
          <div className="divide-y divide-border text-xs">
            <div className="py-3 flex justify-between gap-4">
              <div className="space-y-1">
                <span className="font-bold text-foreground">Voice Query: &quot;Best fertilizer dosage?&quot;</span>
                <p className="text-muted-foreground">Kisan AI recommended organic manure details</p>
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
                <p className="text-muted-foreground">Drafted document checklists for PM-Kisan compensation claims</p>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">June 24, 09:20 AM</span>
            </div>
          </div>
        </Card>

      </div>
    </MainLayout>
  );
}
