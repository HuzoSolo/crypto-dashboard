export const COIN_COLORS: Record<string, string> = {
  BTC: "#f7931a",
  ETH: "#627eea",
  SOL: "#9945ff",
  BNB: "#f3ba2f",
  USDT: "#26a17b",
  AVAX: "#e84142",
  ADA: "#0033ad",
  LINK: "#2a5ada",
  MATIC: "#8247e5",
  DOGE: "#c2a633",
  ARB: "#28a0f0",
  OP: "#ff0420",
  ATOM: "#2e3148",
  NEAR: "#00ec97",
  INJ: "#0082fa",
};

export const COIN_NAMES: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  SOL: "Solana",
  BNB: "BNB",
  USDT: "Tether",
  AVAX: "Avalanche",
  ADA: "Cardano",
  LINK: "Chainlink",
  MATIC: "Polygon",
  DOGE: "Dogecoin",
  ARB: "Arbitrum",
  OP: "Optimism",
  ATOM: "Cosmos",
  NEAR: "Near",
  INJ: "Injective",
};

export const INITIAL_PRICES: Record<string, number> = {
  BTC: 67342.18,
  ETH: 3528.04,
  SOL: 178.62,
  BNB: 612.4,
  USDT: 1.0001,
  AVAX: 38.21,
  ADA: 0.472,
  LINK: 18.34,
  MATIC: 0.7421,
  DOGE: 0.162,
  ARB: 1.244,
  OP: 2.123,
  ATOM: 9.42,
  NEAR: 7.31,
  INJ: 28.4,
};

export const INITIAL_HOLDINGS: Holding[] = [
  { sym: "BTC", qty: 0.482, avg: 58200 },
  { sym: "ETH", qty: 8.22, avg: 2850 },
  { sym: "SOL", qty: 84.5, avg: 142.1 },
  { sym: "LINK", qty: 220, avg: 14.2 },
  { sym: "AVAX", qty: 65, avg: 32.4 },
  { sym: "USDT", qty: 4280, avg: 1.0 },
];

export const WATCHLIST = [
  "BTC", "ETH", "SOL", "BNB", "AVAX", "LINK",
  "MATIC", "DOGE", "ARB", "NEAR", "INJ",
];

export const INITIAL_TRADES: Trade[] = [
  { id: "t1",  date: "2026-05-04", coin: "SOL",  type: "buy",  qty: 12,    price: 168.4,    exchange: "Binance",  note: "Breakout entry",     pnl: 122.64 },
  { id: "t2",  date: "2026-05-03", coin: "ETH",  type: "sell", qty: 1.5,   price: 3520.0,   exchange: "Coinbase", note: "Take partial",       pnl: 1005.0 },
  { id: "t3",  date: "2026-05-02", coin: "BTC",  type: "buy",  qty: 0.05,  price: 66800.0,  exchange: "Binance",  note: "",                   pnl: 27.1 },
  { id: "t4",  date: "2026-04-30", coin: "LINK", type: "buy",  qty: 50,    price: 17.8,     exchange: "Kraken",   note: "Rebalance",          pnl: 27.0 },
  { id: "t5",  date: "2026-04-28", coin: "AVAX", type: "sell", qty: 10,    price: 36.5,     exchange: "Binance",  note: "",                   pnl: -29.0 },
  { id: "t6",  date: "2026-04-25", coin: "SOL",  type: "sell", qty: 8,     price: 174.2,    exchange: "Binance",  note: "Resistance",         pnl: 256.8 },
  { id: "t7",  date: "2026-04-22", coin: "ETH",  type: "buy",  qty: 0.8,   price: 3380.0,   exchange: "Coinbase", note: "Dip buy",            pnl: 118.4 },
  { id: "t8",  date: "2026-04-19", coin: "BTC",  type: "sell", qty: 0.02,  price: 65120.0,  exchange: "Kraken",   note: "",                   pnl: 138.4 },
  { id: "t9",  date: "2026-04-15", coin: "INJ",  type: "buy",  qty: 30,    price: 26.1,     exchange: "Binance",  note: "Mid-cap rotation",   pnl: 69.0 },
  { id: "t10", date: "2026-04-10", coin: "MATIC",type: "buy",  qty: 800,   price: 0.78,     exchange: "Coinbase", note: "",                   pnl: -28.72 },
];

