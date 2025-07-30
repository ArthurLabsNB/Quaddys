// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portal de Quaddys",
  description: "Tu mente es tu mejor carta. Empieza en segundos."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-dvh bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
