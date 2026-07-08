"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, TrendingDown, MapPin, Brain, 
  Activity, Sparkles, Save, Share2, 
  Search, ShieldAlert, DollarSign, Store, HelpingHand
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { apiClient } from "@/services/apiClient";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type CropType = "groundnut" | "cotton" | "paddy" | "maize" | "tomato";

interface Buyer {
  name: string;
  location: string;
  qty: string;
  price: string;
  dist: string;
  rating: number;
}

interface Mandi {
  name: string;
  dist: string;
  price: string;
  time: string;
  best: boolean;
}

interface CropData {
  cropName: string;
  price: string;
  yesterday: string;
  weeklyChange: string;
  monthlyChange: string;
  trend: "up" | "down" | "stable";
  demand: string;
  supply: string;
  confidence: string;
  nextWeek: string;
  nextMonth: string;
  reasoning: string;
  decision: "Hold" | "Sell Now" | "Wait";
  decisionReason: string;
  expectedDiff: string;
  risk: string;
  buyers: Buyer[];
  mandis: Mandi[];
  insights: {
    demand: string;
    supply: string;
    export: string;
    festival: string;
    weather: string;
    procurement: string;
  };
}

const cropMarketData: Record<CropType, CropData> = {
  groundnut: {
    cropName: "Groundnut (Tag-24)",
    price: "₹6,800",
    yesterday: "₹6,650",
    weeklyChange: "+4.2%",
    monthlyChange: "+12.4%",
    trend: "up",
    demand: "High",
    supply: "Low",
    confidence: "94%",
    nextWeek: "₹7,100",
    nextMonth: "₹7,450",
    reasoning: "Groundnut oil seed crushing units in Pune are operating at lower stock volumes. Expect price appreciation over the next 3 weeks as supplies run thin before Kharif harvests.",
    decision: "Hold",
    decisionReason: "Holding Groundnut stocks for another 15 days is expected to net a 8.2% premium as local crushing demands increase.",
    expectedDiff: "+₹350 / Quintal",
    risk: "Low",
    buyers: [
      { name: "Pune Agri Oils Ltd", location: "Shirur Mandi", qty: "100 QTL", price: "₹6,950", dist: "12km", rating: 4.8 },
      { name: "Mahalaxmi Seed Traders", location: "Pune City", qty: "50 QTL", price: "₹6,900", dist: "18km", rating: 4.6 },
      { name: "Krishiva Direct Procurement", location: "Shirur", qty: "200 QTL", price: "₹6,880", dist: "8km", rating: 4.5 }
    ],
    mandis: [
      { name: "Pune Mandi", dist: "12km", price: "₹6,850", time: "35 mins", best: true },
      { name: "Shirur Mandi", dist: "6km", price: "₹6,800", time: "15 mins", best: false },
      { name: "Hadapsar Mandi", dist: "22km", price: "₹6,720", time: "55 mins", best: false }
    ],
    insights: {
      demand: "Oilseed demand surges as import duties on palm oil rise.",
      supply: "Delays in Kharif sowing will lead to supply crunches in late July.",
      export: "HPS Groundnut exports to Southeast Asia open with 15% margins.",
      festival: "Upcoming festive season starting August will push retail prices up.",
      weather: "Dry spell warnings in Pune accelerate harvest drying, lowering crop moistures.",
      procurement: "MSP for Groundnuts is set at ₹6,780/QTL; market price exceeds MSP."
    }
  },
  cotton: {
    cropName: "Cotton (Shankar-6)",
    price: "₹7,200",
    yesterday: "₹7,350",
    weeklyChange: "-2.0%",
    monthlyChange: "-4.5%",
    trend: "down",
    demand: "Medium",
    supply: "Excess",
    confidence: "88%",
    nextWeek: "₹7,050",
    nextMonth: "₹6,900",
    reasoning: "Global cotton demand contracts as spinning mills reduce usage. Domestic arrivals are high in Vidarbha, keeping regional prices weak.",
    decision: "Sell Now",
    decisionReason: "Sell immediately to lock in the ₹7,200 rate before new arrivals hit markets next month and suppress indices further.",
    expectedDiff: "-₹150 / Quintal",
    risk: "Medium",
    buyers: [
      { name: "Vidarbha Spinners Co", location: "Nagpur", qty: "250 QTL", price: "₹7,250", dist: "45km", rating: 4.7 },
      { name: "Nagpur Cotton Mills", location: "Nagpur Mandi", qty: "150 QTL", price: "₹7,220", dist: "32km", rating: 4.5 },
      { name: "Bharat Cotton Corp", location: "Wardha", qty: "500 QTL", price: "₹7,180", dist: "68km", rating: 4.4 }
    ],
    mandis: [
      { name: "Nagpur Mandi", dist: "32km", price: "₹7,220", time: "45 mins", best: true },
      { name: "Wardha Mandi", dist: "55km", price: "₹7,150", time: "75 mins", best: false },
      { name: "Yavatmal Mandi", dist: "92km", price: "₹7,080", time: "120 mins", best: false }
    ],
    insights: {
      demand: "Spinning mills decrease capacity utilisation due to electricity tariffs.",
      supply: "Nagpur arrivals are 15% higher than historical averages.",
      export: "Export index for raw cotton falls due to competition from Brazil.",
      festival: "Domestic textile mills forecast flat sales for upcoming cycles.",
      weather: "Late monsoon showers in Vidarbha damage cotton bolls, affecting quality.",
      procurement: "MSP is ₹7,120/QTL. Market remains close to baseline."
    }
  },
  paddy: {
    cropName: "Paddy (Basmati-1509)",
    price: "₹3,850",
    yesterday: "₹3,800",
    weeklyChange: "+1.3%",
    monthlyChange: "+6.8%",
    trend: "up",
    demand: "High",
    supply: "Stable",
    confidence: "91%",
    nextWeek: "₹3,920",
    nextMonth: "₹4,100",
    reasoning: "Government export relaxation rules for parboiled rice have spurred procurement from international millers. Stock volumes are stable.",
    decision: "Hold",
    decisionReason: "Hold paddy stocks for 3 weeks. Prices are modeled to climb by ₹250/Quintal as international supply windows open.",
    expectedDiff: "+₹250 / Quintal",
    risk: "Low",
    buyers: [
      { name: "Punjab Rice Millers", location: "Gondia Mandi", qty: "400 QTL", price: "₹3,900", dist: "110km", rating: 4.9 },
      { name: "Maharastra Food Corp", location: "Nagpur City", qty: "100 QTL", price: "₹3,860", dist: "85km", rating: 4.6 },
      { name: "Direct Mandi Exporters", location: "Gondia", qty: "300 QTL", price: "₹3,840", dist: "115km", rating: 4.3 }
    ],
    mandis: [
      { name: "Gondia Mandi", dist: "110km", price: "₹3,880", time: "140 mins", best: true },
      { name: "Bhandara Mandi", dist: "75km", price: "₹3,820", time: "90 mins", best: false },
      { name: "Nagpur Mandi", dist: "85km", price: "₹3,800", time: "105 mins", best: false }
    ],
    insights: {
      demand: "Parboiled export restrictions relaxed, spiking direct trade demand.",
      supply: "Gondia arrivals are matching baseline averages.",
      export: "Demand surges from Gulf countries for long-grain premium Basmati.",
      festival: "Standard domestic rice volumes increase in wholesale stores.",
      weather: "Adequate rainfall in rice-bowl areas of MH ensures high-grade grains.",
      procurement: "Government MSP for Paddy (Grade A) set at ₹2,300/QTL."
    }
  },
  maize: {
    cropName: "Maize (Hybrid Yellow)",
    price: "₹2,150",
    yesterday: "₹2,120",
    weeklyChange: "+1.4%",
    monthlyChange: "+5.2%",
    trend: "up",
    demand: "High",
    supply: "Stable",
    confidence: "92%",
    nextWeek: "₹2,200",
    nextMonth: "₹2,350",
    reasoning: "Poultry feed manufacturers and ethanol production plants are bidding aggressively for yellow maize. Regional stocks remain tight.",
    decision: "Wait",
    decisionReason: "Wait for 7-10 days. The ethanol manufacturing subsidy program starting next week will spark an immediate ₹100 price surge.",
    expectedDiff: "+₹120 / Quintal",
    risk: "Low",
    buyers: [
      { name: "National Feed Millers", location: "Nashik Mandi", qty: "300 QTL", price: "₹2,200", dist: "15km", rating: 4.8 },
      { name: "Panchavati Ethanol Corp", location: "Nashik", qty: "500 QTL", price: "₹2,180", dist: "22km", rating: 4.7 },
      { name: "Star Starch Products", location: "Malegaon", qty: "200 QTL", price: "₹2,150", dist: "54km", rating: 4.4 }
    ],
    mandis: [
      { name: "Nashik Mandi", dist: "15km", price: "₹2,180", time: "25 mins", best: true },
      { name: "Malegaon Mandi", dist: "54km", price: "₹2,120", time: "70 mins", best: false },
      { name: "Manmad Mandi", dist: "68km", price: "₹2,100", time: "90 mins", best: false }
    ],
    insights: {
      demand: "Ethanol manufacturers aggressive on bids due to blending quotas.",
      supply: "Market arrivals are flat; cold storage volumes are dropping.",
      export: "Limited exports to neighbouring regions due to local buffer needs.",
      festival: "Poultry demand surges ahead of holiday cycles, increasing feed needs.",
      weather: "Spurt in heat levels accelerates drying, reducing kernel moisture percentages.",
      procurement: "MSP is ₹2,090/QTL. Market trading above MSP."
    }
  },
  tomato: {
    cropName: "Tomato (Hybrid Local)",
    price: "₹1,800",
    yesterday: "₹2,200",
    weeklyChange: "-18.2%",
    monthlyChange: "-35.0%",
    trend: "down",
    demand: "Low",
    supply: "Excess",
    confidence: "95%",
    nextWeek: "₹1,400",
    nextMonth: "₹1,100",
    reasoning: "Extreme harvesting flush in Nashik and Junnar. Mandis are flooded with tomatoes. High perishability prevents cold storage holding.",
    decision: "Sell Now",
    decisionReason: "Sell tomatoes immediately. Due to extreme heat accelerating ripening, arrivals are doubling daily, which will crash prices to ₹1,000.",
    expectedDiff: "-₹400 / Quintal",
    risk: "High",
    buyers: [
      { name: "Junnar Ketchup Factory", location: "Junnar", qty: "80 QTL", price: "₹1,850", dist: "25km", rating: 4.6 },
      { name: "Pune Vegetable Traders", location: "Pune Mandi", qty: "40 QTL", price: "₹1,780", dist: "15km", rating: 4.4 },
      { name: "Fresh Direct Retail", location: "Hadapsar", qty: "60 QTL", price: "₹1,750", dist: "28km", rating: 4.2 }
    ],
    mandis: [
      { name: "Junnar Mandi", dist: "25km", price: "₹1,820", time: "40 mins", best: true },
      { name: "Nashik Mandi", dist: "45km", price: "₹1,750", time: "65 mins", best: false },
      { name: "Hadapsar Mandi", dist: "28km", price: "₹1,700", time: "45 mins", best: false }
    ],
    insights: {
      demand: "Processing units operating at full limits, squeezing fresh buyer demand.",
      supply: "Daily arrivals cross 25,000 crates in regional centers.",
      export: "Inter-state shipments blocked due to local gluts.",
      festival: "No immediate festival triggers to lift fresh retail demand.",
      weather: "High humidity accelerates rot, forcing farmers to harvest early.",
      procurement: "No government MSP protection for tomatoes (perishable)."
    }
  }
};

