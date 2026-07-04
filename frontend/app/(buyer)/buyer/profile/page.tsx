"use client";

import * as React from "react";
import { BuyerLayout } from "@/components/layout/BuyerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export default function BuyerProfilePage() {
  return (
    <BuyerLayout>
      <div className="space-y-6">
        {/* Title row */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            Organization Identity
          </span>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Buyer Profile Details
          </h2>
        </div>

        {/* Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="h-20 w-20 bg-primary/10 rounded-full border border-primary/20 flex items-center justify-center text-primary font-black text-2xl">
              GB
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-foreground">Ganesh Bhide</h3>
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <ShieldCheck className="h-3 w-3 mr-0.5 shrink-0" /> Certified Procurement Buyer
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              B2B procurement specialist representing **Bhide Agri-Products Ltd.** Sourcing organic and Grade A grains/fruits directly from farm gates.
            </p>
          </Card>

          <Card className="lg:col-span-2 p-6 space-y-5 text-xs">
            <h3 className="text-base font-bold text-foreground pb-2 border-b border-border/40">Company Specifications</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Procurement Officer</span>
                <span className="font-bold text-foreground block text-sm">Ganesh Madhukar Bhide</span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Registered Entity</span>
                <span className="font-bold text-foreground block text-sm">Bhide Agri-Products Private Limited</span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Corporate GSTIN</span>
                <span className="font-bold text-foreground block text-sm">27AAACB4891Q1Z4 (Verified)</span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Contact Number</span>
                <span className="font-bold text-foreground block text-sm">+91 91234 56789</span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Email Address</span>
                <span className="font-bold text-foreground block text-sm">buyer@krishiva.ai</span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Billing Hub Address</span>
                <span className="font-bold text-foreground block text-sm">Plot 45, APMC Market Yard, Pune, MH</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border/40 flex justify-end gap-3">
              <Button 
                onClick={() => alert("Verification settings coming soon.")}
                className="text-xs font-bold h-10 rounded-btn cursor-pointer px-4"
              >
                Edit Corporate Info
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </BuyerLayout>
  );
}
