"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sun, Cloud, CloudRain, Wind, Droplets, Brain, 
  Clock, ChevronDown, ChevronUp, AlertTriangle, Calendar, 
  Activity, Sparkles, Camera, Save, Share2, 
  Sprout, HelpingHand, ShieldAlert
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { apiClient } from "@/services/apiClient";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

// Animated Weather SVG component
function WeatherIllustration() {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-amber-400/20 dark:bg-amber-400/10 rounded-full blur-2xl animate-pulse" />
      <svg className="w-24 h-24 relative z-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Rotating Sun */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          style={{ originX: "50px", originY: "38px" }}
        >
          <circle cx="50" cy="38" r="16" fill="url(#sun-gradient)" />
          {/* Sun Rays */}
          <line x1="50" y1="12" x2="50" y2="4" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
          <line x1="50" y1="64" x2="50" y2="72" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
          <line x1="24" y1="38" x2="16" y2="38" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
          <line x1="76" y1="38" x2="84" y2="38" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
          <line x1="32" y1="20" x2="26" y2="14" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
          <line x1="68" y1="56" x2="74" y2="62" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
          <line x1="32" y1="56" x2="26" y2="62" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
          <line x1="68" y1="20" x2="74" y2="14" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
        </motion.g>

        {/* Drifting Cloud */}
        <motion.path
          d="M20,62 C20,53 28,45 38,45 C41,45 44,46 47,48 C51,40 60,35 70,35 C83,35 94,45 95,58 C99,59 102,63 102,68 C102,75 96,80 89,80 L25,80 C18,80 12,74 12,67 C12,64 13,60 16,58"
          fill="url(#cloud-gradient)"
          filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.1))"
          animate={{ x: [-3, 3, -3], y: [-1, 1, -1] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        />

        <defs>
          <linearGradient id="sun-gradient" x1="50" y1="22" x2="50" y2="54" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FBBF24" />
            <stop offset="1" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="cloud-gradient" x1="57" y1="35" x2="57" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F8FAFC" stopOpacity="0.95" />
            <stop offset="1" stopColor="#E2E8F0" stopOpacity="0.9" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function WeatherIntelligencePage() {
  const { t } = useLanguage();
  const [isPageLoading, setIsPageLoading] = React.useState(true);
  const [expandedDay, setExpandedDay] = React.useState<number | null>(null);
  const [weatherData, setWeatherData] = React.useState<any>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);


  const hourlyForecast = React.useMemo(() => [
    { time: t("Now"), temp: "28°C", rain: "10%", wind: "14 km/h", type: "sun" },
    { time: "2 PM", temp: "29°C", rain: "10%", wind: "15 km/h", type: "sun" },
    { time: "3 PM", temp: "29°C", rain: "15%", wind: "16 km/h", type: "cloud" },
    { time: "4 PM", temp: "28°C", rain: "20%", wind: "14 km/h", type: "cloud" },
    { time: "5 PM", temp: "27°C", rain: "25%", wind: "12 km/h", type: "cloud" },
    { time: "6 PM", temp: "26°C", rain: "40%", wind: "10 km/h", type: "rain" },
    { time: "7 PM", temp: "25°C", rain: "65%", wind: "9 km/h", type: "rain" },
    { time: "8 PM", temp: "24°C", rain: "80%", wind: "8 km/h", type: "rain" }
  ], [t]);

  const sevenDayForecast = React.useMemo(() => [
    { 
      day: t("Saturday (Today)"), 
      temp: "24°C - 30°C", 
      rain: "10%", 
      humidity: "62%", 
      wind: "14 km/h", 
      condition: t("Sunny Intervals"),
      type: "sun", 
      advice: t("Delay weeding operations. Soil temperature is high, meaning water evaporation is active. Focus on drip checks.")
    },
    { 
      day: t("Sunday"), 
      temp: "23°C - 28°C", 
      rain: "85%", 
      humidity: "88%", 
      wind: "18 km/h", 
      condition: t("Heavy Showers"),
      type: "rain", 
      advice: t("Skip irrigation entirely. Rain levels will exceed 22mm, leading to saturated clay soils. Clean drainage canals to avoid root drowning.")
    },
    { 
      day: t("Monday"), 
      temp: "22°C - 27°C", 
      rain: "60%", 
      humidity: "82%", 
      wind: "15 km/h", 
      condition: t("Scattered Rain"),
      type: "rain", 
      advice: t("Do not apply chemical sprays. Wet leaves will wash away fungicides. Siphon surface water from depressed field areas.")
    },
    { 
      day: t("Tuesday"), 
      temp: "24°C - 29°C", 
      rain: "20%", 
      humidity: "70%", 
      wind: "10 km/h", 
      condition: t("Cloudy Intervals"),
      type: "cloud", 
      advice: t("Ideal window for applying bio-fertilizers. Humid soils are highly receptive to nitrogen-fixing organic inputs.")
    },
    { 
      day: t("Wednesday"), 
      temp: "25°C - 31°C", 
      rain: "10%", 
      humidity: "65%", 
      wind: "8 km/h", 
      condition: t("Mostly Sunny"),
      type: "sun", 
      advice: t("Excellent day for pesticide spraying. Low wind speed (8 km/h) minimizes chemical drift. Spray early morning.")
    },
    { 
      day: t("Thursday"), 
      temp: "26°C - 32°C", 
      rain: "5%", 
      humidity: "58%", 
      wind: "12 km/h", 
      condition: t("Clear Sky"),
      type: "sun", 
      advice: t("Start of Dry Spell. Increase evening drip cycles by 15% to maintain root moisture levels in Sugarcane rows.")
    },
    { 
      day: t("Friday"), 
      temp: "25°C - 33°C", 
      rain: "5%", 
      humidity: "55%", 
      wind: "14 km/h", 
      condition: t("Hot & Sunny"),
      type: "sun", 
      advice: t("Apply mulching to sugarcane rows. High UV index (9) will dry soil surfaces quickly. Soil cover preserves moisture.")
    }
  ], [t]);

  React.useEffect(() => {
    async function loadForecast() {
      try {
        const res = await apiClient.get<any>("/weather/forecast");
        if (res && res.success) {
          setWeatherData(res);
        }
      } catch (err) {
        console.error("Failed to load weather forecast", err);
      }
    }
    loadForecast();
  }, []);

  if (isPageLoading) {
    return (
      <MainLayout>
        <div className="space-y-8 pb-16 text-left animate-fade-in">
          <SectionHeader 
            title={t("Weather")} 
            description={t("Google Weather combined with AI agricultural insights to guide daily farming decisions.")}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-[350px] rounded-[24px] bg-muted/40 border border-border animate-pulse" />
            <div className="h-[350px] rounded-[24px] bg-muted/40 border border-border animate-pulse" />
          </div>
          <div className="h-96 rounded-[24px] bg-muted/40 border border-border animate-pulse" />
        </div>
      </MainLayout>
    );
  }

  const toggleDay = (index: number) => {
    if (expandedDay === index) {
      setExpandedDay(null);
    } else {
      setExpandedDay(index);
    }
  };

  const getWeatherIcon = (type: string, className = "h-5 w-5") => {
    switch (type) {
      case "rain": return <CloudRain className={`${className} text-blue-500`} />;
      case "cloud": return <Cloud className={`${className} text-slate-500`} />;
      default: return <Sun className={`${className} text-amber-500`} />;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8 pb-16 animate-fade-in text-left">
        
        {/* Page Header */}
        <SectionHeader 
          title={t("Weather")} 
          description={t("Google Weather combined with AI agricultural insights to guide daily farming decisions.")}
          className="mb-0"
        />

        {/* SECTION 1: HERO WEATHER CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          <Card title="" animate={false} className="lg:col-span-2 p-6 flex flex-col justify-between relative overflow-hidden bg-gradient-to-tr from-primary/10 via-card to-accent/5">
            <div className="absolute top-0 right-0 p-4">
              <Badge variant="outline" className="font-bold px-2 py-0.5 bg-card border border-border text-[10px] tracking-wider uppercase">
                Guntur Chilli Plot
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">{t("Current Condition")}</span>
                <h3 className="text-5xl font-extrabold text-foreground">{weatherData?.current?.temp || "28°C"}</h3>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    Feels Like <strong className="text-primary">{weatherData?.current?.feels_like || "30°C"}</strong> • {t(weatherData?.current?.condition || "Cloudy Sky")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Sunrise: 06:02 AM • Sunset: 06:58 PM
                  </p>
                </div>
              </div>

              {/* Animated weather illustration */}
              <div className="self-center sm:self-auto">
                <WeatherIllustration />
              </div>
            </div>

            {/* Quick parameter metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-border/40 text-xs font-semibold">
              <div className="space-y-1">
                <span className="text-muted-foreground block">Humidity</span>
                <p className="font-bold text-foreground flex items-center gap-1">
                  <Droplets className="h-4 w-4 text-primary shrink-0" /> {weatherData?.current?.humidity || "62%"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block">Wind Speed</span>
                <p className="font-bold text-foreground flex items-center gap-1">
                  <Wind className="h-4 w-4 text-primary shrink-0" /> {weatherData?.current?.wind_speed || "14 km/h"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block">Precipitation</span>
                <p className="font-bold text-foreground flex items-center gap-1">
                  <CloudRain className="h-4 w-4 text-primary shrink-0" /> 10%
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block">UV Index</span>
                <p className="font-bold text-foreground flex items-center gap-1">
                  <Sun className="h-4 w-4 text-primary shrink-0" /> {weatherData?.current?.uv_index || "6 (High)"}
                </p>
              </div>
            </div>
          </Card>

          {/* AI Farming Advisory Card */}
          <Card title="" animate={false} className="p-6 border-l-4 border-l-primary flex flex-col justify-between bg-card shadow-sm border-t-0 border-r-0 border-b-0">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <Brain className="h-5 w-5 text-primary shrink-0 animate-pulse" />
                <h4 className="font-bold text-sm text-foreground">AI Farming Advisory</h4>
              </div>

              <div className="space-y-3.5 text-xs font-semibold">
                <div className="flex items-start gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <p className="text-muted-foreground leading-normal">
                    <strong className="text-foreground">Delay Irrigation:</strong> Heavy rain (85%) tomorrow will saturate clayey soil. Avoid overwatering.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <p className="text-muted-foreground leading-normal">
                    <strong className="text-foreground">Drift Warning:</strong> Avoid pesticide spraying between 12 PM - 4 PM today due to 16 km/h gusts.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                  <p className="text-muted-foreground leading-normal">
                    <strong className="text-foreground">Fertilizer Application:</strong> Urea application is recommended after 6 PM today to utilize residual moisture.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/30 text-[10px] text-muted-foreground">
              * Updated 12 mins ago based on local Doppler feeds.
            </div>
          </Card>

        </div>

        {/* SECTION 2: HOURLY FORECAST (HORIZONTAL SCROLL) */}
        <div className="space-y-3.5 font-bold">
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <Clock className="h-4 w-4 text-primary" />
            <span>Hourly Forecast</span>
          </div>

          <div className="flex overflow-x-auto gap-4 scrollbar-none pb-2">
            {hourlyForecast.map((hour, idx) => (
              <div 
                key={idx}
                className="min-w-[90px] flex-1 p-4 rounded-btn border border-border bg-card text-center space-y-2 flex flex-col items-center justify-between h-32 hover:border-primary/30 transition-all shadow-sm"
              >
                <span className="text-[10px] font-bold text-muted-foreground">{hour.time}</span>
                {getWeatherIcon(hour.type, "h-6 w-6")}
                <span className="text-sm font-extrabold text-foreground">{hour.temp}</span>
                <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wide">☔ {hour.rain}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: 7-DAY FORECAST (EXPANDABLE ROWS) */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <Calendar className="h-4 w-4 text-primary" />
            <span>7-Day Agricultural Forecast</span>
          </div>

          <div className="space-y-3 font-semibold">
            {sevenDayForecast.map((day, idx) => {
              const isExpanded = expandedDay === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-btn border border-border bg-card overflow-hidden transition-all shadow-sm"
                >
                  {/* Row Header */}
                  <div 
                    onClick={() => toggleDay(idx)}
                    className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-muted/10 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-[140px] sm:min-w-[200px]">
                      {getWeatherIcon(day.type)}
                      <span className="text-xs font-bold text-foreground">{day.day}</span>
                    </div>

                    <div className="flex items-center gap-6 text-xs">
                      <span className="text-muted-foreground text-center hidden sm:inline-block w-24">
                        ☔ {day.rain} Rain
                      </span>
                      <span className="font-extrabold text-foreground w-20 text-right">
                        {day.temp}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-4 pb-4 pt-1 border-t border-border/30 bg-muted/5 space-y-3 text-xs leading-relaxed">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-muted-foreground pt-1 pb-2 border-b border-border/20">
                            <span>Humidity: <strong className="text-foreground">{day.humidity}</strong></span>
                            <span>Wind Speed: <strong className="text-foreground">{day.wind}</strong></span>
                            <span>Condition: <strong className="text-foreground">{day.condition}</strong></span>
                            <span>Advisory Status: <strong className="text-primary font-bold">Active</strong></span>
                          </div>

                          <div className="space-y-1.5 text-left">
                            <span className="font-bold text-foreground flex items-center gap-1">
                              <Sprout className="h-4 w-4 text-primary shrink-0" />
                              Farming Action Plan
                            </span>
                            <p className="text-muted-foreground font-semibold">
                              {day.advice}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 4: DRY SPELL & WEATHER ALERTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-semibold">
          
          {/* Dry Spell Prediction */}
          <Card title="" animate={false} className="p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
              <h4 className="font-bold text-sm text-foreground">Dry Spell Prediction</h4>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground block uppercase font-bold">Risk Assessment</span>
                <span className="text-lg font-extrabold text-warning">Medium Risk</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground block uppercase font-bold">Expected Duration</span>
                <span className="text-lg font-extrabold text-foreground">4 Days (Jun 29 - Jul 2)</span>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-1 text-left">
              <span className="font-bold text-foreground block">Water Saving Tips:</span>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Deploy mulching cover using Chilli foliage residues.</li>
                <li>Transition sprinkler pipes to drip micro-emitters.</li>
              </ul>
              <div className="pt-2 flex justify-between items-center text-xs border-t border-border/30">
                <span className="text-muted-foreground">Recommended Drip Schedule:</span>
                <span className="font-bold text-primary">20 Mins / Alternate Days</span>
              </div>
            </div>
          </Card>

          {/* Extreme Weather Alerts */}
          <Card title="" animate={false} className="p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 animate-pulse" />
              <h4 className="font-bold text-sm text-foreground">Extreme Weather Alerts</h4>
            </div>

            <div className="space-y-3.5 text-xs text-left">
              {/* Heatwave Warning */}
              <div className="p-3 rounded-btn border border-warning/20 bg-warning/5 flex items-start gap-2.5">
                <AlertTriangle className="h-4.5 w-4.5 text-warning shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-warning-foreground">Heatwave Warning</span>
                    <Badge variant="warning" className="text-[9px] font-bold px-1.5 py-0.2">Medium</Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Soil surface temps up to 38°C modeled on June 30. Increase evening drip cycles.
                  </p>
                </div>
              </div>

              {/* Strong Winds Warning */}
              <div className="p-3 rounded-btn border border-red-500/20 bg-red-500/5 flex items-start gap-2.5">
                <ShieldAlert className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-red-500">Strong Winds Gusts</span>
                    <Badge variant="destructive" className="text-[9px] font-bold px-1.5 py-0.2 bg-red-500">Low</Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Gust speeds exceeding 22 km/h on Wednesday. Secure greenhouse frameworks.
                  </p>
                </div>
              </div>
            </div>
          </Card>

        </div>

        {/* SECTION 5: OPERATIONS CALENDAR TIMELINE */}
        <Card title="" animate={false} className="p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-border/50 mb-6">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">Optimized Farming Calendar</h3>
          </div>

          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 font-semibold">
            <div className="hidden md:block absolute top-[15px] left-8 right-8 h-0.5 bg-border pointer-events-none z-0" />
            
            {/* Sowing Day */}
            <div className="relative z-10 flex md:flex-col items-center gap-3.5 text-left md:text-center md:flex-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-sm">
                1
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-xs text-foreground block">Best Sowing Day</span>
                <span className="text-[10px] text-muted-foreground">Today (June 27)</span>
              </div>
            </div>

            {/* Spraying Day */}
            <div className="relative z-10 flex md:flex-col items-center gap-3.5 text-left md:text-center md:flex-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-sm">
                2
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-xs text-foreground block">Best Spraying Day</span>
                <span className="text-[10px] text-primary font-semibold">Wednesday, July 1</span>
              </div>
            </div>

            {/* Irrigation Day */}
            <div className="relative z-10 flex md:flex-col items-center gap-3.5 text-left md:text-center md:flex-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-sm">
                3
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-xs text-foreground block">Best Irrigation Day</span>
                <span className="text-[10px] text-primary font-semibold">Thursday, July 2</span>
              </div>
            </div>

            {/* Harvesting Day */}
            <div className="relative z-10 flex md:flex-col items-center gap-3.5 text-left md:text-center md:flex-1 opacity-50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground font-bold text-xs">
                4
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-xs text-foreground block">Best Harvesting Day</span>
                <span className="text-[10px] text-muted-foreground">Sunday, July 5</span>
              </div>
            </div>
          </div>
        </Card>

        {/* SECTION 6: SMART INSIGHTS GRID */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-1">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">Weather Risk Insights</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-semibold text-left">
            
            {/* Card 1 */}
            <div className="p-4 rounded-btn border border-border bg-card flex flex-col justify-between text-xs space-y-2 h-36">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Weather Impact</span>
                <p className="font-bold text-foreground leading-normal">
                  Drier soils will trigger deep taproot expansion in groundnut seeds.
                </p>
              </div>
              <Badge variant="outline" className="border-primary text-primary bg-primary/5 text-[9px] font-bold w-fit">
                Beneficial
              </Badge>
            </div>

            {/* Card 2 */}
            <div className="p-4 rounded-btn border border-border bg-card flex flex-col justify-between text-xs space-y-2 h-36">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Crop Stress</span>
                <p className="font-bold text-foreground leading-normal">
                  Chilli transpiration is modeled at 4.2mm/day.
                </p>
              </div>
              <Badge variant="outline" className="border-emerald-500 text-emerald-500 bg-emerald-500/5 text-[9px] font-bold w-fit">
                Optimal
              </Badge>
            </div>

            {/* Card 3 */}
            <div className="p-4 rounded-btn border border-border bg-card flex flex-col justify-between text-xs space-y-2 h-36">
              <div className="space-y-1 text-left">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Water availability</span>
                <p className="font-bold text-foreground leading-normal">
                  Borewell levels are high. Canal flows decrease June 29.
                </p>
              </div>
              <Badge variant="outline" className="border-primary text-primary bg-primary/5 text-[9px] font-bold w-fit">
                Sufficient
              </Badge>
            </div>

            {/* Card 4 */}
            <div className="p-4 rounded-btn border border-border bg-card flex flex-col justify-between text-xs space-y-2 h-36">
              <div className="space-y-1 text-left">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Disease Risk</span>
                <p className="font-bold text-foreground leading-normal">
                  Rust risk is low (12%) due to sunny dry cycles next week.
                </p>
              </div>
              <Badge variant="outline" className="border-emerald-500 text-emerald-500 bg-emerald-500/5 text-[9px] font-bold w-fit">
                Low Risk
              </Badge>
            </div>

            {/* Card 5 */}
            <div className="p-4 rounded-btn border border-border bg-card flex flex-col justify-between text-xs space-y-2 h-36">
              <div className="space-y-1 text-left">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Yield Impact</span>
                <p className="font-bold text-foreground leading-normal">
                  Dry spell rotation maintains the target yield of 2.0 Tons/Acre.
                </p>
              </div>
              <Badge variant="outline" className="border-emerald-500 text-emerald-500 bg-emerald-500/5 text-[9px] font-bold w-fit">
                Stable (0%)
              </Badge>
            </div>

          </div>
        </div>

        {/* SECTION 7: SMART ACTIONS PANEL */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 bg-muted/40 p-5 rounded-card border border-border/50 justify-between font-semibold">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <HelpingHand className="h-4.5 w-4.5 text-primary" />
            Weather Actions:
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => window.location.href = "/assistant"}
              variant="outline"
              className="text-xs font-bold h-9 rounded-btn cursor-pointer bg-card border border-border/80 hover:bg-muted"
            >
              <Sparkles className="mr-1.5 h-4 w-4 text-primary" />
              {t("Vira AI")}
            </Button>
            <Button
              onClick={() => window.location.href = "/crops"}
              variant="outline"
              className="text-xs font-bold h-9 rounded-btn cursor-pointer bg-card border border-border/80 hover:bg-muted"
            >
              <Sprout className="mr-1.5 h-4 w-4 text-primary" />
              {t("Crop Recommendation")}
            </Button>
            <Button
              onClick={() => window.location.href = "/disease"}
              variant="outline"
              className="text-xs font-bold h-9 rounded-btn cursor-pointer bg-card border border-border/80 hover:bg-muted"
            >
              <Camera className="mr-1.5 h-4 w-4 text-primary" />
              {t("Disease Detection")}
            </Button>
            <Button
              onClick={() => alert("Weather report PDF downloaded.")}
              variant="outline"
              className="text-xs font-bold h-9 rounded-btn cursor-pointer bg-card border border-border/80 hover:bg-muted"
            >
              <Save className="mr-1.5 h-4 w-4 text-primary" />
              {t("Save")}
            </Button>
            <Button
              onClick={() => alert("Report shared with nearby RSK weather agents.")}
              className="text-xs font-bold h-9 rounded-btn cursor-pointer bg-primary text-white"
            >
              <Share2 className="mr-1.5 h-4 w-4 text-white" />
              Share Report
            </Button>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}
