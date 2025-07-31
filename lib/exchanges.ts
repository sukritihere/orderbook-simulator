import { Exchange } from '@/types/orderbook';

export const EXCHANGES: Record<string, Exchange> = {
  okx: {
    id: 'okx',
    name: 'OKX',
    wsUrl: 'wss://ws.okx.com:8443/ws/v5/public',
    restUrl: 'https://www.okx.com/api/v5',
    color: '#00D4FF',
  },
  bybit: {
    id: 'bybit',
    name: 'Bybit',
    wsUrl: 'wss://stream.bybit.com/v5/public/spot',
    restUrl: 'https://api.bybit.com/v5',
    color: '#F7A600',
  },
  deribit: {
    id: 'deribit',
    name: 'Deribit',
    wsUrl: 'wss://www.deribit.com/ws/api/v2',
    restUrl: 'https://www.deribit.com/api/v2',
    color: '#FF6B6B',
  },
};

export const POPULAR_SYMBOLS = [
  'BTC-USDT',
  'ETH-USDT',
  'BTC-USD',
  'ETH-USD',
  'SOL-USDT',
  'ADA-USDT',
];

export const ORDER_DELAYS = [
  { label: 'Immediate', value: 0 },
  { label: '5 seconds', value: 5000 },
  { label: '10 seconds', value: 10000 },
  { label: '30 seconds', value: 30000 },
  { label: '1 minute', value: 60000 },
];