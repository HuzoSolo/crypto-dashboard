"use client";

import { create } from "zustand";
import {
  getWatchlist, addWatchlistItem as apiAddWatchlist, deleteWatchlistItem as apiDeleteWatchlist,
  getPortfolio, addPortfolioAsset as apiAddAsset, updatePortfolioAsset as apiUpdateAsset, deletePortfolioAsset as apiDeleteAsset,
  getTrades, createTrade as apiCreateTrade, deleteTrade as apiDeleteTrade,
  getGoals, createGoal as apiCreateGoal, deleteGoal as apiDeleteGoal,
  getPrices, authMe,
  type ApiUser, type ApiWatchlistItem, type CreateTradeInput, type CreateGoalInput,
} from "@/lib/api";

// ─── Tip tanımları ────────────────────────────────────────────────────────

export interface Holding {
  id: string;
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
  progressPct: number;
  onTrack: boolean;
}

// ─── Store tipi ───────────────────────────────────────────────────────────

interface AppState {
  // Oturum
  currentUser: ApiUser | null;
  fetchCurrentUser: () => Promise<void>;

  // Canlı fiyatlar
  prices: Record<string, number>;
  prevPrices: Record<string, number>;
  setPrices: (prices: Record<string, number>) => void;
  fetchPricesForSymbols: (symbols: string[]) => Promise<void>;

  // Watchlist
  watchlistItems: ApiWatchlistItem[];
  watchlistLoading: boolean;
  fetchWatchlist: () => Promise<void>;
  addWatchlistItem: (symbol: string) => Promise<void>;
  removeWatchlistItem: (id: string) => Promise<void>;

  // Portfolio
  holdings: Holding[];
  portfolioMeta: { totalValue: number; change24hUSD: number; change24hPct: number };
  portfolioLoading: boolean;
  fetchPortfolio: () => Promise<void>;
  addHolding: (symbol: string, amount: number) => Promise<void>;
  updateHolding: (id: string, amount: number) => Promise<void>;
  removeHolding: (id: string) => Promise<void>;

  // Trades
  trades: Trade[];
  tradesLoading: boolean;
  fetchTrades: () => Promise<void>;
  addTrade: (data: CreateTradeInput) => Promise<void>;
  deleteTrade: (id: string) => Promise<void>;

  // Goals
  goals: Goal[];
  goalsLoading: boolean;
  fetchGoals: () => Promise<void>;
  addGoal: (data: CreateGoalInput) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
}

// ─── Store implementasyonu ────────────────────────────────────────────────

export const useStore = create<AppState>((set, get) => ({
  // ── Oturum ────────────────────────────────────────────────────────────
  currentUser: null,

  fetchCurrentUser: async () => {
    try {
      const { user } = await authMe();
      set({ currentUser: user });
    } catch {}
  },

  // ── Fiyatlar ──────────────────────────────────────────────────────────
  prices: {},
  prevPrices: {},

  setPrices: (next) =>
    set((s) => ({ prevPrices: { ...s.prices }, prices: { ...s.prices, ...next } })),

  fetchPricesForSymbols: async (symbols) => {
    if (symbols.length === 0) return;
    try {
      const data = await getPrices(symbols);
      const map = Object.fromEntries(data.map((p) => [p.symbol, p.price]));
      set((s) => ({ prevPrices: { ...s.prices }, prices: { ...s.prices, ...map } }));
    } catch {}
  },

  // ── Watchlist ─────────────────────────────────────────────────────────
  watchlistItems: [],
  watchlistLoading: false,

  fetchWatchlist: async () => {
    set({ watchlistLoading: true });
    try {
      const { items } = await getWatchlist();
      set({ watchlistItems: items });
      // Fiyatları da çek
      if (items.length > 0) {
        get().fetchPricesForSymbols(items.map((i) => i.symbol));
      }
    } catch {
    } finally {
      set({ watchlistLoading: false });
    }
  },

  addWatchlistItem: async (symbol) => {
    const { item } = await apiAddWatchlist(symbol);
    set((s) => ({ watchlistItems: [...s.watchlistItems, item] }));
    get().fetchPricesForSymbols([symbol]);
  },

  removeWatchlistItem: async (id) => {
    await apiDeleteWatchlist(id);
    set((s) => ({ watchlistItems: s.watchlistItems.filter((i) => i.id !== id) }));
  },

  // ── Portfolio ─────────────────────────────────────────────────────────
  holdings: [],
  portfolioMeta: { totalValue: 0, change24hUSD: 0, change24hPct: 0 },
  portfolioLoading: false,

  fetchPortfolio: async () => {
    set({ portfolioLoading: true });
    try {
      const data = await getPortfolio();
      const holdings: Holding[] = data.assets.map((a) => ({
        id: a.id,
        sym: a.symbol,
        qty: a.amount,
        avg: a.avgPrice,
      }));
      // Fiyatları store'a yaz
      const priceMap = Object.fromEntries(
        data.assets.filter((a) => a.currentPrice != null).map((a) => [a.symbol, a.currentPrice!])
      );
      set((s) => ({
        holdings,
        portfolioMeta: {
          totalValue: data.totalValue,
          change24hUSD: data.change24hUSD,
          change24hPct: data.change24hPct,
        },
        prevPrices: { ...s.prices },
        prices: { ...s.prices, ...priceMap },
      }));
    } catch {
    } finally {
      set({ portfolioLoading: false });
    }
  },

  addHolding: async (symbol, amount) => {
    await apiAddAsset(symbol, amount);
    get().fetchPortfolio();
  },

  updateHolding: async (id, amount) => {
    await apiUpdateAsset(id, amount);
    get().fetchPortfolio();
  },

  removeHolding: async (id) => {
    await apiDeleteAsset(id);
    set((s) => ({ holdings: s.holdings.filter((h) => h.id !== id) }));
  },

  // ── Trades ────────────────────────────────────────────────────────────
  trades: [],
  tradesLoading: false,

  fetchTrades: async () => {
    set({ tradesLoading: true });
    try {
      const { trades } = await getTrades();
      set({
        trades: trades.map((t) => ({
          id: t.id,
          date: t.date.slice(0, 10),
          coin: t.symbol,
          type: t.type === "BUY" ? "buy" : "sell",
          qty: t.amount,
          price: t.price,
          exchange: t.exchange ?? "",
          note: t.note ?? "",
          pnl: 0,
        })),
      });
    } catch {
    } finally {
      set({ tradesLoading: false });
    }
  },

  addTrade: async (data) => {
    await apiCreateTrade(data);
    get().fetchTrades();
  },

  deleteTrade: async (id) => {
    await apiDeleteTrade(id);
    set((s) => ({ trades: s.trades.filter((t) => t.id !== id) }));
  },

  // ── Goals ─────────────────────────────────────────────────────────────
  goals: [],
  goalsLoading: false,

  fetchGoals: async () => {
    set({ goalsLoading: true });
    try {
      const { goals } = await getGoals();
      set({
        goals: goals.map((g) => ({
          id: g.id,
          name: g.name,
          target: g.targetUSD,
          current: g.currentUSD,
          deadline: g.deadline.slice(0, 10),
          priority: "med" as const,
          progressPct: g.progressPct,
          onTrack: g.onTrack,
        })),
      });
    } catch {
    } finally {
      set({ goalsLoading: false });
    }
  },

  addGoal: async (data) => {
    await apiCreateGoal(data);
    get().fetchGoals();
  },

  deleteGoal: async (id) => {
    await apiDeleteGoal(id);
    set((s) => ({ goals: s.goals.filter((g) => g.id !== id) }));
  },
}));
