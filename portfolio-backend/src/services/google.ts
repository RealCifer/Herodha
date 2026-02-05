import axios from "axios";

export async function fetchGoogleMetrics(
  symbol: string,
  exchange: "NSE" | "BSE"
): Promise<{ peRatio: number | null; latestEarnings: string | null }> {
  try {
    const googleSymbol =
      exchange === "NSE" ? `${symbol}:NSE` : `${symbol}:BSE`;

    const url = `https://www.google.com/finance/quote/${googleSymbol}`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Accept: "text/html",
      },
      timeout: 5000,
    });

    const html = response.data as string;

    const peMatch = html.match(/P\/E ratio<\/div><div[^>]*>([\d.,]+)/i);
    const peRatio = peMatch
      ? parseFloat(peMatch[1].replace(/,/g, ""))
      : null;

    const latestEarnings =
      peRatio !== null
        ? "Latest earnings data available on Google Finance"
        : null;

    return {
      peRatio: Number.isFinite(peRatio) ? peRatio : null,
      latestEarnings,
    };
  } catch (error) {
    console.warn(`Google Finance fetch failed for ${symbol}`);
    return {
      peRatio: null,
      latestEarnings: null,
    };
  }
}
