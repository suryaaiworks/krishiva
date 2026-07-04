"use client";

import * as React from "react";
import { BuyerLayout } from "@/components/layout/BuyerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, Truck, FileText, Download, 
  MapPin, Clock 
} from "lucide-react";

type OrderStatus = "Pending" | "Accepted" | "Completed" | "Cancelled";

export default function BuyerOrdersPage() {
  const [activeTab, setActiveTab] = React.useState<OrderStatus | "All">("All");

  const [orders, setOrders] = React.useState([
    { id: "ORD90210", crop: "Sugarcane (Grade A)", quantity: "15 Tons", total: "₹49,500", date: "Oct 04, 2026", status: "Accepted" as OrderStatus, farmer: "Ramesh Patel", address: "Pune Mandi, MH" },
    { id: "ORD90209", crop: "Wheat (Lokwan)", quantity: "8 Tons", total: "₹20,800", date: "Sep 28, 2026", status: "Completed" as OrderStatus, farmer: "Suresh Deshmukh", address: "Nagpur Storage, MH" },
    { id: "ORD90208", crop: "Organic Bananas", quantity: "4 Tons", total: "₹72,000", date: "Sep 22, 2026", status: "Completed" as OrderStatus, farmer: "Amit Shinde", address: "Jalgaon Hub, MH" },
    { id: "ORD90207", crop: "Sugarcane Raw", quantity: "10 Tons", total: "₹30,000", date: "Sep 15, 2026", status: "Cancelled" as OrderStatus, farmer: "Karan Johar", address: "Mumbai Yard, MH" },
  ]);

  const filteredOrders = activeTab === "All" 
    ? orders 
    : orders.filter(o => o.status === activeTab);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return <Badge variant="outline" className="bg-amber-500/5 text-amber-600 border-amber-500/20 text-[8.5px] font-bold">Pending</Badge>;
      case "Accepted":
        return <Badge variant="success" className="text-[8.5px] font-bold">Accepted</Badge>;
      case "Completed":
        return <Badge variant="success" className="bg-blue-500/5 text-blue-600 border-blue-500/20 text-[8.5px] font-bold">Completed</Badge>;
      case "Cancelled":
        return <Badge variant="outline" className="bg-rose-500/5 text-rose-600 border-rose-500/20 text-[8.5px] font-bold">Cancelled</Badge>;
    }
  };

  return (
    <BuyerLayout>
      <div className="space-y-6">
        {/* Title row */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            Procurement Ledger
          </span>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Active Orders & Dispatch status
          </h2>
        </div>

        {/* Tab filters */}
        <div className="flex flex-wrap gap-1.5 border-b border-border/40 pb-3">
          {([
            { id: "All", label: "All Orders" },
            { id: "Pending", label: "Pending" },
            { id: "Accepted", label: "Accepted" },
            { id: "Completed", label: "Completed" },
            { id: "Cancelled", label: "Cancelled" }
          ] as const).map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-[10.5px] font-bold rounded-btn transition-all cursor-pointer border ${
                  isSelected 
                    ? "bg-primary text-white border-primary" 
                    : "bg-card text-muted-foreground hover:bg-muted/10 border-border"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Orders list */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card className="p-12 text-center text-xs text-muted-foreground">
              <Clock className="h-8 w-8 text-primary/45 mx-auto mb-2.5 animate-pulse" />
              No orders found in this category.
            </Card>
          ) : (
            filteredOrders.map((ord) => (
              <Card key={ord.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-sm transition-shadow">
                
                {/* Order Info */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-foreground text-sm">Order #{ord.id}</span>
                    {getStatusBadge(ord.status)}
                    <span className="text-[10px] text-muted-foreground">{ord.date}</span>
                  </div>

                  <div className="text-xs text-muted-foreground grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                      <span>Crop: <span className="font-bold text-foreground">{ord.crop}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Truck className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                      <span>Farmer: <span className="font-bold text-foreground">{ord.farmer}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                      <span>Destination: <span className="font-bold text-foreground">{ord.address}</span></span>
                    </div>
                  </div>
                </div>

                {/* Pricing & Invoice Actions */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-border/30">
                  <div className="text-left md:text-right">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase block">Order Amount</span>
                    <span className="text-base font-black text-primary">{ord.total}</span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => alert(`Opening Invoice PDF for ${ord.id}...`)}
                      className="text-[10.5px] font-bold h-8 px-3 rounded-btn bg-card border border-border cursor-pointer flex items-center"
                    >
                      <FileText className="mr-1 h-3.5 w-3.5" /> View Invoice
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </BuyerLayout>
  );
}
