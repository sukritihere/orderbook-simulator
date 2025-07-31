"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrderbookStore } from "@/store/orderbook-store";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from "recharts";

interface DepthChartProps {
  className?: string;
}

export function DepthChart({ className }: DepthChartProps) {
  const { selectedExchange, selectedSymbol, orderbooks } = useOrderbookStore();

  const orderbook = orderbooks[`${selectedExchange}-${selectedSymbol}`];

  const chartData = useMemo(() => {
    if (!orderbook) return [];

    const bids = orderbook.bids.slice(0, 20);
    const asks = orderbook.asks.slice(0, 20);

    let bidTotal = 0;
    let askTotal = 0;

    const bidData = bids
      .map((bid) => {
        bidTotal += bid.size;
        return {
          price: bid.price,
          bidDepth: bidTotal,
          askDepth: null,
          side: "bid",
        };
      })
      .reverse();

    const askData = asks.map((ask) => {
      askTotal += ask.size;
      return {
        price: ask.price,
        bidDepth: null,
        askDepth: askTotal,
        side: "ask",
      };
    });

    return [...bidData, ...askData].sort((a, b) => a.price - b.price);
  }, [orderbook]);

  const midPrice = useMemo(() => {
    if (!orderbook || !orderbook.bids.length || !orderbook.asks.length)
      return 0;
    return (orderbook.bids[0].price + orderbook.asks[0].price) / 2;
  }, [orderbook]);

  if (!orderbook) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Market Depth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Loading depth chart...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Market Depth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="bidGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="askGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="price"
                type="number"
                scale="linear"
                domain={["dataMin", "dataMax"]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-medium">
                          Price: $
                          {typeof label === "number"
                            ? `$${label.toFixed(2)}`
                            : label}
                        </p>
                        {data.bidDepth && (
                          <p className="text-green-600">
                            Bid Depth: {data.bidDepth.toFixed(4)}
                          </p>
                        )}
                        {data.askDepth && (
                          <p className="text-red-600">
                            Ask Depth: {data.askDepth.toFixed(4)}
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Area
                type="stepAfter"
                dataKey="bidDepth"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#bidGradient)"
                connectNulls={false}
              />

              <Area
                type="stepBefore"
                dataKey="askDepth"
                stroke="#ef4444"
                strokeWidth={2}
                fill="url(#askGradient)"
                connectNulls={false}
              />

              <ReferenceLine
                x={midPrice}
                stroke="var(--muted-foreground)"
                strokeDasharray="2 2"
                strokeWidth={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
