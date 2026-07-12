import { createClient } from "@supabase/supabase-js";

// Usa NEXT_PUBLIC_* env vars en Vercel, con fallback a valores hardcodeados
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://ylyajclxleqkfdpyregz.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlseWFqY2x4bGVxa2ZkcHlyZWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMzMzNjYsImV4cCI6MjA5NjYwOTM2Nn0.ReYTDJ_o2PhItbPMrevd5UWGai26otd9G6FQDW1d3cc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadMedia(file: File, folder = "missions") {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { data, error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (error) throw error;
  const { data: pub } = supabase.storage.from("media").getPublicUrl(data.path);
  return pub.publicUrl;
}
