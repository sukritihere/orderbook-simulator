'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrderbookStore } from '@/store/orderbook-store';
import { OrderbookLevel } from '@/types/orderbook';
import { formatPrice, formatSize, calculateOrderbookImbalance } from '@/lib/orderbook-calculations';
import { cn } from '@/lib/utils';

interface OrderbookTableProps {
  className?: string;
}

export function OrderbookTable({ className }: OrderbookTableProps) {
  const { selectedExchange, selectedSymbol, orderbooks, simulations } = useOrderbookStore();
  
  const orderbook = orderbooks[`${selectedExchange}-${selectedSymbol}`];
  
  const { bids, asks, spread, imbalance } = useMemo(() => {
    if (!orderbook) {
      return { bids: [], asks: [], spread: 0, imbalance: 50 };
    }

    const topBid = orderbook.bids[0]?.price || 0;
    const topAsk = orderbook.asks[0]?.price || 0;
    const spread = topAsk - topBid;
    const imbalance = calculateOrderbookImbalance(orderbook.bids, orderbook.asks);

    return {
      bids: orderbook.bids.slice(0, 15),
      asks: orderbook.asks.slice(0, 15),
      spread,
      imbalance,
    };
  }, [orderbook]);

  const getRowHighlight = (price: number, side: 'bid' | 'ask') => {
    const simulation = simulations.find(sim => 
      sim.exchange === selectedExchange && 
      sim.symbol === selectedSymbol &&
      sim.side === (side === 'bid' ? 'buy' : 'sell') &&
      Math.abs((sim.price || 0) - price) < 0.01
    );
    
    return simulation ? 'ring-2 ring-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : '';
  };

  if (!orderbook) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Order Book
            <Badge variant="outline">Loading...</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Connecting to exchange...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Order Book - {selectedSymbol}</span>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              Spread: {formatPrice(spread)}
            </Badge>
            <Badge 
              variant={imbalance > 55 ? "default" : imbalance < 45 ? "destructive" : "secondary"}
            >
              {imbalance.toFixed(1)}% Bid
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Asks */}
          <div className="space-y-0">
            <div className="px-4 py-2 bg-muted text-xs font-medium grid grid-cols-3 gap-2">
              <span>Price</span>
              <span className="text-right">Size</span>
              <span className="text-right">Total</span>
            </div>
            {asks.slice().reverse().map((ask, index) => (
              <div
                key={`ask-${index}`}
                className={cn(
                  "px-4 py-1 text-xs grid grid-cols-3 gap-2 border-b border-border/50 hover:bg-muted/50 transition-colors",
                  "text-red-600 dark:text-red-400",
                  getRowHighlight(ask.price, 'ask')
                )}
              >
                <span className="font-mono">{formatPrice(ask.price)}</span>
                <span className="text-right font-mono">{formatSize(ask.size)}</span>
                <span className="text-right font-mono text-muted-foreground">
                  {formatSize(ask.price * ask.size)}
                </span>
              </div>
            ))}
          </div>

          {/* Bids */}
          <div className="space-y-0">
            <div className="px-4 py-2 bg-muted text-xs font-medium grid grid-cols-3 gap-2">
              <span>Price</span>
              <span className="text-right">Size</span>
              <span className="text-right">Total</span>
            </div>
            {bids.map((bid, index) => (
              <div
                key={`bid-${index}`}
                className={cn(
                  "px-4 py-1 text-xs grid grid-cols-3 gap-2 border-b border-border/50 hover:bg-muted/50 transition-colors",
                  "text-green-600 dark:text-green-400",
                  getRowHighlight(bid.price, 'bid')
                )}
              >
                <span className="font-mono">{formatPrice(bid.price)}</span>
                <span className="text-right font-mono">{formatSize(bid.size)}</span>
                <span className="text-right font-mono text-muted-foreground">
                  {formatSize(bid.price * bid.size)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}