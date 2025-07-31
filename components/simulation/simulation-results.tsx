"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useOrderbookStore } from "@/store/orderbook-store";
import { formatCurrency, formatPrice } from "@/lib/orderbook-calculations";
import { EXCHANGES } from "@/lib/exchanges";
import { X, TrendingUp, TrendingDown, Clock, Target } from "lucide-react";
import ClientTime from "../ClientTime";

interface SimulationResultsProps {
  className?: string;
}

export function SimulationResults({ className }: SimulationResultsProps) {
  const { simulations, removeSimulation, clearSimulations } =
    useOrderbookStore();

  if (simulations.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Simulation Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            No simulations yet. Submit an order to see results.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Simulation Results</span>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{simulations.length}</Badge>
            <Button variant="outline" size="sm" onClick={clearSimulations}>
              Clear All
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {simulations.map((simulation, index) => {
          const exchange =
            EXCHANGES[simulation.exchange as keyof typeof EXCHANGES];

          return (
            <div key={simulation.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: exchange?.color }}
                  />
                  <span className="text-sm font-medium">
                    {exchange?.name} - {simulation.symbol}
                  </span>
                  <Badge
                    variant={
                      simulation.side === "buy" ? "default" : "destructive"
                    }
                  >
                    {simulation.side === "buy" ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {simulation.side.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">
                    {simulation.type.toUpperCase()}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSimulation(simulation.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-mono">{simulation.quantity}</span>
                  </div>
                  {simulation.price && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-mono">
                        {formatPrice(simulation.price)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Est. Fill:</span>
                    <Badge
                      variant={
                        simulation.estimatedFill >= 95 ? "default" : "secondary"
                      }
                    >
                      {simulation.estimatedFill.toFixed(1)}%
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Slippage:</span>
                    <Badge
                      variant={
                        simulation.slippage > 1 ? "destructive" : "secondary"
                      }
                    >
                      {simulation.slippage.toFixed(2)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Impact:</span>
                    <Badge
                      variant={
                        simulation.marketImpact > 5
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {simulation.marketImpact.toFixed(2)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <div className="flex items-center space-x-1 text-xs">
                      <Clock className="h-3 w-3" />
                      <span>
                        {(simulation.estimatedTimeToFill / 1000).toFixed(1)}s
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {simulation.delay > 0 && (
                <div className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-600">
                    Delayed execution: {simulation.delay / 1000}s
                  </span>
                </div>
              )}

              <ClientTime
                timestamp={simulation.timestamp}
                prefix="Simulated at"
              />

              {index < simulations.length - 1 && <Separator />}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
