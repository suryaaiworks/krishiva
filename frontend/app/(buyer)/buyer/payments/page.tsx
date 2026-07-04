"use client";

import * as React from "react";
import { BuyerLayout } from "@/components/layout/BuyerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, ArrowUpRight, CheckCircle2, ShoppingBag 
} from "lucide-react";

export default function BuyerPaymentsPage() {
  const transactions = [
    { id: "TXN50129", date: "Oct 04, 2026", desc: "Sugarcane Direct Match Payout", type: "UPI Payment", amount: "₹49,500", status: "Settled" },
    { id: "TXN50128", date: "Sep 28, 2026", desc: "Wheat Procurement Payout", type: "Bank Transfer", amount: "₹20,800", status: "Settled" },
    { id: "TXN50127", date: "Sep 22, 2026", desc: "Bananas Sourcing Settlement", type: "UPI Payment", amount: "₹72,000", status: "Settled" },
  ];

  return (
    <BuyerLayout>
      <div className="space-y-6">
        {/* Title row */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            Financial Ledger
          </span>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Procurement Payments History
          </h2>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Total Disbursed</span>
              <span className="text-2xl font-black text-foreground">₹1,42,300</span>
              <span className="text-[9px] text-emerald-600 block flex items-center gap-0.5 mt-0.5">
                <ArrowUpRight className="h-3 w-3" /> +18.4% since last quarter
              </span>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-btn flex items-center justify-center text-primary">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Pending Settlement</span>
              <span className="text-2xl font-black text-foreground">₹0.00</span>
              <span className="text-[9px] text-muted-foreground block mt-0.5">
                All payouts processed
              </span>
            </div>
            <div className="h-12 w-12 bg-emerald-500/10 rounded-btn flex items-center justify-center text-emerald-600">
              <CreditCard className="h-6 w-6" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Tax invoices</span>
              <span className="text-2xl font-black text-foreground">15 <span className="text-xs font-normal text-muted-foreground">files</span></span>
              <span className="text-[9px] text-muted-foreground block mt-0.5">
                All direct match transactions
              </span>
            </div>
            <div className="h-12 w-12 bg-blue-500/10 rounded-btn flex items-center justify-center text-blue-600">
              <ShoppingBag className="h-6 w-6" />
            </div>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card className="p-6">
          <div className="flex justify-between items-center pb-3 border-b border-border/40 mb-4">
            <h3 className="text-base font-bold text-foreground">Disbursement Transactions Log</h3>
            <Badge variant="outline" className="text-[8.5px] font-bold">Encrypted</Badge>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border/30 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                  <th className="py-3 px-2">Transaction ID</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">Description</th>
                  <th className="py-3 px-2">Payment Method</th>
                  <th className="py-3 px-2">Disbursed Amount</th>
                  <th className="py-3 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 text-foreground font-medium">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-2 font-mono text-[11px] font-bold text-muted-foreground">{txn.id}</td>
                    <td className="py-3 px-2 text-muted-foreground">{txn.date}</td>
                    <td className="py-3 px-2 font-bold">{txn.desc}</td>
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
    </BuyerLayout>
  );
}
