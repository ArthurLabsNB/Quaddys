import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const { session, user, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) router.replace("/");
  }, [loading, session, router]);

  if (loading || !session) {
    return (
      <main className="min-h-dvh grid place-items-center bg-neutral-950 text-white">
        <div className="animate-pulse">Cargando…</div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-neutral-950 text-white p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/70">{user?.email}</span>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace("/");
            }}
            className="rounded-md bg-white/10 px-3 py-1 text-sm hover:bg-white/20"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <section className="rounded-xl border border-white/10 p-4">
        <p>Bienvenido a Quaddys. Aquí irá el tablero o menú principal.</p>
      </section>
    </main>
  );
}
