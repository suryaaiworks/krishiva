"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/services/apiClient";
import { useLanguage } from "@/context/LanguageContext";

interface KrishivaFarmerContext {
  id: string;
  name: string;
  phone: string;
  language: string;
  location: string;
  crops: string[];
}

declare global {
  interface Window {
    KrishivaFarmer?: KrishivaFarmerContext;
  }
}

export function ViraVoiceWidget() {
  const router = useRouter();
  const { language } = useLanguage();

  React.useEffect(() => {
    let script: HTMLScriptElement | null = null;

    async function initializeVira() {
      const savedLang = typeof window !== "undefined" ? localStorage.getItem("krishiva_language") : "te";
      let farmerContext: KrishivaFarmerContext = {
        id: "demo-farmer",
        name: "K. Srinivasa Rao",
        phone: "9876543210",
        language: savedLang || "te",
        location: "Guntur",
        crops: ["Chilli", "Cotton"]
      };

      const token = typeof window !== "undefined" ? localStorage.getItem("krishiva_token") : null;

      if (token) {
        try {
          // Retrieve farmer context dynamically from backend profile, settings, & farms
          const prof = await apiClient.get<any>("/profile");
          const settings = await apiClient.get<any>("/settings");
          const farmList = await apiClient.get<any[]>("/profile/farms");
          
          const crops = farmList ? farmList.map((f: any) => f.current_crop).filter(Boolean) : [];
          const district = prof?.verified_id ? prof.verified_id.split("-")[0] : "Guntur";

          farmerContext = {
            id: prof?.id || "demo-farmer",
            name: prof?.name || "K. Srinivasa Rao",
            phone: prof?.phone || "9876543210",
            language: settings?.language || prof?.language || "te",
            location: prof?.district || district || "Guntur",
            crops: crops.length > 0 ? crops : ["Chilli", "Cotton"]
          };
        } catch (err) {
          console.warn("Failed to load authenticated profile details for Vira. Using guest fallback profile context.", err);
        }
      } else {
        console.log("Vira Voice initialization: No authentication token found. Mounting in Guest Mode directly.");
      }

      window.KrishivaFarmer = farmerContext;

      // Prevent double script insertion
      if (document.querySelector('script[src="/vira.js"]')) {
        console.log("Vira script already injected in document. Skipping duplicate mount.");
        return;
      }

      // Load the pluggable vira.js widget
      script = document.createElement("script");
      script.src = "/vira.js";
      script.dataset.userId = farmerContext.id;
      script.dataset.apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      document.body.appendChild(script);
    }

    initializeVira();

    const handleAction = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { action, page } = customEvent.detail || {};

      if (action === "navigate" && page) {
        // Dynamic voice-guided page redirection routing
        router.push("/" + page.toLowerCase());
      }
    };

    window.addEventListener("vira-action", handleAction);

    return () => {
      window.removeEventListener("vira-action", handleAction);
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (typeof window !== "undefined") {
        (window as any).__ViraScriptRunning = false;
      }
      const popup = document.querySelector(".vira-popup");
      const btn = document.querySelector(".vira-btn");
      if (popup) popup.remove();
      if (btn) btn.remove();
    };
  }, [router, language]);

  return null;
}

export default ViraVoiceWidget;
