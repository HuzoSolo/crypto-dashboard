# Handoff: Cryptolio — Crypto Portfolio Dashboard

## Overview

A personal crypto investment tracker for individual investors. Single-pane dashboard for live prices, trades, taxes, goals, and finances. Turkish UI labels, English numerical formatting (USD/USDT). Dark-mode-first with light-mode toggle.

## About the Design Files

The files in `source/` are **design references created in HTML/JSX/CSS** — they are prototypes that show the intended look, layout, and interaction behavior. They are **not production code to copy verbatim**.

Your task is to **recreate these designs in the target codebase's environment**:
- The brief specifies **Next.js 15 + Tailwind CSS + shadcn/ui + Recharts + FullCalendar**. Use those.
- Map the visual tokens defined in `source/styles.css` to a Tailwind theme (in `tailwind.config.ts`) and CSS variables in `globals.css`.
- Replace hand-rolled components in the prototype with shadcn/ui equivalents (Button, Card, Table, Dialog, Tabs, Select, Badge, Progress, Tooltip, DropdownMenu, etc.).
- Replace hand-rolled charts with **Recharts** (PieChart, LineChart for sparklines, BarChart). Replace the calendar with **FullCalendar**.
- Replace inline SVG icons with **lucide-react** (the prototype uses Lucide-style icons; names match where possible: home, list, wallet, arrow-up-down, calendar, target, bar-chart, receipt, etc.).

## Fidelity

**High-fidelity.** Colors, spacing, typography, hover states, animations, and interaction flows are all final and intended for pixel-faithful recreation. Use the design tokens below verbatim.

## Tech Stack (target)

- **Next.js 15** (App Router)
- **Tailwind CSS** (with CSS variables for theme tokens)
- **shadcn/ui** (Radix-based primitives)
- **Recharts** (donut, line/sparkline, bar)
- **FullCalendar** (`@fullcalendar/react` + dayGrid + timeGrid + interaction plugins)
- **lucide-react** for icons
- Optional: **next-themes** for dark/light toggle, **zustand** or React Context for global app state.

## Layout Structure

All authenticated pages share:

- **Sidebar (left, fixed, 232px wide)** — vertical nav. Top: brand. Mid: nav items grouped under "Genel" and "Finans" labels. Bottom: a "Toplam Bakiye" mini-card with live pill.
- **Header (top, sticky, 56px tall)** — page title with grid icon · search input (max 380px, ⌘K hint) · refresh / notifications / theme toggle / settings icon buttons · user chip with avatar.
- **Main content** — scrollable, padded (`20px 24px 40px`). Page-level `<h1>` + sub-line.

Responsive: at `<1100px` sidebar collapses to icon-only (64px); at `<720px` header shrinks and grids stack.

## Pages (9 screens)

### 1. Login (`/login`)
Two-column layout. Left side: dark gradient panel with brand mark, headline ("Tüm portföyün, tek bir sade panelde."), 3 social-proof stats. Right side: centered form (email + password + remember-me checkbox + forgot-password link + primary submit). On submit, route to `/dashboard`.

### 2. Dashboard (`/dashboard`)
Bento grid with 4 rows:
1. **Hero card (2fr)** + **Allocation donut card (1.1fr)** in a 2-column grid.
   - Hero: green gradient card with total value (animated counter), 24h delta pill, large white sparkline, footer with All-Time P&L / Monthly Net / Cost / "Cüzdana Git" button.
   - Donut: 150px donut with center label, hover slice highlights, legend list right.
2. **KPI strip** — 4 stat cards: En İyi Performer, En Kötü Performer, Bu Ay İşlem, Vergiye Tabi Kâr.
3. **Active Goals (1.4fr)** + **Recent Trades table (1.6fr)** + **Monthly Net & Quick Nav (1fr)**.

### 3. Watchlist (`/watchlist`)
Toolbar card: live badge, refresh interval chips (2s/5s/15s/60s), source chips (Binance/CoinGecko), refresh + add buttons. Below: sortable table — Symbol, Price (USDT), 24h Change %, 30d Sparkline, 24h Volume, Source, row actions. Live price flashing (green flash on tick up, red on tick down).

### 4. Portfolio / Wallet (`/portfolio`)
Top: hero card with total value + cost + open P&L + position count. Beside: donut card with allocation. Below: 3-column grid of asset cards. Each card: coin row, delta badge, sparkline, editable quantity input, current price, total value, open P&L.

