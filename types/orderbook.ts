export interface OrderbookLevel {
  price: number;
  size: number;
  total?: number;
}

export interface Orderbook {
  bids: OrderbookLevel[];
  asks: OrderbookLevel[];
  timestamp: number;
  symbol: string;
}

export interface Exchange {
  id: 'okx' | 'bybit' | 'deribit';
  name: string;
  wsUrl: string;
  restUrl: string;
  color: string;
}

export interface OrderSimulation {
  id: string;
  exchange: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  price?: number;
  quantity: number;
  delay: number;
  estimatedFill: number;
  slippage: number;
  marketImpact: number;
  estimatedTimeToFill: number;
  timestamp: number;
}

export interface WebSocketMessage {
  channel: string;
  data: any;
  timestamp: number;
}

export interface OrderbookState {
  selectedExchange: Exchange['id'];
  selectedSymbol: string;
  orderbooks: Record<string, Orderbook>;
  isConnected: boolean;
  lastUpdate: number;
  simulations: OrderSimulation[];
  isDarkMode: boolean;
}