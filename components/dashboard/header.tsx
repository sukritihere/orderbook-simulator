"use client";

import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useOrderbookStore } from "@/store/orderbook-store";
import { POPULAR_SYMBOLS } from "@/lib/exchanges";
import { Activity, Wifi, WifiOff } from "lucide-react";
import ClientTime from "../ClientTime";

export function Header() {
  const {
    selectedSymbol,
    setSelectedSymbol,
    isConnected,
    lastUpdate,
    simulations,
  } = useOrderbookStore();

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Real-Time Orderbook Viewer</h1>

          <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {POPULAR_SYMBOLS.map((symbol) => (
                <SelectItem key={symbol} value={symbol}>
                  {symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-4">
          {simulations.length > 0 && (
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <Badge variant="outline">{simulations.length} Active</Badge>
            </div>
          )}

          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600" />
            )}
            <span className="text-sm text-muted-foreground">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>

          <div className="text-xs text-muted-foreground">
            <ClientTime timestamp={lastUpdate} prefix="Last update:" />
          </div>
        </div>
      </div>
    </Card>
  );
}
