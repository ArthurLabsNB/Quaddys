"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

type Mode = "login" | "register" | "magic";
const emailOk = (v: string) => /^\S+@\S+\.\S+$/.test(v);
const passOk = (v: string) => v.length >= 6;

export default function AuthCard() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    if (mode === "magic") return emailOk(email);
    if (mode === "register") return emailOk(email) && passOk(pass) && name.trim().length >= 2;
    return emailOk(email) && passOk(pass);
  }, [mode, email, pass, name]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    if (!canSubmit) return;

    setPending(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
        setMsg("Bienvenido.");
      } else if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: { data: { name } },
        });
        if (error) throw error;
        if (data.user?.identities?.length === 0) setErr("El correo ya está registrado.");
        else setMsg("Verifica tu correo para activar la cuenta.");
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined },
        });
        if (error) throw error;
        setMsg("Enviamos un enlace mágico a tu correo.");
      }
    } catch (e: any) {
      setErr(e?.message ?? "Error inesperado");
    } finally {
      setPending(false);
    }
  }

  async function oauth(provider: "google" | "github" | "discord") {
    setErr(null);
    setMsg(null);
    setPending(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: typeof window !== "undefined" ? window.location.origin : undefined },
      });
      if (error) throw error;
    } catch (e: any) {
      setErr(e?.message ?? "No se pudo iniciar sesión con OAuth");
    } finally {
      setPending(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="w-[min(100%,420px)] rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-5 shadow-xl"
    >
      <header className="mb-4 text-center">
        <h1 className="text-2xl font-semibold text-white">Portal de Quaddys</h1>
        <p className="text-sm text-white/70">Login / Registro</p>
      </header>

      <nav className="mb-4 grid grid-cols-3 gap-1 rounded-xl bg-white/10 p-1">
        {(["login", "register", "magic"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setErr(null); setMsg(null); }}
            className={`rounded-lg py-2 text-sm font-medium transition ${
              mode === m ? "bg-white text-black" : "text-white/80 hover:bg-white/10"
            }`}
          >
            {m === "login" ? "Entrar" : m === "register" ? "Crear cuenta" : "Enlace"}
          </button>
        ))}
      </nav>

      <AnimatePresence mode="wait">
        <motion.form
          key={mode}
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          {mode === "register" && (
            <div className="space-y-1">
              <label className="block text-sm text-white/80">Nombre</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg bg-black/30 text-white px-3 py-2 outline-none ring-1 ring-white/15 focus:ring-2 focus:ring-indigo-400"
                placeholder="Tu alias"
                autoComplete="name"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-sm text-white/80">Correo</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-black/30 text-white px-3 py-2 outline-none ring-1 ring-white/15 focus:ring-2 focus:ring-indigo-400"
              placeholder="tucorreo@ejemplo.com"
              type="email"
              autoComplete="email"
              inputMode="email"
            />
          </div>

          {mode !== "magic" && (
            <div className="space-y-1">
              <label className="block text-sm text-white/80">Contraseña</label>
              <input
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full rounded-lg bg-black/30 text-white px-3 py-2 outline-none ring-1 ring-white/15 focus:ring-2 focus:ring-indigo-400"
                placeholder="Mínimo 6 caracteres"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              {mode === "register" && (
                <div className="mt-1 h-1 w-full bg-white/10 rounded">
                  <div
                    className={`h-1 rounded ${pass.length >= 10 ? "w-3/3" : pass.length >= 8 ? "w-2/3" : "w-1/3"}`}
                    style={{ background: "linear-gradient(90deg,#6366f1,#22d3ee)" }}
                  />
                </div>
              )}
            </div>
          )}

          <button
            disabled={!canSubmit || pending}
            className="w-full rounded-lg bg-white text-black py-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? "Procesando..." : mode === "login" ? "Entrar" : mode === "register" ? "Crear cuenta" : "Enviar enlace"}
          </button>
        </motion.form>
      </AnimatePresence>

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/15" />
        <span className="text-xs text-white/60">o</span>
        <div className="h-px flex-1 bg-white/15" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button onClick={() => oauth("google")} disabled={pending} className="rounded-lg bg-white/90 text-black py-2 text-sm font-medium hover:bg-white">
          Google
        </button>
        <button onClick={() => oauth("github")} disabled={pending} className="rounded-lg bg-white/90 text-black py-2 text-sm font-medium hover:bg-white">
          GitHub
        </button>
        <button onClick={() => oauth("discord")} disabled={pending} className="rounded-lg bg-white/90 text-black py-2 text-sm font-medium hover:bg-white">
          Discord
        </button>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setErr(null);
            setMsg(null);
          }}
          className="text-sm text-white/80 hover:text-white"
        >
          {mode === "login" ? "¿No tienes cuenta? Crear cuenta" : "¿Ya tienes cuenta? Entrar"}
        </button>
      </div>

      {err && (
        <motion.div role="alert" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-lg bg-red-500/15 border border-red-400/20 p-3 text-red-200 text-sm">
          {err}
        </motion.div>
      )}
      {msg && (
        <motion.div role="status" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-lg bg-emerald-500/15 border border-emerald-400/20 p-3 text-emerald-200 text-sm">
          {msg}
        </motion.div>
      )}
    </motion.div>
  );
}
