# Crypto Dashboard

Bir kripto borsa yatırımcısının portföyünü ve yatırımlarını anlık olarak takip etmesini sağlayan web tabanlı dashboard uygulaması.

---

## Proje Kapsamı

### 1. Coin / Hisse Takibi

- BTC, ETH ve diğer coinlerin anlık fiyatları
- Kullanıcı tarafından eklenebilir, düzenlenebilir ve kaldırılabilir varlık listesi

### 2. Crypto Cüzdan Özeti

- Cüzdanın anlık toplam değeri (USD bazında)

### 3. Alım-Satım Not Defteri

- Elle girilebilen alım/satım detayları
- Gerekirse Binance API entegrasyonu
- Tüm işlemlerin interaktif olarak takip edilmesi

### 4. Takvim

- Alım-satım işlemleri ve önemli olayların takvim görünümünde izlenmesi

### 5. Hedef Takibi

- Belirli süreler için kâr hedefi tanımlama
- Anlık ilerleme durumu
- İstatistiksel analiz ile tahmini hedefe ulaşma süresi veya süre kısıtındaki tahmini son durum

### 6. Gelir-Gider Tablosu

- Elle tutulan, düzenlenebilir gelir ve gider kayıtları

---

## Genel Yapı

Projenin temel amacı; bir yatırımcının tüm verilerini **temiz, anlaşılır ve hızlı** bir arayüzde görebilmesidir.

- **Platform:** Web tabanlı (ilerleyen aşamalarda mobil ve masaüstü uygulama desteği planlanmaktadır)

---

## Tech Stack

### Neden Bu Stack?

Tek repo, ayrı backend yok, veritabanı soyutlaması hazır, bileşen kütüphanesi hızı — MVP'ye en kısa yol.

### Temel Katmanlar

| Katman | Teknoloji | Gerekçe |
| --- | --- | --- |
| Framework | [Next.js 15](https://nextjs.org) (App Router) | Frontend + API Routes tek repoda; ayrı backend kurulumu yok |
| Dil | TypeScript | Tip güvenliği, daha az runtime hatası |
| Stil | [Tailwind CSS](https://tailwindcss.com) | Utility-first; hızlı, tutarlı arayüz |
| Bileşenler | [shadcn/ui](https://ui.shadcn.com) | Tablo, form, modal, dropdown — hepsi hazır, özelleştirilebilir |
| Veri çekme | [TanStack Query](https://tanstack.com/query) | Otomatik cache, yenileme aralığı, fallback mantığı |
| ORM | [Prisma](https://www.prisma.io) | SQLite (dev) → PostgreSQL (prod) tek config değişikliğiyle |
| Auth | [NextAuth.js v5](https://authjs.dev) | Credentials provider ile temel kullanıcı adı + parola akışı |
| Grafikler | [Recharts](https://recharts.org) | React-native, hafif; portföy dağılımı ve hedef ilerleme grafikleri |
| Takvim | [FullCalendar](https://fullcalendar.io) | Aylık/haftalık görünüm, event ekleme — kutudan çıkar |
| Fiyat API | Binance REST + WebSocket | Birincil kaynak; 15 sn altı gecikme için WebSocket |
| Fallback API | CoinGecko Public API | Binance erişilemez olduğunda otomatik devreye girer |

### Klasör Yapısı (Önerilen)

```text
src/
├── app/
│   ├── (auth)/          # login sayfası
│   ├── (dashboard)/     # korumalı sayfalar
│   │   ├── watchlist/
│   │   ├── wallet/
│   │   ├── trades/
│   │   ├── calendar/
│   │   ├── goals/
│   │   ├── finance/
│   │   └── tax/
│   └── api/             # Next.js API Routes
├── components/          # shadcn/ui + özel bileşenler
├── lib/
│   ├── db.ts            # Prisma client
│   ├── binance.ts       # Binance API + CoinGecko fallback
│   └── tax.ts           # FIFO vergi hesaplama motoru
└── prisma/
    └── schema.prisma
```

### Geliştirme Ortamı

```bash
node >= 20
npm >= 10
# SQLite — ek kurulum gerektirmez
# PostgreSQL — üretim ortamı için
```

---

## Demo Giriş Bilgileri

Login ekranı (`/login`) şu an **kimlik doğrulama yapmıyor**; form gönderimi sonrası doğrudan `/dashboard`’a yönlendirir. UI’da görünen örnek değerlerle giriş yapabilirsiniz:

- **E-posta / Username**: `emre@example.com`
- **Şifre / Password**: `••••••••`
