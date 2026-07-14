"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  MapPin, Compass, Sprout, TrendingUp, Droplet, Sun, 
  Activity, FileText, Brain, Loader2, ChevronRight, 
  ChevronLeft, Save, Share2, HelpingHand, Store
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { apiClient } from "@/services/apiClient";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CropCard } from "@/components/crop/CropCard";

type StepType = "location" | "details" | "season" | "analysis" | "result";

const analysisLogs = [
  "Contacting local weather models for rain probability forecasts...",
  "Determining clayey soil moisture coefficients and pH buffers...",
  "Estimating crop ground-water replenishment rates...",
  "Retrieving commodity spot prices from Pune and Nagpur Mandis...",
  "Querying national agricultural seed seed-subsidy schemes...",
  "Applying crop rotation suitability matrix on previous sugarcane fields...",
  "Synthesizing optimal sowing and ROI recommendations..."
];

interface LocationState {
  method: "gps" | "manual";
  district: string;
  village: string;
  lat: number | null;
  lng: number | null;
  detectedName: string | null;
}

interface DetailsState {
  farmSize: number;
  landType: "rainfed" | "irrigated" | "sloped";
  soilType: "clayey" | "sandy" | "loamy" | "acidic";
  waterSource: "borewell" | "canal" | "rainfall" | "pond";
  previousCrop: string;
  budget: number;
  preferredCategory: "cash" | "grains" | "pulses" | "oilseeds" | "vegetables";
}

