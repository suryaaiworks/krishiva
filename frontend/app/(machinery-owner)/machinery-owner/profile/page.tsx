"use client";

import * as React from "react";
import { MachineryOwnerLayout } from "@/components/layout/MachineryOwnerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export default function OwnerProfilePage() {
  return (
    <MachineryOwnerLayout>
      <div className="space-y-6">
        {/* Title row */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            Verification Center
          </span>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            My Partner Profile
          </h2>
        </div>

        {/* Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="h-20 w-20 bg-primary/10 rounded-full border border-primary/20 flex items-center justify-center text-primary font-black text-2xl">
              RK
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-foreground">Rajesh Kumar</h3>
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <ShieldCheck className="h-3 w-3 mr-0.5 shrink-0" /> Verified Partner
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Serving Pune and neighboring talukas with premium, well-maintained agricultural heavy machinery.
            </p>
          </Card>

          <Card className="lg:col-span-2 p-6 space-y-5 text-xs">
            <h3 className="text-base font-bold text-foreground pb-2 border-b border-border/40">Profile Particulars</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Full Legal Name</span>
                <span className="font-bold text-foreground block text-sm">Rajesh Kumar Deshmukh</span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Phone Number</span>
                <span className="font-bold text-foreground block text-sm">+91 98234 56789</span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Email Address</span>
                <span className="font-bold text-foreground block text-sm">owner@krishiva.ai</span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Primary Hub Location</span>
                <span className="font-bold text-foreground block text-sm">Haveli, Pune, MH</span>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Registered Bank Account</span>
                <span className="font-bold text-foreground block text-sm">State Bank of India (A/C: **********8493, IFSC: SBIN0001043)</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border/40 flex justify-end gap-3">
              <Button 
                onClick={() => alert("Verification portal coming soon.")}
                className="text-xs font-bold h-10 rounded-btn cursor-pointer px-4"
              >
                Edit Profile Info
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </MachineryOwnerLayout>
  );
}
