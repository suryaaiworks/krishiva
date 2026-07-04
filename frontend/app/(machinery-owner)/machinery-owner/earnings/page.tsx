"use client";

import * as React from "react";
import { MachineryOwnerLayout } from "@/components/layout/MachineryOwnerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, CreditCard, ArrowUpRight, CheckCircle, 
  Download, Sparkles 
} from "lucide-react";

export default function EarningsPage() {
  const transactions = [
    { id: "TXN10293", date: "Oct 04, 2026", farmer: "Ramesh Patel", type: "UPI Transfer", amount: "₹9,600", status: "Settled" },
    { id: "TXN10292", date: "Oct 02, 2026", farmer: "Suresh Deshmukh", type: "UPI Transfer", amount: "₹5,600", status: "Settled" },
    { id: "TXN10291", date: "Sep 28, 2026", farmer: "Amit Shinde", type: "Bank Transfer", amount: "₹1,500", status: "Settled" },
  ];

  return (
    <MachineryOwnerLayout>
      <div className="space-y-6">
        {/* Title row */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
              Financial Registry
            </span>
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
              Earnings & Payouts
            </h2>
          </div>
          <Button 
            onClick={() => alert("Downloading Statement PDF...")}
            variant="outline" 
            className="text-xs font-bold gap-1.5 h-10 rounded-btn cursor-pointer bg-card"
          >
            <Download className="h-4 w-4" /> Download PDF Statement
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Total Payouts Settled</span>
              <span className="text-2xl font-black text-foreground">₹35,700</span>
              <span className="text-[9px] text-emerald-600 block flex items-center gap-0.5 mt-0.5">
                <ArrowUpRight className="h-3 w-3" /> +14.2% since last week
              </span>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-btn flex items-center justify-center text-primary">
              <CheckCircle className="h-6 w-6" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Pending Settlement</span>
              <span className="text-2xl font-black text-foreground">₹15,200</span>
              <span className="text-[9px] text-muted-foreground block mt-0.5">
                Settling in 24 hours
              </span>
            </div>
            <div className="h-12 w-12 bg-amber-500/10 rounded-btn flex items-center justify-center text-amber-600">
              <CreditCard className="h-6 w-6" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Total Earnings YTD</span>
              <span className="text-2xl font-black text-foreground">₹1,84,600</span>
              <span className="text-[9px] text-primary block flex items-center gap-0.5 mt-0.5 font-bold">
                <Sparkles className="h-3 w-3 animate-pulse" /> Top Partner Rank
              </span>
            </div>
            <div className="h-12 w-12 bg-blue-500/10 rounded-btn flex items-center justify-center text-blue-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </Card>
        </div>

        {/* Transactions list */}
        <Card className="p-6">
          <div className="flex justify-between items-center pb-3 border-b border-border/40 mb-4">
            <h3 className="text-base font-bold text-foreground">Recent Payout Transactions</h3>
            <Badge variant="outline" className="text-[8.5px] font-bold">Security: SSL Secured</Badge>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border/30 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                  <th className="py-3 px-2">Transaction ID</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">Farmer</th>
                  <th className="py-3 px-2">Payout Type</th>
                  <th className="py-3 px-2">Amount</th>
                  <th className="py-3 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 text-foreground font-medium">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-2 font-mono text-[11px] font-bold text-muted-foreground">{txn.id}</td>
                    <td className="py-3 px-2 text-muted-foreground">{txn.date}</td>
                    <td className="py-3 px-2 font-bold">{txn.farmer}</td>
                    <td className="py-3 px-2 text-muted-foreground">{txn.type}</td>
                    <td className="py-3 px-2 font-extrabold text-primary">{txn.amount}</td>
                    <td className="py-3 px-2 text-right">
                      <Badge variant="success" className="text-[8px] font-bold px-1.5 py-0">
                        {txn.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </MachineryOwnerLayout>
  );
}
