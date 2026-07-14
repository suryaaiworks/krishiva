"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { 
  Sprout, Sun, Moon, Globe, 
  WifiOff, ArrowRight, Loader2, ShieldCheck,
  Info, CheckCircle2, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

type Step = "splash" | "language" | "login" | "profile_setup";

export default function LoginPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  
  const [mounted, setMounted] = React.useState(false);
  const [step, setStep] = React.useState<Step>("splash");
  const [isOffline, setIsOffline] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Splash loading message states
  const [loadingTextIdx, setLoadingTextIdx] = React.useState(0);
  const SPLASH_TEXTS = React.useMemo(() => [
    "Initializing AI Services...",
    "Connecting Farm Intelligence...",
    "Preparing Smart Agriculture..."
  ], []);

  // Google Login configuration error
  const [googleError, setGoogleError] = React.useState<string | null>(null);

  // First-time Profile Setup Form State
  const [profileForm, setProfileForm] = React.useState({
    name: "",
    state: "Andhra Pradesh",
    district: "Guntur",
    village: "",
    primaryCrop: "Chilli",
    preferredLanguage: "en"
  });

  // Load mount states
  React.useEffect(() => {
    setMounted(true);
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Splash timeout and session check
  React.useEffect(() => {
    if (step !== "splash") return;

    // Cycle text indexes
    const textTimer = setInterval(() => {
      setLoadingTextIdx((prev) => (prev + 1) % SPLASH_TEXTS.length);
    }, 450);

    const checkTimer = setTimeout(() => {
      clearInterval(textTimer);
      const token = localStorage.getItem("krishiva_token");
      if (token) {
        // Returning user - bypass onboarding directly to Dashboard
        router.push("/dashboard");
      } else {
        // First launch - check if language is already set
        const savedLang = localStorage.getItem("krishiva_language");
        if (savedLang && ["en", "te", "hi"].includes(savedLang)) {
          setStep("login");
        } else {
          setStep("language");
        }
      }
    }, 1200);

    return () => {
      clearInterval(textTimer);
      clearTimeout(checkTimer);
    };
  }, [step, router, SPLASH_TEXTS]);

  // Sync default profile language when language updates
  React.useEffect(() => {
    setProfileForm(prev => ({ ...prev, preferredLanguage: language }));
  }, [language]);

  const handleLanguageSelect = (lang: "en" | "te" | "hi") => {
    setLanguage(lang);
    setStep("login");
  };

  const handleGoogleLogin = () => {
    setGoogleError(null);
    setIsLoading(true);

    // Check if Firebase client is fully configured
    const isFirebaseConfigured = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? true : false;
    
    setTimeout(() => {
      setIsLoading(false);
      if (!isFirebaseConfigured) {
        setGoogleError(t("Google Sign-In is unavailable in this environment."));
      } else {
        // Simulating Firebase auth configuration if it was defined
        localStorage.setItem("krishiva_token", "google_mock_prod_token");
        localStorage.setItem("krishiva_role", "farmer");
        localStorage.setItem("krishiva_user_id", "google-user-1234");
        
        // Direct to profile setup or dashboard depending on database entry
        setStep("profile_setup");
      }
    }, 800);
  };

  const handleGuestLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      try {
        localStorage.setItem("krishiva_token", "guest_token");
        localStorage.setItem("krishiva_role", "guest");
        localStorage.setItem("krishiva_user_id", "guest_user");
        
        // Preset mock guest farmer values
        localStorage.setItem("krishiva_farmer_name", "K. Srinivasa Rao");
        localStorage.setItem("krishiva_farmer_district", "Guntur");
        localStorage.setItem("krishiva_farmer_crop", "Chilli");
        
        router.push("/dashboard");
      } catch (e) {
        alert("Failed to initialize guest session.");
      } finally {
        setIsLoading(false);
      }
    }, 600);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim() || !profileForm.village.trim()) {
      alert("Please fill in all profile fields.");
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      // Save profile inputs in localStorage
      localStorage.setItem("krishiva_token", "google_mock_prod_token");
      localStorage.setItem("krishiva_role", "farmer");
      localStorage.setItem("krishiva_user_id", "google-user-1234");
      localStorage.setItem("krishiva_farmer_name", profileForm.name);
      localStorage.setItem("krishiva_farmer_district", profileForm.district);
      localStorage.setItem("krishiva_farmer_crop", profileForm.primaryCrop);
      localStorage.setItem("krishiva_language", profileForm.preferredLanguage);
      
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 overflow-x-hidden font-sans">
      
      {/* Offline Status Alert Banner */}
      {isOffline && (
        <motion.div 
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-full shadow-lg text-xs font-bold"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <WifiOff className="h-4 w-4 animate-bounce" />
          <span>You are currently offline. Running local guest parameters.</span>
        </motion.div>
      )}

      {/* Decorative background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute -top-[10%] -left-[10%] h-[380px] w-[380px] rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="absolute bottom-[5%] right-[-5%] h-[400px] w-[400px] rounded-full bg-amber-500/5 blur-[120px]" />
      </div>

      <AnimatePresence mode="wait">
        
        {/* STEP 1: SPLASH SCREEN */}
        {step === "splash" && (
          <motion.div
            key="splash"
            className="flex flex-col items-center text-center justify-center space-y-6 max-w-sm px-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary text-primary-foreground shadow-lg animate-pulse">
              <Sprout className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-2">
              <h1 className="font-heading text-3xl font-black tracking-tight text-foreground">
                🌱 Krishiva
              </h1>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                Empowering Farmers with AI
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 pt-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <p className="text-xs text-muted-foreground font-semibold h-4 animate-pulse">
                {SPLASH_TEXTS[loadingTextIdx]}
              </p>
            </div>
          </motion.div>
        )}

        {/* STEP 2: LANGUAGE SELECTION */}
        {step === "language" && (
          <motion.div
            key="language"
            className="w-full max-w-md border border-border bg-card/65 backdrop-blur-md rounded-[28px] p-6 md:p-8 shadow-sm flex flex-col gap-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
          >
            <div className="space-y-1.5 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-primary/10 text-primary mx-auto">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
                Select Your Language
              </h3>
              <p className="text-xs text-muted-foreground">
                మీకు నచ్చిన భాషను ఎంచుకోండి • अपनी पसंदीदा भाषा चुनें
              </p>
            </div>

            <div className="flex flex-col gap-3 py-2">
              {[
                { code: "en", name: "English", native: "🇬🇧 English (India)" },
                { code: "te", name: "తెలుగు", native: "🇮🇳 తెలుగు (Telugu)" },
                { code: "hi", name: "हिन्दी", native: "🇮🇳 हिन्दी (Hindi)" }
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code as any)}
                  className="flex items-center justify-between px-5 py-4 rounded-[20px] border border-border hover:border-primary/40 bg-card hover:bg-primary/5 transition-all text-left font-bold text-sm cursor-pointer group"
                >
                  <div className="space-y-0.5">
                    <span className="text-foreground block">{lang.native}</span>
                    <span className="text-[10px] text-muted-foreground font-semibold block">{lang.name}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 3: LOGIN SCREEN */}
        {step === "login" && (
          <motion.div
            key="login"
            className="w-full max-w-md border border-border bg-card/65 backdrop-blur-md rounded-[28px] p-6 md:p-8 shadow-sm flex flex-col gap-6 text-left"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
          >
            {/* Header branding */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-primary text-primary-foreground shadow-sm">
                  <Sprout className="h-5 w-5" />
                </div>
                <span className="font-heading text-base font-bold tracking-tight text-foreground">
                  Krishiva <span className="text-primary">AI</span>
                </span>
              </div>

              {/* Theme Toggle */}
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="h-8 w-8 rounded-full border border-border"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              )}
            </div>

            <div className="space-y-1 pt-2">
              <h3 className="font-heading text-2xl font-black tracking-tight text-foreground">
                {t("Get Started")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t("Empowering Farmers with AI")}
              </p>
            </div>

            {/* Google Authentication */}
            <div className="space-y-3 pt-2">
              <Button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full h-12 justify-center rounded-[20px] font-bold cursor-pointer border border-border bg-card hover:bg-muted text-foreground text-xs flex items-center gap-2.5 transition-all shadow-sm"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                )}
                <span>{t("Continue with Google")}</span>
              </Button>

              {/* Google Sign-in Error Banner */}
              {googleError && (
                <motion.div 
                  className="flex items-start gap-2 p-3.5 rounded-[16px] bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold leading-relaxed"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Info className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">{googleError}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{t("Please use Guest Mode to explore the platform.")}</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Divider line */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-border/60"></div>
              <span className="flex-shrink mx-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t("Or")}</span>
              <div className="flex-grow border-t border-border/60"></div>
            </div>

            {/* Guest Mode Section */}
            <div className="space-y-2.5">
              <div className="text-left space-y-1">
                <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                  {t("Explore as Guest")}
                </span>
                <p className="text-[11px] text-muted-foreground leading-normal font-semibold">
                  {t("Explore Krishiva instantly using demo farm data. No account required.")}
                </p>
              </div>

              <Button
                onClick={handleGuestLogin}
                disabled={isLoading}
                className="w-full h-11 justify-center rounded-[20px] font-bold cursor-pointer bg-primary text-white hover:bg-primary/95 text-xs"
              >
                <span>{t("Enter Guest Platform")}</span>
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>

            {/* Google Trust Section */}
            <div className="pt-2 border-t border-border/50 space-y-2.5">
              <div className="grid grid-cols-3 gap-2 text-[9px] text-muted-foreground/80 font-bold">
                <div className="flex items-center gap-1.5 justify-center py-1 rounded-full bg-muted/40">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  <span>AI Powered</span>
                </div>
                <div className="flex items-center gap-1.5 justify-center py-1 rounded-full bg-muted/40">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Secure Auth</span>
                </div>
                <div className="flex items-center gap-1.5 justify-center py-1 rounded-full bg-muted/40">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Google Cloud</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 4: FIRST-TIME PROFILE SETUP */}
        {step === "profile_setup" && (
          <motion.div
            key="profile_setup"
            className="w-full max-w-md border border-border bg-card/65 backdrop-blur-md rounded-[28px] p-6 md:p-8 shadow-sm flex flex-col gap-5 text-left"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
          >
            <div className="space-y-1">
              <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
                Farmer Profile Setup
              </h3>
              <p className="text-xs text-muted-foreground">
                Set up your agriculture details for smart telemetry suggestions.
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs font-bold leading-normal">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-foreground">Farmer Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  placeholder="e.g. Srinivasa Rao"
                  className="w-full bg-transparent px-3.5 py-2.5 border border-border rounded-[18px] focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-semibold"
                />
              </div>

              {/* State & District grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-foreground">State</label>
                  <select
                    value={profileForm.state}
                    onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                    className="w-full bg-card px-3.5 py-2.5 border border-border rounded-[18px] focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-semibold"
                  >
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Karnataka">Karnataka</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground">District</label>
                  <input
                    type="text"
                    required
                    value={profileForm.district}
                    onChange={(e) => setProfileForm({ ...profileForm, district: e.target.value })}
                    placeholder="e.g. Guntur"
                    className="w-full bg-transparent px-3.5 py-2.5 border border-border rounded-[18px] focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-semibold"
                  />
                </div>
              </div>

              {/* Village */}
              <div className="space-y-1.5">
                <label className="text-foreground">Village</label>
                <input
                  type="text"
                  required
                  value={profileForm.village}
                  onChange={(e) => setProfileForm({ ...profileForm, village: e.target.value })}
                  placeholder="e.g. Tenali"
                  className="w-full bg-transparent px-3.5 py-2.5 border border-border rounded-[18px] focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-semibold"
                />
              </div>

              {/* Primary Crop */}
              <div className="space-y-1.5">
                <label className="text-foreground">Primary Crop</label>
                <select
                  value={profileForm.primaryCrop}
                  onChange={(e) => setProfileForm({ ...profileForm, primaryCrop: e.target.value })}
                  className="w-full bg-card px-3.5 py-2.5 border border-border rounded-[18px] focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-semibold"
                >
                  <option value="Chilli">Chilli</option>
                  <option value="Paddy">Paddy</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Sugarcane">Sugarcane</option>
                </select>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 justify-center rounded-[20px] font-bold cursor-pointer bg-primary text-white hover:bg-primary/95 text-xs mt-2"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Profile & Continue"}
              </Button>
            </form>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