### 5. Trades (`/trades`)
Toolbar: type chips (Tümü/Alış/Satış), coin filter, date range, CSV export, **Yeni İşlem** primary button. Table: Date, Coin, Type badge, Qty, Price, Total, Exchange badge, Note, P&L delta, delete action. "Yeni İşlem" opens a modal form (date, coin, type toggle, qty, price, exchange, note).

### 6. Calendar (`/calendar`)
Toolbar with month nav (prev/next/today), legend, **Etkinlik Ekle**. 7-column month grid. Trade events plotted on their dates as colored chips (buy=accent, sell=loss, note=info). Click a day → modal with event list and "Add event to this day" CTA.

### 7. Goals (`/goals`)
Toolbar with status chips. 2-column grid of goal cards. Each card: priority sub-label, name, on-track/risk badge, big current value + `/ target` + percent, progress bar, footer with deadline / projected date / remaining + edit/delete actions. **Yeni Hedef** modal.

### 8. Income & Expense (`/income-expense`)
4-card KPI strip (Toplam Gelir / Toplam Gider / Aylık Net hero / Yıllık Tahmin). Below: 2-column — left is a filter+CSV+add toolbar over a ledger table (Date, Type badge, Category, Description, Amount, Currency); right is "Gider Kategorileri" with mini progress bars per category.

### 9. Tax (`/tax`)
4-card KPI strip (Realized P&L / Taxable Profit / Offsettable Loss / **Estimated Tax hero with rate slider 0–50%**). Below: FIFO breakdown table — Date, Coin, Qty, Buy Price, Sell Price, P&L, Tax (rate%). Bottom row totals. CSV export.

## Sidebar Navigation

| Label          | Route             | lucide icon     |
|----------------|-------------------|-----------------|
| Ana Sayfa      | `/dashboard`      | `Home`          |
| Varlık Listesi | `/watchlist`      | `List`          |
| Cüzdan         | `/portfolio`      | `Wallet`        |
| İşlemler       | `/trades`         | `ArrowUpDown`   |
| Takvim         | `/calendar`       | `Calendar`      |
| Hedefler       | `/goals`          | `Target`        |
| Gelir-Gider    | `/income-expense` | `BarChart3`     |
| Vergi          | `/tax`            | `Receipt`       |

Active item gets a **green gradient pill** (`linear-gradient(135deg, #16a34a → #0a6e34)`) with white text and a `0 4px 14px #16a34a40` shadow. Inactive items: `var(--text-dim)`, hover background `var(--bg-hover)`.

## Design Tokens

### Color Palette — Dark (default)

```css
--bg:          #0b0d10  /* app background */
--bg-elev:     #111418  /* sidebar, header backdrop */
--bg-card:     #14181d  /* card surface */
--bg-card-2:   #181d23  /* table header */
--bg-hover:    #1c2229
--border:      #20262e
--border-soft: #1a1f25
--text:        #e8ecf1
--text-dim:    #9aa3ad
--text-mute:   #5e6770
--accent:      #16a34a  /* emerald 600, primary */
--accent-soft: #16a34a22
--accent-grad-1: #16a34a
--accent-grad-2: #0a6e34
--gain:        #22c55e
--loss:        #f43f5e
--warn:        #f59e0b
--info:        #38bdf8
--chip-bg:     #1a2127
--shadow-card: 0 1px 0 #ffffff04 inset, 0 8px 24px #00000033
```

### Color Palette — Light (`[data-theme="light"]`)

```css
--bg:          #f4f5f7
--bg-elev:     #ffffff
--bg-card:     #ffffff
--bg-card-2:   #fafbfc
--bg-hover:    #eef0f3
--border:      #e4e7ec
--border-soft: #eef0f3
--text:        #0f1419
--text-dim:    #4a5560
--text-mute:   #8993a1
--accent:      #16a34a
--gain:        #16a34a
--loss:        #e11d48
--warn:        #d97706
--info:        #0284c7
--chip-bg:     #f1f3f5
```

### Optional accent colors (Tweaks)

| Token   | accent    | accent-grad-2 |
|---------|-----------|---------------|
| emerald | `#16a34a` | `#0a6e34`     |
| indigo  | `#6366f1` | `#4338ca`     |
| amber   | `#f59e0b` | `#b45309`     |
| rose    | `#e11d48` | `#9f1239`     |

