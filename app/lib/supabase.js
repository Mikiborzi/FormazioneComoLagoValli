import { createClient } from "@supabase/supabase-js";

// Il client viene creato solo se le variabili d'ambiente sono presenti.
// Durante la build statica senza .env.local il modulo non lancia eccezioni.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
