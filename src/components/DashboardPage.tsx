"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';

export default function DashboardPage() {
  const supabase = getSupabase();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace('/');
    });
  }, [router, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl text-white">Bienvenido al tablero</h1>
    </div>
  );
}
