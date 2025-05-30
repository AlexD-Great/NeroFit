import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ToastProvider } from "@/providers/ToastProvider";
import { WalletProvider } from "@/providers/WalletProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NeroFit - Fitness Rewards on Blockchain",
  description: "Earn cryptocurrency rewards for completing fitness challenges",
};

// Loading component for better UX
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <p className="text-white/70">Loading NeroFit...</p>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DynamicContextProvider
          settings={{
            environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID || "c38730b6-370b-4f8d-b43e-ec06c6b8416d",
            walletConnectors: [EthereumWalletConnectors],
            appName: "NeroFit",
            appLogoUrl: "/favicon.ico",
            cssOverrides: `
              .dynamic-widget-card {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 12px;
              }
              .dynamic-widget-button {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                border-radius: 8px;
                color: white;
                font-weight: 600;
                padding: 12px 24px;
                transition: all 0.3s ease;
              }
              .dynamic-widget-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
              }
            `,
            initialAuthenticationMode: 'connect-only',
          }}
        >
          <WalletProvider>
            <ToastProvider>
              <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                {children}
              </div>
            </ToastProvider>
          </WalletProvider>
        </DynamicContextProvider>
      </body>
    </html>
  );
}
