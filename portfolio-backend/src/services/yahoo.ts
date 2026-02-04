import axios from "axios";

export async function fetchYahooCMP(
  symbol: string,
  exchange: "NSE" | "BSE"
): Promise<number | null> {
  const yahooSymbol =
    exchange === "NSE" ? `${symbol}.NS` : `${symbol}.BO`;

  const primaryUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${yahooSymbol}`;

  const fallbackUrl = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${yahooSymbol}?modules=price`;

  try {
    const response = await axios.get(primaryUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Accept: "application/json",
      },
      timeout: 5000,
    });

    const result = response.data?.quoteResponse?.result?.[0];

    if (result && typeof result.regularMarketPrice === "number") {
      return result.regularMarketPrice;
    }
  } catch (err) {
    console.warn(`Primary Yahoo fetch failed for ${yahooSymbol}`);
  }

  try {
    const response = await axios.get(fallbackUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Accept: "application/json",
      },
      timeout: 5000,
    });

    const price =
      response.data?.quoteSummary?.result?.[0]?.price
        ?.regularMarketPrice?.raw;

    if (typeof price === "number") {
      return price;
    }
  } catch (err) {
    console.warn(`Fallback Yahoo fetch failed for ${yahooSymbol}`);
  }

  return null;
}
