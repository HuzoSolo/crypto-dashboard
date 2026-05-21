export interface PriceData {
  symbol: string;
  price: number;
  change24hPct: number;
  change24hUSD: number;
}

// Binance: GET /api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT"]
async function fetchFromBinance(symbols: string[]): Promise<PriceData[]> {
  const param = JSON.stringify(symbols.map((s) => `${s}USDT`));
  const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(param)}`;

  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) throw new Error(`Binance ${res.status}`);

  const data = await res.json();
  return data.map((t: Record<string, string>) => ({
    symbol: t.symbol.replace(/USDT$/, ""),
    price: parseFloat(t.lastPrice),
    change24hPct: parseFloat(t.priceChangePercent),
    change24hUSD: parseFloat(t.priceChange),
  }));
}

// CoinGecko: GET /api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true
const COINGECKO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  BNB: "binancecoin",
  SOL: "solana",
  XRP: "ripple",
  ADA: "cardano",
  DOGE: "dogecoin",
  DOT: "polkadot",
  MATIC: "matic-network",
  LTC: "litecoin",
};

async function fetchFromCoinGecko(symbols: string[]): Promise<PriceData[]> {
  const ids = symbols
    .map((s) => COINGECKO_IDS[s])
    .filter(Boolean)
    .join(",");

  if (!ids) return [];

  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=false`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) throw new Error(`CoinGecko ${res.status}`);

  const data = await res.json();

  return symbols
    .map((symbol) => {
      const id = COINGECKO_IDS[symbol];
      const entry = id ? data[id] : undefined;
      if (!entry) return null;
      return {
        symbol,
        price: entry.usd as number,
        change24hPct: (entry.usd_24h_change as number) ?? 0,
        change24hUSD: 0, // CoinGecko free tier'da yok, hesaplanır
      } satisfies PriceData;
    })
    .filter((x): x is PriceData => x !== null);
}

export async function fetchPrices(symbols: string[]): Promise<PriceData[]> {
  if (symbols.length === 0) return [];

  try {
    return await fetchFromBinance(symbols);
  } catch {
    try {
      return await fetchFromCoinGecko(symbols);
    } catch {
      // Her iki kaynak da erişilemez — boş dizi döner, UI hata gösterir
      return [];
    }
  }
}
