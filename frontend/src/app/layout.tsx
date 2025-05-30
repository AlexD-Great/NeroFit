import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/providers/WalletProvider";
import { ToastProvider } from "@/providers/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NeroFit - Fitness Rewards on Blockchain",
  description: "Earn cryptocurrency rewards for completing fitness challenges",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <WalletProvider>
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
              {children}
            </div>
          </WalletProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
