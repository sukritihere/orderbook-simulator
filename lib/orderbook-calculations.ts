import { OrderbookLevel, OrderSimulation } from "@/types/orderbook";

export function calculateOrderImpact(
  side: "buy" | "sell",
  quantity: number,
  price: number | undefined,
  levels: OrderbookLevel[]
): {
  estimatedFill: number;
  slippage: number;
  marketImpact: number;
  estimatedTimeToFill: number;
} {
  if (!levels.length) {
    return {
      estimatedFill: 0,
      slippage: 0,
      marketImpact: 0,
      estimatedTimeToFill: 0,
    };
  }

  let remainingQuantity = quantity;
  let totalCost = 0;
  let levelsConsumed = 0;
  const bestPrice = levels[0]?.price || 0;

  for (const level of levels) {
    if (remainingQuantity <= 0) break;

    const fillQuantity = Math.min(remainingQuantity, level.size);
    totalCost += fillQuantity * level.price;
    remainingQuantity -= fillQuantity;
    levelsConsumed++;
  }

  const filledQuantity = quantity - remainingQuantity;
  const averagePrice = filledQuantity > 0 ? totalCost / filledQuantity : 0;
  const estimatedFill = (filledQuantity / quantity) * 100;

  const targetPrice = price || bestPrice;
  const slippage =
    targetPrice > 0
      ? Math.abs((averagePrice - targetPrice) / targetPrice) * 100
      : 0;

  const totalDepth = levels.reduce((sum, level) => sum + level.size, 0);
  const marketImpact = (quantity / totalDepth) * 100;

  const estimatedTimeToFill = levelsConsumed * 1000 + Math.random() * 5000;

  return {
    estimatedFill,
    slippage,
    marketImpact,
    estimatedTimeToFill,
  };
}

export function calculateOrderbookImbalance(
  bids: OrderbookLevel[],
  asks: OrderbookLevel[]
): number {
  const bidVolume = bids.reduce((sum, level) => sum + level.size, 0);
  const askVolume = asks.reduce((sum, level) => sum + level.size, 0);
  const totalVolume = bidVolume + askVolume;

  return totalVolume > 0 ? (bidVolume / totalVolume) * 100 : 50;
}

export function formatPrice(price: number, decimals = 2): string {
  return price.toFixed(decimals);
}

export function formatSize(size: number): string {
  if (size >= 1000000) {
    return `${(size / 1000000).toFixed(2)}M`;
  } else if (size >= 1000) {
    return `${(size / 1000).toFixed(2)}K`;
  }
  return size.toFixed(4);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
