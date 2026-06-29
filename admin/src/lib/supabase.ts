import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ylyajclxleqkfdpyregz.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlseWFqY2x4bGVxa2ZkcHlyZWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMzMzNjYsImV4cCI6MjA5NjYwOTM2Nn0.ReYTDJ_o2PhItbPMrevd5UWGai26otd9G6FQDW1d3cc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
