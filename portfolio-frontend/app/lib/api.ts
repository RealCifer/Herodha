export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://herodha-371j.onrender.com";

export async function fetchPortfolio() {
  const res = await fetch(`${API_BASE_URL}/portfolio`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch portfolio");
  }

  return res.json();
}
