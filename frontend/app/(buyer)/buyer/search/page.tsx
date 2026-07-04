"use client";

import * as React from "react";
import { BuyerLayout } from "@/components/layout/BuyerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Tag, ArrowRight, UserCheck, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchFarmersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCrop, setSelectedCrop] = React.useState("all");

  const farmers = [
    { id: 1, name: "Ramesh Patel", crop: "Sugarcane", grade: "Grade A", quantity: "15 Tons", location: "Pune, Maharashtra", status: "Verified" },
    { id: 2, name: "Suresh Deshmukh", crop: "Wheat", grade: "Lokwan", quantity: "8 Tons", location: "Nagpur, Maharashtra", status: "Verified" },
    { id: 3, name: "Amit Shinde", crop: "Banana", grade: "Organic", quantity: "4 Tons", location: "Jalgaon, Maharashtra", status: "Verified" },
    { id: 4, name: "Vikram Pawar", crop: "Wheat", grade: "Grade A", quantity: "20 Tons", location: "Kolhapur, Maharashtra", status: "Standard" },
  ];

  const filteredFarmers = farmers.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCrop = selectedCrop === "all" || f.crop.toLowerCase() === selectedCrop.toLowerCase();
    return matchesSearch && matchesCrop;
  });

  return (
    <BuyerLayout>
      <div className="space-y-6">
        {/* Title row */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            Direct B2B Sourcing
          </span>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Search Verified Farmers
          </h2>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-card p-4 rounded-card border border-border/60 shadow-sm">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search by farmer name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/30 border border-border rounded-input pl-10 pr-4 h-11 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-muted-foreground/60 transition-all duration-200"
            />
          </div>

          <div className="space-y-1">
            <select 
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full bg-muted/30 border border-border rounded-input px-3.5 h-11 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer transition-all duration-200"
            >
              <option value="all">All Crops</option>
              <option value="sugarcane">Sugarcane</option>
              <option value="wheat">Wheat</option>
              <option value="banana">Banana</option>
            </select>
          </div>

          <div className="space-y-1">
            <select 
              className="w-full bg-muted/30 border border-border rounded-input px-3.5 h-11 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer transition-all duration-200"
            >
              <option value="all">All Regions</option>
              <option value="pune">Pune District</option>
              <option value="nagpur">Nagpur District</option>
              <option value="jalgaon">Jalgaon District</option>
            </select>
          </div>
        </div>

        {/* Farmers List */}
        <div className="space-y-4">
          {filteredFarmers.length === 0 ? (
            <Card className="p-12 text-center text-xs text-muted-foreground">
              <Search className="h-8 w-8 text-primary/45 mx-auto mb-2.5" />
              No farmers matching search criteria.
            </Card>
          ) : (
            filteredFarmers.map((f) => (
              <Card key={f.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-sm transition-shadow">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-foreground text-sm flex items-center gap-1">
                      {f.name}
                      {f.status === "Verified" && (
                        <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </span>
                    <Badge variant={f.status === "Verified" ? "success" : "outline"} className="text-[8px] font-bold">
                      {f.status} Provider
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground flex flex-wrap gap-4">
                    <span className="flex items-center gap-1">
                      <Tag className="h-4 w-4 text-muted-foreground/60" /> Crop: <span className="font-bold text-foreground pl-0.5">{f.crop} ({f.grade})</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground/60" /> Location: <span className="font-bold text-foreground pl-0.5">{f.location}</span>
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col justify-between items-end gap-3 w-full sm:w-auto border-t sm:border-t-0 border-border/30 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase block">Available Stock</span>
                    <span className="text-base font-black text-primary">{f.quantity}</span>
                  </div>
                  
                  <Button 
                    onClick={() => router.push("/buyer/negotiation")}
                    className="text-[10.5px] font-bold h-8.5 px-3 rounded-btn cursor-pointer gap-1"
                  >
                    Initiate Direct Trade <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </BuyerLayout>
  );
}
