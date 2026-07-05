"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Sprout, Phone, Sun, Moon, Globe, 
  WifiOff, ArrowRight, Loader2, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/services/apiClient";
import { supabase } from "@/utils/supabaseClient";
import { useLanguage } from "@/context/LanguageContext";

// Zod validation schema for Indian phone numbers (10 digits starting with 6-9)
const loginSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number (starts with 6-9)"),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOffline, setIsOffline] = React.useState(false);
  const [selectedRole, setSelectedRoleState] = React.useState<"farmer" | "buyer" | "owner" | "guest">("farmer");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRole = localStorage.getItem("krishiva_role");
      if (savedRole && ["farmer", "buyer", "owner", "guest"].includes(savedRole.toLowerCase())) {
        setSelectedRoleState(savedRole.toLowerCase() as any);
      }
    }
  }, []);

  const setSelectedRole = (role: "farmer" | "buyer" | "owner" | "guest") => {
    setSelectedRoleState(role);
    if (typeof window !== "undefined") {
      localStorage.setItem("krishiva_role", role);
    }
  };

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      rememberMe: false,
    },
  });

  const [otpSent, setOtpSent] = React.useState(false);
  const [otpCode, setOtpCode] = React.useState("");
  const [phoneVal, setPhoneVal] = React.useState("");

  // Track mount & connection status
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

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setPhoneVal(data.phone);
    try {
      // 1. Try Supabase OTP sign in
      const formattedPhone = `+91${data.phone}`;
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });
      if (error) {
        // Fallback to backend API
        await apiClient.post("/auth/otp/send", { phone: data.phone });
      }
      setOtpSent(true);
    } catch (err: any) {
      alert(err.message || "Failed to dispatch verification OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      alert("Please enter a valid 6-digit verification code.");
      return;
    }
    setIsLoading(true);
    try {
      const formattedPhone = `+91${phoneVal}`;
      const roleMapped = selectedRole === "farmer" ? "Farmer" : 
                         (selectedRole === "buyer" ? "Buyer" : 
                          (selectedRole === "owner" ? "Owner" : "Guest"));
      
      // 1. Try Supabase verification
      if (otpCode !== "123456") {
        const { data, error } = await supabase.auth.verifyOtp({
          phone: formattedPhone,
          token: otpCode,
          type: "sms"
        });
        if (!error && data.session) {
          localStorage.setItem("krishiva_token", data.session.access_token);
          localStorage.setItem("krishiva_role", selectedRole);
          localStorage.setItem("krishiva_user_id", data.session.user?.id || "");
          
          const targetDashboard = selectedRole === "farmer" ? "/dashboard/farmer" :
                                  (selectedRole === "buyer" ? "/dashboard/buyer" :
                                   (selectedRole === "owner" ? "/dashboard/owner" : "/dashboard/guest"));
          router.push(targetDashboard);
          return;
        }
      }

      // 2. Sandbox bypass or fallback to backend API verification
      const res: any = await apiClient.post("/auth/otp/verify", {
        phone: phoneVal,
        otp: otpCode,
        role: roleMapped
      });
      localStorage.setItem("krishiva_token", res.access_token);
      localStorage.setItem("krishiva_role", selectedRole);
      localStorage.setItem("krishiva_user_id", res.user_id);
      
      const targetDashboard = selectedRole === "farmer" ? "/dashboard/farmer" :
                              (selectedRole === "buyer" ? "/dashboard/buyer" :
                               (selectedRole === "owner" ? "/dashboard/owner" : "/dashboard/guest"));
      router.push(targetDashboard);
    } catch (err: any) {
      alert(err.message || "OTP verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const roleMapped = selectedRole === "farmer" ? "Farmer" : 
                         (selectedRole === "buyer" ? "Buyer" : 
                          (selectedRole === "owner" ? "Owner" : "Guest"));
                          
      const targetDashboard = selectedRole === "farmer" ? "/dashboard/farmer" :
                              (selectedRole === "buyer" ? "/dashboard/buyer" :
                               (selectedRole === "owner" ? "/dashboard/owner" : "/dashboard/guest"));

      // Try Supabase Google OAuth provider redirection
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin + targetDashboard : undefined
        }
      });
      if (error) {
        // Fallback to backend API mock Google token exchange
        const res: any = await apiClient.post("/auth/google", {
          id_token: "google_login_sample_token_2026",
          role: roleMapped
        });
        localStorage.setItem("krishiva_token", res.access_token);
        localStorage.setItem("krishiva_role", selectedRole);
        localStorage.setItem("krishiva_user_id", res.user_id);
        router.push(targetDashboard);
      }
    } catch (err: any) {
      alert(err.message || "Google Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
      const roleMapped = selectedRole === "farmer" ? "Farmer" : 
                         (selectedRole === "buyer" ? "Buyer" : 
                          (selectedRole === "owner" ? "Owner" : "Guest"));
                          
      const res: any = await apiClient.post("/auth/guest", { role: roleMapped });
      localStorage.setItem("krishiva_token", res.access_token);
      localStorage.setItem("krishiva_role", selectedRole);
      localStorage.setItem("krishiva_user_id", res.user_id);
      
      const targetDashboard = selectedRole === "farmer" ? "/dashboard/farmer" :
                              (selectedRole === "buyer" ? "/dashboard/buyer" :
                               (selectedRole === "owner" ? "/dashboard/owner" : "/dashboard/guest"));
      router.push(targetDashboard);
    } catch (err: any) {
      alert(err.message || "Guest authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col lg:grid lg:grid-cols-2 bg-background overflow-x-hidden font-sans">
      
      {/* Offline Status Alert Banner */}
      {isOffline && (
        <motion.div 
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-full shadow-lg text-xs font-bold"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <WifiOff className="h-4 w-4" />
          <span>You are currently offline. Local session only.</span>
        </motion.div>
      )}

      {/* Decorative breathing background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-[10%] -left-[10%] h-[350px] w-[350px] rounded-full bg-primary/10 blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[5%] right-[-5%] h-[400px] w-[400px] rounded-full bg-accent/5 blur-[120px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        />
      </div>

      {/* LEFT COLUMN: BRAND DISPLAY & ILLUSTRATION */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-950 text-white relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/5 pointer-events-none" />
        
        {/* Brand header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-btn bg-primary text-primary-foreground shadow-md">
            <Sprout className="h-6 w-6" />
          </div>
          <span className="font-heading text-lg font-bold tracking-tight">
            Krishiva <span className="text-primary">AI</span>
          </span>
        </div>

        {/* Brand visual centerpiece */}
        <div className="flex flex-col items-center justify-center space-y-8 max-w-md mx-auto relative z-10">
          <div className="w-[300px] aspect-square bg-white rounded-card shadow-lg p-6 flex items-center justify-center overflow-hidden">
            <Image
              src="/illustrations/login_bg.png"
              alt="Platform Login illustration"
              width={260}
              height={260}
              className="object-contain"
              priority
            />
          </div>

          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              Empowering Farms Through Intelligence
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Detect plant diseases, access market pricing indexes, and receive warnings regarding dry spells with smart AI reasoning.
            </p>
          </div>
        </div>

        {/* Copyright info */}
        <p className="text-xs text-slate-500 relative z-10">
          © 2026 Krishiva. Powered by Google Gemini & Cloud Run.
        </p>
      </div>

      {/* RIGHT COLUMN: LOGIN WIDGET CARD */}
      <div className="flex-1 flex flex-col justify-between p-6 lg:p-12 relative z-10">
        {/* Top Header Actions (Language, Theme) */}
        <div className="flex items-center justify-between w-full lg:justify-end gap-3">
          {/* Brand header for mobile */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-btn bg-primary text-primary-foreground">
              <Sprout className="h-4.5 w-4.5" />
            </div>
            <span className="font-heading text-sm font-bold text-foreground">
              Krishiva <span className="text-primary">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Custom Language Selector using shadcn select */}
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Select value={language} onValueChange={(val) => { if (val) setLanguage(val as any); }}>
                <SelectTrigger className="w-[110px] h-9 text-xs font-semibold rounded-btn border border-border">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="en">{t("English")}</SelectItem>
                  <SelectItem value="hi">{t("Hindi")}</SelectItem>
                  <SelectItem value="te">{t("Telugu")}</SelectItem>
                  <SelectItem value="ta">{t("Tamil")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dark Mode Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9 rounded-btn border border-border"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4.5 w-4.5" />
                ) : (
                  <Moon className="h-4.5 w-4.5" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Centerpiece Form Card */}
        <div className="flex-1 flex items-center justify-center py-8">
          <motion.div
            className="w-full max-w-md border border-border bg-card/60 backdrop-blur-md rounded-card p-6 md:p-8 shadow-sm flex flex-col gap-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
          >
            {/* Header info */}
            <div className="space-y-1">
              <h3 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                {t("Get Started")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t("Register or log in using your phone or social credentials.")}
              </p>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                {t("Select Your Role")}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "farmer", label: t("Farmer"), desc: t("Grow & Trade") },
                  { id: "buyer", label: t("Buyer"), desc: t("Procure Crops") },
                  { id: "owner", label: t("Owner"), desc: t("Rent Machines") },
                  { id: "guest", label: t("Guest"), desc: t("Demo View") }
                ].map((role) => {
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id as "farmer" | "buyer" | "owner" | "guest")}
                      className={`p-2 rounded-btn border text-left transition-all ${
                        isSelected 
                          ? "border-primary bg-primary/5 ring-1 ring-primary" 
                          : "border-border bg-card/40 hover:bg-muted/10"
                      }`}
                    >
                      <span className="font-extrabold text-[10px] text-foreground block">{role.label}</span>
                      <span className="text-[8px] text-muted-foreground block mt-0.5">{role.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conditional form rendering */}
            {selectedRole === "guest" ? (
              <div className="space-y-4 pt-2">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("Enter the platform as a Guest to preview trade and rental statistics without creating an account.")}
                </p>
                <Button
                  onClick={handleGuestLogin}
                  disabled={isLoading}
                  className="w-full h-11 justify-center rounded-btn font-bold cursor-pointer transition-all duration-200 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" />
                      {t("Please Wait")}
                    </>
                  ) : (
                    <>
                      {t("Enter Guest Platform")}
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            ) : !otpSent ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <Input
                    {...register("phone")}
                    label={t("Phone Number")}
                    placeholder={t("Enter 10-digit phone number")}
                    icon={Phone}
                    error={errors.phone?.message}
                    disabled={isLoading}
                    maxLength={10}
                  />
                </div>

                {/* Remember me & Forgot details row */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground select-none cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("rememberMe")}
                      disabled={isLoading}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary/50 cursor-pointer"
                    />
                    <span>{t("Remember my farm")}</span>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 justify-center rounded-btn font-bold cursor-pointer transition-transform duration-200 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" />
                      {t("Please Wait")}
                    </>
                  ) : (
                    <>
                      {t("Send OTP Verification")}
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Input
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    label={t("Verification OTP")}
                    placeholder={t("Enter 6-digit OTP code")}
                    icon={ShieldCheck}
                    disabled={isLoading}
                    maxLength={6}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    {t("An OTP was sent to")} {phoneVal}. {t("Type 123456 to bypass in demo sandbox.")}
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 justify-center rounded-btn font-bold cursor-pointer transition-transform duration-200 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" />
                      {t("Verifying Code")}
                    </>
                  ) : (
                    <>
                      {t("Verify OTP & Login")}
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOtpSent(false)}
                  disabled={isLoading}
                  className="w-full h-9 justify-center rounded-btn text-xs"
                >
                  {t("Back to Phone Entry")}
                </Button>
              </form>
            )}

            {/* Social logins */}
            <div className="space-y-3 pt-2">
              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full h-11 justify-center rounded-btn border border-border font-bold flex items-center gap-2 hover:bg-muted/10 cursor-pointer"
              >
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {t("Sign in with Google")}
              </Button>

              <div className="relative flex items-center justify-center my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <span className="relative px-3 text-[10px] font-extrabold text-muted-foreground bg-card uppercase tracking-wider">
                  {t("Or continue with")}
                </span>
              </div>

              {/* Guest / Continue without account row */}
              <div className="flex items-center gap-2.5">
                <Button
                  onClick={handleGuestLogin}
                  disabled={isLoading}
                  variant="secondary"
                  className="flex-1 h-10 rounded-btn font-semibold text-xs cursor-pointer"
                >
                  Guest Login
                </Button>
                
                <Button
                  onClick={() => router.push("/dashboard")}
                  disabled={isLoading}
                  variant="ghost"
                  className="flex-1 h-10 rounded-btn font-semibold text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Skip for Now
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Links (Terms & Privacy) */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3 pt-4 border-t border-border/50 text-xs text-muted-foreground">
          <p className="text-center sm:text-left">
            By signing in, you agree to our terms.
          </p>
          <div className="flex items-center gap-3">
            <a href="#terms" className="hover:underline hover:text-foreground">Terms of Service</a>
            <span className="text-border">•</span>
            <a href="#privacy" className="hover:underline hover:text-foreground">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}
