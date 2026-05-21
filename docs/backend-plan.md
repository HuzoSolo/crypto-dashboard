# Backend & Veritabanı İnşa Planı

## Genel Mimari

Next.js Route Handlers — ayrı bir backend servisi yok. Tüm `/api/*` endpoint'leri `app/api/` altında yazılır. Tek repo, tek deploy.

```
frontend (Next.js App Router)
   └── /api/*  ← Route Handlers
         └── PostgreSQL / SQLite  ← Prisma ORM
```

---

## Teknoloji Seçimleri

| Katman | Seçim | Gerekçe |
|---|---|---|
| ORM | **Prisma** | TypeScript-native, migration sistemi güçlü, Next.js ile tam uyumlu |
| DB (dev) | **SQLite** | Sıfır setup, PRD'de belirtilmiş |
| DB (prod) | **PostgreSQL** | PRD'de belirtilmiş |
| Auth | **JWT + bcrypt** | `jose` (edge-uyumlu) + `bcryptjs` |
| Token depolama | **httpOnly Cookie** | localStorage'a karşı XSS güvenli |
| Fiyat verisi | **Binance REST + CoinGecko fallback** | PRD kararı |
| Validation | **Zod** | Schema tabanlı, TypeScript ile entegre |

---

## Veritabanı Şeması

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"   // prod'da "postgresql" olur
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  username  String   @unique
  password  String   // bcrypt hash
  taxRate   Float    @default(20)
  createdAt DateTime @default(now())

  watchlist WatchlistItem[]
  portfolio PortfolioAsset[]
  trades    Trade[]
  events    CalendarEvent[]
  goals     Goal[]
  finances  FinanceEntry[]
}

model WatchlistItem {
  id     String @id @default(uuid())
  userId String
  symbol String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, symbol])
}

model PortfolioAsset {
  id        String   @id @default(uuid())
  userId    String
  symbol    String
  amount    Float
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, symbol])
}

model Trade {
  id        String    @id @default(uuid())
  userId    String
  symbol    String
  type      TradeType
  date      DateTime
  amount    Float
  price     Float     // USDT
  exchange  String?
  note      String?
  createdAt DateTime  @default(now())
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, symbol])
  @@index([userId, date])
}

enum TradeType {
  BUY
  SELL
}

model CalendarEvent {
  id          String    @id @default(uuid())
  userId      String
  title       String
  date        DateTime
  description String?
  type        EventType @default(MANUAL)
  tradeId     String?   @unique   // TRADE tipinde ilgili Trade'i işaret eder
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum EventType {
  MANUAL
  TRADE
}

model Goal {
  id        String   @id @default(uuid())
  userId    String
  name      String
  targetUSD Float
  deadline  DateTime
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model FinanceEntry {
  id          String      @id @default(uuid())
  userId      String
  type        FinanceType
  category    String
  amount      Float       // USD/USDT
  date        DateTime
  description String?
  createdAt   DateTime    @default(now())
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, date])
  @@index([userId, type])
}

