'use client';

import { useState } from 'react';
import { createSupabaseBrowser } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const tabClasses = (active: boolean) =>
  `px-4 py-2 rounded-full text-sm cursor-pointer transition-colors ${active ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'}`;

export default function AuthCard() {
  const supabase = createSupabaseBrowser();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else router.push('/dashboard');
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else router.push('/dashboard');
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 w-full max-w-sm text-white">
      <div className="flex justify-center mb-4 gap-2">
        <button className={tabClasses(tab === 'login')} onClick={() => setTab('login')}>Entrar</button>
        <button className={tabClasses(tab === 'signup')} onClick={() => setTab('signup')}>Crear cuenta</button>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {tab === 'login' ? (
          <motion.div key="login" initial={{ rotateY: 180 }} animate={{ rotateY: 0 }} exit={{ rotateY: -180 }} transition={{ duration: 0.2 }} className="[backface-visibility:hidden]">
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <label className="flex flex-col text-sm">
                Correo
                <input
                  type="email"
                  className="mt-1 px-2 py-1 rounded bg-black/20 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label className="flex flex-col text-sm">
                Contraseña
                <input
                  type="password"
                  className="mt-1 px-2 py-1 rounded bg-black/20 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 transition-colors rounded py-2 text-sm font-medium"
              >
                {loading ? 'Cargando...' : 'Entrar'}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div key="signup" initial={{ rotateY: 180 }} animate={{ rotateY: 0 }} exit={{ rotateY: -180 }} transition={{ duration: 0.2 }} className="[backface-visibility:hidden]">
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSignUp();
              }}
            >
              <label className="flex flex-col text-sm">
                Correo
                <input
                  type="email"
                  className="mt-1 px-2 py-1 rounded bg-black/20 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label className="flex flex-col text-sm">
                Contraseña
                <input
                  type="password"
                  className="mt-1 px-2 py-1 rounded bg-black/20 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 transition-colors rounded py-2 text-sm font-medium"
              >
                {loading ? 'Cargando...' : 'Crear cuenta'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

