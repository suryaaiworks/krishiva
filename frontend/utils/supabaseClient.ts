import { createClient } from "@supabase/supabase-js";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Clean quotes, whitespaces, and newlines
const supabaseUrl = rawUrl.trim().replace(/['"]/g, "").replace(/\/$/, "");
const supabaseAnonKey = rawKey.trim().replace(/['"]/g, "");

// Print environmental values during server build time
if (typeof window === "undefined") {
  console.log("----------------------------------------");
  console.log("Supabase Env Audit (Build-Time):");
  console.log(`- NEXT_PUBLIC_SUPABASE_URL: "${supabaseUrl}"`);
  console.log(`- NEXT_PUBLIC_SUPABASE_ANON_KEY (length): ${supabaseAnonKey.length}`);
  console.log("----------------------------------------");
}

// Strict URL check to prevent createClient throwing errors on empty/malformed URLs
const isValidUrl = supabaseUrl.startsWith("http://") || supabaseUrl.startsWith("https://");

let client = null;

if (isValidUrl && supabaseAnonKey) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    if (typeof window === "undefined") {
      console.warn("Supabase client initialization failed inside try-catch block:", err);
    }
  }
}

export const supabase = client as any;
