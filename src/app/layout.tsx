import type { Metadata } from "next";
import "./globals.css";
import { Geist, JetBrains_Mono, Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/providers/Providers";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const inter = Inter({ subsets: ['latin'], variable: '--font-headline' });

export const metadata: Metadata = {
  title: "Spendly — Track smarter, live better",
  description: "Track your finances with editorial precision.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("dark h-full", "font-sans", geist.variable, mono.variable, inter.variable)}>
      <body className="min-h-full bg-[#0e141a] text-[#dee3ec] antialiased">
        <Providers>
          {children}
        </Providers>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
