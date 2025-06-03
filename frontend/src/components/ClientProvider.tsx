"use client";

import { ToastProvider } from "@/providers/ToastProvider";
import { WalletProvider } from "@/providers/WalletProvider";
import { NeroProvider } from "@/providers/NeroProvider";
import { useState, useEffect } from "react";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by only rendering NERO on client
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <NeroProvider>
      <WalletProvider>
        <ToastProvider>
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {children}
          </div>
        </ToastProvider>
      </WalletProvider>
    </NeroProvider>
  );
} 