import { Stock } from "./stock";
export interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  gainLoss: number;
}

export interface Portfolio {
  stocks: Stock[];
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  sectors: SectorSummary[];
  lastUpdated: string;
}
