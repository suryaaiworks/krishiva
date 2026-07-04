"use client";

import * as React from "react";
import { OwnerLayout } from "@/components/layout/OwnerLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageCircle, AlertTriangle, User } from "lucide-react";

export default function ReviewsPage() {
  const reviews = [
    { id: 1, author: "Ramesh Patel", rating: 5, date: "Sep 28, 2026", text: "John Deere tractor was in perfect condition. Delivered clean and fueled. Rajesh was very cooperative. Highly recommended!", machine: "John Deere 5050D" },
    { id: 2, author: "Suresh Deshmukh", rating: 4, date: "Sep 20, 2026", text: "Good service and timely delivery. The Mahindra Arjun tractor operated smoothly. Minor scratching on side bumper, otherwise great.", machine: "Mahindra Arjun 555" },
    { id: 3, author: "Amit Shinde", rating: 5, date: "Sep 12, 2026", text: "Rotavator tilled my soil wonderfully. Perfect tools for heavy clay cultivation.", machine: "Rotavator Heavy Duty" },
  ];

  return (
    <OwnerLayout>
      <div className="space-y-6">
        {/* Title row */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            Partner Feedback
          </span>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Reviews & Ratings
          </h2>
        </div>

        {/* Rating Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 flex flex-col justify-center items-center text-center space-y-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Average Rating</span>
            <span className="text-4xl font-black text-foreground">4.8 <span className="text-sm font-normal text-muted-foreground">/ 5</span></span>
            <div className="flex gap-1 text-amber-500">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current opacity-80" />
            </div>
            <span className="text-[10px] text-muted-foreground">Based on 18 rentals</span>
          </Card>

          <Card className="p-6 md:col-span-2 space-y-2.5 text-xs text-muted-foreground leading-normal">
            <h3 className="text-base font-bold text-foreground">Partner Ranking Status</h3>
            <p>
              Your score places you in the **Top 5% of Machinery Providers** in the Maharashtra region. Keep up the high ratings to receive priority bookings and lower service fee deductions.
            </p>
            <div className="flex gap-3 pt-2">
              <div className="p-2.5 rounded-btn bg-emerald-500/5 border border-emerald-500/10 text-emerald-800 dark:text-emerald-200 flex-1">
                <span className="font-extrabold text-foreground block">98% Match Rate</span>
                <span>Prompt responses to booking alerts.</span>
              </div>
              <div className="p-2.5 rounded-btn bg-emerald-500/5 border border-emerald-500/10 text-emerald-800 dark:text-emerald-200 flex-1">
                <span className="font-extrabold text-foreground block">Zero Cancellations</span>
                <span>No self-cancels in the last 60 days.</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((rev) => (
            <Card key={rev.id} className="p-5 space-y-3">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                    <User className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="font-bold text-foreground text-sm block">{rev.author}</span>
                    <span className="text-[10px] text-muted-foreground">{rev.date}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <div className="flex gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < rev.rating ? "fill-current" : "text-muted/30"}`} />
                    ))}
                  </div>
                  <Badge variant="outline" className="text-[8px] font-bold px-1.5 py-0">Machine: {rev.machine}</Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-1">
                &ldquo;{rev.text}&rdquo;
              </p>
            </Card>
          ))}
        </div>
      </div>
    </OwnerLayout>
  );
}
