"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/services/apiClient";

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

  React.useEffect(() => {
    let script: HTMLScriptElement | null = null;

    async function initializeVira() {
      let farmerContext: KrishivaFarmerContext = {
        id: "demo-farmer",
        name: "Ramesh Patil",
        phone: "9876543210",
        language: "te",
        location: "Pune",
        crops: ["Sugarcane", "Groundnut"]
      };

      const token = typeof window !== "undefined" ? localStorage.getItem("krishiva_token") : null;

      if (token) {
        try {
          // Retrieve farmer context dynamically from backend profile, settings, & farms
          const prof = await apiClient.get<any>("/profile");
          const settings = await apiClient.get<any>("/settings");
          const farmList = await apiClient.get<any[]>("/profile/farms");
          
          const crops = farmList ? farmList.map((f: any) => f.current_crop).filter(Boolean) : [];
          const district = prof?.verified_id ? prof.verified_id.split("-")[0] : "Pune";

          farmerContext = {
            id: prof?.id || "demo-farmer",
            name: prof?.name || "Ramesh Patil",
            phone: prof?.phone || "9876543210",
            language: settings?.language || prof?.language || "te",
            location: prof?.district || district || "Pune",
            crops: crops.length > 0 ? crops : ["Sugarcane", "Groundnut"]
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
      const popup = document.querySelector(".vira-popup");
      const btn = document.querySelector(".vira-btn");
      if (popup) popup.remove();
      if (btn) btn.remove();
    };
  }, [router]);

  return null;
}

export default ViraVoiceWidget;
