"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { 
  Play, Sparkles, Sliders, X, ChevronLeft, ChevronRight, 
  RefreshCw, PlayCircle, PauseCircle, ShieldAlert, TrendingUp, 
  Sprout, Landmark, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Scenario {
  id: number;
  title: string;
  desc: string;
  icon: React.ElementType;
  route: string;
  alert: string;
  color: string;
}

const scenarios: Scenario[] = [
  {
    id: 1,
    title: "Healthy Farm Scenario",
    desc: "Weather is optimal, crops are thriving, prices are stable. Directs to Dashboard.",
    icon: Sprout,
    route: "/dashboard",
    alert: "Demo Scenario: Healthy Farm active. Review metrics, crop health (92%), and weather forecasts.",
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
  },
  {
    id: 2,
    title: "Disease Outbreak Scenario",
    desc: "Foliage disease detected on Sugarcane. Directs to Disease Diagnosis scanner.",
    icon: ShieldAlert,
    route: "/disease",
    alert: "Demo Scenario: Disease Outbreak active. Trigger foliage scanning for Sugarcane Rust diagnosis.",
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20"
  },
  {
    id: 3,
    title: "Flood Disaster Scenario",
    desc: "Emergency flood alert active. Directs to Relief Hub command center.",
    icon: Activity,
    route: "/relief",
    alert: "Demo Scenario: Flood Disaster active. Access relief aid packages, NGO seeds, and biofuel buyers.",
    color: "text-rose-500 bg-rose-500/10 border-rose-500/20"
  },
  {
    id: 4,
    title: "Market Opportunity Scenario",
    desc: "Mandi prices surge, AI recommends holding crops. Directs to B2B Marketplace.",
    icon: TrendingUp,
    route: "/marketplace",
    alert: "Demo Scenario: Market Price Surge active. Review arbitrage comparison and B2B negotiation counter-offers.",
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20"
  },
  {
    id: 5,
    title: "Government Benefits Scenario",
    desc: "Personalized subsidy matching wizard. Directs to Schemes Advisor.",
    icon: Landmark,
    route: "/schemes",
    alert: "Demo Scenario: Subsidy Matches active. Run the eligibility wizard to match ₹42,500/Yr payouts.",
    color: "text-teal-500 bg-teal-500/10 border-teal-500/20"
  }
];

const thinkingLogs = [
  "Understanding Request parameters...",
  "Analyzing regional weather models...",
  "Checking agricultural crop disease database...",
  "Comparing APMC Mandis market prices...",
  "Searching eligible Government Schemes...",
  "Generating B2B recommendations..."
];

