"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export default function DashboardPage() {
  const supabase = getSupabase();
  const router = useRouter();

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace('/');
    });
  }, [router, supabase]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl text-white">Bienvenido al tablero</h1>
      <button
        onClick={() => window.location.assign("/api/riot/start")}
        className="rounded-lg bg-white/90 text-black py-2 px-3 text-sm font-medium hover:bg-white"
      >
        Vincular Riot
      </button>
      <button
        onClick={signOut}
        className="rounded-lg bg-white/20 text-white py-2 px-3 text-sm font-medium hover:bg-white/30"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
