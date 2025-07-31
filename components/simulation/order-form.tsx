"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useOrderbookStore } from "@/store/orderbook-store";
import { EXCHANGES, POPULAR_SYMBOLS, ORDER_DELAYS } from "@/lib/exchanges";
import { calculateOrderImpact } from "@/lib/orderbook-calculations";
import { OrderSimulation } from "@/types/orderbook";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const orderSchema = z.object({
  exchange: z.string().min(1, "Exchange is required"),
  symbol: z.string().min(1, "Symbol is required"),
  side: z.enum(["buy", "sell"]),
  type: z.enum(["market", "limit"]),
  price: z.number().optional(),
  quantity: z.number().min(0.001, "Quantity must be greater than 0"),
  delay: z.number().min(0),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
  className?: string;
}

export function OrderForm({ className }: OrderFormProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const { selectedExchange, selectedSymbol, orderbooks, addSimulation } =
    useOrderbookStore();

  const orderbook = orderbooks[`${selectedExchange}-${selectedSymbol}`];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      exchange: selectedExchange,
      symbol: selectedSymbol,
      side: "buy",
      type: "market",
      quantity: 1,
      delay: 0,
    },
  });

  const watchedValues = watch();
  const isLimitOrder = watchedValues.type === "limit";

  const simulationResults = (() => {
    if (!orderbook || !watchedValues.quantity) return null;

    const levels =
      watchedValues.side === "buy" ? orderbook.asks : orderbook.bids;
    return calculateOrderImpact(
      watchedValues.side,
      watchedValues.quantity,
      watchedValues.price,
      levels
    );
  })();

  const onSubmit = async (data: OrderFormData) => {
    if (!orderbook) {
      toast.error("No orderbook data available");
      return;
    }

    setIsSimulating(true);

    try {
      const levels = data.side === "buy" ? orderbook.asks : orderbook.bids;
      const impact = calculateOrderImpact(
        data.side,
        data.quantity,
        data.price,
        levels
      );

      const simulation: OrderSimulation = {
        id: `sim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        exchange: data.exchange,
        symbol: data.symbol,
        side: data.side,
        type: data.type,
        price: data.price,
        quantity: data.quantity,
        delay: data.delay,
        ...impact,
        timestamp: Date.now(),
      };

      if (data.delay > 0) {
        toast.info(`Order simulation scheduled for ${data.delay / 1000}s`);
        setTimeout(() => {
          addSimulation(simulation);
          toast.success("Order simulation executed!");
        }, data.delay);
      } else {
        addSimulation(simulation);
        toast.success("Order simulation executed!");
      }
    } catch (error) {
      toast.error("Failed to simulate order");
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Order Simulation</span>
          {simulationResults?.marketImpact &&
            simulationResults.marketImpact > 5 && (
              <Badge variant="destructive" className="ml-2">
                <AlertTriangle className="w-3 h-3 mr-1" />
                High Impact
              </Badge>
            )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exchange">Exchange</Label>
              <Select
                value={watchedValues.exchange}
                onValueChange={(value) => setValue("exchange", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(EXCHANGES).map((exchange) => (
                    <SelectItem key={exchange.id} value={exchange.id}>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: exchange.color }}
                        />
                        <span>{exchange.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Select
                value={watchedValues.symbol}
                onValueChange={(value) => setValue("symbol", value)}
              >
                <SelectTrigger>
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
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Side</Label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={watchedValues.side === "buy" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setValue("side", "buy")}
                >
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Buy
                </Button>
                <Button
                  type="button"
                  variant={
                    watchedValues.side === "sell" ? "default" : "outline"
                  }
                  className="flex-1"
                  onClick={() => setValue("side", "sell")}
                >
                  <TrendingDown className="w-4 h-4 mr-1" />
                  Sell
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={watchedValues.type}
                onValueChange={(value: "market" | "limit") =>
                  setValue("type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market</SelectItem>
                  <SelectItem value="limit">Limit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {isLimitOrder && (
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>
            )}

            <div className={`space-y-2 ${!isLimitOrder ? "col-span-2" : ""}`}>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                step="0.0001"
                placeholder="0.0000"
                {...register("quantity", { valueAsNumber: true })}
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">
                  {errors.quantity.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Execution Delay</Label>
            <Select
              value={watchedValues.delay.toString()}
              onValueChange={(value) => setValue("delay", parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_DELAYS.map((delay) => (
                  <SelectItem key={delay.value} value={delay.value.toString()}>
                    {delay.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={isSimulating}>
            {isSimulating ? "Simulating..." : "Simulate Order"}
          </Button>
        </form>
        {simulationResults && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Simulation Preview</h4>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Est. Fill:</span>
                  <Badge
                    variant={
                      simulationResults.estimatedFill >= 95
                        ? "default"
                        : "secondary"
                    }
                    className="ml-2"
                  >
                    {simulationResults.estimatedFill.toFixed(1)}%
                  </Badge>
                </div>

                <div>
                  <span className="text-muted-foreground">Slippage:</span>
                  <Badge
                    variant={
                      simulationResults.slippage > 1
                        ? "destructive"
                        : "secondary"
                    }
                    className="ml-2"
                  >
                    {simulationResults.slippage.toFixed(2)}%
                  </Badge>
                </div>

                <div>
                  <span className="text-muted-foreground">Market Impact:</span>
                  <Badge
                    variant={
                      simulationResults.marketImpact > 5
                        ? "destructive"
                        : "secondary"
                    }
                    className="ml-2"
                  >
                    {simulationResults.marketImpact.toFixed(2)}%
                  </Badge>
                </div>

                <div>
                  <span className="text-muted-foreground">Est. Time:</span>
                  <span className="ml-2 text-xs">
                    {(simulationResults.estimatedTimeToFill / 1000).toFixed(1)}s
                  </span>
                </div>
              </div>

              {simulationResults.marketImpact > 5 && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium text-destructive">
                      High Market Impact Warning
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    This order may significantly move the market price and cause
                    high slippage.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