### Coin brand colors (for logos & charts)

```
BTC #f7931a · ETH #627eea · SOL #9945ff · BNB #f3ba2f · USDT #26a17b
AVAX #e84142 · ADA #0033ad · LINK #2a5ada · MATIC #8247e5 · DOGE #c2a633
ARB #28a0f0 · OP #ff0420 · ATOM #2e3148 · NEAR #00ec97 · INJ #0082fa
```

### Typography

- **UI:** `Inter`, weights 400/500/600/700. Default 14px / 1.45.
- **Numbers:** `JetBrains Mono`, 400/500/600 with `font-feature-settings: 'tnum'`. Apply via `.mono` utility on every monetary/numeric cell.
- Page H1: 22px / 600 / -0.02em letter-spacing
- Card title: 13px / 600
- Hero value: 44px / 600 / -0.03em / line-height 1.05
- Stat value: 20–22px / 600 / -0.02em
- Label/sub: 11px / mute color
- Table headers: 11px / uppercase / 0.04em letter-spacing / mute color

### Spacing & Radii

- Card padding: `18px` (compact: `14px`)
- Card gap (grids): `16px`
- Card border-radius: `14px`
- Button border-radius: `8px`
- Input border-radius: `8px`
- Pill/chip: `999px`
- Badge: `999px`, `3px 8px` padding, `10px` font

### Shadows

- Card: `0 1px 0 #ffffff04 inset, 0 8px 24px #00000033` (dark)
- Hero card: `0 12px 32px #16a34a25`
- Active nav: `0 4px 14px #16a34a40, 0 0 0 1px #ffffff10 inset`
- Modal: `0 20px 60px #00000077`

## Components Inventory

| Prototype                | Implement with                                   |
|--------------------------|--------------------------------------------------|
| `Sidebar`                | Custom layout component using shadcn `Button`    |
| `Header`                 | Custom + shadcn `Input`, `DropdownMenu`          |
| `CoinLogo`               | Inline SVG/`<div>` with brand color gradient     |
| `Coin` (logo + name)     | Custom presentational component                  |
| `Delta` (gain/loss chip) | shadcn `Badge` variants                          |
| `Spark` (sparkline)      | **Recharts** `<LineChart>` + `<Area>`            |
| `Donut`                  | **Recharts** `<PieChart>` with `innerRadius`     |
| `BarSet`                 | **Recharts** `<BarChart>` with stacked bars      |
| `Ticker` (count-up)      | `useEffect` + `requestAnimationFrame`, ease-out cubic |
| `progress` (shimmer)     | shadcn `Progress` + custom shimmer overlay       |
| `TradeForm` modal        | shadcn `Dialog` + `Form`                         |
| `EventModal`             | shadcn `Dialog`                                  |
| `Tabs/Chips`             | shadcn `Tabs` or `ToggleGroup`                   |
| `WatchlistTable`, etc.   | shadcn `Table` + `flash` keyframe                |
| `Calendar`               | **FullCalendar** (`dayGridMonth`, custom event renderer) |

## Interactions & Animations

- **Page fade-in** on route mount: `opacity 0 → 1`, `translateY(4px) → 0`, `350ms ease`. Implement via `key={route}` re-mount or framer-motion.
- **Number ticker:** animate from previous value to new over 600ms, ease-out cubic. Always use tabular-nums.
- **Sparkline draw-on:** `stroke-dasharray: 1000; stroke-dashoffset: 1000 → 0` over 1.6s ease.
- **Live price flash:** when ticker > previous, apply `flash-up` (green bg fade) for 800ms; when <, `flash-dn` (red).
- **Donut slice hover:** scale 1.04, other slices fade to opacity 0.32, transition 200ms.
- **Progress shimmer:** infinite 2.5s gradient sweep across the filled bar.
- **Live pulse dot:** opacity 1 → 0.35 → 1 over 2s infinite.
- **Modal in:** opacity + `scale(0.98) → 1` + `translateY(8px) → 0` over 200ms cubic-bezier(.2,.8,.2,1). Backdrop blur 4px.
- **Button hover:** `translateY(-1px)`, background lift to `--bg-hover`.
- **Sidebar item hover:** background `--bg-hover`, color → `--text`. Active: gradient pill.
- **Theme switch:** smooth via `transition: background-color .25s ease, color .25s ease` on `body`.

