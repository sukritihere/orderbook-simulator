import { create } from "zustand";
import {
  OrderbookState,
  Exchange,
  Orderbook,
  OrderSimulation,
} from "@/types/orderbook";
import { EXCHANGES } from "@/lib/exchanges";

interface OrderbookActions {
  setSelectedExchange: (exchange: Exchange["id"]) => void;
  setSelectedSymbol: (symbol: string) => void;
  updateOrderbook: (key: string, orderbook: Orderbook) => void;
  setConnectionStatus: (connected: boolean) => void;
  addSimulation: (simulation: OrderSimulation) => void;
  removeSimulation: (id: string) => void;
  clearSimulations: () => void;
  toggleDarkMode: () => void;
}

export const useOrderbookStore = create<OrderbookState & OrderbookActions>(
  (set, get) => ({
    selectedExchange: "okx",
    selectedSymbol: "BTC-USDT",
    orderbooks: {},
    isConnected: false,
    lastUpdate: Date.now(),
    simulations: [],
    isDarkMode: false,

    setSelectedExchange: (exchange) => {
      set({ selectedExchange: exchange });
    },

    setSelectedSymbol: (symbol) => {
      set({ selectedSymbol: symbol });
    },

    updateOrderbook: (key, orderbook) => {
      set((state) => ({
        orderbooks: {
          ...state.orderbooks,
          [key]: orderbook,
        },
        lastUpdate: Date.now(),
      }));
    },

    setConnectionStatus: (connected) => {
      set({ isConnected: connected });
    },

    addSimulation: (simulation) => {
      set((state) => ({
        simulations: [simulation, ...state.simulations.slice(0, 9)],
      }));
    },

    removeSimulation: (id) => {
      set((state) => ({
        simulations: state.simulations.filter((sim) => sim.id !== id),
      }));
    },

    clearSimulations: () => {
      set({ simulations: [] });
    },

    toggleDarkMode: () => {
      set((state) => ({ isDarkMode: !state.isDarkMode }));
    },
  })
);
