"use client";

import * as React from "react";
import { BuyerLayout } from "@/components/layout/BuyerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, User, Clock, ArrowRight, ShieldCheck, 
  Send, DollarSign, CheckCircle2, ChevronRight 
} from "lucide-react";

export default function NegotiationCenterPage() {
  const [messages, setMessages] = React.useState([
    { id: 1, sender: "farmer", text: "Hello! I saw your requirement. I have 15 Tons of Grade A Sugarcane. My price expectation is ₹3,400/Ton.", time: "Oct 04, 10:20 AM" },
    { id: 2, sender: "buyer", text: "Thanks for reaching out, Ramesh. I can offer ₹3,200/Ton for direct procurement with immediate loading.", time: "Oct 04, 11:15 AM" },
    { id: 3, sender: "farmer", text: "Direct procurement sounds good, but I can go down only to ₹3,300/Ton to cover harvesting labor costs.", time: "Oct 04, 11:30 AM" },
  ]);

  const [newMsg, setNewMsg] = React.useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg) return;

    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: "buyer",
        text: newMsg,
        time: "Just now"
      }
    ]);
    setNewMsg("");
  };

  const handleAcceptOffer = () => {
    alert("Offer accepted! Creating contract and invoice...");
  };

  return (
    <BuyerLayout>
      <div className="space-y-6">
        {/* Title row */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            Contract Negotiation
          </span>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Direct Trade Negotiation
          </h2>
        </div>

        {/* Info panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main timeline */}
          <Card className="lg:col-span-2 p-6 flex flex-col justify-between h-[520px] bg-card/40 backdrop-blur-md">
            <div className="space-y-4 flex-1 flex flex-col justify-between overflow-y-auto">
              
              {/* Header */}
              <div className="flex justify-between items-center pb-2.5 border-b border-border/40 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black text-xs">
                    RP
                  </div>
                  <div>
                    <span className="font-bold text-foreground text-xs block">Ramesh Patel (Farmer)</span>
                    <span className="text-[9px] text-muted-foreground flex items-center gap-0.5"><Clock className="h-3 w-3" /> Active 5m ago</span>
                  </div>
                </div>
                <Badge variant="success" className="text-[8px] font-bold px-1.5 py-0">98% Completion Rate</Badge>
              </div>

              {/* Chat Timeline list */}
              <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 scrollbar-thin select-text">
                {messages.map((msg) => {
                  const isBuyer = msg.sender === "buyer";
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex gap-3 max-w-[85%] ${isBuyer ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                    >
                      <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${isBuyer ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                        {isBuyer ? "ME" : "RP"}
                      </div>
                      <div className={`p-3 rounded-[16px] text-xs leading-relaxed ${isBuyer ? "bg-primary/10 text-foreground border border-primary/20 rounded-tr-none" : "bg-muted/30 text-foreground border border-border/30 rounded-tl-none"}`}>
                        <p>{msg.text}</p>
                        <span className="text-[8.5px] text-muted-foreground mt-1.5 block text-right">{msg.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input box */}
              <form onSubmit={handleSendMessage} className="pt-3 border-t border-border/40 flex gap-2 shrink-0 items-center">
                <input 
                  type="text" 
                  placeholder="Type message or input counter offer..."
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  className="flex-1 bg-muted/30 border border-border rounded-input px-3.5 h-10 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-muted-foreground/60"
                />
                <Button type="submit" size="icon" className="h-10 w-10 shrink-0 rounded-btn cursor-pointer flex items-center justify-center">
                  <Send className="h-4 w-4" />
                </Button>
              </form>

            </div>
          </Card>

          {/* Quick Counter Offer actions */}
          <Card className="p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-foreground pb-2 border-b border-border/40">Negotiation Summary</h3>

              <div className="space-y-3.5 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Crop Category:</span>
                  <span className="font-bold text-foreground">Sugarcane (Grade A)</span>
                </div>
                <div className="flex justify-between">
                  <span>Requested Stock:</span>
                  <span className="font-bold text-foreground">15 Tons</span>
                </div>
                <div className="flex justify-between">
                  <span>Original Ask:</span>
                  <span className="font-bold text-foreground">₹3,400/Ton</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span>Current Counter Offer:</span>
                  <span className="font-bold text-primary">₹3,300/Ton</span>
                </div>
                <div className="p-3 bg-primary/5 border border-primary/10 rounded-btn text-foreground font-semibold flex items-center justify-between">
                  <span>Estimated Total:</span>
                  <span className="text-sm font-black text-primary">₹49,500</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-6">
              <Button 
                onClick={handleAcceptOffer}
                className="w-full h-11 justify-center rounded-btn font-bold cursor-pointer transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-4.5 w-4.5" /> Accept counter offer (₹3,300)
              </Button>
              <Button 
                variant="outline"
                onClick={() => alert("Countering with custom price...")}
                className="w-full h-11 justify-center rounded-btn font-bold cursor-pointer transition-all bg-card border border-border"
              >
                Propose custom price
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </BuyerLayout>
  );
}