export const INITIAL_GOALS: Goal[] = [
  { id: "g1", name: "$25K Yıllık Kâr",      target: 25000, current: 14820, deadline: "2026-12-31", priority: "high" },
  { id: "g2", name: "Marmaris Tatil Fonu",  target: 4500,  current: 3240,  deadline: "2026-07-15", priority: "med" },
  { id: "g3", name: "1 BTC Biriktir",       target: 67000, current: 32450, deadline: "2027-03-01", priority: "med" },
  { id: "g4", name: "Acil Durum Tamponu",   target: 10000, current: 8200,  deadline: "2026-06-30", priority: "low" },
];

export const INITIAL_INCOME_EXPENSE: IncomeExpense[] = [
  { id: "ie1", date: "2026-05-04", type: "income",  category: "Salary",       amount: 4800,  ccy: "USD",  desc: "Mayıs maaşı" },
  { id: "ie2", date: "2026-05-03", type: "income",  category: "Trading",      amount: 1005,  ccy: "USDT", desc: "ETH satış kârı" },
  { id: "ie3", date: "2026-05-02", type: "expense", category: "Rent",         amount: 1450,  ccy: "USD",  desc: "Mayıs kirası" },
  { id: "ie4", date: "2026-04-29", type: "expense", category: "Subscription", amount: 39,    ccy: "USD",  desc: "TradingView Pro" },
  { id: "ie5", date: "2026-04-27", type: "income",  category: "Staking",      amount: 142,   ccy: "USDT", desc: "ETH staking ödülü" },
  { id: "ie6", date: "2026-04-25", type: "expense", category: "Food",         amount: 320,   ccy: "USD",  desc: "Market alışverişi" },
  { id: "ie7", date: "2026-04-22", type: "expense", category: "Travel",       amount: 480,   ccy: "USD",  desc: "İzmir uçak bileti" },
  { id: "ie8", date: "2026-04-18", type: "income",  category: "Trading",      amount: 256.8, ccy: "USDT", desc: "SOL kısmi satış" },
  { id: "ie9", date: "2026-04-15", type: "expense", category: "Utilities",    amount: 110,   ccy: "USD",  desc: "Elektrik + internet" },
];

export const TAX_LOTS: TaxLot[] = [
  { date: "2026-04-25", coin: "AVAX", buyP: 39.3,   sellP: 36.5,   qty: 10,   pnl: -28.0,   tax: 0 },
  { date: "2026-04-19", coin: "BTC",  buyP: 58200,  sellP: 65120,  qty: 0.02, pnl: 138.4,   tax: 27.68 },
  { date: "2026-04-25", coin: "SOL",  buyP: 142.1,  sellP: 174.2,  qty: 8,    pnl: 256.8,   tax: 51.36 },
  { date: "2026-05-03", coin: "ETH",  buyP: 2850,   sellP: 3520,   qty: 1.5,  pnl: 1005.0,  tax: 201.0 },
  { date: "2026-03-12", coin: "BTC",  buyP: 52000,  sellP: 64200,  qty: 0.04, pnl: 488.0,   tax: 97.6 },
  { date: "2026-02-28", coin: "LINK", buyP: 14.2,   sellP: 19.8,   qty: 100,  pnl: 560.0,   tax: 112.0 },
];

// Types
export interface Holding {
  sym: string;
  qty: number;
  avg: number;
}

export interface Trade {
  id: string;
  date: string;
  coin: string;
  type: "buy" | "sell";
  qty: number;
  price: number;
  exchange: string;
  note: string;
  pnl: number;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  priority: "high" | "med" | "low";
}

export interface IncomeExpense {
  id: string;
  date: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  ccy: string;
  desc: string;
}

export interface TaxLot {
  date: string;
  coin: string;
  buyP: number;
  sellP: number;
  qty: number;
  pnl: number;
  tax: number;
}

export function genSeries(seed: number, n = 30, base = 100, vol = 0.04, trend = 0.002): number[] {
  let s = seed;
  const rng = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const out = [base];
  for (let i = 1; i < n; i++) {
    const r = (rng() - 0.5) * 2 * vol + trend;
    out.push(Math.max(0.01, out[i - 1] * (1 + r)));
  }
  return out;
}
