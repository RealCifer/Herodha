"use client";

import { useEffect, useState } from "react";
import { fetchPortfolio } from "./lib/api";

type Stock = {
  symbol: string;
  name: string;
  exchange: "NSE" | "BSE";
  quantity: number;
  purchasePrice: number;
  cmp?: number;
  presentValue?: number;
  gainLoss?: number;
  portfolioPercent?: number;
  peRatio?: number;
  latestEarnings?: string;
};

type Sector = {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  gainLoss: number;
};

type Portfolio = {
  stocks: Stock[];
  sectors: Sector[];
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  lastUpdated: string;
  source?: "fresh" | "cache";
};

export default function Home() {
  const [data, setData] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchPortfolio();
      setData(res);
      setError("");
    } catch {
      setError("Unable to load portfolio data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 p-8 text-white">
        <div className="animate-pulse space-y-4 max-w-6xl mx-auto">
          <div className="h-6 bg-neutral-700 rounded w-1/3"></div>
          <div className="h-32 bg-neutral-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 p-8 text-red-500">
        {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="max-w-6xl mx-auto bg-neutral-900 rounded-xl p-6 shadow-lg">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Portfolio Dashboard</h1>
          {data.source && (
            <span
              className={`text-xs px-2 py-1 rounded ${
                data.source === "fresh"
                  ? "bg-green-600 text-white"
                  : "bg-yellow-500 text-black"
              }`}
            >
              {data.source === "fresh" ? "LIVE" : "CACHED"}
            </span>
          )}
        </div>

        {}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <SummaryCard title="Investment" value={data.totalInvestment} />
          <SummaryCard title="Present Value" value={data.totalPresentValue} />
          <SummaryCard
            title="Gain / Loss"
            value={data.totalGainLoss}
            highlight
          />
        </div>

        {}
        <table className="w-full border border-neutral-700 mb-10 text-sm">
          <thead className="bg-neutral-800 text-neutral-300">
            <tr>
              <th className="p-2 border">Symbol</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Exch</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Buy</th>
              <th className="p-2 border">CMP</th>
              <th className="p-2 border">Value</th>
              <th className="p-2 border">% Port</th>
              <th className="p-2 border">P/E</th>
              <th className="p-2 border">Earnings</th>
              <th className="p-2 border">P/L</th>
            </tr>
          </thead>
          <tbody>
            {data.stocks.map((s) => {
              const gain = s.gainLoss ?? 0;
              const positive = gain >= 0;

              return (
                <tr key={s.symbol} className="hover:bg-neutral-800">
                  <td className="p-2 border font-medium">{s.symbol}</td>
                  <td className="p-2 border">{s.name}</td>
                  <td className="p-2 border">{s.exchange}</td>
                  <td className="p-2 border">{s.quantity}</td>
                  <td className="p-2 border">₹{s.purchasePrice}</td>
                  <td className="p-2 border">₹{s.cmp ?? "-"}</td>
                  <td className="p-2 border">
                    ₹{Math.round(s.presentValue ?? 0)}
                  </td>
                  <td className="p-2 border">
                    {s.portfolioPercent?.toFixed(2)}%
                  </td>
                  <td className="p-2 border">{s.peRatio ?? "-"}</td>
                  <td className="p-2 border text-xs">
                    {s.latestEarnings ?? "-"}
                  </td>
                  <td
                    className={`p-2 border font-semibold ${
                      positive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {positive ? "▲" : "▼"} ₹{Math.round(gain)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {}
        <h2 className="text-lg font-semibold mb-3">Sector Summary</h2>

        <table className="w-full border border-neutral-700 text-sm">
          <thead className="bg-neutral-800 text-neutral-300">
            <tr>
              <th className="p-2 border">Sector</th>
              <th className="p-2 border">Investment</th>
              <th className="p-2 border">Present Value</th>
              <th className="p-2 border">Gain / Loss</th>
            </tr>
          </thead>
          <tbody>
            {data.sectors.map((s) => (
              <tr key={s.sector} className="hover:bg-neutral-800">
                <td className="p-2 border font-medium">{s.sector}</td>
                <td className="p-2 border">
                  ₹{Math.round(s.totalInvestment)}
                </td>
                <td className="p-2 border">
                  ₹{Math.round(s.totalPresentValue)}
                </td>
                <td
                  className={`p-2 border font-semibold ${
                    s.gainLoss >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  ₹{Math.round(s.gainLoss)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-sm text-neutral-400 mt-4">
          Last updated:{" "}
          {new Date(data.lastUpdated).toLocaleTimeString()}
        </p>
      </div>
    </main>
  );
}

function SummaryCard({
  title,
  value,
  highlight,
}: {
  title: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="border border-neutral-700 p-4 rounded bg-neutral-800">
      <p className="text-sm text-neutral-400">{title}</p>
      <p
        className={`text-xl font-bold ${
          highlight
            ? value >= 0
              ? "text-green-500"
              : "text-red-500"
            : "text-white"
        }`}
      >
        ₹{Math.round(value)}
      </p>
    </div>
  );
}
