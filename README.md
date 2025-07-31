# Real-Time Orderbook Viewer with Order Simulation

A production-ready Next.js application for visualizing cryptocurrency orderbooks and simulating order execution across multiple exchanges (OKX, Bybit, Deribit).

## Features

### 🔄 Real-Time Orderbook Data

- Live orderbook data from OKX, Bybit, and Deribit
- WebSocket connections for low-latency updates
- 15 bid/ask levels with real-time price updates
- Automatic reconnection handling

### 📊 Advanced Visualization

- Interactive orderbook table with color-coded bid/ask levels
- Market depth charts using Recharts
- Orderbook imbalance indicators
- Responsive design for all device sizes

### 🎯 Order Simulation

- Market and limit order simulation
- Real-time market impact calculations
- Slippage and fill estimation
- Delayed execution options (immediate, 5s, 10s, 30s, 1m)
- Visual order placement in orderbook

### 🚨 Risk Analysis

- High market impact warnings
- Slippage calculations and alerts
- Estimated time to fill
- Order size optimization suggestions

### 🎨 Modern UI/UX

- Clean, professional dashboard layout
- Dark/light mode toggle
- Smooth animations and transitions
- Mobile-responsive design
- Real-time status indicators

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **WebSocket**: Native WebSocket API
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-repo/orderbook-simulator.git
cd orderbook-simulator
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Viewing Orderbooks

1. **Select Exchange**: Use the sidebar to choose between OKX, Bybit, or Deribit
2. **Choose Symbol**: Select a trading pair from the header dropdown (BTC-USDT, ETH-USDT, etc.)
3. **Monitor Data**: View real-time orderbook updates and depth charts

### Simulating Orders

1. **Configure Order**:

   - Select exchange and symbol
   - Choose buy/sell side
   - Set order type (market/limit)
   - Enter quantity and price (for limit orders)
   - Select execution delay if needed

2. **Review Impact**:

   - Check estimated fill percentage
   - Review slippage calculations
   - Monitor market impact warnings
   - Verify estimated execution time

3. **Execute Simulation**:
   - Click "Simulate Order" to place the virtual order
   - Watch the order appear in the orderbook visualization
   - Review results in the simulation panel

### Understanding Results

- **Estimated Fill**: Percentage of order that can be filled at current market depth
- **Slippage**: Price difference between expected and actual execution price
- **Market Impact**: How much the order would move the market price
- **Time to Fill**: Estimated time for complete order execution

## API Integration

### WebSocket Endpoints

The application connects to official exchange WebSocket APIs:

- **OKX**: `wss://ws.okx.com:8443/ws/v5/public`
- **Bybit**: `wss://stream.bybit.com/v5/public/spot`
- **Deribit**: `wss://www.deribit.com/ws/api/v2`

### Authentication

No API keys are required for public market data. The application uses read-only endpoints for orderbook information.

## Configuration

### Exchange Configuration

Modify `lib/exchanges.ts` to customize:

- WebSocket URLs
- Color schemes
- Supported symbols
- Connection parameters

### Key Components

- `OrderbookTable`: Real-time orderbook display
- `DepthChart`: Market depth visualization
- `OrderForm`: Order simulation interface
- `SimulationResults`: Results display and management
- `useWebSocket`: WebSocket connection management

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
