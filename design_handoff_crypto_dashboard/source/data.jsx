// Mock data for the dashboard
const COIN_COLORS = {
  BTC: '#f7931a', ETH: '#627eea', SOL: '#9945ff', BNB: '#f3ba2f',
  USDT: '#26a17b', AVAX: '#e84142', ADA: '#0033ad', LINK: '#2a5ada',
  MATIC: '#8247e5', DOGE: '#c2a633', ARB: '#28a0f0', OP: '#ff0420',
  ATOM: '#2e3148', NEAR: '#00ec97', INJ: '#0082fa',
};
const COIN_NAMES = {
  BTC: 'Bitcoin', ETH: 'Ethereum', SOL: 'Solana', BNB: 'BNB',
  USDT: 'Tether', AVAX: 'Avalanche', ADA: 'Cardano', LINK: 'Chainlink',
  MATIC: 'Polygon', DOGE: 'Dogecoin', ARB: 'Arbitrum', OP: 'Optimism',
  ATOM: 'Cosmos', NEAR: 'Near', INJ: 'Injective',
};

const INITIAL_PRICES = {
  BTC: 67342.18, ETH: 3528.04, SOL: 178.62, BNB: 612.40,
  USDT: 1.0001, AVAX: 38.21, ADA: 0.4720, LINK: 18.34,
  MATIC: 0.7421, DOGE: 0.1620, ARB: 1.2440, OP: 2.1230,
  ATOM: 9.42, NEAR: 7.31, INJ: 28.40,
};

const INITIAL_HOLDINGS = [
  { sym: 'BTC',  qty: 0.4820, avg: 58200 },
  { sym: 'ETH',  qty: 8.220,  avg: 2850 },
  { sym: 'SOL',  qty: 84.50,  avg: 142.10 },
  { sym: 'LINK', qty: 220,    avg: 14.20 },
  { sym: 'AVAX', qty: 65,     avg: 32.40 },
  { sym: 'USDT', qty: 4280,   avg: 1.00 },
];

const WATCHLIST = ['BTC', 'ETH', 'SOL', 'BNB', 'AVAX', 'LINK', 'MATIC', 'DOGE', 'ARB', 'NEAR', 'INJ'];

const TRADES = [
  { id: 't1',  date: '2026-05-04', coin: 'SOL',  type: 'buy',  qty: 12,    price: 168.40, exchange: 'Binance', note: 'Breakout entry', pnl: +122.64 },
  { id: 't2',  date: '2026-05-03', coin: 'ETH',  type: 'sell', qty: 1.5,   price: 3520.00, exchange: 'Coinbase', note: 'Take partial', pnl: +1005.00 },
  { id: 't3',  date: '2026-05-02', coin: 'BTC',  type: 'buy',  qty: 0.05,  price: 66800.00, exchange: 'Binance', note: '', pnl: +27.10 },
  { id: 't4',  date: '2026-04-30', coin: 'LINK', type: 'buy',  qty: 50,    price: 17.80, exchange: 'Kraken', note: 'Rebalance', pnl: +27.00 },
  { id: 't5',  date: '2026-04-28', coin: 'AVAX', type: 'sell', qty: 10,    price: 36.50, exchange: 'Binance', note: '', pnl: -29.00 },
  { id: 't6',  date: '2026-04-25', coin: 'SOL',  type: 'sell', qty: 8,     price: 174.20, exchange: 'Binance', note: 'Resistance', pnl: +256.80 },
  { id: 't7',  date: '2026-04-22', coin: 'ETH',  type: 'buy',  qty: 0.8,   price: 3380.00, exchange: 'Coinbase', note: 'Dip buy', pnl: +118.40 },
  { id: 't8',  date: '2026-04-19', coin: 'BTC',  type: 'sell', qty: 0.02,  price: 65120.00, exchange: 'Kraken', note: '', pnl: +138.40 },
  { id: 't9',  date: '2026-04-15', coin: 'INJ',  type: 'buy',  qty: 30,    price: 26.10, exchange: 'Binance', note: 'Mid-cap rotation', pnl: +69.00 },
  { id: 't10', date: '2026-04-10', coin: 'MATIC',type: 'buy',  qty: 800,   price: 0.78, exchange: 'Coinbase', note: '', pnl: -28.72 },
];

