import { Router, Request, Response } from "express";
import InMemoryCache from "../utils/cache";
import { Portfolio } from "../models/portfolio";
import { Stock } from "../models/stock";
import { fetchYahooCMP } from "../services/yahoo";

const router = Router();

const portfolioCache = new InMemoryCache<Portfolio>(15);

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

 for (const stock of stocks) {
  stock.investment = stock.purchasePrice * stock.quantity;
  totalInvestment += stock.investment;

  const cmp = await fetchYahooCMP(stock.symbol, stock.exchange);
  stock.cmp = cmp ?? stock.purchasePrice;

  stock.presentValue = stock.cmp * stock.quantity;
  stock.gainLoss = stock.presentValue - stock.investment;
};

  const portfolio: Portfolio = {
    stocks,
    totalInvestment,
    totalPresentValue: totalInvestment,
    totalGainLoss: 0,
    sectors: [],
    lastUpdated: new Date().toISOString(),
  };

  portfolioCache.set(portfolio);

  return res.status(200).json({
    source: "fresh",
    ...portfolio,
  });
});

export default router;
