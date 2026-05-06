# MOD — Watchlist (Varlık Listesi)

## Amaç
Kullanıcının takip ettiği coin ve hisselerin anlık fiyatlarını Binance (birincil) ve CoinGecko (fallback) üzerinden çekerek gösterir.

## Sorumluluklar
- Binance REST/WebSocket ile anlık fiyat çekme
- Binance erişilemezse CoinGecko'ya otomatik geçiş
- 24 saatlik değişim yüzdesi hesaplama
- Kullanıcının varlık listesini CRUD ile yönetme
- Kullanıcının belirlediği aralıkta otomatik yenileme

## API Endpoint'leri
| Yöntem | Yol | Açıklama |
|--------|-----|----------|
| GET | `/api/watchlist` | Kullanıcının varlık listesi + anlık fiyatlar |
| POST | `/api/watchlist` | Yeni varlık ekle |
| PUT | `/api/watchlist/:id` | Varlık güncelle |
| DELETE | `/api/watchlist/:id` | Varlık sil |
| GET | `/api/prices?symbols=BTC,ETH` | Fiyat verisi (cache TTL: 15sn) |

## Veri Modeli
```
WatchlistAsset {
  id        : UUID
  userId    : UUID
  symbol    : string
  amount    : number?
  createdAt : datetime
}

PriceCache {
  symbol    : string
  price     : number (USDT/USD)
  change24h : number (%)
  source    : "binance" | "coingecko"
  fetchedAt : datetime
}
```

## İş Kuralları
- Önbellek TTL: 15 saniye
- Binance'e 3 art arda başarısız istek → CoinGecko'ya geçiş
- Yenileme aralığı kullanıcı tarafından ayarlanır; minimum 10 saniye
- Sayfa açıldığında liste maks. 5 saniyede yüklenir

---

## SAY — Watchlist (Varlık Listesi Ekranı)
**Rota:** `/watchlist`

### Bölümler
| Bölüm | Açıklama |
|-------|----------|
| Varlık tablosu | Sembol, fiyat, 24s değişim, işlemler |
| Varlık ekle butonu | Modal tetikler |
| Yenileme ayarı | Otomatik yenileme aralığı seçici |

---

### KOM — WatchlistTable
**Amaç:** Takip edilen varlıkların fiyat ve değişim verisini tablo formatında gösterir.

**Sütunlar**
| Sütun | Açıklama |
|-------|----------|
| Sembol | Coin kodu (ör. BTC) |
| Fiyat | Anlık USDT/USD değeri |
| 24s Değişim | % değişim; pozitif → yeşil, negatif → kırmızı |
| İşlemler | Düzenle / Sil butonları |

**Props**
| Prop | Tür | Açıklama |
|------|-----|----------|
| `assets` | Asset[] | Gösterilecek varlık listesi |
| `onEdit` | (id) => void | Düzenleme tetikleyicisi |
| `onDelete` | (id) => void | Silme tetikleyicisi |

**Davranışlar**
- Fiyat güncellendiğinde satırda 500ms flash animasyonu oynar
- Boş listede yönlendirici mesaj gösterilir

---

### KOM — AssetCard
**Amaç:** Yeni varlık eklemek veya mevcudu düzenlemek için açılan modal formdur.

**Alanlar**
| Alan | Tür | Zorunlu |
|------|-----|---------|
| Sembol | text / autocomplete | evet |
| Miktar | number | hayır |

**Props**
| Prop | Tür | Açıklama |
|------|-----|----------|
| `mode` | "add" \| "edit" | Kart modu |
| `asset` | Asset? | Düzenleme modunda mevcut varlık |
| `onSave` | (data) => void | Kaydet tetikleyicisi |
| `onClose` | () => void | Modal kapat |

**Davranışlar**
- Geçersiz sembol girilirse API hatasıyla satır içi uyarı gösterilir
- Kayıt sonrası tablo yenilenmeden güncellenir

---

### KOM — PriceTag
**Amaç:** Bir varlığın anlık fiyatını ve 24s değişimini satır içi etiket olarak gösterir.

**Görünüm:** `BTC  $67,420  ▲ +2.3%`

**Props**
| Prop | Tür | Açıklama |
|------|-----|----------|
| `price` | number | Anlık fiyat (USD/USDT) |
| `change24h` | number | 24s yüzde değişim |
| `size` | "sm" \| "md" \| "lg" | Boyut |

**Davranışlar**
- `change24h > 0` → yeşil ▲; `< 0` → kırmızı ▼; `= 0` → gri
- Fiyat güncellendiğinde 500ms flash animasyonu
- Veri yoksa `—` gösterilir
