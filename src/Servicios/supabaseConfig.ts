// Reemplaza con TUS datos reales de Supabase
export const SUPABASE_URL = "https://gccpufipmwsenhfckixi.supabase.co";
export const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjY3B1ZmlwbXdzZW5oZmNraXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MDI4OTksImV4cCI6MjA4MDk3ODg5OX0.Ctx-7SdtiIqI8YIBd072MNcsph-nosdSa580qvRiuxM";

// Headers obligatorios para que Supabase acepte la petición de Alova
export const supabaseHeaders = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation" // Para que devuelva el dato insertado
};