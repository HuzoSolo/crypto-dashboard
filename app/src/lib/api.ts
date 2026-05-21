"use client";

// ─── Helpers ───────────────────────────────────────────────────────────────

async function req<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, { credentials: "include", ...options });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

const json = (body: unknown) => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

const put = (body: unknown) => ({
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

const del = { method: "DELETE" } as RequestInit;

// ─── Types ────────────────────────────────────────────────────────────────

export interface ApiUser {
  id: string;
  username: string;
  taxRate: number;
}

export interface ApiWatchlistItem {
  id: string;
  symbol: string;
  userId: string;
}

export interface ApiPortfolioAsset {
  id: string;
  userId: string;
  symbol: string;
  amount: number;
  updatedAt: string;
  currentPrice: number | null;
  value: number;
  change24hUSD: number;
  change24hPct: number | null;
  avgPrice: number;
}

export interface ApiPortfolioResponse {
  assets: ApiPortfolioAsset[];
  totalValue: number;
  change24hUSD: number;
  change24hPct: number;
}

export interface ApiTrade {
  id: string;
  userId: string;
  symbol: string;
  type: "BUY" | "SELL";
  date: string;
  amount: number;
  price: number;
  exchange: string | null;
  note: string | null;
  createdAt: string;
}

export interface ApiGoal {
  id: string;
  userId: string;
  name: string;
  targetUSD: number;
  deadline: string;
  createdAt: string;
  currentUSD: number;
  progressPct: number;
  onTrack: boolean;
}

export interface ApiFinanceEntry {
  id: string;
  userId: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  amount: number;
  date: string;
  description: string | null;
  createdAt: string;
}

export interface ApiFinanceResponse {
  entries: ApiFinanceEntry[];
  totalIncome: number;
  totalExpense: number;
  net: number;
}

export interface ApiTaxLot {
  date: string;
  symbol: string;
  buyPrice: number;
  sellPrice: number;
  amount: number;
  pnl: number;
  tax: number;
}

export interface ApiTaxResponse {
  year: number;
  taxRate: number;
  lots: ApiTaxLot[];
  totalGain: number;
  totalLoss: number;
  netPnl: number;
  estimatedTax: number;
}

export interface ApiCalendarEvent {
  id: string;
  userId: string;
  title: string;
  date: string;
  description: string | null;
  type: "MANUAL" | "TRADE";
  tradeId: string | null;
}

export interface PriceData {
  symbol: string;
  price: number;
  change24hPct: number;
  change24hUSD: number;
}

// ─── Auth ─────────────────────────────────────────────────────────────────

export const authLogin = (username: string, password: string) =>
  req<{ user: ApiUser }>("/api/auth/login", json({ username, password }));

export const authRegister = (username: string, password: string) =>
  req<{ user: ApiUser }>("/api/auth/register", json({ username, password }));

export const authLogout = () =>
  req<{ ok: boolean }>("/api/auth/logout", { method: "POST" });

export const authMe = () =>
  req<{ user: ApiUser }>("/api/auth/me");

// ─── Prices ───────────────────────────────────────────────────────────────

export const getPrices = (symbols: string[]) =>
  req<PriceData[]>(`/api/prices?symbols=${symbols.join(",")}`);

// ─── Watchlist ────────────────────────────────────────────────────────────

export const getWatchlist = () =>
  req<{ items: ApiWatchlistItem[] }>("/api/watchlist");

export const addWatchlistItem = (symbol: string) =>
  req<{ item: ApiWatchlistItem }>("/api/watchlist", json({ symbol }));

export const deleteWatchlistItem = (id: string) =>
  req<{ ok: boolean }>(`/api/watchlist/${id}`, del);

// ─── Portfolio ────────────────────────────────────────────────────────────

export const getPortfolio = () =>
  req<ApiPortfolioResponse>("/api/portfolio");

export const addPortfolioAsset = (symbol: string, amount: number) =>
  req<{ asset: ApiPortfolioAsset }>("/api/portfolio", json({ symbol, amount }));

export const updatePortfolioAsset = (id: string, amount: number) =>
  req<{ asset: ApiPortfolioAsset }>(`/api/portfolio/${id}`, put({ amount }));

export const deletePortfolioAsset = (id: string) =>
  req<{ ok: boolean }>(`/api/portfolio/${id}`, del);

// ─── Trades ───────────────────────────────────────────────────────────────

export interface TradeFilters {
  symbol?: string;
  type?: "BUY" | "SELL";
  from?: string;
  to?: string;
}

export const getTrades = (filters?: TradeFilters) => {
  const p = new URLSearchParams();
  if (filters?.symbol) p.set("symbol", filters.symbol);
  if (filters?.type) p.set("type", filters.type);
  if (filters?.from) p.set("from", filters.from);
  if (filters?.to) p.set("to", filters.to);
  const qs = p.toString();
  return req<{ trades: ApiTrade[] }>(`/api/trades${qs ? `?${qs}` : ""}`);
};

export interface CreateTradeInput {
  symbol: string;
  type: "BUY" | "SELL";
  date: string;
  amount: number;
  price: number;
  exchange?: string;
  note?: string;
}

export const createTrade = (data: CreateTradeInput) =>
  req<{ trade: ApiTrade }>("/api/trades", json(data));

export const deleteTrade = (id: string) =>
  req<{ ok: boolean }>(`/api/trades/${id}`, del);

// ─── Calendar ─────────────────────────────────────────────────────────────

export const getCalendarEvents = (from?: string, to?: string) => {
  const p = new URLSearchParams();
  if (from) p.set("from", from);
  if (to) p.set("to", to);
  const qs = p.toString();
  return req<{ events: ApiCalendarEvent[] }>(`/api/calendar${qs ? `?${qs}` : ""}`);
};

export const createCalendarEvent = (data: { title: string; date: string; description?: string }) =>
  req<{ event: ApiCalendarEvent }>("/api/calendar", json(data));

export const deleteCalendarEvent = (id: string) =>
  req<{ ok: boolean }>(`/api/calendar/${id}`, del);

// ─── Goals ────────────────────────────────────────────────────────────────

export const getGoals = () =>
  req<{ goals: ApiGoal[] }>("/api/goals");

export interface CreateGoalInput {
  name: string;
  targetUSD: number;
  deadline: string;
}

export const createGoal = (data: CreateGoalInput) =>
  req<{ goal: ApiGoal }>("/api/goals", json(data));

export const deleteGoal = (id: string) =>
  req<{ ok: boolean }>(`/api/goals/${id}`, del);

// ─── Finance ──────────────────────────────────────────────────────────────

export interface FinanceFilters {
  type?: "INCOME" | "EXPENSE";
  from?: string;
  to?: string;
}

export const getFinance = (filters?: FinanceFilters) => {
  const p = new URLSearchParams();
  if (filters?.type) p.set("type", filters.type);
  if (filters?.from) p.set("from", filters.from);
  if (filters?.to) p.set("to", filters.to);
  const qs = p.toString();
  return req<ApiFinanceResponse>(`/api/finance${qs ? `?${qs}` : ""}`);
};

export interface CreateFinanceInput {
  type: "INCOME" | "EXPENSE";
  category: string;
  amount: number;
  date: string;
  description?: string;
}

export const createFinanceEntry = (data: CreateFinanceInput) =>
  req<{ entry: ApiFinanceEntry }>("/api/finance", json(data));

export const deleteFinanceEntry = (id: string) =>
  req<{ ok: boolean }>(`/api/finance/${id}`, del);

export const exportFinanceCSV = (filters?: FinanceFilters) => {
  const p = new URLSearchParams();
  if (filters?.type) p.set("type", filters.type);
  if (filters?.from) p.set("from", filters.from);
  if (filters?.to) p.set("to", filters.to);
  window.open(`/api/finance/export?${p.toString()}`, "_blank");
};

// ─── Tax ──────────────────────────────────────────────────────────────────

export const getTax = (year?: number) =>
  req<ApiTaxResponse>(`/api/tax${year ? `?year=${year}` : ""}`);

export const updateTaxRate = (taxRate: number) =>
  req<{ taxRate: number }>("/api/tax/rate", put({ taxRate }));

export const exportTaxCSV = (year?: number) => {
  window.open(`/api/tax/export${year ? `?year=${year}` : ""}`, "_blank");
};
