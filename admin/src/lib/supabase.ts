import { createClient } from "@supabase/supabase-js";

// Usa NEXT_PUBLIC_* env vars en Vercel, con fallback a valores hardcodeados
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://ylyajclxleqkfdpyregz.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlseWFqY2x4bGVxa2ZkcHlyZWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMzMzNjYsImV4cCI6MjA5NjYwOTM2Nn0.ReYTDJ_o2PhItbPMrevd5UWGai26otd9G6FQDW1d3cc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
