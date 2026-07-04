"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sprout, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function BuyerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("buyer@krishiva.ai");
  const [password, setPassword] = React.useState("123456");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate login checks
    setTimeout(() => {
      if (email === "buyer@krishiva.ai" && password === "123456") {
        router.push("/buyer/dashboard");
      } else {
        setError("Invalid email or password. Use demo credentials.");
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background soft blurs */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-6 z-10"
      >
        <div className="flex flex-col items-center select-none text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-btn bg-primary text-primary-foreground shadow-md mb-4">
            <Sprout className="h-6 w-6" />
          </div>
          <h1 className="font-heading text-2xl font-black text-foreground tracking-tight">
            Krishiva <span className="text-primary">Buyer Portal</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
            Source crops directly from farmers, negotiate rates, and manage payments.
          </p>
        </div>

        <Card className="p-6 sm:p-8 border border-border/60">
          <form onSubmit={handleLogin} className="space-y-4.5 text-xs">
            {error && (
              <div className="p-3 rounded-btn bg-rose-500/5 border border-rose-500/10 text-rose-500 font-bold">
                {error}
              </div>
            )}

            {/* Email field */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-muted-foreground uppercase">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-muted/30 border border-border rounded-input pl-10 pr-4 h-11 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-muted-foreground/60 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-muted-foreground uppercase">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-muted/30 border border-border rounded-input pl-10 pr-4 h-11 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-muted-foreground/60 transition-all"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 justify-center rounded-btn font-bold cursor-pointer transition-all mt-2.5 flex items-center gap-1.5"
            >
              {isLoading ? "Signing in..." : "Sign In to Procurement"} <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Quick info */}
          <div className="mt-5 pt-4 border-t border-border/40 text-[10px] text-muted-foreground/80 flex items-center justify-center gap-1.5 select-none font-semibold">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <span>Secured Buyer Portal Session</span>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
