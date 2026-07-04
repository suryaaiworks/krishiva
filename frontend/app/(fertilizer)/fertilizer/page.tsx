"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Sprout, ArrowLeft, Sparkles, ShieldCheck, 
  Info, Compass, Loader2
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function FertilizerAdvisorPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(false);

  const handleRecalculate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResult(true);
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-16">
        
        {/* Header Block */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-muted border border-border"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              Fertilizer Advisor <Sprout className="h-5 w-5 text-primary" />
            </h1>
            <p className="text-xs text-muted-foreground">
              Calculate optimal chemical and organic N-P-K ratios based on soil health parameters.
            </p>
          </div>
        </div>

        {/* Current Soil Nutrient Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="" animate={false} className="p-5 bg-card border border-border/80 shadow-sm text-left">
            <span className="text-[10px] font-bold text-muted-foreground block uppercase">Nitrogen (N)</span>
            <h3 className="text-2xl font-black text-foreground pt-1">4.2 <span className="text-xs font-semibold text-muted-foreground">mg/kg</span></h3>
            <Badge variant="outline" className="mt-2 text-primary border-primary/20 bg-primary/5 font-bold text-[9px]">Optimal</Badge>
          </Card>
          <Card title="" animate={false} className="p-5 bg-card border border-border/80 shadow-sm text-left">
            <span className="text-[10px] font-bold text-muted-foreground block uppercase">Phosphorus (P)</span>
            <h3 className="text-2xl font-black text-foreground pt-1">1.8 <span className="text-xs font-semibold text-muted-foreground">mg/kg</span></h3>
            <Badge variant="outline" className="mt-2 text-amber-600 border-amber-500/20 bg-amber-500/5 font-bold text-[9px]">Slightly Low</Badge>
          </Card>
          <Card title="" animate={false} className="p-5 bg-card border border-border/80 shadow-sm text-left">
            <span className="text-[10px] font-bold text-muted-foreground block uppercase">Potassium (K)</span>
            <h3 className="text-2xl font-black text-foreground pt-1">5.4 <span className="text-xs font-semibold text-muted-foreground">mg/kg</span></h3>
            <Badge variant="outline" className="mt-2 text-primary border-primary/20 bg-primary/5 font-bold text-[9px]">Optimal</Badge>
          </Card>
        </div>

        {/* AI Recommendations panel */}
        <Card title="" animate={false} className="p-6 bg-gradient-to-tr from-primary/10 via-card to-accent/5 border-primary/20 shadow-sm">
          <div className="flex items-start gap-3 text-xs leading-relaxed text-left">
            <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-extrabold text-foreground text-sm">Vira AI Fertilizer Recommendation</h4>
              <p className="text-muted-foreground leading-normal font-medium">
                To balance the phosphorus deficiency, apply **12 kg of Diammonium Phosphate (DAP)** or **25 kg of Single Superphosphate (SSP)** per acre. Add organic compost (neem cake) to Zone A to enhance nitrogen retention before sowing next week.
              </p>
              <div className="pt-2 border-t border-border/30 flex justify-between items-center text-[10px]">
                <span className="text-muted-foreground">Last Soil Test Date: **June 12, 2026**</span>
                <span className="text-primary font-bold cursor-pointer hover:underline" onClick={() => router.push("/profile")}>View Soil Report</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Dynamic Calculator Widget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="" animate={false} className="p-6 bg-card border border-border shadow-sm text-left space-y-4">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2">
              <Compass className="h-4.5 w-4.5 text-primary" />
              <h4 className="font-bold text-sm text-foreground">Fertilizer Calculator</h4>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-foreground">Target Crop Type</label>
                <select className="w-full bg-card px-3 py-2 border border-border rounded-btn focus:outline-none focus:ring-1 focus:ring-primary text-foreground">
                  <option value="sugarcane">Sugarcane (Grade A)</option>
                  <option value="cotton">Long Staple Cotton</option>
                  <option value="groundnut">Groundnut (TAG-24)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Farm Field Size (Acres)</label>
                <input 
                  type="number" 
                  defaultValue={5.5} 
                  className="w-full bg-transparent px-3 py-2 border border-border rounded-btn focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <Button
                onClick={handleRecalculate}
                className="w-full rounded-btn h-10 font-bold bg-primary text-white cursor-pointer"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : null}
                Calculate Ratios
              </Button>
            </div>
          </Card>

          {/* Results Display */}
          <Card title="" animate={false} className="p-6 bg-card border border-border shadow-sm text-left flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
                <h4 className="font-bold text-sm text-foreground">Output Ratios</h4>
              </div>

              <div className="space-y-3.5 text-xs text-muted-foreground leading-normal">
                {result ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                  >
                    <div className="flex justify-between py-1 border-b border-border/20">
                      <span className="font-medium text-foreground">Urea (Nitrogen Source):</span>
                      <strong className="text-foreground font-bold">45 kg (1 Bag)</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/20">
                      <span className="font-medium text-foreground">DAP (Phosphorus Source):</span>
                      <strong className="text-foreground font-bold">12 kg</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/20">
                      <span className="font-medium text-foreground">MOP (Muriate of Potash):</span>
                      <strong className="text-foreground font-bold">15 kg</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium text-foreground">Estimated Cost:</span>
                      <strong className="text-primary font-black">₹1,850</strong>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                    <Info className="h-8 w-8 text-muted-foreground/45 mb-2" />
                    <span>Run the calculator to generate crop-specific chemical blends.</span>
                  </div>
                )}
              </div>
            </div>

            {result && (
              <Button
                variant="outline"
                className="w-full rounded-btn h-9 font-bold bg-card border-border text-foreground hover:bg-muted"
                onClick={() => alert("Printing report...")}
              >
                Download Ratios Report
              </Button>
            )}
          </Card>
        </div>

      </div>
    </MainLayout>
  );
}
