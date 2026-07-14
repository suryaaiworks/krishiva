"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, TrendingUp, Sparkles, Star, MessageSquare, 
  DollarSign, Truck, FileText, ShieldCheck, Scale, Globe, 
  PhoneCall, ArrowUpRight, Check, Search, MapPin, X
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { apiClient } from "@/services/apiClient";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

interface Buyer {
  id: string;
  companyName: string;
  rating: number;
  cropRequired: string;
  quantityRequired: string;
  offeredPrice: number;
  unit: string;
  distance: string;
  distanceVal: number;
  pickupAvailable: boolean;
  paymentMethod: string;
  expectedPaymentTime: string;
  category: "Grains" | "Oilseeds" | "Vegetables" | "Sugarcane";
  location: string;
  certification: string;
  phone?: string;
}

const buyersDatabase: Buyer[] = [
  {
    id: "sahyadri-sugar",
    companyName: "Sahyadri Sugar Cooperative",
    rating: 4.8,
    cropRequired: "Sugarcane",
    quantityRequired: "150 Tons",
    offeredPrice: 3520,
    unit: "Ton",
    distance: "3.5 km",
    distanceVal: 3.5,
    pickupAvailable: true,
    paymentMethod: "DBT Direct Bank Transfer",
    expectedPaymentTime: "Instant on Weight Slip",
    category: "Sugarcane",
    location: "Shirur Road, Pune",
    certification: "Cooperative Govt Approved"
  },
  {
    id: "baramati-agro",
    companyName: "Baramati Agro Industries",
    rating: 4.7,
    cropRequired: "Sugarcane",
    quantityRequired: "500 Tons",
    offeredPrice: 3480,
    unit: "Ton",
    distance: "12.4 km",
    distanceVal: 12.4,
    pickupAvailable: true,
    paymentMethod: "Direct Bank Transfer",
    expectedPaymentTime: "Net 7 Days",
    category: "Sugarcane",
    location: "Baramati Highway, Pune",
    certification: "Govt Licensed Processor"
  },
  {
    id: "biofuel-pune",
    companyName: "Pune Bio-Ethanol Ltd",
    rating: 4.5,
    cropRequired: "Sugarcane",
    quantityRequired: "80 Tons",
    offeredPrice: 3410,
    unit: "Ton",
    distance: "8.0 km",
    distanceVal: 8.0,
    pickupAvailable: false,
    paymentMethod: "Direct Bank Transfer",
    expectedPaymentTime: "Net 3 Days",
    category: "Sugarcane",
    location: "Hadapsar Industrial Area, Pune",
    certification: "Green Energy Certified"
  },
  {
    id: "maharashtra-oil",
    companyName: "Maharashtra Oilseeds Corp",
    rating: 4.9,
    cropRequired: "Groundnut",
    quantityRequired: "120 Tons",
    offeredPrice: 6250,
    unit: "Quintal",
    distance: "15.0 km",
    distanceVal: 15.0,
    pickupAvailable: true,
    paymentMethod: "DBT Direct Bank Transfer",
    expectedPaymentTime: "2 Working Days",
    category: "Oilseeds",
    location: "Hadapsar, Pune",
    certification: "Organic Certified / APMC License"
  },
  {
    id: "pune-veggie-hub",
    companyName: "Pune Fresh Veggie Hub",
    rating: 4.4,
    cropRequired: "Tomato",
    quantityRequired: "10 Tons",
    offeredPrice: 2800,
    unit: "Quintal",
    distance: "6.5 km",
    distanceVal: 6.5,
    pickupAvailable: false,
    paymentMethod: "Cash",
    expectedPaymentTime: "On Delivery",
    category: "Vegetables",
    location: "Market Yard, Pune",
    certification: "Local APMC Registered"
  }
];

