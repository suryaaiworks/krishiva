"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, MapPin, Award, Clock, 
  Settings as SettingsIcon, Sprout, ShieldCheck, Plus, Edit2, 
  Download, Save, LogOut
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Farm {
  id: string;
  name: string;
  location: string;
  area: string;
  soilType: string;
  waterSource: string;
  currentCrop: string;
  healthScore: number;
}

interface CropHistoryItem {
  season: string;
  crop: string;
  yieldAmount: string;
  profit: string;
  weatherNotes: string;
  diseaseReports: string;
}

const mockFarms: Farm[] = [
  {
    id: "farm-1",
    name: "Pune Main Field",
    location: "Shirur Taluka, Pune",
    area: "5.5 Acres",
    soilType: "Clayey (Black Cotton)",
    waterSource: "Canal Gravity Gate",
    currentCrop: "Sugarcane (Co 86032)",
    healthScore: 92
  },
  {
    id: "farm-2",
    name: "Shirur Dryland",
    location: "Kharad Block, Pune",
    area: "3.0 Acres",
    soilType: "Sandy Loam",
    waterSource: "Rainfed / Borewell",
    currentCrop: "Groundnut (TAG-24)",
    healthScore: 88
  }
];

const mockHistory: CropHistoryItem[] = [
  {
    season: "Kharif 2025",
    crop: "Paddy (Basmati)",
    yieldAmount: "1.8 Tons / Acre",
    profit: "₹38,000",
    weatherNotes: "Normal monsoon precipitation. Delayed sowing by 10 days.",
    diseaseReports: "Minor leaf blast incident. Handled with copper oxychloride spray."
  },
  {
    season: "Rabi 2024-25",
    crop: "Wheat (HD 2189)",
    yieldAmount: "2.2 Tons / Acre",
    profit: "₹45,500",
    weatherNotes: "Favorable cool weather window. Optimal soil moisture.",
    diseaseReports: "No significant pest outbreaks or fungal rusts detected."
  },
  {
    season: "Kharif 2024",
    crop: "Sugarcane",
    yieldAmount: "35 Tons / Acre",
    profit: "₹1,25,000",
    weatherNotes: "Heavy rain alert in mid-August. Drained low fields.",
    diseaseReports: "Medium sugarcane rust infection. Bio-fungicide sprays applied."
  }
];

