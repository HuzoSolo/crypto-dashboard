# MOD — Portfolio (Cüzdan Özeti)

## Amaç
Kullanıcının sahip olduğu varlıkları ve miktarlarını yönetir; anlık fiyatlarla birleştirerek toplam portföy değerini hesaplar.

## Sorumluluklar
- Kullanıcıya ait varlık + miktar kayıtlarını CRUD ile yönetme
- Toplam portföy değerini hesaplama: `Σ (miktar × anlık fiyat)`
- 24 saatlik portföy değer değişimini (USD ve %) hesaplama
- Pasta grafik için varlık bazında dağılım verisi üretme

## API Endpoint'leri
| Yöntem | Yol | Açıklama |
|--------|-----|----------|
| GET | `/api/portfolio` | Tüm varlıklar + anlık değerler |
| POST | `/api/portfolio` | Yeni varlık ekle |
| PUT | `/api/portfolio/:id` | Varlık miktarını güncelle |
| DELETE | `/api/portfolio/:id` | Varlığı sil |

## Veri Modeli
```
PortfolioAsset {
  id        : UUID
  userId    : UUID
  symbol    : string
  amount    : number
  updatedAt : datetime
}
```

## Hesaplamalar
| Değer | Formül |
|-------|--------|
| Varlık değeri | `amount × currentPrice` |
| Toplam portföy | `Σ (amount × currentPrice)` |
| 24s değişim (USD) | `Σ (amount × priceChange24h)` |
| 24s değişim (%) | `24sDeğişim / öncekiToplam × 100` |

## İş Kuralları
- Miktar güncellendikten sonra toplam değer anında yeniden hesaplanır
- Grafik, portföyün %80'inden fazlasını kapsayan varlıkları gösterir; kalanlar "Diğer" olarak gruplandırılır

---

## SAY — Portfolio (Cüzdan Özeti Ekranı)
**Rota:** `/portfolio`

### Bölümler
| Bölüm | Açıklama |
|-------|----------|
| Toplam portföy kartı | Toplam USD değeri + 24s değişim |
| Pasta grafik | Varlık bazında dağılım |
| Varlık satırları | Sembol, miktar, fiyat, toplam değer |
| Varlık ekle butonu | Modal form tetikler |

---

### KOM — PortfolioSummary
**Amaç:** Toplam portföy değerini ve 24 saatlik değişimi özet kart formatında gösterir.

**Gösterilen Bilgiler**
| Bilgi | Açıklama |
|-------|----------|
| Toplam değer | Büyük fontla, USD cinsinden |
| 24s değişim (USD) | Artı/eksi işaretli, renk kodlu |
| 24s değişim (%) | Artı/eksi işaretli, renk kodlu |
| Son güncelleme | "X saniye önce" formatı |

**Props**
| Prop | Tür | Açıklama |
|------|-----|----------|
| `totalValue` | number | Toplam portföy değeri (USD) |
| `change24hUSD` | number | 24s mutlak değişim |
| `change24hPct` | number | 24s yüzde değişim |
| `lastUpdated` | datetime | Fiyat verisi çekilme zamanı |

**Davranışlar**
- Pozitif değişim → yeşil; negatif → kırmızı
- `lastUpdated` 15 saniyeden eskiyse uyarı ikonu gösterilir
- Dashboard'da mini versiyon olarak da kullanılır

---

### KOM — PieChart
**Amaç:** Portföydeki her varlığın toplam değer içindeki oranını pasta grafik olarak gösterir.

**Props**
| Prop | Tür | Açıklama |
|------|-----|----------|
| `data` | PieSlice[] | `{ symbol, value, percentage }` |
| `size` | "full" \| "mini" | Grafik boyutu |

**Davranışlar**
- Dilimin üzerine gelindiğinde tooltip: sembol, değer, yüzde
- `mini` modda tooltip yok; yalnızca renk dilimleri
- %80 eşiğin altındaki varlıklar "Diğer" olarak gruplandırılır
- Dashboard'da `mini` modda gösterilir
