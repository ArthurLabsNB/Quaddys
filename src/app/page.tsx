"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import { useSession } from "@/hooks/useSession";

export default function Home() {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && session) router.replace("/dashboard");
  }, [loading, session, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e1b4b] to-[#0a0a0a] p-4">
      {!loading && !session && <AuthCard />}
    </div>
  );
}
