import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession } from "@/hooks/useSession";

const AuthCard = dynamic(() => import("@/components/AuthCard"), {
  ssr: false,
  loading: () => (
    <div className="h-[460px] w-[min(100%,420px)] rounded-2xl bg-white/5 backdrop-blur-md animate-pulse" />
  ),
});

const NEXT_PAGE = "/dashboard";

export default function Home() {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    router.prefetch(NEXT_PAGE);
  }, [router]);

  useEffect(() => {
    if (!loading && session) router.replace(NEXT_PAGE);
  }, [loading, session, router]);

  return (
    <main className="min-h-dvh grid place-items-center bg-gradient-to-br from-[#1e1b4b] to-[#0a0a0a] p-4">
      {loading ? (
        <div className="h-[460px] w-[min(100%,420px)] rounded-2xl bg-white/5 backdrop-blur-md animate-pulse" />
      ) : !session ? (
        <AuthCard />
      ) : null}
    </main>
  );
}