enum FinanceType {
  INCOME
  EXPENSE
}
```

> **Not:** `TaxSettings` ayrı tablo değil — `User.taxRate` alanına gömüldü.
> FIFO hesabı DB'de saklanmaz, her request'te Trade'lerden anlık hesaplanır.

---

## Klasör Yapısı

```
app/
├── api/
│   ├── auth/
│   │   ├── register/route.ts
│   │   ├── login/route.ts
│   │   ├── logout/route.ts
│   │   └── me/route.ts
│   ├── watchlist/
│   │   ├── route.ts          (GET, POST)
│   │   └── [id]/route.ts     (DELETE)
│   ├── portfolio/
│   │   ├── route.ts          (GET, POST)
│   │   └── [id]/route.ts     (PUT, DELETE)
│   ├── trades/
│   │   ├── route.ts          (GET, POST)
│   │   ├── [id]/route.ts     (DELETE)
│   │   └── sync/route.ts     (POST — Binance)
│   ├── calendar/
│   │   ├── route.ts          (GET, POST)
│   │   └── [id]/route.ts     (DELETE)
│   ├── goals/
│   │   ├── route.ts          (GET, POST)
│   │   └── [id]/route.ts     (DELETE)
│   ├── finance/
│   │   ├── route.ts          (GET, POST)
│   │   ├── [id]/route.ts     (DELETE)
│   │   └── export/route.ts   (GET — CSV)
│   └── tax/
│       ├── route.ts          (GET — hesaplama)
│       ├── rate/route.ts     (PUT)
│       └── export/route.ts   (GET — CSV)
├── lib/
│   ├── prisma.ts             (singleton Prisma client)
│   ├── auth.ts               (JWT sign/verify, middleware helper)
│   └── fifo.ts               (FIFO vergi hesaplama algoritması)
└── middleware.ts             (korumalı route'lar için auth guard)
```

---

## API Endpoint Listesi

### Auth
| Yöntem | Yol | Açıklama |
|--------|-----|----------|
| POST | `/api/auth/register` | Yeni kullanıcı kaydı |
| POST | `/api/auth/login` | Giriş; httpOnly cookie döner |
| POST | `/api/auth/logout` | Cookie temizler |
| GET  | `/api/auth/me` | Mevcut kullanıcı bilgisi |

### Watchlist
| Yöntem | Yol | Açıklama |
|--------|-----|----------|
| GET    | `/api/watchlist` | Kullanıcının takip listesi |
| POST   | `/api/watchlist` | Sembol ekle |
| DELETE | `/api/watchlist/:id` | Sembol sil |

### Portfolio
| Yöntem | Yol | Açıklama |
|--------|-----|----------|
| GET    | `/api/portfolio` | Varlıklar + Binance'tan anlık fiyatlar |
| POST   | `/api/portfolio` | Yeni varlık ekle |
| PUT    | `/api/portfolio/:id` | Miktar güncelle |
| DELETE | `/api/portfolio/:id` | Varlık sil |

### Trades
| Yöntem | Yol | Açıklama |
|--------|-----|----------|
| GET    | `/api/trades` | İşlem listesi (filtre destekli: symbol, type, from, to) |
| POST   | `/api/trades` | Yeni işlem ekle |
| DELETE | `/api/trades/:id` | İşlem sil |
| POST   | `/api/trades/sync` | Binance API ile otomatik çek |

### Calendar
| Yöntem | Yol | Açıklama |
|--------|-----|----------|
| GET    | `/api/calendar` | Etkinlikler (Trade'ler dahil) |
| POST   | `/api/calendar` | Manuel etkinlik ekle |
| DELETE | `/api/calendar/:id` | Etkinlik sil |

### Goals
| Yöntem | Yol | Açıklama |
|--------|-----|----------|
| GET    | `/api/goals` | Hedefler + anlık ilerleme |
| POST   | `/api/goals` | Yeni hedef ekle |
| DELETE | `/api/goals/:id` | Hedef sil |

### Finance
| Yöntem | Yol | Açıklama |
|--------|-----|----------|
| GET    | `/api/finance` | Gelir-gider kayıtları (filtre destekli) |
| POST   | `/api/finance` | Yeni kayıt ekle |
| DELETE | `/api/finance/:id` | Kayıt sil |
| GET    | `/api/finance/export` | Filtrelenmiş CSV indir |

### Tax
| Yöntem | Yol | Açıklama |
|--------|-----|----------|
| GET    | `/api/tax?year=2025` | Yıllık FIFO vergi hesabı |
| PUT    | `/api/tax/rate` | Vergi oranını güncelle |
| GET    | `/api/tax/export?year=2025` | CSV dışa aktar |

---

## Auth Akışı

```
POST /api/auth/login
  → bcrypt.compare(password, hash)
  → JWT oluştur (24h, payload: { userId })
  → Set-Cookie: token=<jwt>; HttpOnly; Secure; SameSite=Lax
  → 200 { user: { id, username } }

middleware.ts
  → /login ve /api/auth/* hariç tüm route'lar korumalı
  → Cookie yoksa veya geçersizse → 401 / /login yönlendir
  → 5 başarısız girişten sonra 15 dakika bekleme (in-memory)
```

---

## Fiyat Verisi Stratejisi

Fiyat verisi **DB'ye yazılmaz** — her zaman canlı API'den çekilir.

```
GET /api/portfolio
  1. DB'den user'ın PortfolioAsset'lerini çek
  2. Binance REST: GET /api/v3/ticker/24hr?symbols=[...]
     → Hata alırsa → CoinGecko /simple/price fallback
  3. amount × currentPrice hesapla, response'a ekle
  → Sonuç DB'ye yazılmaz
```

Client-side polling (Zustand + `setInterval`) ile watchlist ve portfolio 15 saniyede bir güncellenir.

---

## FIFO Algoritması (`lib/fifo.ts`)

DB yazma yok — her `GET /api/tax` request'inde Trade'ler çekilip hesaplanır.

```typescript
type BuyLot = { price: number; remaining: number; date: Date }
type TaxLotResult = {
  date: Date; symbol: string
  buyPrice: number; sellPrice: number
  amount: number; pnl: number; tax: number
}

function computeFIFO(trades: Trade[], year: number, taxRate: number): TaxLotResult[] {
  const buyQueues = new Map<string, BuyLot[]>()
  const results: TaxLotResult[] = []

  // Tüm BUY'ları kuyruğa ekle (yıldan bağımsız — FIFO için önceki yıllar da gerekli)
  trades
    .filter(t => t.type === 'BUY')
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .forEach(t => {
      const q = buyQueues.get(t.symbol) ?? []
      q.push({ price: t.price, remaining: t.amount, date: t.date })
      buyQueues.set(t.symbol, q)
    })

  // Sadece hedef yıldaki SELL'leri işle
  trades
    .filter(t => t.type === 'SELL' && t.date.getFullYear() === year)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .forEach(sell => {
      let sellRemaining = sell.amount
      const queue = buyQueues.get(sell.symbol) ?? []

      while (sellRemaining > 0 && queue.length > 0) {
        const lot = queue[0]
        const matched = Math.min(lot.remaining, sellRemaining)
        const pnl = (sell.price - lot.price) * matched

        results.push({
          date: sell.date, symbol: sell.symbol,
          buyPrice: lot.price, sellPrice: sell.price,
          amount: matched,
          pnl, tax: pnl > 0 ? pnl * (taxRate / 100) : 0,
        })

        lot.remaining -= matched
        sellRemaining -= matched
        if (lot.remaining === 0) queue.shift()
      }
    })

  return results
}
```

---

## Uygulama Sırası

| # | Adım | Dosyalar | Bağımlılık |
|---|---|---|---|
| 1 | **Prisma kurulum** | `prisma/schema.prisma`, `lib/prisma.ts`, `.env` | — |
| 2 | **Auth** | `api/auth/*`, `middleware.ts`, `lib/auth.ts` | 1 |
| 3 | **Watchlist** | `api/watchlist/*` | 1, 2 |
| 4 | **Portfolio + Fiyat** | `api/portfolio/*` | 1, 2 |
| 5 | **Trades** | `api/trades/*` | 1, 2 |
| 6 | **Tax + FIFO** | `api/tax/*`, `lib/fifo.ts` | 5 |
| 7 | **Goals** | `api/goals/*` | 1, 2 |
| 8 | **Finance** | `api/finance/*` | 1, 2 |
| 9 | **Calendar** | `api/calendar/*` | 5 |
| 10 | **Binance sync** | `api/trades/sync/route.ts` | 5 |

---

## Kurulum Komutları

```bash
# Prisma
npm install prisma @prisma/client
npx prisma init --datasource-provider sqlite

# Auth
npm install jose bcryptjs
npm install -D @types/bcryptjs

# Validation
npm install zod
```

```env
# .env
DATABASE_URL="file:./dev.db"
JWT_SECRET="<güçlü-rastgele-string>"
```

```bash
# Şemayı DB'ye uygula
npx prisma db push

# Prisma Studio (opsiyonel — veriyi görsel yönet)
npx prisma studio
```
