"use client";

import { create } from "zustand";
import {
  INITIAL_PRICES,
  INITIAL_HOLDINGS,
  INITIAL_TRADES,
  INITIAL_GOALS,
  INITIAL_INCOME_EXPENSE,
  TAX_LOTS,
  type Holding,
  type Trade,
  type Goal,
  type IncomeExpense,
  type TaxLot,
} from "@/lib/data";

interface AppState {
  prices: Record<string, number>;
  prevPrices: Record<string, number>;
  holdings: Holding[];
  trades: Trade[];
  goals: Goal[];
  incomeExpense: IncomeExpense[];
  taxLots: TaxLot[];

  setPrices: (prices: Record<string, number>) => void;
  setHoldings: (fn: (h: Holding[]) => Holding[]) => void;
  addTrade: (trade: Trade) => void;
  deleteTrade: (id: string) => void;
  setGoals: (fn: (g: Goal[]) => Goal[]) => void;
}

export const useStore = create<AppState>((set) => ({
  prices: INITIAL_PRICES,
  prevPrices: INITIAL_PRICES,
  holdings: INITIAL_HOLDINGS,
  trades: INITIAL_TRADES,
  goals: INITIAL_GOALS,
  incomeExpense: INITIAL_INCOME_EXPENSE,
  taxLots: TAX_LOTS,

  setPrices: (next) =>
    set((s) => ({ prevPrices: { ...s.prices }, prices: next })),

  setHoldings: (fn) => set((s) => ({ holdings: fn(s.holdings) })),

  addTrade: (trade) =>
    set((s) => ({ trades: [trade, ...s.trades] })),

  deleteTrade: (id) =>
    set((s) => ({ trades: s.trades.filter((t) => t.id !== id) })),

  setGoals: (fn) => set((s) => ({ goals: fn(s.goals) })),
}));
