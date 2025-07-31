import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Real-Time Orderbook Viewer | Advanced Order Simulation",
  description:
    "Professional real-time orderbook visualization with advanced order simulation for OKX, Bybit, and Deribit exchanges. Features depth charts, market impact analysis, and slippage calculations.",
  keywords:
    "orderbook, cryptocurrency, trading, real-time, order simulation, market depth, slippage analysis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider defaultTheme="dark">
          {children}
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
