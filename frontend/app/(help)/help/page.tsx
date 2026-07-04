"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  HelpCircle, Search, MessageSquare, Phone, ChevronDown, 
  Send, Bot, User, CheckCircle2, ArrowLeft
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FaqItem {
  q: string;
  a: string;
  category: "vira" | "crops" | "disease" | "mandi" | "schemes" | "relief";
}

const FAQS: FaqItem[] = [
  {
    category: "vira",
    q: "Who is Vira and how does she help me?",
    a: "Vira is your AI-powered agricultural copilot. She can assist with crop selection, soil nutrient reviews, weather forecasts, pest identifications, and direct B2B pricing queries. Tap the green microphone or Vira robot bubble to ask your questions using voice."
  },
  {
    category: "crops",
    q: "How does the Crop Advisor make recommendations?",
    a: "The Crop AdvisorStepper checks your geographic region (GPS/District), soil parameters (pH, texture), water availability, budget, and local mandi demand. It correlates this with regional cropping historical yields to find the highest-ROI crops."
  },
  {
    category: "disease",
    q: "What is the best way to scan crop leaves for disease?",
    a: "Select the 'Disease Scan' operations action, allow camera permissions, and snap a clean photo of the infected leaf area. Keep the camera focused on the leaf spots and capture in bright sunlight. The AI laser scanner will analyze cell spots and suggest chemical/organic treatments."
  },
  {
    category: "mandi",
    q: "Where does Krishiva get market mandi pricing?",
    a: "We pull spot market prices and daily bid volumes directly from state APMC Mandi database reports. Our AI forecasts price changes over the next 7 to 30 days based on weather cycles and regional crop logistics."
  },
  {
    category: "schemes",
    q: "How do I apply for eligible government subsidy schemes?",
    a: "Go to the 'Govt Schemes' tab, complete your land ownership eligibility filters, and check off the documents in the AI Document Assistant. Krishiva will pre-verify your documents and compile the docket to apply directly at your block Rythu office."
  },
  {
    category: "relief",
    q: "What should I do in case of a flood or natural disaster?",
    a: "Open the 'Relief Hub', execute an AI crop damage scanner upload to calculate crop loss percentage and compensation claims, and check pre-approved PMFBY insurance claims. You can also view nearby NGO distributions and alternative markets buying damaged residues."
  }
];

const CATEGORY_MAP = {
  all: { label: "All", value: "all" },
  weather: { label: "Weather", value: "weather" },
  market: { label: "Market", value: "mandi" },
  schemes: { label: "Schemes", value: "schemes" },
  disease: { label: "Disease", value: "disease" },
  machinery: { label: "Machinery", value: "machinery" },
  payments: { label: "Payments", value: "payments" },
  profile: { label: "Profile", value: "profile" },
  support: { label: "Support", value: "vira" },
  government: { label: "Government", value: "schemes" },
  crop: { label: "Crop", value: "crops" }
} as const;