const GOALS = [
  { id: 'g1', name: '$25K Yıllık Kâr',         target: 25000,  current: 14820, deadline: '2026-12-31', priority: 'high' },
  { id: 'g2', name: 'Marmaris Tatil Fonu',     target: 4500,   current: 3240,  deadline: '2026-07-15', priority: 'med'  },
  { id: 'g3', name: '1 BTC Biriktir',          target: 67000,  current: 32450, deadline: '2027-03-01', priority: 'med'  },
  { id: 'g4', name: 'Acil Durum Tamponu',      target: 10000,  current: 8200,  deadline: '2026-06-30', priority: 'low'  },
];

const INCOME_EXPENSE = [
  { id: 'ie1', date: '2026-05-04', type: 'income',  category: 'Salary',     amount: 4800,  ccy: 'USD',  desc: 'Mayıs maaşı' },
  { id: 'ie2', date: '2026-05-03', type: 'income',  category: 'Trading',    amount: 1005,  ccy: 'USDT', desc: 'ETH satış kârı' },
  { id: 'ie3', date: '2026-05-02', type: 'expense', category: 'Rent',       amount: 1450,  ccy: 'USD',  desc: 'Mayıs kirası' },
  { id: 'ie4', date: '2026-04-29', type: 'expense', category: 'Subscription', amount: 39, ccy: 'USD',  desc: 'TradingView Pro' },
  { id: 'ie5', date: '2026-04-27', type: 'income',  category: 'Staking',    amount: 142,   ccy: 'USDT', desc: 'ETH staking ödülü' },
  { id: 'ie6', date: '2026-04-25', type: 'expense', category: 'Food',       amount: 320,   ccy: 'USD',  desc: 'Market alışverişi' },
  { id: 'ie7', date: '2026-04-22', type: 'expense', category: 'Travel',     amount: 480,   ccy: 'USD',  desc: 'İzmir uçak bileti' },
  { id: 'ie8', date: '2026-04-18', type: 'income',  category: 'Trading',    amount: 256.8, ccy: 'USDT', desc: 'SOL kısmi satış' },
  { id: 'ie9', date: '2026-04-15', type: 'expense', category: 'Utilities',  amount: 110,   ccy: 'USD',  desc: 'Elektrik + internet' },
];

const TAX_LOTS = [
  { date: '2026-04-25', coin: 'AVAX', buyP: 39.30, sellP: 36.50, qty: 10,   pnl: -28.00,  tax: 0 },
  { date: '2026-04-19', coin: 'BTC',  buyP: 58200, sellP: 65120, qty: 0.02, pnl: 138.40,  tax: 27.68 },
  { date: '2026-04-25', coin: 'SOL',  buyP: 142.10,sellP: 174.20,qty: 8,    pnl: 256.80,  tax: 51.36 },
  { date: '2026-05-03', coin: 'ETH',  buyP: 2850,  sellP: 3520,  qty: 1.5,  pnl: 1005.00, tax: 201.00 },
  { date: '2026-03-12', coin: 'BTC',  buyP: 52000, sellP: 64200, qty: 0.04, pnl: 488.00,  tax: 97.60 },
  { date: '2026-02-28', coin: 'LINK', buyP: 14.20, sellP: 19.80, qty: 100,  pnl: 560.00,  tax: 112.00 },
];

window.MOCK = {
  COIN_COLORS, COIN_NAMES, INITIAL_PRICES, INITIAL_HOLDINGS,
  WATCHLIST, TRADES, GOALS, INCOME_EXPENSE, TAX_LOTS,
};
