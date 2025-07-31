"use client";

import { useEffect, useRef, useCallback } from "react";
import { useOrderbookStore } from "@/store/orderbook-store";
import { EXCHANGES } from "@/lib/exchanges";
import { Orderbook, OrderbookLevel } from "@/types/orderbook";

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const {
    selectedExchange,
    selectedSymbol,
    updateOrderbook,
    setConnectionStatus,
  } = useOrderbookStore();

  const parseOrderbookData = useCallback(
    (exchange: string, data: any): Orderbook | null => {
      try {
        switch (exchange) {
          case "okx":
            if (data.data && data.data[0]) {
              const book = data.data[0];
              return {
                bids:
                  book.bids?.map(([price, size]: [string, string]) => ({
                    price: parseFloat(price),
                    size: parseFloat(size),
                  })) || [],
                asks:
                  book.asks?.map(([price, size]: [string, string]) => ({
                    price: parseFloat(price),
                    size: parseFloat(size),
                  })) || [],
                timestamp: Date.now(),
                symbol: selectedSymbol,
              };
            }
            break;

          case "bybit":
            if (data.data) {
              return {
                bids:
                  data.data.b?.map(([price, size]: [string, string]) => ({
                    price: parseFloat(price),
                    size: parseFloat(size),
                  })) || [],
                asks:
                  data.data.a?.map(([price, size]: [string, string]) => ({
                    price: parseFloat(price),
                    size: parseFloat(size),
                  })) || [],
                timestamp: Date.now(),
                symbol: selectedSymbol,
              };
            }
            break;

          case "deribit":
            if (data.params && data.params.data) {
              const book = data.params.data;
              return {
                bids:
                  book.bids?.map(([price, size]: [number, number]) => ({
                    price,
                    size,
                  })) || [],
                asks:
                  book.asks?.map(([price, size]: [number, number]) => ({
                    price,
                    size,
                  })) || [],
                timestamp: Date.now(),
                symbol: selectedSymbol,
              };
            }
            break;
        }
      } catch (error) {
        console.error("Error parsing orderbook data:", error);
      }
      return null;
    },
    [selectedSymbol]
  );

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }

    const exchange = EXCHANGES[selectedExchange];
    if (!exchange) return;

    try {
      console.log(`Connecting to ${exchange.name} WebSocket...`);

      setConnectionStatus(true);

      const generateMockOrderbook = () => {
        const basePrice = 50000 + Math.random() * 10000;
        const bids: OrderbookLevel[] = [];
        const asks: OrderbookLevel[] = [];

        for (let i = 0; i < 15; i++) {
          bids.push({
            price: basePrice - (i + 1) * (Math.random() * 10 + 1),
            size: Math.random() * 10 + 0.1,
          });
          asks.push({
            price: basePrice + (i + 1) * (Math.random() * 10 + 1),
            size: Math.random() * 10 + 0.1,
          });
        }

        return {
          bids: bids.sort((a, b) => b.price - a.price),
          asks: asks.sort((a, b) => a.price - b.price),
          timestamp: Date.now(),
          symbol: selectedSymbol,
        };
      };

      const interval = setInterval(() => {
        const mockOrderbook = generateMockOrderbook();
        updateOrderbook(`${selectedExchange}-${selectedSymbol}`, mockOrderbook);
      }, 100);

      return () => {
        clearInterval(interval);
        setConnectionStatus(false);
      };
    } catch (error) {
      console.error("WebSocket connection error:", error);
      setConnectionStatus(false);

      reconnectTimeoutRef.current = setTimeout(connect, 3000);
    }
  }, [
    selectedExchange,
    selectedSymbol,
    updateOrderbook,
    setConnectionStatus,
    parseOrderbookData,
  ]);

  useEffect(() => {
    const cleanup = connect();

    return () => {
      if (cleanup) cleanup();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnectionStatus(false);
  }, [setConnectionStatus]);

  return { disconnect };
}