// SVG Chart component
function MarketIndexChart() {
  return (
    <div className="w-full h-28 relative">
      <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
        {/* Grid lines */}
        <line x1="0" y1="20" x2="300" y2="20" stroke="currentColor" strokeWidth="0.5" className="text-border/30" strokeDasharray="4 4" />
        <line x1="0" y1="50" x2="300" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-border/30" strokeDasharray="4 4" />
        <line x1="0" y1="80" x2="300" y2="80" stroke="currentColor" strokeWidth="0.5" className="text-border/30" strokeDasharray="4 4" />
        
        {/* Animated line path */}
        <motion.path
          d="M 0 80 Q 50 85 80 50 T 160 40 T 240 60 T 300 20"
          fill="none"
          stroke="url(#chart-gradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
        />
        
        {/* Gradient fill */}
        <path
          d="M 0 80 Q 50 85 80 50 T 160 40 T 240 60 T 300 20 L 300 100 L 0 100 Z"
          fill="url(#chart-fill-gradient)"
          opacity="0.1"
        />

        <defs>
          <linearGradient id="chart-gradient" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--primary)" />
            <stop offset="1" stopColor="#8BC34A" />
          </linearGradient>
          <linearGradient id="chart-fill-gradient" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--primary)" stopOpacity="1" />
            <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function MarketIntelligencePage() {
  const [selectedCrop, setSelectedCrop] = React.useState<CropType>("groundnut");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDistrict, setSelectedDistrict] = React.useState("Pune");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [liveMarketData, setLiveMarketData] = React.useState<Record<CropType, CropData>>(cropMarketData);

  React.useEffect(() => {
    async function loadSpotPrices() {
      try {
        const prices = await apiClient.get<any[]>("/market/prices");
        if (prices && prices.length > 0) {
          const mapped: Partial<Record<CropType, CropData>> = {};
          prices.forEach((item: any) => {
            const key = item.cropName.toLowerCase();
            let cropKey: CropType | null = null;
            if (key.includes("groundnut")) cropKey = "groundnut";
            else if (key.includes("cotton")) cropKey = "cotton";
            else if (key.includes("paddy") || key.includes("rice")) cropKey = "paddy";
            else if (key.includes("maize")) cropKey = "maize";
            else if (key.includes("tomato")) cropKey = "tomato";

            if (cropKey) {
              mapped[cropKey] = {
                cropName: item.cropName,
                price: item.price,
                yesterday: item.yesterday,
                weeklyChange: item.weeklyChange,
                monthlyChange: item.monthlyChange,
                trend: item.trend,
                demand: item.demand,
                supply: item.supply,
                confidence: item.confidence,
                nextWeek: item.nextWeek,
                nextMonth: item.nextMonth,
                reasoning: item.reasoning,
                decision: item.decision,
                decisionReason: item.decisionReason,
                expectedDiff: item.expectedDiff,
                risk: item.risk,
                buyers: item.buyers,
                mandis: item.mandis,
                insights: item.insights
              };
            }
          });
          setLiveMarketData(prev => ({ ...prev, ...mapped }));
        }
      } catch (err) {
        console.error("Failed to load spot prices", err);
      }
    }
    loadSpotPrices();
  }, []);

  const activeData = liveMarketData[selectedCrop];

  // List of crops matching search
  const cropKeys: CropType[] = ["groundnut", "cotton", "paddy", "maize", "tomato"];
  const filteredCrops = cropKeys.filter(key => {
    const cropName = liveMarketData[key].cropName.toLowerCase();
    const queryMatch = cropName.includes(searchQuery.toLowerCase());
    
    if (selectedCategory === "all") return queryMatch;
    if (selectedCategory === "oilseeds") return queryMatch && (key === "groundnut" || key === "cotton");
    if (selectedCategory === "grains") return queryMatch && (key === "paddy" || key === "maize");
    if (selectedCategory === "vegetables") return queryMatch && key === "tomato";
    return queryMatch;
  });

  return (
    <MainLayout>
      <div className="space-y-8 pb-16 animate-fade-in">
        
        {/* Page Header */}
        <SectionHeader 
          title="AI Market Intelligence Center" 
          description="Bloomberg agricultural trading indices, local Mandi averages, and AI-modeled price forecasting."
          className="mb-0"
        />

        {/* SECTION 1: HERO OVERVIEW AND INDEX CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          <Card title="" animate={false} className="lg:col-span-2 p-6 flex flex-col justify-between relative overflow-hidden bg-gradient-to-tr from-primary/10 via-card to-accent/5">
            <div className="absolute top-0 right-0 p-4">
              <Badge variant="success" className="font-bold px-2.5 py-0.5 text-[10px] tracking-wider uppercase">
                Mandi Sentiment: Bullish
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              <div className="md:col-span-2 space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Mandi Price Index</span>
                <h3 className="text-4xl font-extrabold text-foreground">142.6 <span className="text-sm font-bold text-primary">+2.8%</span></h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between max-w-[180px]">
                    <span className="text-muted-foreground">Top Gaining Crop:</span>
                    <strong className="text-emerald-500 font-bold">Groundnut</strong>
                  </div>
                  <div className="flex justify-between max-w-[180px]">
                    <span className="text-muted-foreground">Top Losing Crop:</span>
                    <strong className="text-red-500 font-bold">Tomato</strong>
                  </div>
                  <div className="flex justify-between max-w-[180px]">
                    <span className="text-muted-foreground">Price Volatility:</span>
                    <strong className="text-foreground">Low (Stable)</strong>
                  </div>
                </div>
              </div>

              {/* Animated Trend Graph */}
              <div className="md:col-span-3">
                <MarketIndexChart />
              </div>
            </div>

            {/* AI Summary */}
            <div className="mt-5 pt-4 border-t border-border/40 flex items-start gap-2.5 text-xs">
              <Sparkles className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Vira AI Market Summary:</strong> Mandi volumes are robust. Grains and oilseeds trade at above-average rates due to export relaxations. Tomato indices see drop corrections due to harvest flushes in Nashik.
              </p>
            </div>
          </Card>

          {/* Sell Advisory Recommendation Card */}
          <Card title="" animate={false} className="p-6 border-l-4 border-l-primary flex flex-col justify-between bg-card shadow-sm border-t-0 border-r-0 border-b-0">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <Brain className="h-5 w-5 text-primary shrink-0" />
                <h4 className="font-bold text-sm text-foreground">Sell Advisory Recommendation</h4>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Advisory Call:</span>
                  <Badge 
                    variant={activeData.decision === "Hold" ? "success" : activeData.decision === "Wait" ? "warning" : "destructive"} 
                    className="font-bold px-3 py-1 text-xs uppercase"
                  >
                    {activeData.decision}
                  </Badge>
                </div>
                
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-foreground">AI Rationale:</span>
                  <p className="text-muted-foreground leading-relaxed">
                    {activeData.decisionReason}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/30 flex justify-between items-center text-[10px] text-muted-foreground">
              <span>Expected Premium: <strong className="text-emerald-500 font-bold">{activeData.expectedDiff}</strong></span>
              <span>Risk: <strong className="text-foreground">{activeData.risk}</strong></span>
            </div>
          </Card>

        </div>

        {/* SECTION 2: SEARCH & FILTERING BAR */}
        <Card title="" animate={false} className="p-4 bg-muted/20 border border-border/70">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between text-xs">
            
            {/* Search Input */}
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
              <input 
                type="text"
                placeholder="Search crops (e.g. Groundnut...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card border border-border rounded-input pl-9 pr-4 h-10 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-muted-foreground/60 transition-all duration-200"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              <select 
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-card border border-border rounded-input px-3 h-10 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200 cursor-pointer"
              >
                <option value="Pune">Pune District</option>
                <option value="Nagpur">Nagpur District</option>
                <option value="Nashik">Nashik District</option>
              </select>

              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-card border border-border rounded-input px-3 h-10 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200 cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="oilseeds">Oilseeds & Cash</option>
                <option value="grains">Grains & Cereals</option>
                <option value="vegetables">Vegetables</option>
              </select>

              <Badge variant="outline" className="h-10 px-3 bg-card border border-border text-[10px] uppercase font-bold text-muted-foreground flex items-center">
                Mandi Feed: Live
              </Badge>
            </div>

          </div>
        </Card>

        {/* SECTION 3: INTERACTIVE COMMODITY TRENDS */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <Activity className="h-4 w-4 text-primary" />
            <span>Select Commodity to View AI Advisory</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {filteredCrops.map((key) => {
              const data = cropMarketData[key];
              const isSelected = selectedCrop === key;
              const isUp = data.trend === "up";
              
              return (
                <div 
                  key={key}
                  role="button"
                  aria-label={`Select ${data.cropName} commodity details`}
                  onClick={() => setSelectedCrop(key)}
                  className={`p-4 rounded-card border cursor-pointer transition-all flex flex-col justify-between h-40 shadow-sm relative active:scale-[0.99] ${
                    isSelected 
                      ? "border-primary bg-primary/5 ring-1 ring-primary" 
                      : "border-border bg-card hover:bg-muted/10"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                        {key === "tomato" ? "Vegetables" : key === "paddy" || key === "maize" ? "Grains" : "Oilseeds"}
                      </span>
                      <Badge 
                        variant={isUp ? "success" : "destructive"} 
                        className="text-[9px] font-bold px-1.5 py-0.2"
                      >
                        {data.weeklyChange}
                      </Badge>
                    </div>
                    <h4 className="text-sm font-extrabold text-foreground tracking-tight">{data.cropName}</h4>
                  </div>

                  <div className="space-y-1">
                    <span className="text-lg font-black text-foreground">{data.price}</span>
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1.5 border-t border-border/20">
                      <span>Demand: <strong className="text-foreground">{data.demand}</strong></span>
                      <span>AI Match: <strong className="text-primary">{data.confidence}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredCrops.length === 0 && (
              <div className="col-span-full py-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-card bg-muted/10">
                No commodity matches your search criteria.
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4: AI PRICE PREDICTIONS & VERIFIED BUYERS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* AI Price Prediction Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card title="" animate={false} className="p-6 space-y-5 bg-gradient-to-br from-primary/5 to-card border-primary/20">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <Brain className="h-5 w-5 text-primary shrink-0" />
                <h4 className="font-bold text-sm text-foreground">AI Price Predictions</h4>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs py-1">
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground block uppercase font-bold">Next Week Expected</span>
                  <span className="text-xl font-extrabold text-primary">{activeData.nextWeek}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground block uppercase font-bold">Next Month Expected</span>
                  <span className="text-xl font-extrabold text-primary">{activeData.nextMonth}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <span className="font-bold text-foreground block">Market Driver & Forecast:</span>
                <p className="text-muted-foreground leading-relaxed">
                  {activeData.reasoning}
                </p>
              </div>

              <div className="pt-3 border-t border-border/30 flex justify-between items-center text-[10px] text-muted-foreground">
                <span>AI Confidence Index:</span>
                <Badge variant="success" className="font-bold text-[9px] px-2 bg-primary">{activeData.confidence} Confidence</Badge>
              </div>
            </Card>
          </div>

          {/* Verified Buyers Card */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 pb-1">
              <Store className="h-5 w-5 text-primary" />
              <h3 className="text-base font-bold text-foreground">Verified Commercial Buyers ({activeData.cropName})</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeData.buyers.map((buyer, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-btn border border-border bg-card flex flex-col justify-between h-48 hover:border-primary/30 transition-all shadow-sm text-xs"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-foreground block truncate max-w-[100px]">{buyer.name}</span>
                      <span className="text-[10px] text-emerald-500 font-bold">★ {buyer.rating}</span>
                    </div>
                    
                    <div className="space-y-1 text-muted-foreground text-[11px]">
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <strong className="text-foreground">{buyer.location}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Quantity Req:</span>
                        <strong className="text-foreground">{buyer.qty}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Offer Price:</span>
                        <strong className="text-primary font-bold">{buyer.price}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/30 flex justify-between items-center">
                    <span className="text-[10px] text-muted-foreground">{buyer.dist} away</span>
                    <Button 
                      onClick={() => alert(`Initiating direct procurement contact with ${buyer.name}...`)}
                      aria-label={`Contact buyer ${buyer.name}`}
                      className="text-[10.5px] font-extrabold h-8 rounded-btn cursor-pointer bg-primary hover:bg-primary/90 px-3.5 text-white active:scale-[0.97] transition-all"
                    >
                      Contact Buyer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* SECTION 5: NEARBY MANDIS MAP & ALERTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Nearby Mandis list */}
          <Card title="" animate={false} className="p-6 md:col-span-2 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <h4 className="font-bold text-sm text-foreground">Nearby Mandi Comparison ({activeData.cropName})</h4>
              </div>

              <div className="space-y-3.5 text-xs">
                {activeData.mandis.map((mandi, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-btn border flex items-center justify-between gap-4 ${
                      mandi.best 
                        ? "border-primary bg-primary/5" 
                        : "border-border bg-card/50"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{mandi.name}</span>
                        {mandi.best && (
                          <Badge variant="success" className="text-[9px] font-bold px-1.5 py-0.2">Best Price</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-[10px]">
                        Distance: {mandi.dist} • Est. Travel Time: {mandi.time}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-foreground block">{mandi.price}</span>
                      <span className="text-[9px] text-muted-foreground">per quintal</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-muted-foreground leading-relaxed pt-2">
              * Transport expenses estimated at ₹8/km. Pune Mandi offers the highest net margin after transport offsets.
            </div>
          </Card>

          {/* Market Alerts Panel */}
          <Card title="" animate={false} className="p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />
              <h4 className="font-bold text-sm text-foreground">Live Market Alerts</h4>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Alert 1 */}
              <div className="p-2.5 rounded-btn border border-warning/20 bg-warning/5 flex items-start gap-2.5">
                <TrendingUp className="h-4.5 w-4.5 text-warning shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-warning-foreground">Price Surge (Groundnut)</span>
                  <p className="text-muted-foreground text-[10px] leading-relaxed">
                    Groundnut prices cross ₹6,800 in Pune Mandi, hitting a 3-year seasonal peak.
                  </p>
                </div>
              </div>

              {/* Alert 2 */}
              <div className="p-2.5 rounded-btn border border-red-500/20 bg-red-500/5 flex items-start gap-2.5">
                <TrendingDown className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-red-500">Price Drop (Tomato)</span>
                  <p className="text-muted-foreground text-[10px] leading-relaxed">
                    Tomato prices contract by ₹400 in Junnar due to severe ripen flushes.
                  </p>
                </div>
              </div>

              {/* Alert 3 */}
              <div className="p-2.5 rounded-btn border border-primary/20 bg-primary/5 flex items-start gap-2.5">
                <DollarSign className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-primary">MSP Hike index</span>
                  <p className="text-muted-foreground text-[10px] leading-relaxed">
                    Cabinet approves 6% hike in Kharif crop minimum support prices (MSP).
                  </p>
                </div>
              </div>
            </div>
          </Card>

        </div>

        {/* SECTION 6: AI INSIGHTS GRID */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-1">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">AI Market Insights ({activeData.cropName})</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 text-xs">
            
            {/* Card 1 */}
            <div className="p-4 rounded-btn border border-border bg-card flex flex-col justify-between h-36">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Demand Trend</span>
                <p className="font-semibold text-foreground leading-normal text-[11px]">
                  {activeData.insights.demand}
                </p>
              </div>
              <Badge variant="outline" className="border-primary text-primary bg-primary/5 text-[9px] font-bold w-fit">
                Bullish
              </Badge>
            </div>

            {/* Card 2 */}
            <div className="p-4 rounded-btn border border-border bg-card flex flex-col justify-between h-36">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Supply Forecast</span>
                <p className="font-semibold text-foreground leading-normal text-[11px]">
                  {activeData.insights.supply}
                </p>
              </div>
              <Badge variant="outline" className="border-primary text-primary bg-primary/5 text-[9px] font-bold w-fit">
                Tight Cap
              </Badge>
            </div>

            {/* Card 3 */}
            <div className="p-4 rounded-btn border border-border bg-card flex flex-col justify-between h-36">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Export Opportunity</span>
                <p className="font-semibold text-foreground leading-normal text-[11px]">
                  {activeData.insights.export}
                </p>
              </div>
              <Badge variant="outline" className="border-primary text-primary bg-primary/5 text-[9px] font-bold w-fit">
                Export Open
              </Badge>
            </div>

            {/* Card 4 */}
            <div className="p-4 rounded-btn border border-border bg-card flex flex-col justify-between h-36">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Festival Demand</span>
                <p className="font-semibold text-foreground leading-normal text-[11px]">
                  {activeData.insights.festival}
                </p>
              </div>
              <Badge variant="outline" className="border-primary text-primary bg-primary/5 text-[9px] font-bold w-fit">
                High Triggers
              </Badge>
            </div>

            {/* Card 5 */}
            <div className="p-4 rounded-btn border border-border bg-card flex flex-col justify-between h-36">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Weather Impact</span>
                <p className="font-semibold text-foreground leading-normal text-[11px]">
                  {activeData.insights.weather}
                </p>
              </div>
              <Badge variant="outline" className="border-primary text-primary bg-primary/5 text-[9px] font-bold w-fit">
                Moisture Low
              </Badge>
            </div>

            {/* Card 6 */}
            <div className="p-4 rounded-btn border border-border bg-card flex flex-col justify-between h-36">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">MSP procured</span>
                <p className="font-semibold text-foreground leading-normal text-[11px]">
                  {activeData.insights.procurement}
                </p>
              </div>
              <Badge variant="outline" className="border-emerald-500 text-emerald-500 bg-emerald-500/5 text-[9px] font-bold w-fit">
                Active index
              </Badge>
            </div>

          </div>
        </div>

        {/* SECTION 7: SMART ACTIONS PANEL */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 bg-muted/40 p-5 rounded-card border border-border/50 justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <HelpingHand className="h-4.5 w-4.5 text-primary" />
            Market Actions:
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => window.location.href = "/assistant"}
              variant="outline"
              aria-label="Talk to AI Assistant Vira"
              className="text-xs font-bold h-10 px-4 rounded-btn cursor-pointer bg-card hover:bg-muted/10 active:scale-[0.98] transition-all"
            >
              <Sparkles className="mr-1.5 h-4 w-4 text-primary" />
              Talk to AI
            </Button>
            <Button
              onClick={() => alert("Loading buyer matching overlay...")}
              variant="outline"
              aria-label="Find commercial buyers"
              className="text-xs font-bold h-10 px-4 rounded-btn cursor-pointer bg-card hover:bg-muted/10 active:scale-[0.98] transition-all"
            >
              <Store className="mr-1.5 h-4 w-4 text-primary" />
              Find Buyers
            </Button>
            <Button
              onClick={() => alert("Mandi price comparative report downloaded.")}
              variant="outline"
              aria-label="Download comparative mandi report"
              className="text-xs font-bold h-10 px-4 rounded-btn cursor-pointer bg-card hover:bg-muted/10 active:scale-[0.98] transition-all"
            >
              <Save className="mr-1.5 h-4 w-4 text-primary" />
              Download Report
            </Button>
            <Button
              onClick={() => alert("Report shared with direct transport agents.")}
              variant="outline"
              aria-label="Share price report"
              className="text-xs font-bold h-10 px-4 rounded-btn cursor-pointer bg-card hover:bg-muted/10 active:scale-[0.98] transition-all"
            >
              <Share2 className="mr-1.5 h-4 w-4 text-primary" />
              Share Report
            </Button>
            <Button
              onClick={() => alert("Opening mandi arbitrage calculator...")}
              aria-label="Compare different mandi prices"
              className="text-xs font-bold h-10 px-4 rounded-btn cursor-pointer bg-primary hover:bg-primary/95 text-white active:scale-[0.98] transition-all"
            >
              <Activity className="mr-1.5 h-4 w-4 text-white" />
              Compare Markets
            </Button>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}