export default function HelpPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<keyof typeof CATEGORY_MAP>("all");
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
  
  // Support Form State
  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: "", email: "", topic: "general", message: "" });
  
  // Live Chat Simulator State
  const [chatOpen, setChatOpen] = React.useState(false);
  const [chatMessages, setChatMessages] = React.useState([
    { sender: "ai", text: "Hello! I am Vira Support. How can I help resolve your technical issue today?" }
  ]);
  const [chatInput, setChatInput] = React.useState("");
  const [chatTyping, setChatTyping] = React.useState(false);

  const filteredFaqs = FAQS.filter(faq => {
    const targetVal = CATEGORY_MAP[selectedCategory].value;
    const matchesCategory = targetVal === "all" || faq.category === targetVal;
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", email: "", topic: "general", message: "" });
    }, 4000);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    setChatTyping(true);

    setTimeout(() => {
      setChatTyping(false);
      let reply = "I've recorded your concern. A technical support agent will review your session logs and follow up via SMS.";
      if (userMsg.toLowerCase().includes("soil") || userMsg.toLowerCase().includes("crop")) {
        reply = "To recalibrate your soil tests, navigate to your Profile page, click your registered plot card, and choose 'Edit Soil Values'.";
      } else if (userMsg.toLowerCase().includes("disease") || userMsg.toLowerCase().includes("scan")) {
        reply = "Foliage laser scans require clear image inputs. Make sure to clear your camera lens and avoid capturing shadow-covered leaves.";
      }
      setChatMessages(prev => [...prev, { sender: "ai", text: reply }]);
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
              Help & Support Center <HelpCircle className="h-5 w-5 text-primary" />
            </h1>
            <p className="text-xs text-muted-foreground">
              Find answers to agronomy queries, report technical issues, or start a live support session.
            </p>
          </div>
        </div>

        {/* Support Helplines and Shortcuts Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="" animate={false} className="p-5 border-l-4 border-l-primary flex flex-col justify-between bg-card shadow-sm border-t-0 border-r-0 border-b-0">
            <div className="space-y-1 text-left text-xs">
              <Phone className="h-5 w-5 text-primary mb-2" />
              <h4 className="font-bold text-foreground">Krishiva Helpline</h4>
              <p className="text-muted-foreground">Toll-free agricultural support desk (24x7)</p>
              <strong className="text-foreground text-sm block pt-1.5">1800-180-1551</strong>
            </div>
            <Button
              size="sm"
              onClick={() => alert("Dialing Toll-Free Helpline: 1800-180-1551")}
              className="mt-4 rounded-btn h-8 font-bold bg-primary text-white text-[10px] cursor-pointer"
            >
              Call Helpline
            </Button>
          </Card>

          <Card title="" animate={false} className="p-5 border-l-4 border-l-emerald-500 flex flex-col justify-between bg-card shadow-sm border-t-0 border-r-0 border-b-0">
            <div className="space-y-1 text-left text-xs">
              <MessageSquare className="h-5 w-5 text-emerald-500 mb-2" />
              <h4 className="font-bold text-foreground">Live Vira Support</h4>
              <p className="text-muted-foreground">Immediate interactive resolution window</p>
              <strong className="text-foreground text-sm block pt-1.5">Active (Avg 1 min response)</strong>
            </div>
            <Button
              size="sm"
              onClick={() => setChatOpen(true)}
              className="mt-4 rounded-btn h-8 font-bold bg-emerald-600 text-white text-[10px] cursor-pointer"
            >
              Start Live Chat
            </Button>
          </Card>

          <Card title="" animate={false} className="p-5 border-l-4 border-l-rose-500 flex flex-col justify-between bg-card shadow-sm border-t-0 border-r-0 border-b-0">
            <div className="space-y-1 text-left text-xs">
              <HelpCircle className="h-5 w-5 text-rose-500 mb-2" />
              <h4 className="font-bold text-foreground">Local RSK Offices</h4>
              <p className="text-muted-foreground">Book appointments with district specialists</p>
              <strong className="text-foreground text-sm block pt-1.5">Pune Shirur Zone active</strong>
            </div>
            <Button
              size="sm"
              onClick={() => router.push("/offices")}
              className="mt-4 rounded-btn h-8 font-bold bg-rose-500 text-white text-[10px] cursor-pointer"
            >
              Locate Center
            </Button>
          </Card>
        </div>

        {/* FAQs Panel */}
        <div className="space-y-4">
          <SectionHeader 
            title="Frequently Asked Questions" 
            description="Quick answers to common agricultural advisor operations." 
          />

          {/* Search bar and Filters */}
          <div className="flex flex-col gap-4 bg-card p-4 rounded-card border border-border/80 shadow-sm">
            {/* Search Box */}
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent pl-9.5 pr-4 py-2.5 border border-border rounded-input text-xs focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground text-foreground transition-all duration-200"
              />
            </div>

            {/* Filter Chips wrapped */}
            <div className="flex flex-wrap gap-1.5 py-1">
              {(Object.keys(CATEGORY_MAP) as Array<keyof typeof CATEGORY_MAP>).map((key) => {
                const cat = CATEGORY_MAP[key];
                return (
                  <Button
                    key={key}
                    size="sm"
                    onClick={() => setSelectedCategory(key)}
                    className={`h-8 px-3 text-[10px] font-bold rounded-btn cursor-pointer transition-all duration-200 ${
                      selectedCategory === key 
                        ? "bg-primary text-white shadow-sm" 
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {cat.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground bg-card border border-border rounded-card">
                No matching FAQ topics found for your search query.
              </div>
            ) : (
              filteredFaqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className="rounded-card border border-border/60 bg-card overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                    className="w-full p-4 flex justify-between items-center text-xs font-bold text-foreground text-left cursor-pointer hover:bg-muted/20"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expandedIndex === idx ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {expandedIndex === idx && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border/20 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contact Help Desk Form */}
        <div className="space-y-4">
          <SectionHeader 
            title="Submit a Ticket" 
            description="Cannot find answers? Send detailed logs directly to our support engineers." 
          />

          <Card title="" animate={false} className="p-6 bg-card border border-border shadow-sm">
            {formSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-3"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading text-lg font-bold text-foreground">Ticket Submitted!</h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    We have successfully queued your ticket. A Krishiva engineer will follow up on your registered phone number.
                  </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-foreground">FullName</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ramesh Patil"
                      className="w-full bg-transparent px-3.5 py-2.5 border border-border rounded-btn focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ramesh@gmail.com"
                      className="w-full bg-transparent px-3.5 py-2.5 border border-border rounded-btn focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Topic Category</label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full bg-card px-3.5 py-2.5 border border-border rounded-btn focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  >
                    <option value="general">General Agronomy Query</option>
                    <option value="disease">Crop Leaf Diagnostics Issue</option>
                    <option value="schemes">Government Schemes Documentation help</option>
                    <option value="b2b">B2B Buyer Contract Dispute</option>
                    <option value="tech">Software Bug Report</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Detailed Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details on soil status, borer pest severity or details on your missing PM-Kisan document..."
                    className="w-full bg-transparent px-3.5 py-2.5 border border-border rounded-btn focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground text-foreground resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-btn h-10 font-bold bg-primary text-white cursor-pointer text-xs"
                >
                  Submit Support Dossier
                </Button>
              </form>
            )}
          </Card>
        </div>

      </div>

      {/* LIVE CHAT DRAWER DIALOG OVERLAY */}
      <AnimatePresence>
        {chatOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:justify-end sm:p-6 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              className="bg-card border-t border-x sm:border border-border w-full sm:max-w-md h-[80vh] sm:h-[600px] rounded-t-[24px] sm:rounded-[24px] shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              {/* Header */}
              <div className="bg-primary text-white p-4 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                    <Bot className="h-4.5 w-4.5" />
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-xs block">Vira Support Live</span>
                    <span className="text-[9px] text-white/80 block flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                      Agent Online
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setChatOpen(false)}
                  className="h-8 w-8 rounded-full p-0 text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Message Streams */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin text-xs">
                {chatMessages.map((msg, idx) => (
                  <div 
                    key={idx}
                    className={`flex items-start gap-2.5 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                  >
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${msg.sender === "user" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                      {msg.sender === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                    </div>
                    <div className={`p-3 rounded-card leading-relaxed ${msg.sender === "user" ? "bg-primary text-white rounded-tr-none text-right" : "bg-muted text-foreground rounded-tl-none text-left"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {chatTyping && (
                  <div className="flex items-start gap-2.5 mr-auto max-w-[85%]">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-[9px]">
                      <Bot className="h-3 w-3" />
                    </div>
                    <div className="p-3 bg-muted text-muted-foreground rounded-card rounded-tl-none flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Panel */}
              <form onSubmit={handleSendChatMessage} className="p-3 border-t border-border flex items-center gap-2 bg-muted/20">
                <input
                  type="text"
                  placeholder="Type message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-card px-3.5 py-2 border border-border rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-primary text-white cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </MainLayout>
  );
}

// Inline close icon helper
function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
