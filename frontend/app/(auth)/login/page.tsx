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
  WifiOff, ArrowRight, Loader2 
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
  const [mounted, setMounted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOffline, setIsOffline] = React.useState(false);

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

  const onSubmit = (data: LoginFormValues) => {
    setIsLoading(true);
    console.log("Logging in with phone:", data.phone);
    // Mock login timeout
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1800);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1200);
  };

  const handleGuestLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1000);
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
              <Select defaultValue="en">
                <SelectTrigger className="w-[110px] h-9 text-xs font-semibold rounded-btn border border-border">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                  <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                  <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
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
            className="w-full max-w-sm border border-border bg-card/60 backdrop-blur-md rounded-card p-6 md:p-8 shadow-sm flex flex-col gap-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
          >
            {/* Header info */}
            <div className="space-y-1">
              <h3 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                Get Started
              </h3>
              <p className="text-xs text-muted-foreground">
                Register or log in using your phone or social credentials.
              </p>
            </div>

            {/* Main validation form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Input
                  {...register("phone")}
                  label="Phone Number"
                  placeholder="Enter 10-digit phone number"
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
                  <span>Remember my farm</span>
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
                    Please Wait
                  </>
                ) : (
                  <>
                    Send OTP Verification
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Separator */}
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Or Continue With
              </span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            {/* Social logins */}
            <div className="flex flex-col gap-3">
              {/* Google login (primary action) */}
              <Button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                variant="outline"
                className="w-full h-11 justify-center rounded-btn font-bold border border-border bg-card/40 cursor-pointer"
              >
                <svg className="mr-2.5 h-4.5 w-4.5" viewBox="0 0 24 24" width="24" height="24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign In with Google
              </Button>

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
