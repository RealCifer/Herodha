import axios from "axios";

export async function fetchYahooCMP(
  symbol: string,
  exchange: "NSE" | "BSE"
): Promise<number | null> {
  try {
    const yahooSymbol =
      exchange === "NSE" ? `${symbol}.NS` : `${symbol}.BO`;

    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${yahooSymbol}`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0", 
      },
      timeout: 5000,
    });

    const result = response.data?.quoteResponse?.result?.[0];

    if (!result || typeof result.regularMarketPrice !== "number") {
      return null;
    }

    return result.regularMarketPrice;
  } catch (error) {
    console.error(`Yahoo CMP fetch failed for ${symbol}`, error);
    return null;
  }
}
