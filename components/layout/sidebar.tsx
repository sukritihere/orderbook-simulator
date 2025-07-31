"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOrderbookStore } from "@/store/orderbook-store";
import { EXCHANGES } from "@/lib/exchanges";
import {
  TrendingUp,
  Settings,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Activity,
} from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const { selectedExchange, setSelectedExchange, isConnected, simulations } =
    useOrderbookStore();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleResize = () => {
      setIsCollapsed(!mediaQuery.matches);
    };

    handleResize();
    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  return (
    <div
      className={cn(
        "h-full bg-background border-r border-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">OrderBook</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                isConnected ? "bg-green-500" : "bg-red-500"
              )}
            />
            {!isCollapsed && (
              <span className="text-sm text-muted-foreground">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 px-0 md:p-4 space-y-4 overflow-auto">
          {!isCollapsed && (
            <h3 className="font-semibold text-sm text-muted-foreground uppercase">
              Exchanges
            </h3>
          )}

          <div className="space-y-2">
            {Object.values(EXCHANGES).map((exchange) => {
              const isSelected = selectedExchange === exchange.id;

              return (
                <Button
                  key={exchange.id}
                  variant={isSelected ? "default" : "ghost"}
                  className={cn(
                    "w-full transition-all duration-200 items-center",
                    isCollapsed
                      ? "justify-center px-1 py-1"
                      : "justify-start px-1 py-1",
                    isSelected &&
                      "bg-white text-black shadow-sm scale-[1.02] px-4 py-1.5"
                  )}
                  onClick={() => setSelectedExchange(exchange.id)}
                >
                  <div
                    className={cn(
                      "flex items-center",
                      isCollapsed ? "gap-0.5" : "gap-2"
                    )}
                  >
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: exchange.color }}
                    />
                    {!isCollapsed && (
                      <span className="truncate text-[13px] sm:text-sm">
                        {exchange.name}
                      </span>
                    )}
                    {isCollapsed && (
                      <span className="text-[10px]">{exchange.name}</span>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
          {!isCollapsed && simulations.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                Active Simulations
              </h3>
              <Card className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4" />
                    <span className="text-sm">Running</span>
                  </div>
                  <Badge variant="secondary">{simulations.length}</Badge>
                </div>
              </Card>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-border space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start",
              isCollapsed && "justify-center px-0"
            )}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            {!isCollapsed && (
              <span className="ml-2">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start",
              isCollapsed && "justify-center px-0"
            )}
          >
            <Settings className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Settings</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}
