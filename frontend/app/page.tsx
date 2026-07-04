"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, ArrowRight, ChevronRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// Onboarding slides config
const SLIDES = [
  {
    title: "Welcome to Krishiva",
    description: "Your intelligent farming companion powered by Artificial Intelligence.",
    illustration: "/illustrations/farmer_ai_assistant.png",
  },
  {
    title: "Know Your Crop Better",
    description: "Detect crop diseases, receive smart recommendations and improve productivity.",
    illustration: "/illustrations/crop_scanning.png",
  },
  {
    title: "Weather & Market Intelligence",
    description: "Stay ahead with weather forecasts, market prices and personalized farming alerts.",
    illustration: "/illustrations/weather_market.png",
  },
  {
    title: "Protect & Grow Your Farm",
    description: "Receive disaster alerts, government scheme recommendations, NGO support and connect directly with verified buyers.",
    illustration: "/illustrations/happy_farmer.png",
  },
];

// Carousel slide transition variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: "spring" as const, stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    transition: {
      x: { type: "spring" as const, stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  }),
};

export default function Home() {
  const router = useRouter();
  const [step, setStep] = React.useState<"splash" | "onboarding" | "finished">("splash");
  const [progress, setProgress] = React.useState(0);
  const [[currentSlide, direction], setCurrentSlide] = React.useState([0, 0]);

  // Handle Splash progress and transition
  React.useEffect(() => {
    if (step !== "splash") return;

    const duration = 2500; // 2.5s progress duration
    const intervalTime = 50;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          // Small delay before moving to onboarding
          setTimeout(() => setStep("onboarding"), 300);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [step]);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide([currentSlide + 1, 1]);
    } else {
      setStep("finished");
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide([currentSlide - 1, -1]);
    }
  };

  const handleSkip = () => {
    setStep("finished");
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-background text-foreground select-none font-sans">
      <AnimatePresence mode="wait">
        {/* STEP 1: SPLASH SCREEN */}
        {step === "splash" && (
          <motion.div
            key="splash"
            className="absolute inset-0 flex flex-col items-center justify-between py-12 bg-slate-950 text-white"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.6, ease: "easeInOut" } }}
          >
            {/* Animated breathing background orb */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-primary/20 blur-[100px]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut",
              }}
            />

            {/* Empty top block for spacing */}
            <div />

            {/* Central glassmorphic card */}
            <motion.div
              className="relative z-10 flex flex-col items-center gap-6 p-8 rounded-card border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl max-w-sm w-full mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 120, damping: 20 }}
            >
              <motion.div
                className="flex h-16 w-16 items-center justify-center rounded-btn bg-primary text-primary-foreground shadow-lg"
                initial={{ rotate: -180, scale: 0.5 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 150, damping: 15 }}
              >
                <Sprout className="h-9 w-9" />
              </motion.div>

              <div className="text-center space-y-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-white">
                  Krishiva <span className="text-primary">AI</span>
                </h1>
                <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  AI Powered Agricultural Intelligence
                </p>
              </div>
            </motion.div>

            {/* Bottom Progress Block */}
            <div className="w-full max-w-xs px-4 flex flex-col items-center gap-3 relative z-10">
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                Loading Platform... {Math.min(Math.round(progress), 100)}%
              </span>
            </div>
          </motion.div>
        )}

        {/* STEP 2: ONBOARDING FLOW */}
        {step === "onboarding" && (
          <motion.div
            key="onboarding"
            className="absolute inset-0 flex flex-col justify-between py-6 px-4 md:px-8 bg-background"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4 } }}
          >
            {/* Header section */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-btn bg-primary text-primary-foreground">
                  <Sprout className="h-4.5 w-4.5" />
                </div>
                <span className="font-heading text-sm font-bold text-foreground">
                  Krishiva <span className="text-primary">AI</span>
                </span>
              </div>
              
              {currentSlide < SLIDES.length - 1 && (
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Skip
                </Button>
              )}
            </div>

            {/* Content Slider Area */}
            <div className="relative flex-1 flex flex-col items-center justify-center my-6 overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentSlide}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full max-w-sm flex flex-col items-center gap-6"
                >
                  {/* Clean illustration card with white background and green accents */}
                  <div className="relative w-full aspect-square max-w-[280px] rounded-card border border-border bg-card shadow-sm p-6 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
                    <Image
                      src={SLIDES[currentSlide].illustration}
                      alt={SLIDES[currentSlide].title}
                      width={220}
                      height={220}
                      className="object-contain max-h-[220px] transition-transform duration-300 hover:scale-105"
                      priority
                    />
                  </div>

                  {/* Typography information */}
                  <div className="text-center space-y-2.5 px-2">
                    <h2 className="font-heading text-xl md:text-2xl font-bold tracking-tight text-foreground leading-snug">
                      {SLIDES[currentSlide].title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {SLIDES[currentSlide].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer Navigation Area */}
            <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto">
              {/* Pagination Dots */}
              <div className="flex items-center gap-2">
                {SLIDES.map((_, index) => {
                  const isCurrent = index === currentSlide;
                  return (
                    <motion.div
                      key={index}
                      className="rounded-full bg-border"
                      animate={{
                        width: isCurrent ? 24 : 8,
                        height: 8,
                        backgroundColor: isCurrent ? "var(--primary)" : "var(--border)",
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between w-full gap-4 pt-1">
                {currentSlide > 0 ? (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 py-5 rounded-btn font-bold cursor-pointer text-xs"
                  >
                    Back
                  </Button>
                ) : (
                  <div className="flex-1" />
                )}

                <Button
                  onClick={handleNext}
                  className="flex-1 py-5 rounded-btn font-bold cursor-pointer text-xs gap-1.5"
                >
                  {currentSlide === SLIDES.length - 1 ? (
                    <>
                      Get Started
                      <CheckCircle2 className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: MOCK FINISHED LANDING */}
        {step === "finished" && (
          <motion.div
            key="finished"
            className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-background"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
            {/* Elegant glassmorphic completion card */}
            <div className="max-w-sm w-full border border-border bg-card rounded-card p-8 shadow-md text-center space-y-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Ready to Start!
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Thank you for completing onboarding. Krishiva is configured for your farm.
                </p>
              </div>

              <div className="rounded-btn bg-muted/50 p-4 border border-border/50 text-left text-xs space-y-2 text-muted-foreground leading-normal">
                <span className="font-bold text-foreground block">Onboarding Modules Configured:</span>
                <div>✓ Soil & Water Crop Advisor</div>
                <div>✓ Crop Diagnosis Scan Interface</div>
                <div>✓ Local APMC Mandi Price Alerts</div>
                <div>✓ Interactive Voice Assistance</div>
              </div>

              <Button
                onClick={() => router.push("/login")}
                className="w-full py-5 rounded-btn font-bold cursor-pointer text-xs"
              >
                Proceed to Platform
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
