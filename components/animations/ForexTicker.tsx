"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TickerItem {
  pair: string;
  price: number;
  change: number;
  changePercent: number;
}

const INITIAL_TICKERS: TickerItem[] = [
  { pair: "EUR/USD", price: 1.0845, change: 0.0012, changePercent: 0.11 },
  { pair: "GBP/USD", price: 1.2734, change: -0.0023, changePercent: -0.18 },
  { pair: "USD/JPY", price: 149.82, change: 0.45, changePercent: 0.30 },
  { pair: "XAU/USD", price: 2034.56, change: 12.30, changePercent: 0.61 },
  { pair: "BTC/USD", price: 67234.12, change: 1234.50, changePercent: 1.87 },
  { pair: "USD/CHF", price: 0.8923, change: -0.0011, changePercent: -0.12 },
  { pair: "AUD/USD", price: 0.6543, change: 0.0034, changePercent: 0.52 },
  { pair: "EUR/GBP", price: 0.8512, change: -0.0008, changePercent: -0.09 },
  { pair: "GBP/JPY", price: 190.67, change: 0.89, changePercent: 0.47 },
  { pair: "NZD/USD", price: 0.6123, change: 0.0021, changePercent: 0.34 },
];

export function ForexTicker() {
  const [tickers, setTickers] = useState<TickerItem[]>(INITIAL_TICKERS);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickers((prev) =>
        prev.map((ticker) => {
          const volatility = ticker.pair.includes("BTC") ? 50 : ticker.pair.includes("XAU") ? 2 : 0.0005;
          const change = (Math.random() - 0.5) * volatility;
          const newPrice = Math.max(0.01, ticker.price + change);
          const newChange = ticker.change + change;
          const newPercent = (newChange / (newPrice - newChange)) * 100;
          return {
            ...ticker,
            price: newPrice,
            change: newChange,
            changePercent: newPercent,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const tickerContent = [...tickers, ...tickers];

  return (
    <div className="w-full bg-elite-card/90 backdrop-blur-md border-y border-elite-border/50 overflow-hidden py-3">
      <div className="flex animate-ticker whitespace-nowrap">
        {tickerContent.map((ticker, i) => (
          <div key={`${ticker.pair}-${i}`} className="flex items-center gap-3 px-6 border-r border-elite-border/30">
            <span className="font-mono font-semibold text-sm text-gray-300">{ticker.pair}</span>
            <span className="font-mono text-sm tabular-nums">
              {ticker.price.toFixed(ticker.pair.includes("JPY") ? 2 : ticker.pair.includes("BTC") || ticker.pair.includes("XAU") ? 2 : 4)}
            </span>
            <span className={`flex items-center gap-1 text-xs font-mono ${ticker.change >= 0 ? "text-elite-green" : "text-elite-red"}`}>
              {ticker.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {ticker.changePercent >= 0 ? "+" : ""}
              {ticker.changePercent.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
