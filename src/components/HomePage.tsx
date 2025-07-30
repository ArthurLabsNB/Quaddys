"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import { useSession } from "@/hooks/useSession";

export default function HomePage() {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/dashboard");
  }, [router]);

  useEffect(() => {
    if (!loading && session) router.replace("/dashboard");
  }, [loading, session, router]);

  return (
    <main className="min-h-dvh grid place-items-center bg-gradient-to-br from-[#1e1b4b] via-[#141228] to-[#0a0a0a] p-4">
      {loading ? (
        <div className="h-[480px] w-[min(100%,440px)] rounded-2xl bg-white/5 backdrop-blur-md animate-pulse" />
      ) : !session ? (
        <AuthCard />
      ) : null}
    </main>
  );
}
