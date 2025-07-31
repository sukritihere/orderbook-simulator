"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/dashboard/header";
import { OrderbookTable } from "@/components/orderbook/orderbook-table";
import { DepthChart } from "@/components/orderbook/depth-chart";
import { OrderForm } from "@/components/simulation/order-form";
import { SimulationResults } from "@/components/simulation/simulation-results";
import { useWebSocket } from "@/hooks/use-websocket";

export default function Home() {
  const { disconnect } = useWebSocket();

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border">
          <Header />
        </div>

        <div className="flex-1 p-4 overflow-auto">
          <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <OrderbookTable className="flex-1" />
              <DepthChart className="h-80" />
            </div>

            <div className="space-y-4">
              <OrderForm />
              <SimulationResults />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