export default function ProfilePage() {
  const [farms, setFarms] = React.useState<Farm[]>(mockFarms);
  const [editFarmId, setEditFarmId] = React.useState<string | null>(null);

  // Edit Farm Form state
  const [farmForm, setFarmForm] = React.useState<Omit<Farm, "id">>({
    name: "",
    location: "",
    area: "",
    soilType: "",
    waterSource: "",
    currentCrop: "",
    healthScore: 90
  });

  const handleEditFarm = (farm: Farm) => {
    setEditFarmId(farm.id);
    setFarmForm({
      name: farm.name,
      location: farm.location,
      area: farm.area,
      soilType: farm.soilType,
      waterSource: farm.waterSource,
      currentCrop: farm.currentCrop,
      healthScore: farm.healthScore
    });
  };

  const handleSaveFarm = () => {
    if (!editFarmId) return;
    setFarms(prev => prev.map(f => f.id === editFarmId ? { ...f, ...farmForm } : f));
    setEditFarmId(null);
    alert("Farm details updated successfully.");
  };

  const handleAddFarm = () => {
    const newId = `farm-${Date.now()}`;
    const newFarm: Farm = {
      id: newId,
      name: `New Farm Field ${farms.length + 1}`,
      location: "Pune Block",
      area: "2.0 Acres",
      soilType: "Sandy Soil",
      waterSource: "Drip Kit Reservoir",
      currentCrop: "Maize",
      healthScore: 90
    };
    setFarms(prev => [...prev, newFarm]);
    alert("New farm registered in profile database.");
  };

  return (
    <MainLayout>
      <div className="space-y-8 pb-16 animate-fade-in">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <SectionHeader 
            title="Farmer Account Profile" 
            description="Manage your regional fields, historical crop registers, achievements, and account settings."
            className="mb-0"
          />
          <Button
            onClick={() => window.location.href = "/settings"}
            variant="outline"
            className="text-xs font-bold px-4 h-10 rounded-btn cursor-pointer bg-card self-start sm:self-auto"
          >
            <SettingsIcon className="mr-1.5 h-4 w-4 text-primary" />
            Edit Settings
          </Button>
        </div>

        {/* SECTION 1: PROFILE HERO OVERVIEW CARD */}
        <Card title="" animate={false} className="p-6 relative overflow-hidden bg-gradient-to-tr from-primary/10 via-card to-accent/5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left Avatar & Basic Info */}
            <div className="md:col-span-8 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              {/* Photo Avatar */}
              <div className="relative h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30 shrink-0">
                <User className="h-10 w-10 text-primary" />
                <Badge variant="success" className="absolute -bottom-1 -right-1 font-bold px-2 py-0.5 text-[8.5px] bg-primary text-white border-none">
                  Active
                </Badge>
              </div>

              <div className="space-y-2 text-xs leading-normal">
                <div className="space-y-0.5">
                  <h3 className="text-xl font-extrabold text-foreground">Ramesh Patil</h3>
                  <p className="text-primary font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5 justify-center sm:justify-start">
                    <ShieldCheck className="h-4 w-4" />
                    Verified Farmer ID: KA-2026-89104
                  </p>
                </div>

                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 text-muted-foreground text-[11px] pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    Shirur Village, Pune
                  </span>
                  <span>•</span>
                  <span>15 Years Experience</span>
                </div>
              </div>
            </div>

            {/* Right Profile Completion status */}
            <div className="md:col-span-4 space-y-3 bg-card p-4 rounded-card border border-border/60 shadow-sm text-xs leading-normal">
              <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase">
                <span>Profile Completion</span>
                <span className="text-primary">85% Complete</span>
              </div>
              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "85%" }} />
              </div>
              <p className="text-[10px] text-muted-foreground/90">
                Attach soil reports to complete your profile and unlock certified seed subsidies eligibility checks.
              </p>
            </div>

          </div>

          {/* Core Profile Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 mt-6 border-t border-border/40 text-xs text-center">
            <div className="space-y-0.5 border-r border-border/40">
              <span className="text-muted-foreground block text-[9.5px] font-bold uppercase">Registered Farms</span>
              <strong className="text-base font-extrabold text-foreground">{farms.length} Fields</strong>
            </div>
            <div className="space-y-0.5 sm:border-r border-border/40">
              <span className="text-muted-foreground block text-[9.5px] font-bold uppercase">Total Land Holdings</span>
              <strong className="text-base font-extrabold text-foreground">8.5 Acres</strong>
            </div>
            <div className="space-y-0.5 border-r border-border/40">
              <span className="text-muted-foreground block text-[9.5px] font-bold uppercase">Primary Crops</span>
              <strong className="text-base font-extrabold text-foreground">Sugarcane, Groundnut</strong>
            </div>
            <div className="space-y-0.5">
              <span className="text-muted-foreground block text-[9.5px] font-bold uppercase">DBT Account Linked</span>
              <strong className="text-base font-extrabold text-emerald-500">SBI Bank Verified</strong>
            </div>
          </div>
        </Card>

        {/* SECTION 2: FARM MANAGEMENT GRID */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 pb-1">
            <div className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-primary" />
              <h3 className="text-base font-bold text-foreground">Registered Farm Management</h3>
            </div>
            <Button 
              onClick={handleAddFarm}
              size="sm" 
              className="text-xs font-bold rounded-btn bg-primary text-white cursor-pointer"
            >
              <Plus className="mr-1 h-3.5 w-3.5 shrink-0" />
              Add New Farm
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {farms.map((farm) => (
              <div 
                key={farm.id}
                className="p-5 rounded-card border border-border bg-card flex flex-col justify-between min-h-[220px] hover:border-primary/30 transition-all shadow-sm text-xs leading-relaxed"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="font-extrabold text-sm text-foreground tracking-tight">{farm.name}</h4>
                    <Badge variant="success" className="font-bold text-[8.5px] px-2 py-0.5 shrink-0 bg-primary/10 text-primary border-none">
                      {farm.healthScore}% Health
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10.5px] text-muted-foreground pt-1.5">
                    <span>Location: <strong className="text-foreground">{farm.location}</strong></span>
                    <span>Area: <strong className="text-foreground">{farm.area}</strong></span>
                    <span>Soil Type: <strong className="text-foreground">{farm.soilType}</strong></span>
                    <span>Water: <strong className="text-foreground">{farm.waterSource}</strong></span>
                  </div>

                  <p className="text-muted-foreground text-[10.5px] pt-1">
                    Current Sowing Crop: <strong className="text-foreground">{farm.currentCrop}</strong>
                  </p>
                </div>

                <div className="pt-3 border-t border-border/30 flex justify-between items-center text-[10.5px] text-muted-foreground">
                  <span className="flex items-center gap-1 text-[10px]">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    Last Updated: Today
                  </span>
                  <Button 
                    onClick={() => handleEditFarm(farm)}
                    size="sm" 
                    variant="outline"
                    className="h-7 px-2.5 rounded-btn cursor-pointer bg-card text-[9.5px] font-bold"
                  >
                    <Edit2 className="mr-1 h-3 w-3 text-primary" />
                    Edit Farm
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: CROP HISTORY TIMELINE & ACHIEVEMENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Crop History Timeline (Col Span 7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 pb-1">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-base font-bold text-foreground">Seasonal Crop History Log</h3>
            </div>

            <div className="relative pl-6 border-l border-border/80 ml-2.5 space-y-6">
              {mockHistory.map((item, idx) => (
                <div key={idx} className="relative text-xs leading-normal">
                  {/* Timeline dot */}
                  <span className="absolute -left-[30px] top-0 h-4 w-4 rounded-full bg-card border-2 border-primary flex items-center justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </span>

                  <div className="bg-card border border-border p-4 rounded-card space-y-3 shadow-sm">
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-extrabold text-foreground text-sm">{item.season}</span>
                      <Badge className="bg-primary/10 text-primary border-none text-[9px] font-extrabold px-2.5">
                        {item.crop}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[10.5px] text-muted-foreground">
                      <span>Harvest Yield: <strong className="text-foreground">{item.yieldAmount}</strong></span>
                      <span>Net Profit: <strong className="text-emerald-500 font-bold">{item.profit}</strong></span>
                    </div>

                    <div className="space-y-1 text-[10.5px] border-t border-border/20 pt-2 text-muted-foreground">
                      <p>
                        <strong className="text-foreground">Weather conditions:</strong> {item.weatherNotes}
                      </p>
                      <p>
                        <strong className="text-foreground">Pests & Diseases:</strong> {item.diseaseReports}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements & Badges (Col Span 5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 pb-1">
              <Award className="h-5 w-5 text-primary" />
              <h3 className="text-base font-bold text-foreground">Farming Milestones & Badges</h3>
            </div>

            <div className="bg-card border border-border p-5 rounded-card space-y-4 shadow-sm">
              <div className="grid grid-cols-1 gap-3.5 text-xs">
                
                {/* Badge 1 */}
                <div className="flex gap-3 items-center p-3 rounded-btn border border-border/60 bg-muted/20">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0">
                    <Sprout className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bold block text-[11px] text-foreground">Climate Sentinel</span>
                    <span className="text-[9.5px] text-muted-foreground">Followed 10 successive weather alerts correctly.</span>
                  </div>
                </div>

                {/* Badge 2 */}
                <div className="flex gap-3 items-center p-3 rounded-btn border border-border/60 bg-muted/20">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500 shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bold block text-[11px] text-foreground">Pest spotter Champion</span>
                    <span className="text-[9.5px] text-muted-foreground">Successfully diagnosed 5 crop diseases via AI scans.</span>
                  </div>
                </div>

                {/* Badge 3 */}
                <div className="flex gap-3 items-center p-3 rounded-btn border border-border/60 bg-muted/20">
                  <div className="h-10 w-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bold block text-[11px] text-foreground">Water Conservator</span>
                    <span className="text-[9.5px] text-muted-foreground">Adopted sub-surface drip irrigation systems.</span>
                  </div>
                </div>

              </div>

              <div className="pt-2 text-[10px] text-muted-foreground text-center">
                * Badges earned by participating in Google AI Hackathon tasks.
              </div>
            </div>

            {/* Smart Actions Panel */}
            <div className="bg-card border border-border p-5 rounded-card space-y-3.5 shadow-sm text-xs leading-normal">
              <h4 className="font-bold text-foreground">Export Account Reports</h4>
              
              <div className="space-y-2">
                <Button
                  onClick={() => alert("Preparing download... Crop yields dossier ready as PDF.")}
                  variant="outline"
                  className="w-full text-xs font-bold h-9 rounded-btn cursor-pointer bg-card justify-start"
                >
                  <Download className="mr-2 h-4 w-4 text-primary shrink-0" />
                  Download Crop Yields Report
                </Button>
                <Button
                  onClick={() => alert("Account preferences backed up to cloud servers.")}
                  variant="outline"
                  className="w-full text-xs font-bold h-9 rounded-btn cursor-pointer bg-card justify-start"
                >
                  <Save className="mr-2 h-4 w-4 text-primary shrink-0" />
                  Backup Profile Dossier
                </Button>
                <Button
                  onClick={() => window.location.href = "/login"}
                  variant="outline"
                  className="w-full text-xs font-bold h-9 rounded-btn cursor-pointer bg-card justify-start text-red-500 hover:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4 text-red-500 shrink-0" />
                  Sign Out Account
                </Button>
              </div>
            </div>

          </div>

        </div>

        {/* EDIT FARM DETAIL DIALOG POPUP */}
        <AnimatePresence>
          {editFarmId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-md bg-card rounded-dialog border border-border p-6 shadow-2xl space-y-5"
              >
                {/* Header */}
                <div className="flex justify-between items-start pb-3 border-b border-border/50">
                  <h3 className="text-base font-extrabold text-foreground">Edit Farm Details</h3>
                  <Button 
                    onClick={() => setEditFarmId(null)}
                    variant="outline" 
                    className="h-8 w-8 rounded-full p-0 bg-card cursor-pointer border border-border text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-4 text-xs leading-normal">
                  {/* Farm Name */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">Farm Field Name</label>
                    <input 
                      type="text"
                      value={farmForm.name}
                      onChange={(e) => setFarmForm({ ...farmForm, name: e.target.value })}
                      className="w-full bg-muted/10 border border-border rounded-btn px-3 h-10 text-xs font-bold text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  {/* Area */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">Farm Area Size</label>
                    <input 
                      type="text"
                      value={farmForm.area}
                      onChange={(e) => setFarmForm({ ...farmForm, area: e.target.value })}
                      className="w-full bg-muted/10 border border-border rounded-btn px-3 h-10 text-xs font-bold text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  {/* Soil Type */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">Soil Type</label>
                    <input 
                      type="text"
                      value={farmForm.soilType}
                      onChange={(e) => setFarmForm({ ...farmForm, soilType: e.target.value })}
                      className="w-full bg-muted/10 border border-border rounded-btn px-3 h-10 text-xs font-bold text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  {/* Current Crop */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">Active Sowing Crop</label>
                    <input 
                      type="text"
                      value={farmForm.currentCrop}
                      onChange={(e) => setFarmForm({ ...farmForm, currentCrop: e.target.value })}
                      className="w-full bg-muted/10 border border-border rounded-btn px-3 h-10 text-xs font-bold text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  {/* Action controls */}
                  <div className="flex gap-3 pt-3">
                    <Button 
                      onClick={() => setEditFarmId(null)}
                      variant="outline" 
                      className="flex-1 text-xs font-bold h-10 rounded-btn cursor-pointer bg-card"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSaveFarm}
                      className="flex-1 text-xs font-bold h-10 rounded-btn cursor-pointer bg-primary text-white"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </MainLayout>
  );
}