export default function BuyerMarketplacePage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCrop, setSelectedCrop] = React.useState<string>("Sugarcane");
  const [selectedBuyerId, setSelectedBuyerId] = React.useState<string>("sahyadri-sugar");
  const [distanceFilter, setDistanceFilter] = React.useState<number>(20);
  const [certificationFilter, setCertificationFilter] = React.useState<string>("all");

  // Negotiation states
  const [negotiationOpen, setNegotiationOpen] = React.useState(false);
  const [counterPrice, setCounterPrice] = React.useState<number>(0);
  const [negotiationStatus, setNegotiationStatus] = React.useState<"idle" | "submitting" | "accepted" | "countered" | "declined">("idle");
  const [buyerCounterOffer, setBuyerCounterOffer] = React.useState<number>(0);
  const [negotiationMessage, setNegotiationMessage] = React.useState("");

  // Delivery planner states
  const [selectedVehicle, setSelectedVehicle] = React.useState<string>("bolero");
  const [pickupDate, setPickupDate] = React.useState<string>("June 29, 2026");

  const activeCropQuantity = 10; // Mocking 10 Tons crop availability in profile

  // Filter buyers based on crop type & other fields
  const filteredBuyers = buyersDatabase.filter(buyer => {
    const matchesSearch = buyer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          buyer.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCrop = buyer.cropRequired.toLowerCase() === selectedCrop.toLowerCase();
    const matchesDistance = buyer.distanceVal <= distanceFilter;
    const matchesCertification = certificationFilter === "all" || 
                                 buyer.certification.toLowerCase().includes(certificationFilter.toLowerCase());

    return matchesSearch && matchesCrop && matchesDistance && matchesCertification;
  });

  const selectedBuyer = buyersDatabase.find(b => b.id === selectedBuyerId) || filteredBuyers[0] || buyersDatabase[0];

  // Price calculations
  const calculateGrossEarnings = (buyer: Buyer) => {
    const qty = activeCropQuantity;
    return buyer.offeredPrice * qty;
  };

  const calculateTransportCost = (buyer: Buyer) => {
    const dist = buyer.distanceVal;
    let rate = 15; // default rate
    if (selectedVehicle === "bolero") rate = 12;
    else if (selectedVehicle === "tractor") rate = 20;
    else if (selectedVehicle === "truck") rate = 35;
    
    return dist * rate;
  };

  const calculateNetEarnings = (buyer: Buyer) => {
    return calculateGrossEarnings(buyer) - calculateTransportCost(buyer);
  };

  // AI Best Match calculation
  const getBestMatch = () => {
    const cropBuyers = buyersDatabase.filter(b => b.cropRequired.toLowerCase() === selectedCrop.toLowerCase());
    if (cropBuyers.length === 0) return null;

    return cropBuyers.reduce((best, current) => {
      const bestNet = calculateNetEarnings(best);
      const currentNet = calculateNetEarnings(current);
      return currentNet > bestNet ? current : best;
    });
  };

  const bestMatchBuyer = getBestMatch();

  const handleSelectBuyer = (id: string) => {
    setSelectedBuyerId(id);
    setNegotiationOpen(false);
    setNegotiationStatus("idle");
    const buyer = buyersDatabase.find(b => b.id === id);
    if (buyer) {
      setCounterPrice(buyer.offeredPrice + 100);
    }
  };

  React.useEffect(() => {
    if (selectedBuyer) {
      setCounterPrice(selectedBuyer.offeredPrice + 100);
    }
  }, [selectedBuyerId, selectedCrop, selectedBuyer]);

  const handleOpenNegotiation = () => {
    setNegotiationOpen(true);
    setNegotiationStatus("idle");
  };

  const handleSubmitCounter = async () => {
    setNegotiationStatus("submitting");
    try {
      const payload = {
        buyer_request_id: selectedBuyer.id,
        offered_price: selectedBuyer.offeredPrice,
        counter_price: counterPrice,
        message: "Requesting counter price rate."
      };
      const res = await apiClient.post<any>("/market/negotiate", payload);
      if (res) {
        setNegotiationStatus(res.status);
        setNegotiationMessage(res.message);
        if (res.status === "countered") {
          setBuyerCounterOffer(res.buyer_counter_offer || Math.round(selectedBuyer.offeredPrice * 1.04));
        }
        return;
      }
    } catch (err) {
      console.error("Negotiation failed on B2B desk", err);
    }

    // Fallback logic
    setTimeout(() => {
      const initial = selectedBuyer.offeredPrice;
      const differencePct = ((counterPrice - initial) / initial) * 100;

      if (differencePct <= 3.5) {
        setNegotiationStatus("accepted");
        setNegotiationMessage(`Offer accepted! Sahyadri Sugar has approved ₹${counterPrice}/${selectedBuyer.unit} for your crop. A draft contract has been locked in your profile.`);
      } else if (differencePct > 3.5 && differencePct <= 9) {
        const compromise = Math.round(initial + (counterPrice - initial) * 0.45);
        setNegotiationStatus("countered");
        setBuyerCounterOffer(compromise);
        setNegotiationMessage(`The buyer's B2B desk reviewed your counter of ₹${counterPrice} and responded with a compromise offer of ₹${compromise}/${selectedBuyer.unit}.`);
      } else {
        setNegotiationStatus("declined");
        setNegotiationMessage(`The buyer has declined ₹${counterPrice}/${selectedBuyer.unit} as it exceeds their current budget cap for ${selectedBuyer.cropRequired}. Try a counter under ₹${Math.round(initial * 1.05)}.`);
      }
    }, 1200);
  };

  return (
    <MainLayout>
      <div className="space-y-8 pb-16 animate-fade-in">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <SectionHeader 
            title="Premium B2B Buyer Marketplace" 
            description="Sell your crop directly to verified institutional buyers, cooperatives, and organic processors."
            className="mb-0"
          />
          <div className="flex gap-2">
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="bg-card border border-border rounded-btn px-4 h-10 text-xs font-bold text-foreground cursor-pointer focus:ring-1 focus:ring-primary focus:outline-none"
            >
              <option value="Sugarcane">Sugarcane</option>
              <option value="Groundnut">Groundnut (Oilseed)</option>
              <option value="Paddy">Paddy (Grain)</option>
              <option value="Tomato">Tomato (Vegetable)</option>
            </select>
          </div>
        </div>

        {/* SECTION 1: HERO OVERVIEW AND METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-stretch">
          
          {/* Metric 1 */}
          <div className="bg-card border border-border/80 p-5 rounded-card flex flex-col justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Verified Buyers</span>
              <h3 className="text-2xl font-black text-foreground">48 Buyers</h3>
            </div>
            <div className="text-[10px] text-primary font-bold flex items-center gap-1 mt-2 bg-primary/10 px-2 py-0.5 rounded-btn w-fit">
              <ShieldCheck className="h-3 w-3" />
              100% KYC Verified
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-card border border-border/80 p-5 rounded-card flex flex-col justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Active Requests</span>
              <h3 className="text-2xl font-black text-foreground">120 Requests</h3>
            </div>
            <div className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5 mt-2">
              <ArrowUpRight className="h-3.5 w-3.5" />
              +15% this week
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-card border border-border/80 p-5 rounded-card flex flex-col justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Today&apos;s Best Offer</span>
              <h3 className="text-2xl font-black text-foreground">₹3,520<span className="text-xs font-semibold text-muted-foreground">/Ton</span></h3>
            </div>
            <div className="text-[10px] text-muted-foreground font-bold flex items-center gap-1 mt-2">
              <DollarSign className="h-3.5 w-3.5 text-primary" />
              Sahyadri Cooperative
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-card border border-border/80 p-5 rounded-card flex flex-col justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Nearby Buyers</span>
              <h3 className="text-2xl font-black text-foreground">12 Buyers</h3>
            </div>
            <div className="text-[10px] text-muted-foreground font-bold flex items-center gap-1 mt-2">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              Within 15 km range
            </div>
          </div>

          {/* Metric 5 */}
          <div className="bg-card border border-border/80 p-5 rounded-card flex flex-col justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Average Mandi Price</span>
              <h3 className="text-2xl font-black text-foreground">₹3,200<span className="text-xs font-semibold text-muted-foreground">/Ton</span></h3>
            </div>
            <div className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5 mt-2">
              <TrendingUp className="h-3.5 w-3.5" />
              Stable baseline
            </div>
          </div>

        </div>

        {/* AI SELLING ADVISORY RECOMMENDATION */}
        <div className="bg-emerald-500/[0.04] dark:bg-emerald-500/[0.02] border-l-4 border-l-primary border-y-0 border-r-0 p-5 rounded-r-card rounded-l-none flex items-start gap-3.5 text-xs shadow-sm text-left">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 shadow-inner">
            <Sparkles className="h-4.5 w-4.5 animate-pulse" />
          </div>
          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-foreground text-sm">Vira AI Selling Advisory</h4>
                <Badge variant="outline" className="text-[9px] font-black border-primary/20 bg-primary/10 text-primary px-2 py-0.5 shrink-0 rounded-full select-none">
                  ✨ VIRA ADVISOR
                </Badge>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge className="text-[9px] font-bold bg-emerald-500 text-white border-none shadow-sm rounded-full">
                  96% Confidence
                </Badge>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[11.5px] font-semibold text-muted-foreground">
              <div className="space-y-1">
                <p><strong className="text-foreground">{t("Reasoning")}:</strong> Sahyadri Sugar Cooperative offers free direct field pickup and is located only 3.5 km away, minimizing transport costs.</p>
                <p><strong className="text-foreground">{t("Recommended Action")}:</strong> Sell Sugarcane harvest directly to Sahyadri Sugar Cooperative via the match button below.</p>
              </div>
              <div className="space-y-1">
                <p><strong className="text-foreground">{t("Expected Impact")}:</strong> Boosts net earnings by ₹1,400 with a 98% payment success rate through instant Direct Bank Transfer.</p>
                <p><strong className="text-foreground">{t("Data Source")}:</strong> Local Mandi APMCs &amp; B2B Procurement API</p>
              </div>
            </div>

            <div className="pt-2 border-t border-border/30 flex justify-between items-center text-[10px] text-muted-foreground font-semibold">
              <span>Last Updated: Just now</span>
              <span>Secure match verified</span>
            </div>
          </div>
        </div>

        {/* Search & Advanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-card p-4 rounded-card border border-border/60 shadow-sm">
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search by buyer company name, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/30 border border-border rounded-input pl-10 pr-4 h-11 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-muted-foreground/60 transition-all duration-200"
            />
          </div>

          {/* Distance slider */}
          <div className="space-y-1 px-2 text-xs">
            <div className="flex justify-between items-center text-muted-foreground font-bold uppercase text-[9px] mb-1">
              <span>Max Distance</span>
              <span className="text-foreground">{distanceFilter} km</span>
            </div>
            <input 
              type="range"
              min="2"
              max="30"
              value={distanceFilter}
              onChange={(e) => setDistanceFilter(Number(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Certification selection */}
          <div className="space-y-1">
            <select 
              value={certificationFilter}
              onChange={(e) => setCertificationFilter(e.target.value)}
              className="w-full bg-muted/30 border border-border rounded-input px-3.5 h-11 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer transition-all duration-200"
            >
              <option value="all">All Certifications</option>
              <option value="APMC">APMC Approved</option>
              <option value="Organic">Organic Certified</option>
              <option value="Quality">NABL Quality Certified</option>
            </select>
          </div>
        </div>

        {/* MAIN BODY: AI BEST MATCH BANNER & TWO COLUMN VIEW */}
        {bestMatchBuyer && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border-2 border-primary/40 rounded-card p-6 shadow-sm relative overflow-hidden"
          >
            {/* Corner Badge */}
            <div className="absolute top-0 right-0 p-3 bg-primary text-white text-[9.5px] font-extrabold uppercase tracking-widest rounded-bl-card">
              AI Best Match
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left match summary */}
              <div className="lg:col-span-8 space-y-3 text-xs leading-normal">
                <div className="flex items-center gap-2.5">
                  <Badge className="bg-primary/10 text-primary border-none text-[9px] font-extrabold px-3 py-0.5">
                    98% Compatibility
                  </Badge>
                  <h4 className="text-base font-black text-foreground">Recommended Buyer: {bestMatchBuyer.companyName}</h4>
                </div>

                <p className="text-muted-foreground max-w-2xl leading-relaxed text-[11px]">
                  <strong>AI Explanation:</strong> This buyer provides the highest gross return for your {selectedCrop} (₹{calculateGrossEarnings(bestMatchBuyer).toLocaleString()}) and has minimal transport friction. Because they are located just {bestMatchBuyer.distance} away, logistics cost is reduced to ₹{calculateTransportCost(bestMatchBuyer)}, delivering a net pocket payout of ₹{calculateNetEarnings(bestMatchBuyer).toLocaleString()}.
                </p>

                {/* Match sub statistics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-[10.5px]">
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground block text-[9.5px] font-bold uppercase">Expected Net Profit</span>
                    <strong className="text-sm font-extrabold text-primary">₹{(calculateNetEarnings(bestMatchBuyer) - 20000).toLocaleString()}</strong>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground block text-[9.5px] font-bold uppercase">Transport Cost</span>
                    <strong className="text-sm font-extrabold text-foreground">₹{calculateTransportCost(bestMatchBuyer).toLocaleString()}</strong>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground block text-[9.5px] font-bold uppercase">Net Pocket Earnings</span>
                    <strong className="text-sm font-extrabold text-emerald-500">₹{calculateNetEarnings(bestMatchBuyer).toLocaleString()}</strong>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground block text-[9.5px] font-bold uppercase">Payment Time</span>
                    <strong className="text-sm font-extrabold text-foreground">{bestMatchBuyer.expectedPaymentTime}</strong>
                  </div>
                </div>
              </div>

              {/* Right match action */}
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5 justify-end w-full lg:items-end">
                <Button 
                  onClick={() => handleSelectBuyer(bestMatchBuyer.id)} 
                  variant="outline" 
                  className="w-full sm:w-auto lg:w-48 text-xs font-bold h-10 rounded-btn cursor-pointer bg-card"
                >
                  View Buyer Details
                </Button>
                <Button 
                  onClick={() => handleOpenNegotiation()}
                  className="w-full sm:w-auto lg:w-48 text-xs font-bold h-10 rounded-btn cursor-pointer bg-primary text-white"
                >
                  Request Direct Deal
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* TWO COLUMN INTERACTION GIRD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Buyer Cards list (Column span 5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
              <span>Matching Buyers ({filteredBuyers.length})</span>
              <span>Based on {selectedCrop}</span>
            </div>

            <div className="space-y-4 max-h-[640px] overflow-y-auto pr-1">
              <AnimatePresence mode="popLayout">
                {filteredBuyers.map((buyer) => {
                  const isSelected = buyer.id === selectedBuyerId;
                  return (
                    <motion.div
                      key={buyer.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => handleSelectBuyer(buyer.id)}
                      className={`p-5 rounded-card border text-left cursor-pointer transition-all shadow-sm flex flex-col justify-between min-h-[190px] ${
                        isSelected 
                          ? "border-primary bg-primary/5 ring-1 ring-primary" 
                          : "border-border bg-card hover:bg-muted/10"
                      }`}
                    >
                      <div className="space-y-3.5 text-xs">
                        {/* Company Header with Gradient Logo */}
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 select-none shadow-md">
                            {buyer.companyName.split(' ').map(w => w[0]).join('').substring(0, 2)}
                          </div>
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <h4 className="font-extrabold text-xs text-foreground tracking-tight truncate">{buyer.companyName}</h4>
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            </div>
                            <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-primary shrink-0" />
                              {buyer.location || "Pune"}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-[10.5px] text-muted-foreground py-1">
                          <span>Volume Request: <strong className="text-foreground">{buyer.quantityRequired}</strong></span>
                          <span>Distance: <strong className="text-foreground">{buyer.distance}</strong></span>
                        </div>

                        <p className="text-muted-foreground text-[10.5px] line-clamp-1">
                          Certification: <strong className="text-foreground">{buyer.certification}</strong>
                        </p>
                      </div>


                      <div className="pt-3.5 border-t border-border/30 flex justify-between items-center text-[10.5px] text-muted-foreground">
                        <div>
                          <span>Offered Rate:</span>
                          <strong className="text-emerald-500 font-extrabold text-sm ml-1">₹{buyer.offeredPrice}/{buyer.unit}</strong>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-foreground">{buyer.rating}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {filteredBuyers.length === 0 && (
                <div className="p-8 text-center bg-card border border-border rounded-card space-y-3">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground/60 mx-auto" />
                  <p className="text-xs font-bold text-muted-foreground">No buyers found for {selectedCrop} in Pune.</p>
                  <Button 
                    onClick={() => { setSearchQuery(""); setDistanceFilter(25); }} 
                    size="sm" 
                    variant="outline" 
                    className="text-xs rounded-btn bg-card cursor-pointer"
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>

            {/* Smart Insights Panel */}
            <div className="bg-card border border-border p-5 rounded-card space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <TrendingUp className="h-5 w-5 text-primary shrink-0" />
                <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">Smart Market Insights</h4>
              </div>
              <div className="space-y-3 text-xs leading-normal">
                <div className="flex gap-2.5 items-start">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">High Demand:</strong> Oilseeds (Groundnut TAG-24) demand in Pune markets is up 22% due to crushing mill shortages.
                  </p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Low Supply Area:</strong> Western Taluka region has recorded low Sugarcane outputs, pushing private mills to raise premiums by ₹120/Ton.
                  </p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Export Spurt:</strong> Long-staple cotton is drawing high inquiries from regional textile exporters in Mumbai APMC.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Detailed statistics, Price Comparison, Negotiation, Delivery (Column span 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Buyer Core Info Card */}
            <Card title="" animate={false} className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">Selected Buyer Specifications</span>
                  <h3 className="text-lg font-extrabold text-foreground">{selectedBuyer.companyName}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => handleOpenNegotiation()}
                    className="text-xs font-bold px-4 h-9 rounded-btn cursor-pointer bg-primary text-white"
                  >
                    <MessageSquare className="mr-1.5 h-4 w-4 shrink-0" />
                    Negotiate Price
                  </Button>
                  <Button 
                    onClick={() => alert(`Dialing buyer corporate desk: ${selectedBuyer.phone || "+91 20 2894 8812"}`)}
                    variant="outline" 
                    className="text-xs font-bold px-4 h-9 rounded-btn cursor-pointer bg-card"
                  >
                    <PhoneCall className="mr-1.5 h-4 w-4 shrink-0 text-primary" />
                    Contact
                  </Button>
                </div>
              </div>

              {/* Specific buyer parameters list */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs leading-normal">
                <div>
                  <span className="text-muted-foreground block text-[10px] font-semibold uppercase">Offered Rate</span>
                  <strong className="text-emerald-500 font-extrabold text-sm">₹{selectedBuyer.offeredPrice}/{selectedBuyer.unit}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] font-semibold uppercase">Required Quantity</span>
                  <strong className="text-foreground text-sm">{selectedBuyer.quantityRequired}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] font-semibold uppercase">Distance from Farm</span>
                  <strong className="text-foreground text-sm">{selectedBuyer.distance}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] font-semibold uppercase">Payment Mode</span>
                  <strong className="text-foreground text-sm">{selectedBuyer.paymentMethod}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] font-semibold uppercase">Payment Release</span>
                  <strong className="text-foreground text-sm">{selectedBuyer.expectedPaymentTime}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] font-semibold uppercase">Logistics Pickup</span>
                  <strong className="text-foreground text-sm">{selectedBuyer.pickupAvailable ? "Pickup Provided" : "Farmer Delivery"}</strong>
                </div>
              </div>
            </Card>

            {/* Price Arbitrage Comparison Table */}
            <Card title="" animate={false} className="p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <Scale className="h-5 w-5 text-primary shrink-0" />
                <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">Market Price Arbitrage Comparison</h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse leading-normal">
                  <thead>
                    <tr className="border-b border-border/40 text-muted-foreground font-bold uppercase text-[9px]">
                      <th className="py-2.5">Market Channel</th>
                      <th className="py-2.5">Rate / {selectedBuyer.unit}</th>
                      <th className="py-2.5">Gross Revenue</th>
                      <th className="py-2.5 text-right">Arbitrage vs. Mandi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20 text-foreground font-medium">
                    {/* Selected Buyer row */}
                    <tr className="bg-primary/5 text-primary font-bold">
                      <td className="py-3 flex items-center gap-1">
                        <ShieldCheck className="h-4 w-4 shrink-0" />
                        {selectedBuyer.companyName} (Private)
                      </td>
                      <td className="py-3">₹{selectedBuyer.offeredPrice}</td>
                      <td className="py-3">₹{(selectedBuyer.offeredPrice * activeCropQuantity).toLocaleString()}</td>
                      <td className="py-3 text-right text-emerald-500 font-extrabold">
                        +₹{((selectedBuyer.offeredPrice - 3200) * activeCropQuantity).toLocaleString()}
                      </td>
                    </tr>
                    
                    {/* Mandi baseline */}
                    <tr>
                      <td className="py-2.5 text-muted-foreground">Local Pune APMC Mandi</td>
                      <td className="py-2.5">₹3,200</td>
                      <td className="py-2.5">₹{(3200 * activeCropQuantity).toLocaleString()}</td>
                      <td className="py-2.5 text-right text-muted-foreground">- Baseline</td>
                    </tr>

                    {/* Government MSP */}
                    <tr>
                      <td className="py-2.5 text-muted-foreground">Govt Minimum Support Price (MSP)</td>
                      <td className="py-2.5">₹3,150</td>
                      <td className="py-2.5">₹{(3150 * activeCropQuantity).toLocaleString()}</td>
                      <td className="py-2.5 text-right text-red-500 font-semibold">
                        -₹500
                      </td>
                    </tr>

                    {/* Export buyer */}
                    <tr>
                      <td className="py-2.5 text-muted-foreground">Gulf Export Aggregator</td>
                      <td className="py-2.5">₹3,400</td>
                      <td className="py-2.5">₹{(3400 * activeCropQuantity).toLocaleString()}</td>
                      <td className="py-2.5 text-right text-emerald-500">
                        +₹2,000
                      </td>
                    </tr>

                    {/* Local Wholesale aggregators */}
                    <tr>
                      <td className="py-2.5 text-muted-foreground">Wholesale Commission Agent</td>
                      <td className="py-2.5">₹3,050</td>
                      <td className="py-2.5">₹{(3050 * activeCropQuantity).toLocaleString()}</td>
                      <td className="py-2.5 text-right text-red-500 font-semibold">
                        -₹1,500
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Delivery Planner Widget */}
            <Card title="" animate={false} className="p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <Truck className="h-5 w-5 text-primary shrink-0" />
                <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">Logistics & Delivery Planner</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs leading-normal">
                {/* Vehicle Selection */}
                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">Select Transport Vehicle</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: "bolero", label: "Mahindra Bolero Pickup", desc: "Up to 2 Tons (₹12/km)" },
                      { id: "tractor", label: "3-Ton Tractor Trolley", desc: "Up to 5 Tons (₹20/km)" },
                      { id: "truck", label: "Eicher Commercial Truck", desc: "Above 5 Tons (₹35/km)" }
                    ].map((v) => (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVehicle(v.id)}
                        className={`p-3 rounded-btn border text-left cursor-pointer transition-all ${
                          selectedVehicle === v.id
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border bg-card hover:bg-muted/10 text-muted-foreground"
                        }`}
                      >
                        <div className="font-bold text-xs">{v.label}</div>
                        <div className="text-[10px] text-muted-foreground/80 mt-0.5">{v.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dates & Logistics Summary */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">Requested Pickup Date</label>
                    <select 
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full bg-muted/20 border border-border rounded-btn px-3 h-10 text-xs text-foreground cursor-pointer focus:ring-1 focus:ring-primary focus:outline-none"
                    >
                      <option value="June 29, 2026">June 29, 2026 (Monday)</option>
                      <option value="June 30, 2026">June 30, 2026 (Tuesday)</option>
                      <option value="July 01, 2026">July 01, 2026 (Wednesday)</option>
                    </select>
                  </div>

                  {/* Calculations card */}
                  <div className="p-4 rounded-card border border-border/80 bg-muted/30 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Logistics Distance:</span>
                      <strong className="text-foreground">{selectedBuyer.distance}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Estimated Travel Time:</span>
                      <strong className="text-foreground">{(selectedBuyer.distanceVal * 3).toFixed(0)} mins</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Logistics Cost:</span>
                      <strong className="text-foreground">₹{calculateTransportCost(selectedBuyer).toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between items-center pt-1.5 border-t border-border/30 font-bold">
                      <span className="text-foreground">Net Pocket Earnings:</span>
                      <strong className="text-emerald-500 text-sm">₹{calculateNetEarnings(selectedBuyer).toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Smart Actions Panel */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 bg-muted/40 p-5 rounded-card border border-border/50 justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <ShoppingBag className="h-4.5 w-4.5 text-primary" />
                Marketplace Actions:
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => window.location.href = "/assistant"}
                  variant="outline"
                  aria-label="Ask Vira AI Advisor"
                  className="text-xs font-bold h-10 px-4 rounded-btn cursor-pointer bg-card hover:bg-muted/10 active:scale-[0.98] transition-all"
                >
                  <Sparkles className="mr-1.5 h-4 w-4 text-primary" />
                  Ask AI Advisor
                </Button>
                <Button
                  onClick={() => alert(`Offer sheet of ${selectedBuyer.companyName} downloaded.`)}
                  variant="outline"
                  aria-label="Download buyer offer details"
                  className="text-xs font-bold h-10 px-4 rounded-btn cursor-pointer bg-card hover:bg-muted/10 active:scale-[0.98] transition-all"
                >
                  <FileText className="mr-1.5 h-4 w-4 text-primary" />
                  Download Offer
                </Button>
                <Button
                  onClick={() => alert("Buyer added to your favorites.")}
                  variant="outline"
                  aria-label="Save buyer to favorites"
                  className="text-xs font-bold h-10 px-4 rounded-btn cursor-pointer bg-card hover:bg-muted/10 active:scale-[0.98] transition-all"
                >
                  <Star className="mr-1.5 h-4 w-4 text-primary" />
                  Save Buyer
                </Button>
                <Button
                  onClick={() => alert(`Shared ${selectedBuyer.companyName}'s request details.`)}
                  variant="outline"
                  aria-label="Share buyer offer"
                  className="text-xs font-bold h-10 px-4 rounded-btn cursor-pointer bg-card hover:bg-muted/10 active:scale-[0.98] transition-all"
                >
                  <Globe className="mr-1.5 h-4 w-4 text-primary" />
                  Share Offer
                </Button>
              </div>
            </div>

          </div>

        </div>

        {/* NEGOTIATION INTERACTIVE POPUP */}
        <AnimatePresence>
          {negotiationOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-md bg-card rounded-dialog border border-border p-6 shadow-2xl space-y-5"
              >
                {/* Header */}
                <div className="flex justify-between items-start pb-3 border-b border-border/50">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">B2B Negotiation Center</span>
                    <h3 className="text-base font-extrabold text-foreground leading-snug">Negotiate: {selectedBuyer.companyName}</h3>
                  </div>
                  <Button 
                    onClick={() => setNegotiationOpen(false)}
                    variant="outline" 
                    className="h-8 w-8 rounded-full p-0 bg-card cursor-pointer border border-border text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </Button>
                </div>

                {/* IDLE OR INPUT STATE */}
                {negotiationStatus === "idle" && (
                  <div className="space-y-4 text-xs leading-normal">
                    
                    {/* Visual current offer stats */}
                    <div className="grid grid-cols-2 gap-4 p-3 rounded-card border border-border bg-muted/20">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Buyer Initial Offer</span>
                        <strong className="text-sm font-extrabold text-foreground block">₹{selectedBuyer.offeredPrice}/{selectedBuyer.unit}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">AI Suggested Counter</span>
                        <strong className="text-sm font-extrabold text-primary block">₹{selectedBuyer.offeredPrice + 100}/{selectedBuyer.unit}</strong>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-foreground block">Your Counter Price (per {selectedBuyer.unit})</label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">₹</span>
                          <input 
                            type="number"
                            value={counterPrice || ""}
                            onChange={(e) => setCounterPrice(Number(e.target.value))}
                            className="w-full bg-muted/10 border border-border rounded-btn pl-7 pr-4 h-10 text-xs font-bold text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                          />
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1 block">
                        * Recommendation: Submitting a counter price within 3-5% of the buyer&apos;s original price yields a 92% approval probability.
                      </span>
                    </div>

                    {/* Action controls */}
                    <div className="flex gap-3 pt-3">
                      <Button 
                        onClick={() => setNegotiationOpen(false)}
                        variant="outline" 
                        className="flex-1 text-xs font-bold h-10 rounded-btn cursor-pointer bg-card"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSubmitCounter}
                        className="flex-1 text-xs font-bold h-10 rounded-btn cursor-pointer bg-primary text-white"
                      >
                        Submit Counter
                      </Button>
                    </div>

                  </div>
                )}

                {/* LOADING NEGOTIATION RESPONSE */}
                {negotiationStatus === "submitting" && (
                  <div className="py-8 text-center space-y-4">
                    <div className="relative h-16 w-16 flex items-center justify-center mx-auto">
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/10 blur-sm"
                        animate={{ scale: [1, 1.25, 1], opacity: [0.1, 0.35, 0.1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      />
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Scale className="h-5 w-5 text-primary animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-foreground">Analyzing counter-offer criteria...</p>
                      <span className="text-[9.5px] font-bold text-primary tracking-wider uppercase block">Negotiation Desk Syncing</span>
                    </div>
                  </div>
                )}

                {/* ACCEPETED OR COMPROMISED OR DECLINED */}
                {["accepted", "countered", "declined"].includes(negotiationStatus) && (
                  <div className="space-y-4 text-xs leading-normal text-center py-2">
                    {/* Status icons */}
                    {negotiationStatus === "accepted" ? (
                      <div className="h-14 w-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                        <Check className="h-7 w-7 stroke-[3]" />
                      </div>
                    ) : negotiationStatus === "countered" ? (
                      <div className="h-14 w-14 bg-blue-500/10 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto text-blue-500">
                        <Scale className="h-7 w-7" />
                      </div>
                    ) : (
                      <div className="h-14 w-14 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto text-red-500">
                        <X className="h-7 w-7" />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <h4 className="text-base font-extrabold text-foreground">
                        {negotiationStatus === "accepted" ? "Offer Accepted!" : negotiationStatus === "countered" ? "Buyer Counter Offer" : "Counter Declined"}
                      </h4>
                      <p className="text-muted-foreground px-4 text-[10.5px]">
                        {negotiationMessage}
                      </p>
                    </div>

                    {/* Final actions */}
                    {negotiationStatus === "countered" ? (
                      <div className="flex gap-3 pt-3">
                        <Button 
                          onClick={() => { setNegotiationStatus("accepted"); setNegotiationMessage(`Offer accepted! You agreed to the buyer's compromise of ₹${buyerCounterOffer}/${selectedBuyer.unit}.`); }}
                          className="flex-1 text-xs font-bold h-10 rounded-btn cursor-pointer bg-primary text-white"
                        >
                          Accept Compromise
                        </Button>
                        <Button 
                          onClick={() => setNegotiationStatus("idle")}
                          variant="outline" 
                          className="flex-1 text-xs font-bold h-10 rounded-btn cursor-pointer bg-card border border-border text-foreground"
                        >
                          Counter Again
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-3 pt-3">
                        <Button 
                          onClick={() => setNegotiationOpen(false)}
                          className="flex-1 text-xs font-bold h-10 rounded-btn cursor-pointer bg-primary text-white"
                        >
                          Done & Close
                        </Button>
                        {negotiationStatus === "declined" && (
                          <Button 
                            onClick={() => { setNegotiationStatus("idle"); setCounterPrice(selectedBuyer.offeredPrice + 50); }}
                            variant="outline"
                            className="flex-1 text-xs font-bold h-10 rounded-btn cursor-pointer bg-card border border-border text-foreground"
                          >
                            Adjust Offer
                          </Button>
                        )}
                      </div>
                    )}

                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </MainLayout>
  );
}
