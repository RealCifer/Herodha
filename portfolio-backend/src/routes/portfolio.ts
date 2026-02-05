import { Router, Request, Response } from "express";
import InMemoryCache from "../utils/cache";
import { Portfolio } from "../models/portfolio";
import { Stock } from "../models/stock";
import { fetchYahooCMP } from "../services/yahoo";
import { fetchGoogleMetrics } from "../services/google";

const router = Router();
const portfolioCache = new InMemoryCache<Portfolio>(60);

router.get("/", async (_req: Request, res: Response) => {
  const cachedData = portfolioCache.get();
  if (cachedData) {
    return res.status(200).json({
      source: "cache",
      ...cachedData,
    });
  }

  const stocks: Stock[] = [
    {
      symbol: "TCS",
      name: "Tata Consultancy Services",
      exchange: "NSE",
      sector: "IT",
      purchasePrice: 3200,
      quantity: 10,
    },
    {
      symbol: "INFY",
      name: "Infosys",
      exchange: "NSE",
      sector: "IT",
      purchasePrice: 1500,
      quantity: 20,
    },
  ];

  let totalInvestment = 0;
  let totalPresentValue = 0;

  const sectorMap: Record<
    string,
    { totalInvestment: number; totalPresentValue: number }
  > = {};

  for (const stock of stocks) {
    stock.investment = stock.purchasePrice * stock.quantity;
    totalInvestment += stock.investment;

    const cmp = await fetchYahooCMP(stock.symbol, stock.exchange);
    stock.cmp = cmp ?? stock.purchasePrice;

    stock.presentValue = stock.cmp * stock.quantity;
    stock.gainLoss = stock.presentValue - stock.investment;

    totalPresentValue += stock.presentValue;

    const { peRatio, latestEarnings } = await fetchGoogleMetrics(
      stock.symbol,
      stock.exchange
    );

    stock.peRatio = peRatio ?? undefined;
    stock.latestEarnings = latestEarnings ?? undefined;

    if (!sectorMap[stock.sector]) {
      sectorMap[stock.sector] = {
        totalInvestment: 0,
        totalPresentValue: 0,
      };
    }

    sectorMap[stock.sector].totalInvestment += stock.investment;
    sectorMap[stock.sector].totalPresentValue += stock.presentValue;
  }
  for (const stock of stocks) {
    stock.portfolioPercent =
      totalPresentValue > 0
        ? (stock.presentValue! / totalPresentValue) * 100
        : 0;
  }
  const sectors = Object.entries(sectorMap).map(
    ([sector, values]) => ({
      sector,
      totalInvestment: values.totalInvestment,
      totalPresentValue: values.totalPresentValue,
      gainLoss: values.totalPresentValue - values.totalInvestment,
    })
  );

  const portfolio: Portfolio = {
    stocks,
    totalInvestment,
    totalPresentValue,
    totalGainLoss: totalPresentValue - totalInvestment,
    sectors,
    lastUpdated: new Date().toISOString(),
  };

  portfolioCache.set(portfolio);

  return res.status(200).json({
    source: "fresh",
    ...portfolio,
  });
});

export default router;
