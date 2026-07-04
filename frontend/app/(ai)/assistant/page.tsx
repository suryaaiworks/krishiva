"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Camera, Image as ImageIcon, MapPin, Send, Mic, 
  Globe, Loader2, PhoneCall, Award, RefreshCw, X
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { WeatherCard } from "@/components/weather/WeatherCard";
import { CropCard } from "@/components/crop/CropCard";
import { MarketCard } from "@/components/market/MarketCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Chip } from "@/components/ui/chip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Chat message interface
interface Message {
  id: string;
  sender: "user" | "ai";
  text?: string;
  timestamp: string;
  cardType?: "weather" | "crop" | "market" | "disease" | "scheme" | "relief";
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "ai",
    text: "Hello Ramesh! I am your Vira AI Advisor. How can I help your farm today? You can ask me for crop suggestions, weather forecasts, market prices, or upload crop leaf photos to diagnose diseases.",
    timestamp: "10:15 AM",
  },
];

export default function AssistantPage() {
  const [messages, setMessages] = React.useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [language, setLanguage] = React.useState("en");
  const [isVoiceActive, setIsVoiceActive] = React.useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  // Auto scroll to chat bottom
  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendText = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    triggerAiResponse(textToSend);
  };

  const triggerAiResponse = (userQuery: string) => {
    setIsTyping(true);

    // Mock AI reasoning based on query keywords
    setTimeout(() => {
      setIsTyping(false);
      const query = userQuery.toLowerCase();
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      if (query.includes("weather") || query.includes("rain")) {
        aiMsg.cardType = "weather";
        aiMsg.text = "I checked today's meteorological updates. A dry spell warning is active for Pune. Here are the climate metrics:";
      } else if (query.includes("crop") || query.includes("recommend")) {
        aiMsg.cardType = "crop";
        aiMsg.text = "Based on your clayey soil test and low watering conditions, Sugarcane is your highest matching crop. Here are the crop attributes:";
      } else if (query.includes("market") || query.includes("price") || query.includes("mandi")) {
        aiMsg.cardType = "market";
        aiMsg.text = "Here are today's verified market highlights from the Pune APMC Mandi index:";
      } else if (query.includes("disease") || query.includes("diagnose") || query.includes("leaf")) {
        aiMsg.cardType = "disease";
        aiMsg.text = "Analysis complete! I found signs of leaf rust infection. Here is the diagnosis summary and chemical treatment plan:";
      } else if (query.includes("scheme") || query.includes("government") || query.includes("subsidy")) {
        aiMsg.cardType = "scheme";
        aiMsg.text = "I searched the government scheme portal. Based on your 8.5-acre sugarcane farm, you qualify for disaster seed compensations:";
      } else if (query.includes("relief") || query.includes("disaster") || query.includes("damage")) {
        aiMsg.cardType = "relief";
        aiMsg.text = "Here is your personalized recovery plan to manage crop damage, connect with buyers, and obtain seed support:";
      } else {
        aiMsg.text = `Thank you for asking about &quot;${userQuery}&quot;. At this moment, my primary support modules focus on crop selection, disease scans, APMC mandi pricing, and disaster relief schemes. Please ask a related query.`;
      }

      setMessages((prev) => [...prev, aiMsg]);
    }, 1800);
  };

  const toggleVoiceMode = () => {
    const nextState = !isVoiceActive;
    setIsVoiceActive(nextState);
    if (nextState) {
      // Simulate recording voice query
      setTimeout(() => {
        setIsVoiceActive(false);
        handleSendText("Show today's market prices.");
      }, 3500);
    }
  };

  return (
    <MainLayout>
      <div className="relative h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] flex flex-col justify-between overflow-hidden bg-background">
        
        {/* HEADER BAR (AVATAR & LANGUAGE SELECT) */}
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Vira AI Assistant</h2>
              <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active (Gemini 2.5)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground hidden sm:block" />
            <Select value={language} onValueChange={(val) => { if (val) setLanguage(val); }}>
              <SelectTrigger className="w-[100px] h-8 text-[11px] font-bold rounded-btn border border-border">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* CHAT CONVERSATION AREA */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {/* Avatars */}
                <Avatar className="h-8 w-8 border border-border/50 shrink-0 shadow-sm">
                  <AvatarFallback className={isUser ? "bg-primary text-primary-foreground text-xs font-bold" : "bg-muted text-muted-foreground text-xs font-bold"}>
                    {isUser ? "R" : "AI"}
                  </AvatarFallback>
                </Avatar>

                {/* Message bubble */}
                <div className="space-y-3">
                  <div
                    className={`p-4 rounded-card text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-card text-foreground rounded-tl-none border border-border"
                    }`}
                  >
                    {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
                  </div>

                  {/* Render Custom Structured Cards */}
                  {!isUser && msg.cardType && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full max-w-sm mt-1"
                    >
                      {msg.cardType === "weather" && (
                        <WeatherCard
                          location="Pune Farm, Maharashtra"
                          temperature="28°C"
                          condition="Cloudy Sky"
                          humidity="62%"
                          windSpeed="14 km/h"
                          rainProbability="10%"
                          alertMessage="Dry spell warning active starting tomorrow."
                          className="border border-border bg-card shadow-sm"
                        />
                      )}

                      {msg.cardType === "crop" && (
                        <CropCard
                          cropName="Sugarcane (Co 86032)"
                          category="Cash Crop"
                          matchPercentage={92}
                          soilType="Clayey Loam"
                          waterRequirement="High Irrigation"
                          season="Kharif/Annual"
                          onSelect={() => handleSendText("Show growth steps for Sugarcane.")}
                        />
                      )}

                      {msg.cardType === "market" && (
                        <MarketCard
                          cropName="Sugarcane (Grade A)"
                          marketName="Pune APMC Mandi"
                          price="₹3,400"
                          priceChange="+₹120 (+3.6%)"
                          trend="up"
                          onDetailsClick={() => handleSendText("Show price trend graphs.")}
                        />
                      )}

                      {msg.cardType === "disease" && (
                        <Card title="" animate={false} className="p-5 border-l-4 border-l-destructive bg-card shadow-sm">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-destructive uppercase tracking-wider">
                                Disease diagnosis scan
                              </span>
                              <Badge variant="destructive" className="text-[10px] font-bold px-1.5 py-0">
                                94% Confidence
                              </Badge>
                            </div>
                            <h3 className="text-base font-bold text-foreground">Sugarcane Rust</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              Symptom: Orange-brown pustules on leaves, causing premature leaf drying and reduction in cane weight.
                            </p>
                            <div className="rounded-btn bg-muted/50 p-3 border border-border/50 text-xs space-y-1.5">
                              <span className="font-bold text-foreground block">Treatment plan:</span>
                              <div>1. Spray Mancozeb (0.2%) or Propiconazole (0.1%) at 15-day intervals.</div>
                              <div>2. Uproot and burn heavily infected leaves.</div>
                            </div>
                            <div className="flex items-center gap-2 pt-1.5">
                              <Button
                                onClick={() => alert("Escalated to RSK Pune Center. Officer will verify.")}
                                className="flex-1 text-[10px] font-bold h-8 rounded-btn cursor-pointer bg-primary"
                              >
                                <PhoneCall className="mr-1 h-3.5 w-3.5" />
                                Escalate to RSK
                              </Button>
                            </div>
                          </div>
                        </Card>
                      )}

                      {msg.cardType === "scheme" && (
                        <Card title="" animate={false} className="p-5 border-l-4 border-l-primary bg-card shadow-sm">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div className="space-y-0.5">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                                  Eligible Subsidy
                                </span>
                                <h3 className="text-sm font-bold text-foreground">PM-Kisan Disaster Compensation</h3>
                              </div>
                              <Award className="h-6 w-6 text-primary" />
                            </div>
                            <div className="text-xs space-y-2 py-1.5 border-y border-border/50">
                              <div className="flex justify-between"><span className="text-muted-foreground">Cash Benefit:</span><span className="font-bold text-foreground">₹6,000 / Year + Seed Subsidy</span></div>
                              <div className="flex justify-between"><span className="text-muted-foreground">Land Limit:</span><span className="font-bold text-foreground">&lt; 2 Hectares</span></div>
                            </div>
                            <div className="space-y-1.5 text-xs text-muted-foreground">
                              <span className="font-bold text-foreground block">Required Documents:</span>
                              <div>✓ Aadhaar verification card</div>
                              <div>✓ Land ownership registration certificate</div>
                            </div>
                            <Button 
                              onClick={() => alert("Mock Application submitted.")}
                              className="w-full text-xs font-bold h-8 rounded-btn cursor-pointer"
                            >
                              Apply Online
                            </Button>
                          </div>
                        </Card>
                      )}

                      {msg.cardType === "relief" && (
                        <Card title="" animate={false} className="p-5 border-l-4 border-l-emerald-600 bg-card shadow-sm">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div className="space-y-0.5">
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                                  AI Damage Assessment
                                </span>
                                <h3 className="text-sm font-bold text-foreground">Farmer Recovery Plan</h3>
                              </div>
                              <RefreshCw className="h-5 w-5 text-emerald-600 animate-spin-slow" />
                            </div>
                            <div className="text-xs space-y-2 py-1 border-b border-border/50">
                              <div className="flex justify-between"><span className="text-muted-foreground">Recovery Cost:</span><span className="font-bold text-foreground">₹8,500 / Acre</span></div>
                              <div className="flex justify-between"><span className="text-muted-foreground">Estimated Time:</span><span className="font-bold text-foreground">3 Months</span></div>
                            </div>
                            <div className="space-y-1.5 text-xs text-muted-foreground">
                              <span className="font-bold text-foreground block">Seed Assistance (NGO partnered):</span>
                              <p className="leading-relaxed">Free seed kits available at nearest RSK center (partnered with Agririse NGO).</p>
                            </div>
                            <div className="space-y-1.5 text-xs text-muted-foreground pt-1.5 border-t border-border/50">
                              <span className="font-bold text-foreground block">Alternative Residue Buyer:</span>
                              <div className="flex justify-between items-center gap-2">
                                <span>Pune Animal Feed Co.</span>
                                <Badge className="text-[9px] font-bold px-1.5 py-0 bg-emerald-500">₹1,400 / Qtl</Badge>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-1">
                              <Button onClick={() => alert("Seed request registered.")} className="flex-1 text-[10px] font-bold h-8 rounded-btn cursor-pointer bg-primary">Claim Seed Kit</Button>
                              <Button onClick={() => alert("Contacted buyer.")} variant="outline" className="flex-1 text-[10px] font-bold h-8 rounded-btn cursor-pointer">Contact Buyer</Button>
                            </div>
                          </div>
                        </Card>
                      )}
                    </motion.div>
                  )}
                  <span className={`text-[9px] text-muted-foreground block ${isUser ? "text-right" : "text-left"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <Avatar className="h-8 w-8 border border-border/50 shrink-0 shadow-sm">
                <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold">
                  AI
                </AvatarFallback>
              </Avatar>
              <div className="bg-card text-foreground border border-border p-4 rounded-card rounded-tl-none shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* SUGGESTED CHIPS AREA */}
        <div className="py-2.5 space-y-1.5 border-t border-border/50">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block px-1">
            Suggested Queries
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
            <Chip onClick={() => handleSendText("Diagnose my crop disease.")} className="shrink-0 cursor-pointer">
              🔬 Diagnose disease
            </Chip>
            <Chip onClick={() => handleSendText("Recommend crops for clayey loam soil.")} className="shrink-0 cursor-pointer">
              🌾 Recommend crops
            </Chip>
            <Chip onClick={() => handleSendText("Show today's market prices.")} className="shrink-0 cursor-pointer">
              📈 Market prices
            </Chip>
            <Chip onClick={() => handleSendText("Show local weather summaries.")} className="shrink-0 cursor-pointer">
              🌦 Weather summary
            </Chip>
            <Chip onClick={() => handleSendText("Am I eligible for PM-Kisan scheme?")} className="shrink-0 cursor-pointer">
              📋 Govt schemes
            </Chip>
            <Chip onClick={() => handleSendText("Generate a relief recovery plan.")} className="shrink-0 cursor-pointer">
              ❤️ Disaster relief
            </Chip>
          </div>
        </div>

        {/* INPUT FORM BAR WITH ATTACHMENTS */}
        <div className="flex flex-col gap-2 pt-2 border-t border-border bg-background pb-3">
          <div className="flex items-center gap-3">
            {/* Attachment Bar Options */}
            <div className="flex items-center gap-1 border-r border-border pr-2 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => alert("Mock Action: Open Camera for plant scanning.")}
                className="h-8 w-8 rounded-btn hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                title="Camera"
              >
                <Camera className="h-4.5 w-4.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => alert("Mock Action: Browse photo gallery.")}
                className="h-8 w-8 rounded-btn hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                title="Gallery"
              >
                <ImageIcon className="h-4.5 w-4.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => alert("Mock Action: Access GPS coordinates.")}
                className="h-8 w-8 rounded-btn hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                title="Location"
              >
                <MapPin className="h-4.5 w-4.5" />
              </Button>
            </div>

            {/* Input Form Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendText(inputValue);
              }}
              className="flex-1 flex items-center gap-2 bg-card border border-border p-1.5 rounded-full shadow-sm"
            >
              <input
                type="text"
                placeholder="Ask Vira..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-transparent px-3 text-xs focus:outline-none placeholder:text-muted-foreground text-foreground"
              />
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={toggleVoiceMode}
                className="h-8 w-8 rounded-full hover:bg-primary/10 text-primary cursor-pointer shrink-0"
              >
                <Mic className="h-4 w-4" />
              </Button>

              <Button
                type="submit"
                size="icon"
                className="h-8 w-8 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm cursor-pointer shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
        </div>

        {/* VOICE PANEL OVERLAY */}
        <AnimatePresence>
          {isVoiceActive && (
            <motion.div
              className="absolute inset-x-0 bottom-0 z-50 bg-slate-950 text-white rounded-t-card border-t border-white/10 p-6 flex flex-col items-center justify-between space-y-6"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-bold text-primary tracking-wider uppercase">
                  Voice Assistant Mode
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsVoiceActive(false)}
                  className="h-8 w-8 rounded-full text-white hover:bg-white/10 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Listening text */}
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold animate-pulse">Listening...</h3>
                <p className="text-xs text-slate-400">Say your farming question aloud</p>
              </div>

              {/* Waveform Micro-indicator */}
              <div className="flex items-center gap-1.5 h-12">
                {[...Array(6)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 bg-primary rounded-full"
                    animate={{
                      height: [12, 40, 12],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.2,
                      delay: i * 0.15,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              {/* Central Mic Ripple Close */}
              <div className="relative flex flex-col items-center gap-3">
                {/* Simulated waves */}
                <motion.div
                  className="absolute h-16 w-16 rounded-full bg-primary/20"
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                />
                <button
                  type="button"
                  onClick={() => setIsVoiceActive(false)}
                  className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg cursor-pointer"
                >
                  <Loader2 className="h-5 w-5 animate-spin" />
                </button>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-1.5">
                  Tap to cancel
                </span>
              </div>

              {/* Helper query suggestions */}
              <p className="text-[10px] text-slate-500 font-semibold text-center italic">
                Suggestion: &quot;Will it rain in Pune tomorrow?&quot;
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </MainLayout>
  );
}
