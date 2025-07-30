import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!client) {
    const url = env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) {
      if (typeof window === "undefined") {
        // Evitar fallo en build cuando las env no estan definidas
        return {} as SupabaseClient;
      }
      throw new Error(
        "Supabase no configurado: define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY"
      );
    }
    client = createClient(url, anon);
  }
  return client;
}