## State Management

Per-page state is local. App-level state required:

- `theme`: `'dark' | 'light'` — persist to localStorage; sync via `next-themes` or `data-theme` attribute.
- `accent`: `'emerald' | 'indigo' | 'amber' | 'rose'`.
- `holdings`: array of `{ sym, qty, avg }`.
- `prices`: `Record<sym, number>` — fed by SWR/react-query polling Binance/CoinGecko (interval based on user setting).
- `prevPrices`: ref for flash-direction detection.
- `trades`, `goals`, `incomeExpense`, `taxLots` — fetched per page, mutated via server actions.

Live price feed: poll every 2/5/15/60s (user-configurable). On each tick, update `prices`, store previous, and apply flash class to changed table rows.

## Live Data Integration

- Primary: Binance Spot Ticker API (`GET /api/v3/ticker/24hr`) for symbol price + 24h % change + 24h volume.
- Fallback: CoinGecko (`/coins/markets`) — slower but no API key, broader coin support.
- For sparklines: Binance klines (`/api/v3/klines?interval=1h&limit=30`) or CoinGecko `/sparkline_in_7d`.
- Store the chosen source as a watchlist setting; show a `Badge` per row indicating where the row's price came from.
- Cache server-side for 2–5s using Next.js `fetch({ next: { revalidate: 5 } })` to avoid rate limits.

## Currency & Formatting

- All monetary values display as `$X,XXX.XX` (USD) or `X,XXX USDT` next to the number.
- Use `Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })` for fiat.
- Crypto quantities: up to 8 decimals; trim trailing zeros for display.
- Percent: `+X.XX%` / `-X.XX%`, green for ≥0, red for <0.
- Always render numbers in `JetBrains Mono` with tabular-nums.

## Accessibility

- Every icon button needs an `aria-label` (the prototype uses `title` only).
- Focus rings: 2px outline in `--accent` for keyboard nav.
- Color contrast: gain/loss colors meet AA against dark backgrounds; recheck against light theme.
- Number tables: row-level "View details" affordance for screen readers (the prototype has hover-only icons).

## Files in this bundle

```
source/
  Crypto Dashboard.html              entry point
  styles.css                         all design tokens + component CSS
  app.jsx                            root + theme/tweaks wiring
  shell.jsx                          Sidebar + Header
  data.jsx                           mock data (coins, trades, goals, etc.)
  ui.jsx                             reusable bits (Spark, Donut, Delta, Ticker, BarSet, usePriceFeed)
  icons.jsx                          inline Lucide-style icons
  page-dashboard.jsx                 /dashboard
  page-watchlist-portfolio.jsx       /watchlist + /portfolio
  page-trades-calendar.jsx           /trades + /calendar
  page-finance.jsx                   /goals + /income-expense + /tax
  tweaks-panel.jsx                   in-design tweak controls (skip in production)
```

The `tweaks-panel.jsx` and the live `Tweaks` UI in `app.jsx` are an **authoring-time aid only** — drop them when porting to Next.js. Surface theme/accent toggles via the header's settings menu instead.

## Recommended implementation order

1. Tailwind theme + `globals.css` with the dark/light CSS variables.
2. App shell: `(authed)/layout.tsx` with Sidebar + Header.
3. shadcn primitives wired (Button, Card, Table, Dialog, Badge, Progress, Input, Select, Tabs, DropdownMenu, Tooltip).
4. Reusable: `Coin`, `Delta`, `Sparkline` (Recharts), `Donut` (Recharts), `Ticker`.
5. Pages, in order of complexity: Login → Watchlist → Portfolio → Dashboard → Trades → Income/Expense → Tax → Goals → Calendar.
6. Live price polling hook (`usePriceFeed`) + flash directive on table rows.
7. Theme toggle via `next-themes`.
8. Auth + persistence (out of scope of this design).

## Notes for Claude Code

- The HTML prototype is the **source of truth for visuals**. When in doubt, screenshot the prototype and match.
- Do **not** copy `styles.css` wholesale — distill it into Tailwind utilities and a small `globals.css`. The CSS variables can map 1:1 to your theme.
- The mock data in `data.jsx` is realistic — use it as seed data for local dev.
- Turkish labels are intentional. English numerical formatting is intentional.