export default function CropRecommendationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState<StepType>("location");
  
  // Location States
  const [location, setLocation] = React.useState<LocationState>({
    method: "gps",
    district: "Pune",
    village: "",
    lat: null,
    lng: null,
    detectedName: null
  });
  const [isDetectingGps, setIsDetectingGps] = React.useState(false);

  // Details States
  const [details, setDetails] = React.useState<DetailsState>({
    farmSize: 5.5,
    landType: "irrigated",
    soilType: "clayey",
    waterSource: "borewell",
    previousCrop: "Sugarcane",
    budget: 15000,
    preferredCategory: "oilseeds"
  });

  // Season State
  const [selectedSeason, setSelectedSeason] = React.useState<"kharif" | "rabi" | "zaid">("kharif");

  // Analysis Animation States
  const [analysisProgress, setAnalysisProgress] = React.useState(0);
  const [activeLogIndex, setActiveLogIndex] = React.useState(0);
  const [recommendations, setRecommendations] = React.useState<any[]>([]);

  // Geolocation mock
  const handleAutoDetectGps = () => {
    setIsDetectingGps(true);
    setTimeout(() => {
      setIsDetectingGps(false);
      setLocation({
        method: "gps",
        district: "Pune",
        village: "Shirur Village",
        lat: 18.5204,
        lng: 73.8567,
        detectedName: "Pune Farm Plot A (Shirur, MH)"
      });
    }, 1500);
  };

  // Run AI Analysis simulation
  const startAIAnalysis = async () => {
    setCurrentStep("analysis");
    setAnalysisProgress(0);
    setActiveLogIndex(0);
    try {
      const res = await apiClient.post<any>("/crops/recommend", {
        soilType: details.soilType,
        waterSource: details.waterSource,
        previousCrop: details.previousCrop,
        preferredCategory: details.preferredCategory
      });
      if (res && res.success && res.crop_recommendations) {
        setRecommendations(res.crop_recommendations);
      }
    } catch (err) {
      console.error("AI Analysis recommendation failed", err);
    }
  };

  React.useEffect(() => {
    if (currentStep !== "analysis") return;

    const duration = 4000; // 4 seconds total
    const intervalTime = 80;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setAnalysisProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => setCurrentStep("result"), 500);
          return 100;
        }

        // Map progress percentage to active log item index
        const logIndex = Math.min(
          Math.floor((next / 100) * analysisLogs.length),
          analysisLogs.length - 1
        );
        setActiveLogIndex(logIndex);

        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentStep]);

  // Stepper Header helper
  const getStepProgressWidth = () => {
    switch (currentStep) {
      case "location": return "20%";
      case "details": return "45%";
      case "season": return "70%";
      case "analysis": return "90%";
      case "result": return "100%";
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 pb-16 animate-fade-in">
        
        {/* Page Header and Progress indicator */}
        <div className="flex flex-col gap-4">
          <SectionHeader 
            title="AI Crop Recommendation Advisor" 
            description="Our agricultural multi-agent recommendation engine analyzes weather patterns, soil profiles, and local markets."
            className="mb-0"
          />

          {currentStep !== "analysis" && currentStep !== "result" && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <span>Step {currentStep === "location" ? 1 : currentStep === "details" ? 2 : 3} of 3</span>
                <span>
                  {currentStep === "location" ? "Farm Location" : currentStep === "details" ? "Farm Parameters" : "Season Preference"}
                </span>
              </div>
              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary rounded-full"
                  animate={{ width: getStepProgressWidth() }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          
          {/* STEP 1: FARM LOCATION */}
          {currentStep === "location" && (
            <motion.div
              key="step-location"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start"
            >
              <div className="lg:col-span-3 space-y-6">
                <Card title="" animate={false} className="p-6 space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground">Select Farm Location</h3>
                    <p className="text-xs text-muted-foreground">Specify the geographical center of your fields for weather and satellite integration.</p>
                  </div>

                  {/* Method Toggle Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      onClick={() => setLocation({ ...location, method: "gps" })}
                      className={`p-4 rounded-btn border text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${
                        location.method === "gps" 
                          ? "border-primary bg-primary/5 text-primary" 
                          : "border-border bg-card/50 hover:bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      <Compass className="h-5 w-5" />
                      <span className="text-xs font-bold">Auto GPS Locate</span>
                    </div>

                    <div 
                      onClick={() => setLocation({ ...location, method: "manual" })}
                      className={`p-4 rounded-btn border text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${
                        location.method === "manual" 
                          ? "border-primary bg-primary/5 text-primary" 
                          : "border-border bg-card/50 hover:bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      <MapPin className="h-5 w-5" />
                      <span className="text-xs font-bold">Manual Selection</span>
                    </div>
                  </div>

                  {/* GPS View */}
                  {location.method === "gps" ? (
                    <div className="space-y-4 pt-2">
                      <Button 
                        onClick={handleAutoDetectGps}
                        disabled={isDetectingGps}
                        className="w-full justify-center h-11 text-xs font-bold rounded-btn cursor-pointer bg-primary"
                      >
                        {isDetectingGps ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Locking Coordinates...
                          </>
                        ) : (
                          <>
                            <Compass className="mr-2 h-4 w-4" />
                            Auto-Detect Current Fields
                          </>
                        )}
                      </Button>

                      {location.lat !== null && location.lng !== null && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-4 rounded-btn bg-muted/40 border border-border/80 space-y-2 text-xs"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-foreground">Detected Plot:</span>
                            <Badge variant="success" className="font-bold px-2 py-0.5 text-[10px]">GPS Lock</Badge>
                          </div>
                          <p className="text-muted-foreground">{location.detectedName}</p>
                          <div className="grid grid-cols-2 gap-2 text-muted-foreground pt-1 border-t border-border/30">
                            <span>Lat: <strong className="text-foreground">{location.lat.toFixed(4)}° N</strong></span>
                            <span>Lng: <strong className="text-foreground">{location.lng.toFixed(4)}° E</strong></span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    // Manual View
                    <div className="space-y-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground">District / Region</label>
                        <select 
                          value={location.district}
                          onChange={(e) => setLocation({ ...location, district: e.target.value })}
                          className="w-full bg-card border border-border rounded-btn px-3.5 h-11 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                        >
                           <option value="Pune">Pune (Western Maharashtra)</option>
                           <option value="Guntur">Guntur (Andhra Pradesh)</option>
                           <option value="Nellore">Nellore (Andhra Pradesh)</option>
                           <option value="Warangal">Warangal (Telangana)</option>
                           <option value="Mysuru">Mysuru (Karnataka)</option>
                           <option value="Coimbatore">Coimbatore (Tamil Nadu)</option>
                           <option value="Nagpur">Nagpur (Vidarbha Region)</option>
                           <option value="Nashik">Nashik (North Maharashtra)</option>
                           <option value="Jalgaon">Jalgaon (Khandesh Region)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground">Village / Taluka Name</label>
                        <input 
                          type="text"
                          placeholder="e.g. Shirur, Baramati, Junnar"
                          value={location.village}
                          onChange={(e) => setLocation({ ...location, village: e.target.value })}
                          className="w-full bg-card border border-border rounded-btn px-4 h-11 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-muted-foreground/60"
                        />
                      </div>
                    </div>
                  )}
                </Card>

                {/* Continue button */}
                <div className="flex justify-end">
                  <Button 
                    onClick={() => setCurrentStep("details")}
                    disabled={location.method === "gps" ? !location.lat : !location.village.trim()}
                    className="text-xs font-bold px-6 h-10 rounded-btn cursor-pointer bg-primary"
                  >
                    Next: Farm Details
                    <ChevronRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Map Preview Column */}
              <div className="lg:col-span-2 space-y-4">
                <Card title="" animate={false} className="p-4 bg-muted/20 border border-border/80 h-full flex flex-col justify-between">
                  <div className="space-y-1.5 pb-2">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">Satellite Feed Mock</span>
                    <h4 className="text-xs font-bold text-foreground">Terrain Map Coordinates</h4>
                  </div>
                  
                  {/* Stylized Google Earth Satellite View mock */}
                  <div className="relative w-full aspect-square rounded-btn bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center">
                    {/* SVG map background layout */}
                    <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Grid overlays */}
                      <path d="M 0 20 L 100 20 M 0 40 L 100 40 M 0 60 L 100 60 M 0 80 L 100 80 M 20 0 L 20 100 M 40 0 L 40 100 M 60 0 L 60 100 M 80 0 L 80 100" stroke="#1E293B" strokeWidth="0.5" />
                      {/* Stylized farm patches */}
                      <rect x="15" y="15" width="20" height="25" fill="#15803d" opacity="0.35" rx="2" />
                      <rect x="40" y="25" width="30" height="30" fill="#166534" opacity="0.4" rx="2" />
                      <rect x="25" y="60" width="45" height="25" fill="#3f6212" opacity="0.3" rx="2" />
                      {/* Water canal line */}
                      <path d="M 0 90 Q 30 75 70 85 T 100 70" stroke="#0284c7" strokeWidth="1.5" opacity="0.5" fill="none" />
                    </svg>

                    {/* Geolocation Lock Target rings */}
                    {location.lat ? (
                      <div className="relative z-10 flex flex-col items-center justify-center">
                        {/* Radar animated ring */}
                        <motion.div 
                          className="absolute h-14 w-14 rounded-full border border-primary/60 bg-primary/5 pointer-events-none"
                          animate={{ scale: [0.8, 1.6, 0.8], opacity: [0.8, 0.1, 0.8] }}
                          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                        />
                        <div className="h-4 w-4 bg-primary rounded-full border-2 border-white flex items-center justify-center shadow-lg relative z-20">
                          <div className="h-1.5 w-1.5 bg-white rounded-full animate-ping" />
                        </div>
                        <span className="mt-2 text-[9px] font-bold text-white bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-800 shadow-md">
                          Plot A Lock
                        </span>
                      </div>
                    ) : (
                      <div className="text-center p-6 space-y-2 relative z-10">
                        <Compass className="h-7 w-7 text-muted-foreground/60 mx-auto animate-pulse" />
                        <span className="text-[10px] font-bold text-muted-foreground/80 block uppercase tracking-wide">
                          Awaiting Position...
                        </span>
                      </div>
                    )}

                    {/* Satellite compass coordinates overlay */}
                    <div className="absolute bottom-3 left-3 text-[9px] font-mono text-muted-foreground/80 space-y-0.5 bg-slate-950/60 p-2 rounded border border-slate-800/80">
                      <div>AZIMUTH: 184° S</div>
                      <div>ELEVATION: 62.4m</div>
                      <div>SAT: GPS-W31</div>
                    </div>
                  </div>

                  <div className="text-[10px] text-muted-foreground leading-relaxed pt-2.5">
                    * Ground indexes and rain histories are localized to a 3km radius from the lock.
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* STEP 2: FARM DETAILS */}
          {currentStep === "details" && (
            <motion.div
              key="step-details"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <Card title="" animate={false} className="p-6 space-y-6">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground">Configure Farm Parameters</h3>
                  <p className="text-xs text-muted-foreground">Select matching descriptors. These parameters dictate mineral balancing, moisture thresholds, and budgets.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Slider: Farm Size */}
                  <div className="space-y-3 bg-muted/10 p-4 rounded-btn border border-border/30">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-foreground">Farm Size (Acres)</span>
                      <Badge variant="outline" className="font-bold text-primary border-primary bg-primary/5 text-xs py-0.5 px-2">
                        {details.farmSize} Acres
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDetails({ ...details, farmSize: Math.max(0.5, details.farmSize - 0.5) })}
                        className="h-8 w-8 p-0 rounded-full font-bold text-sm cursor-pointer"
                      >
                        -
                      </Button>
                      <input 
                        type="range"
                        min="0.5"
                        max="50"
                        step="0.5"
                        value={details.farmSize}
                        onChange={(e) => setDetails({ ...details, farmSize: parseFloat(e.target.value) })}
                        className="flex-1 accent-primary h-1 bg-border rounded-full appearance-none cursor-pointer"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDetails({ ...details, farmSize: Math.min(50, details.farmSize + 0.5) })}
                        className="h-8 w-8 p-0 rounded-full font-bold text-sm cursor-pointer"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Previous Crop selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground block">Previous Crop Sown</label>
                    <div className="flex flex-wrap gap-2">
                      {["Sugarcane", "Cotton", "Soybean", "Rice", "Wheat", "Fallow"].map((crop) => (
                        <div
                          key={crop}
                          onClick={() => setDetails({ ...details, previousCrop: crop })}
                          className={`px-3 py-1.5 rounded-btn border text-xs font-bold cursor-pointer transition-all ${
                            details.previousCrop === crop
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border bg-card hover:bg-muted/50 text-muted-foreground"
                          }`}
                        >
                          {crop}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  
                  {/* Select: Land Type */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-foreground block">Land Typology</span>
                    <div className="grid grid-cols-1 gap-2">
                      {([
                        { id: "irrigated", label: "Irrigated / Wet", desc: "Canal or pump access" },
                        { id: "rainfed", label: "Dryland / Rainfed", desc: "No watering setups" },
                        { id: "sloped", label: "Hilly / Sloped", desc: "Terraced cultivation" }
                      ] as const).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setDetails({ ...details, landType: item.id })}
                          className={`p-3 rounded-btn border text-left cursor-pointer transition-all ${
                            details.landType === item.id
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border bg-card hover:bg-muted/30 text-muted-foreground"
                          }`}
                        >
                          <div className="font-bold text-xs">{item.label}</div>
                          <div className="text-[10px] text-muted-foreground/80 mt-0.5">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Select: Soil Type */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-foreground block">Soil Texture</span>
                    <div className="grid grid-cols-1 gap-2">
                      {([
                        { id: "clayey", label: "Black Clayey", desc: "Retains water, rich" },
                        { id: "sandy", label: "Red Sandy", desc: "Dry, fast drainage" },
                        { id: "loamy", label: "Loamy / Alluvial", desc: "Fertile, balanced pH" },
                        { id: "acidic", label: "Laterite / Acidic", desc: "Iron rich, specialized" }
                      ] as const).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setDetails({ ...details, soilType: item.id })}
                          className={`p-3 rounded-btn border text-left cursor-pointer transition-all ${
                            details.soilType === item.id
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border bg-card hover:bg-muted/30 text-muted-foreground"
                          }`}
                        >
                          <div className="font-bold text-xs">{item.label}</div>
                          <div className="text-[10px] text-muted-foreground/80 mt-0.5">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Select: Water Source */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-foreground block">Water Availability</span>
                    <div className="grid grid-cols-1 gap-2">
                      {([
                        { id: "borewell", label: "Borewell / Tube", desc: "Submersible pump" },
                        { id: "canal", label: "Canal / River", desc: "Gravity water flows" },
                        { id: "pond", label: "Pond / Tank", desc: "Harvested rainwater" },
                        { id: "rainfall", label: "Rain Only", desc: "Monsoon dependent" }
                      ] as const).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setDetails({ ...details, waterSource: item.id })}
                          className={`p-3 rounded-btn border text-left cursor-pointer transition-all ${
                            details.waterSource === item.id
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border bg-card hover:bg-muted/30 text-muted-foreground"
                          }`}
                        >
                          <div className="font-bold text-xs">{item.label}</div>
                          <div className="text-[10px] text-muted-foreground/80 mt-0.5">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-border/40">
                  
                  {/* Select: Budget */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground block">Estimated Sowing Budget (per Acre)</label>
                    <div className="flex flex-wrap gap-2">
                      {[5000, 10000, 15000, 25000].map((val) => (
                        <div
                          key={val}
                          onClick={() => setDetails({ ...details, budget: val })}
                          className={`px-4 py-2.5 rounded-btn border text-xs font-bold cursor-pointer transition-all ${
                            details.budget === val
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border bg-card hover:bg-muted/50 text-muted-foreground"
                          }`}
                        >
                          ₹{val.toLocaleString()} / Acre
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Select: Category */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground block">Preferred Crop Target</label>
                    <div className="flex flex-wrap gap-2">
                      {([
                        { id: "cash", label: "Cash Crops" },
                        { id: "grains", label: "Grains & Cereals" },
                        { id: "pulses", label: "Pulses / Beans" },
                        { id: "oilseeds", label: "Oilseeds" },
                        { id: "vegetables", label: "Vegetables" }
                      ] as const).map((cat) => (
                        <div
                          key={cat.id}
                          onClick={() => setDetails({ ...details, preferredCategory: cat.id })}
                          className={`px-3.5 py-2.5 rounded-btn border text-xs font-bold cursor-pointer transition-all ${
                            details.preferredCategory === cat.id
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border bg-card hover:bg-muted/50 text-muted-foreground"
                          }`}
                        >
                          {cat.label}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </Card>

              {/* Navigation controls */}
              <div className="flex justify-between items-center">
                <Button 
                  onClick={() => setCurrentStep("location")}
                  variant="outline"
                  className="text-xs font-bold px-5 h-10 rounded-btn cursor-pointer bg-card"
                >
                  <ChevronLeft className="mr-1.5 h-4 w-4" />
                  Back
                </Button>
                <Button 
                  onClick={() => setCurrentStep("season")}
                  className="text-xs font-bold px-6 h-10 rounded-btn cursor-pointer bg-primary"
                >
                  Next: Season
                  <ChevronRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SEASON SELECTION */}
          {currentStep === "season" && (
            <motion.div
              key="step-season"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <Card title="" animate={false} className="p-6 space-y-6">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground">Choose Growing Season</h3>
                  <p className="text-xs text-muted-foreground">Select the target crop cycle. Local rainfall models and temperature patterns align with these selections.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Season Card 1: Kharif */}
                  <div
                    onClick={() => setSelectedSeason("kharif")}
                    className={`relative p-5 rounded-card border cursor-pointer transition-all flex flex-col justify-between h-56 ${
                      selectedSeason === "kharif"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-card hover:bg-muted/10"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-btn bg-blue-500/10 text-blue-500">
                          <Droplet className="h-5 w-5 fill-blue-500/10" />
                        </div>
                        {selectedSeason === "kharif" && (
                          <Badge variant="success" className="font-bold px-2 py-0.5 text-[10px]">Selected</Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-extrabold text-foreground">Kharif Cycle</h4>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Monsoon (June - October)</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Sown during southwest monsoons. High moisture availability. Perfect for water-absorbing or rainfed grains and pulses.
                      </p>
                    </div>
                  </div>

                  {/* Season Card 2: Rabi */}
                  <div
                    onClick={() => setSelectedSeason("rabi")}
                    className={`relative p-5 rounded-card border cursor-pointer transition-all flex flex-col justify-between h-56 ${
                      selectedSeason === "rabi"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-card hover:bg-muted/10"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-btn bg-emerald-500/10 text-emerald-500">
                          <Sprout className="h-5 w-5" />
                        </div>
                        {selectedSeason === "rabi" && (
                          <Badge variant="success" className="font-bold px-2 py-0.5 text-[10px]">Selected</Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-extrabold text-foreground">Rabi Cycle</h4>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Winter (November - April)</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Sown in winter and harvested in spring. Moderate watering requirements, relies heavily on ground residual moisture.
                      </p>
                    </div>
                  </div>

                  {/* Season Card 3: Zaid */}
                  <div
                    onClick={() => setSelectedSeason("zaid")}
                    className={`relative p-5 rounded-card border cursor-pointer transition-all flex flex-col justify-between h-56 ${
                      selectedSeason === "zaid"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-card hover:bg-muted/10"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-btn bg-amber-500/10 text-amber-500">
                          <Sun className="h-5 w-5" />
                        </div>
                        {selectedSeason === "zaid" && (
                          <Badge variant="success" className="font-bold px-2 py-0.5 text-[10px]">Selected</Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-extrabold text-foreground">Zaid Cycle</h4>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Summer (March - June)</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Short crop cycle between spring and monsoon. Heat-resilient crops requiring localized drip irrigation.
                      </p>
                    </div>
                  </div>

                </div>
              </Card>

              {/* Navigation controls */}
              <div className="flex justify-between items-center">
                <Button 
                  onClick={() => setCurrentStep("details")}
                  variant="outline"
                  className="text-xs font-bold px-5 h-10 rounded-btn cursor-pointer bg-card"
                >
                  <ChevronLeft className="mr-1.5 h-4 w-4" />
                  Back
                </Button>
                <Button 
                  onClick={startAIAnalysis}
                  className="text-xs font-bold px-6 h-10 rounded-btn cursor-pointer bg-primary"
                >
                  Start AI Crop Matching
                  <Brain className="ml-1.5 h-4 w-4 text-white" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: AI ANALYSIS */}
          {currentStep === "analysis" && (
            <motion.div
              key="step-analysis"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto space-y-8 flex flex-col items-center justify-center text-center py-8"
            >
              {/* Pulsing gradient avatar logo mockup representing Gemini AI */}
              <div className="relative h-28 w-28 flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-emerald-400 to-accent opacity-20 blur-md"
                  animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.45, 0.2] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                />
                <div className="relative h-20 w-20 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg border border-white/20">
                  <Brain className="h-9 w-9 text-white animate-pulse" />
                </div>
              </div>

              {/* Dynamic logging lists with progress bar */}
              <div className="w-full space-y-4">
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-75"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-foreground leading-normal min-h-[40px] px-4">
                    {analysisLogs[activeLogIndex]}
                  </p>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">
                    AI AGENT EVALUATION: {Math.round(analysisProgress)}%
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: RECOMMENDATION RESULT */}
          {currentStep === "result" && (
            <motion.div
              key="step-result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Primary dashboard grid layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Column 1: Main Recommendation Hero and Explanation */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Hero card */}
                  <Card title="" animate={false} className="p-6 bg-gradient-to-br from-emerald-500/10 via-card to-card border-emerald-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3">
                      <Badge variant="success" className="font-bold text-xs py-1 px-3 bg-emerald-500 text-white shadow-sm">
                        {recommendations[0]?.suitability_score || 96}% MATCH
                      </Badge>
                    </div>

                    <div className="space-y-4 relative z-10">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">Top Suggested Crop</span>
                        <h3 className="text-2xl font-extrabold text-foreground flex items-center gap-1.5">
                          {recommendations[0]?.name || "Groundnut (TAG-24)"}
                        </h3>
                      </div>

                      {/* Main Yield and Profit Metrics */}
                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-muted-foreground block uppercase font-bold">Est. Profit</span>
                          <span className="text-2xl font-extrabold text-emerald-600">₹52,000<span className="text-xs font-semibold text-muted-foreground">/Ac</span></span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-muted-foreground block uppercase font-bold">Expected Yield</span>
                          <span className="text-2xl font-extrabold text-foreground">{recommendations[0]?.estimated_yield || "2.0 Tons"}<span className="text-xs font-semibold text-muted-foreground">/Ac</span></span>
                        </div>
                      </div>

                      {/* Sowing particulars */}
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Best Sowing Period:</span>
                          <span className="font-bold text-foreground">June 28 - July 12</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Water Requirement:</span>
                          <span className="font-bold text-foreground flex items-center gap-1">
                            <Droplet className="h-3 w-3 text-primary" /> {recommendations[0]?.water_requirement || "Medium"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Infection / Disease Risk:</span>
                          <span className="font-bold text-emerald-600">Low (Drought Resilient)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Estimated Investment:</span>
                          <span className="font-bold text-foreground">₹18,000 / Acre</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Expected ROI Ratio:</span>
                          <span className="font-bold text-primary">2.9x Return</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* AI Explanation Card */}
                  <Card title="" animate={false} className="p-5 border-l-4 border-l-primary bg-card shadow-sm border-t-0 border-r-0 border-b-0">
                    <div className="space-y-3 text-xs leading-relaxed">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Brain className="h-4.5 w-4.5 text-primary shrink-0" />
                        AI Advisor Reasoning
                      </span>
                      <p className="text-muted-foreground">
                        {recommendations[0]?.reasoning || "We recommend Groundnut (TAG-24) because your soil type (Black Clayey) features excellent moisture-holding traits, which will help bypass the dry spell warning starting June 28. Since your previous crop was sugarcane, planting groundnuts will naturally fix nitrogen reserves back into your field."}
                      </p>
                    </div>
                  </Card>
                </div>

                {/* Column 2: Alternative Options & Smart Insights */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Smart Insights Grid */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-1">
                      <Activity className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-bold text-foreground">Smart Insights & Warnings</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Insight 1: Weather */}
                      <div className="p-4 rounded-btn border border-border bg-card flex gap-3 text-xs">
                        <Sun className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <span className="font-bold text-foreground block">Weather Impact (El Niño warning)</span>
                          <p className="text-muted-foreground leading-normal">
                            Monsoon showers are modeled to be 8% below normal. Groundnut&apos;s deep taproots mitigate dry soil stresses.
                          </p>
                        </div>
                      </div>

                      {/* Insight 2: Market */}
                      <div className="p-4 rounded-btn border border-border bg-card flex gap-3 text-xs">
                        <TrendingUp className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <span className="font-bold text-foreground block">Market Price Opportunity</span>
                          <p className="text-muted-foreground leading-normal">
                            Mandi demand for Groundnut seeds is up 12% in Pune region due to local edible oil processing shortages.
                          </p>
                        </div>
                      </div>

                      {/* Insight 3: Subsidies */}
                      <div className="p-4 rounded-btn border border-border bg-card flex gap-3 text-xs">
                        <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <span className="font-bold text-foreground block">Available Government Schemes</span>
                          <p className="text-muted-foreground leading-normal">
                            Mahasubsidy offers a 50% discount on certified seed packets and borewell micro-sprinkler installations.
                          </p>
                        </div>
                      </div>

                      {/* Insight 4: Soil Health */}
                      <div className="p-4 rounded-btn border border-border bg-card flex gap-3 text-xs">
                        <Activity className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <span className="font-bold text-foreground block">Soil Revitalization</span>
                          <p className="text-muted-foreground leading-normal">
                            Groundnut legumes fix up to 40kg of atmospheric nitrogen per acre, restoring fields after sugarcane farming.
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Alternative Crops (using the CropCard reusable component) */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-1">
                      <Sprout className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-bold text-foreground">Alternative Crop Selections</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {recommendations.length > 1 ? (
                        recommendations.slice(1, 4).map((crop, idx) => (
                          <CropCard 
                            key={idx}
                            cropName={crop.name}
                            category={crop.category || "Crops"}
                            matchPercentage={crop.suitability_score || 85}
                            soilType={crop.soil_type || "Loamy"}
                            waterRequirement={crop.water_requirement || "Medium"}
                            season={crop.season || "Kharif"}
                            onSelect={() => alert(`Loading ${crop.name} growth guidelines...`)}
                          />
                        ))
                      ) : (
                        <>
                          <CropCard 
                            cropName="Soybean (JS-335)"
                            category="Oilseeds"
                            matchPercentage={88}
                            soilType="Black Clayey"
                            waterRequirement="Medium"
                            season="Kharif"
                            onSelect={() => alert("Loading Soybean growth guidelines...")}
                          />
                          <CropCard 
                            cropName="Pearl Millet (Bajra)"
                            category="Grains"
                            matchPercentage={80}
                            soilType="Sandy / Loamy"
                            waterRequirement="Low"
                            season="Kharif"
                            onSelect={() => alert("Loading Pearl Millet growth guidelines...")}
                          />
                          <CropCard 
                            cropName="Sunflower (KBSH)"
                            category="Oilseeds"
                            matchPercentage={74}
                            soilType="Loamy"
                            waterRequirement="Medium"
                            season="Kharif"
                            onSelect={() => alert("Loading Sunflower growth guidelines...")}
                          />
                        </>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              {/* Actions panel */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 bg-muted/40 p-5 rounded-card border border-border/50 justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <HelpingHand className="h-4.5 w-4.5 text-primary" />
                  Smart Next Steps:
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={() => window.location.href = "/assistant"}
                    variant="outline"
                    className="text-xs font-bold h-9 rounded-btn cursor-pointer bg-card"
                  >
                    <Brain className="mr-1.5 h-4 w-4 text-primary" />
                    Ask Assistant
                  </Button>
                  <Button
                    onClick={() => alert("Recommendation saved to local profiles.")}
                    variant="outline"
                    className="text-xs font-bold h-9 rounded-btn cursor-pointer bg-card"
                  >
                    <Save className="mr-1.5 h-4 w-4 text-primary" />
                    Save Report
                  </Button>
                  <Button
                    onClick={() => alert("Report shared with village agricultural officer.")}
                    variant="outline"
                    className="text-xs font-bold h-9 rounded-btn cursor-pointer bg-card"
                  >
                    <Share2 className="mr-1.5 h-4 w-4 text-primary" />
                    Share Report
                  </Button>
                  <Button
                    onClick={() => router.push("/market")}
                    variant="outline"
                    className="text-xs font-bold h-9 rounded-btn cursor-pointer bg-card"
                  >
                    <TrendingUp className="mr-1.5 h-4 w-4 text-primary" />
                    View Market Prices
                  </Button>
                  <Button
                    onClick={() => router.push("/marketplace")}
                    className="text-xs font-bold h-9 rounded-btn cursor-pointer bg-primary"
                  >
                    <Store className="mr-1.5 h-4 w-4 text-white" />
                    Find Crop Buyers
                  </Button>
                </div>
              </div>

              {/* Reset Advisor Link */}
              <div className="flex justify-center pt-2">
                <Button 
                  onClick={() => {
                    setCurrentStep("location");
                    setLocation({ ...location, lat: null, lng: null, detectedName: null, village: "" });
                  }}
                  variant="ghost" 
                  className="text-xs font-bold text-muted-foreground hover:text-primary cursor-pointer"
                >
                  Clear and Start Sowing Advisor Again
                </Button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </MainLayout>
  );
}