export function DemoController() {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = React.useState(false);
  const [activeScenarioId, setActiveScenarioId] = React.useState<number>(1);
  const [isThinking, setIsThinking] = React.useState(false);
  const [thinkingProgress, setThinkingProgress] = React.useState(0);
  const [logIndex, setLogIndex] = React.useState(0);

  // Kiosk mode states
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(false);
  const [presentationMode, setPresentationMode] = React.useState(false);

  // Load state from localStorage on mount
  React.useEffect(() => {
    const savedScenario = localStorage.getItem("demo_scenario_id");
    const savedPresentation = localStorage.getItem("demo_presentation_mode");
    if (savedScenario) {
      setActiveScenarioId(Number(savedScenario));
    }
    if (savedPresentation) {
      setPresentationMode(savedPresentation === "true");
    }
  }, []);

  const handleSelectScenario = (scenario: Scenario) => {
    setActiveScenarioId(scenario.id);
    localStorage.setItem("demo_scenario_id", String(scenario.id));
    
    // Trigger AI thinking overlay
    setIsThinking(true);
    setThinkingProgress(0);
    setLogIndex(0);
  };

  // AI Thinking animation effect
  React.useEffect(() => {
    if (!isThinking) return;

    const duration = 3000; // 3 seconds
    const intervalTime = 60;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setThinkingProgress(prev => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsThinking(false);
            // Navigate to scenario route
            const sc = scenarios.find(s => s.id === activeScenarioId);
            if (sc) {
              router.push(sc.route);
            }
          }, 300);
          return 100;
        }

        const idx = Math.min(
          Math.floor((next / 100) * thinkingLogs.length),
          thinkingLogs.length - 1
        );
        setLogIndex(idx);

        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isThinking, activeScenarioId, router]);

  // Kiosk autoplay slide loops
  React.useEffect(() => {
    if (!isAutoPlaying) return;

    const cycleRoutes = [
      "/dashboard",
      "/weather",
      "/disease",
      "/relief",
      "/marketplace",
      "/schemes",
      "/offices",
      "/profile"
    ];

    const timer = setInterval(() => {
      const currentIdx = cycleRoutes.indexOf(pathname);
      const nextIdx = (currentIdx + 1) % cycleRoutes.length;
      
      // Update scenarios as we cycle relevant routes
      if (cycleRoutes[nextIdx] === "/disease") {
        setActiveScenarioId(2);
      } else if (cycleRoutes[nextIdx] === "/relief") {
        setActiveScenarioId(3);
      } else if (cycleRoutes[nextIdx] === "/marketplace") {
        setActiveScenarioId(4);
      } else if (cycleRoutes[nextIdx] === "/schemes") {
        setActiveScenarioId(5);
      } else if (cycleRoutes[nextIdx] === "/dashboard") {
        setActiveScenarioId(1);
      }
      
      router.push(cycleRoutes[nextIdx]);
    }, 7000); // cycle every 7 seconds

    return () => clearInterval(timer);
  }, [isAutoPlaying, pathname, router]);

  const handleTogglePresentationMode = () => {
    const nextVal = !presentationMode;
    setPresentationMode(nextVal);
    localStorage.setItem("demo_presentation_mode", String(nextVal));
    
    // Dynamically toggle body class for global styling changes (fullscreen mode spacing)
    if (nextVal) {
      document.body.classList.add("demo-presentation-mode");
    } else {
      document.body.classList.remove("demo-presentation-mode");
    }
  };

  const handleNextScenario = () => {
    const nextId = (activeScenarioId % scenarios.length) + 1;
    const sc = scenarios.find(s => s.id === nextId);
    if (sc) handleSelectScenario(sc);
  };

  const handlePrevScenario = () => {
    const prevId = activeScenarioId === 1 ? scenarios.length : activeScenarioId - 1;
    const sc = scenarios.find(s => s.id === prevId);
    if (sc) handleSelectScenario(sc);
  };

  const handleResetDemo = () => {
    setIsAutoPlaying(false);
    setPresentationMode(false);
    setActiveScenarioId(1);
    localStorage.removeItem("demo_scenario_id");
    localStorage.removeItem("demo_presentation_mode");
    document.body.classList.remove("demo-presentation-mode");
    router.push("/dashboard");
    alert("Demo preferences and scenario loops reset to Healthy Farm baseline.");
  };

  const activeScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];

  return (
    <>
      {/* Floating Demo Trigger Button (Bottom-Right corner above mobile nav) */}
      <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg cursor-pointer border border-white/20 relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping opacity-60" />
          {isOpen ? <X className="h-5 w-5" /> : <Play className="h-5 w-5 fill-white" />}
        </motion.button>
      </div>

      {/* Global Scenario Alert Header (Only shown when drawer is closed to indicate active demo mode status) */}
      {!isOpen && !presentationMode && (
        <div className="fixed top-16 left-0 right-0 z-40 px-4 pointer-events-none md:left-64">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-2xl mx-auto p-2.5 rounded-btn border text-[10.5px] font-bold text-center shadow-sm flex items-center justify-center gap-2 ${activeScenario.color}`}
          >
            <Sparkles className="h-4 w-4 shrink-0 animate-pulse" />
            <span>{activeScenario.alert}</span>
          </motion.div>
        </div>
      )}

      {/* SLIDE-UP DEMO DRAWER PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-2xl p-6 md:left-64 max-h-[85vh] overflow-y-auto"
          >
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Header */}
              <div className="flex justify-between items-start pb-3 border-b border-border/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sliders className="h-5 w-5 text-primary" />
                    <h3 className="text-base font-extrabold text-foreground">Kisan AI Hackathon Demo Control Center</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Switch between pre-loaded agricultural scenarios to demonstrate B2B direct match capabilities.
                  </p>
                </div>
                <Button 
                  onClick={() => setIsOpen(false)}
                  variant="outline" 
                  className="h-8 w-8 rounded-full p-0 bg-card border border-border text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  ✕
                </Button>
              </div>

              {/* Scenarios Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {scenarios.map((sc) => {
                  const isActive = sc.id === activeScenarioId;
                  const Icon = sc.icon;
                  return (
                    <div
                      key={sc.id}
                      onClick={() => handleSelectScenario(sc)}
                      className={`p-4 rounded-card border text-left cursor-pointer transition-all flex flex-col justify-between h-40 ${
                        isActive 
                          ? "border-primary bg-primary/5 ring-1 ring-primary" 
                          : "border-border bg-card hover:bg-muted/10 text-muted-foreground"
                      }`}
                    >
                      <div className="space-y-2 text-xs leading-normal">
                        <div className="flex justify-between items-center">
                          <Icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground/60"}`} />
                          <Badge variant={isActive ? "success" : "outline"} className="text-[7.5px] px-1.5 font-bold">
                            Scenario {sc.id}
                          </Badge>
                        </div>
                        <h4 className="font-extrabold text-foreground tracking-tight text-[11px] pt-1">{sc.title}</h4>
                        <p className="text-[10px] text-muted-foreground/80 line-clamp-3">
                          {sc.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Controls bar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/40 items-center justify-between text-xs">
                
                {/* Left: Presentation settings switches */}
                <div className="flex flex-wrap items-center gap-6">
                  {/* Presentation mode */}
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="pres-mode"
                      checked={presentationMode}
                      onChange={handleTogglePresentationMode}
                      className="h-4 w-8 rounded-full appearance-none bg-muted checked:bg-primary transition-all cursor-pointer relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-3 after:w-3 after:rounded-full after:bg-card after:transition-all checked:after:translate-x-3.5"
                    />
                    <label htmlFor="pres-mode" className="font-bold text-foreground cursor-pointer select-none">
                      Presentation Mode (Hide debug bars)
                    </label>
                  </div>

                  {/* Auto play */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                      className={`h-7 px-3 rounded-btn text-[10px] font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                        isAutoPlaying 
                          ? "bg-primary text-white border-primary" 
                          : "bg-card text-muted-foreground hover:bg-muted/10 border-border"
                      }`}
                    >
                      {isAutoPlaying ? <PauseCircle className="h-3.5 w-3.5" /> : <PlayCircle className="h-3.5 w-3.5" />}
                      {isAutoPlaying ? "Stop Auto Play" : "Kiosk Auto Play Loop"}
                    </button>
                  </div>
                </div>

                {/* Right: navigation buttons */}
                <div className="flex items-center justify-end gap-2.5">
                  <Button 
                    onClick={handlePrevScenario}
                    variant="outline" 
                    className="text-[10.5px] font-bold h-8 px-3 rounded-btn cursor-pointer bg-card"
                  >
                    <ChevronLeft className="mr-1 h-3.5 w-3.5 shrink-0" />
                    Prev Scenario
                  </Button>
                  <Button 
                    onClick={handleNextScenario}
                    variant="outline" 
                    className="text-[10.5px] font-bold h-8 px-3 rounded-btn cursor-pointer bg-card"
                  >
                    Next Scenario
                    <ChevronRight className="ml-1 h-3.5 w-3.5 shrink-0" />
                  </Button>
                  <Button 
                    onClick={handleResetDemo}
                    variant="outline"
                    className="text-[10.5px] font-bold h-8 px-3 rounded-btn cursor-pointer bg-card border border-rose-500/20 text-rose-500 hover:bg-rose-500/5"
                  >
                    <RefreshCw className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                    Reset
                  </Button>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN AI THINKING OVERLAY */}
      <AnimatePresence>
        {isThinking && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-background/90 backdrop-blur-md animate-fade-in">
            <div className="max-w-md w-full text-center space-y-8">
              
              {/* Concentric pulsing AI Orb */}
              <div className="relative h-28 w-28 flex items-center justify-center mx-auto">
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-emerald-400 to-accent opacity-20 blur-md"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />
                <div className="relative h-20 w-20 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-2xl border border-white/20">
                  <Sparkles className="h-9 w-9 text-white animate-pulse" />
                </div>
              </div>

              {/* Progress logs check list */}
              <div className="space-y-4">
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-75"
                    style={{ width: `${thinkingProgress}%` }}
                  />
                </div>
                
                <div className="space-y-2 min-h-[50px] flex items-center justify-center">
                  <p className="text-sm font-extrabold text-foreground leading-normal animate-pulse">
                    {thinkingLogs[logIndex]}
                  </p>
                </div>

                <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">
                  AI match simulation: {Math.round(thinkingProgress)}%
                </span>
              </div>

            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
