# MOD — Trade (Alım-Satım Not Defteri)

## Amaç
Kullanıcının gerçekleştirdiği alım-satım işlemlerini kaydeder, listeler ve kâr/zarar analizini sağlar.

## Sorumluluklar
- İşlem CRUD: ekleme, listeleme, silme
- Filtreleme: coin, tarih aralığı, işlem tipi
- Satış işlemlerinde gerçekleşen kâr/zarar hesaplama
- Opsiyonel: Binance API ile otomatik işlem çekme
- Diğer modüllere (Tax, Calendar, Goal) ham işlem verisi sağlama

## API Endpoint'leri
| Yöntem | Yol | Açıklama |
|--------|-----|----------|
| GET | `/api/trades` | İşlem listesi (filtre destekli) |
| POST | `/api/trades` | Yeni işlem ekle |
| DELETE | `/api/trades/:id` | İşlem sil |
| POST | `/api/trades/sync` | Binance API ile otomatik çek |

## Veri Modeli
```
Trade {
  id       : UUID
  userId   : UUID
  symbol   : string
  type     : "buy" | "sell"
  date     : datetime
  amount   : number
  price    : number (USDT)
  exchange : string?
  note     : string?
}
```

## İş Kuralları
- Zorunlu alanlar: symbol, type, date, amount, price
- Binance bağlantısı kesilse bile manuel kayıtlar etkilenmez
- Filtreleme sonuçları 1 saniyeden kısa sürede güncellenir

---

## SAY — Trades (Alım-Satım Not Defteri Ekranı)
**Rota:** `/trades`

### Bölümler
| Bölüm | Açıklama |
|-------|----------|
| Filtre çubuğu | Coin, tarih aralığı, işlem tipi |
| İşlem tablosu | Tüm işlemler; kâr/zarar dahil |
| Toplam özet | Filtrelenen kayıtların kümülatif kâr/zarar |
| İşlem ekle butonu | Modal form tetikler |
| Binance senkron butonu | API anahtarıyla otomatik çekme |

---

### KOM — TradeFilter
**Amaç:** İşlem tablosunu coin, tarih aralığı ve işlem tipine göre anlık filtreler.

**Filtre Alanları**
| Alan | Tür | Açıklama |
|------|-----|----------|
| Coin | text / select | Sembol bazlı arama |
| Başlangıç tarihi | date picker | Aralık başlangıcı |
| Bitiş tarihi | date picker | Aralık sonu |
| İşlem tipi | Tümü / Alım / Satım | Segment control |

**Props**
| Prop | Tür | Açıklama |
|------|-----|----------|
| `onFilterChange` | (FilterState) => void | Her değişimde tetiklenir |
| `availableSymbols` | string[] | Dropdown için coin listesi |

**Davranışlar**
- Debounce: 300ms — her değişimde tablo anlık güncellenir
- "Filtreleri Sıfırla" tüm değerleri temizler
- Aktif filtre sayısı badge ile gösterilir

---

### KOM — TradeTable
**Amaç:** Kaydedilmiş alım-satım işlemlerini sıralı tablo formatında listeler.

**Sütunlar**
| Sütun | Açıklama |
|-------|----------|
| Tarih | İşlem tarihi |
| Coin | Sembol |
| Tür | Alım (yeşil) / Satım (kırmızı) |
| Adet | İşlem adedi |
| Fiyat | İşlem fiyatı (USDT) |
| Toplam | `adet × fiyat` |
| Borsa | Borsa adı |
| Kâr/Zarar | Yalnızca satış işlemleri için |
| — | Sil butonu |

**Props**
| Prop | Tür | Açıklama |
|------|-----|----------|
| `trades` | Trade[] | Gösterilecek işlem listesi |
| `onDelete` | (id) => void | Silme tetikleyicisi |

**Davranışlar**
- Kâr yeşil, zarar kırmızı renkte gösterilir
- Varsayılan sıralama: en yeni işlem üstte
- Boş listede "Henüz işlem yok" mesajı

---

### KOM — TradeForm
**Amaç:** Yeni alım-satım işlemi girmek için kullanılan modal formdur.

**Alanlar**
| Alan | Tür | Zorunlu |
|------|-----|---------|
| Coin sembolü | text / autocomplete | evet |
| İşlem tipi | alım / satım | evet |
| Tarih | date picker | evet |
| Adet | number | evet |
| Fiyat (USDT) | number | evet |
| Borsa | text | hayır |
| Not | textarea | hayır |

**Props**
| Prop | Tür | Açıklama |
|------|-----|----------|
| `onSubmit` | (TradeData) => void | Formu kaydet |
| `onClose` | () => void | Modal kapat |

**Davranışlar**
- Zorunlu alan boşsa gönder butonu devre dışı
- Başarılı kayıt sonrası form sıfırlanır, modal kapanır
- API hatasında form üstünde hata banner'ı görünür
