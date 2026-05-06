# MOD — Tax (Vergi Hesaplama)

## Amaç
Alım-satım not defterindeki işlemlerden yola çıkarak yıllık vergi yükümlülüğünü FIFO yöntemiyle otomatik hesaplar.

## Sorumluluklar
- Satış işlemlerine karşılık gelen alışları FIFO ile eşleştirme
- Gerçekleşen kâr/zarar hesaplama
- Yıllık vergilendirilebilir kâr toplamı gösterme
- Kullanıcının girdiği vergi oranıyla vergi tutarını hesaplama
- Hesaplama özetini CSV olarak dışa aktarma

## API Endpoint'leri
| Yöntem | Yol | Açıklama |
|--------|-----|----------|
| GET | `/api/tax?year=2025` | Yıllık vergi hesabı |
| GET | `/api/tax/export?year=2025` | CSV dışa aktarma |
| PUT | `/api/tax/rate` | Kullanıcı vergi oranını güncelle |

## Veri Modeli
```
TaxSettings {
  userId  : UUID
  taxRate : number (%)
}
```

## FIFO Algoritması
1. Her coin için alışlar tarihe göre sıralanır (en eski önce)
2. Satış gerçekleştiğinde en eski alış lot'ları tüketilir
3. `kâr = (satış fiyatı − alış fiyatı) × adet`
4. `vergi = kâr × (taxRate / 100)`

## CSV Çıktı Sütunları
`tarih | coin | alış fiyatı | satış fiyatı | adet | kâr/zarar | vergi tutarı`

## İş Kuralları
- Not defterine yeni işlem eklendiğinde hesap otomatik güncellenir
- Vergi oranı değiştirildiğinde sonuç anında yeniden hesaplanır
- Aynı coinin birden fazla alım kaydı olduğunda FIFO doğru çalışmalı

---

## SAY — Tax (Vergi Hesaplama Ekranı)
**Rota:** `/tax`

### Bölümler
| Bölüm | Açıklama |
|-------|----------|
| Yıl seçici | Hesaplanacak takvim yılı |
| Vergi oranı girişi | Kullanıcı oranı girer; sonuç anında güncellenir |
| Özet kart | Toplam kâr, zarar, net, tahmini vergi |
| Detay tablosu | Her satış işleminin FIFO dökümü |
| CSV dışa aktar | Hesaplama özetini indirir |

---

### KOM — TaxSummary
**Amaç:** Seçilen yılın vergi hesabı özetini tek bakışta gösterir.

**Gösterilen Metrikler**
| Metrik | Açıklama |
|--------|----------|
| Toplam kâr | Yıl içi kârlı satışların toplamı (USD) |
| Toplam zarar | Yıl içi zararlı satışların toplamı (USD) |
| Net vergilendirilebilir kâr | `toplam kâr + toplam zarar` |
| Vergi oranı | Düzenlenebilir input (%) |
| Tahmini vergi tutarı | `net kâr × (oran / 100)` |

**Props**
| Prop | Tür | Açıklama |
|------|-----|----------|
| `totalGain` | number | Toplam kâr |
| `totalLoss` | number | Toplam zarar |
| `taxRate` | number | Vergi oranı (%) |
| `onRateChange` | (rate) => void | Oran değiştirilince tetiklenir |

**Davranışlar**
- Vergi oranı bu kart üzerindeki input'tan düzenlenir; her değişimde hesap yenilenir
- Net kâr pozitifse yeşil, negatifse kırmızı gösterilir

---

### KOM — TaxTable
**Amaç:** FIFO yöntemiyle hesaplanan her satış işleminin vergi detayını satır bazında listeler.

**Sütunlar**
| Sütun | Açıklama |
|-------|----------|
| Tarih | Satış işlem tarihi |
| Coin | Sembol |
| Alış Fiyatı | FIFO eşleşen alış fiyatı (USDT) |
| Satış Fiyatı | Satış fiyatı (USDT) |
| Adet | İşlem adedi |
| Kâr / Zarar | `(satış − alış) × adet` |
| Vergi Tutarı | `kâr × (oran / 100)` |

**Props**
| Prop | Tür | Açıklama |
|------|-----|----------|
| `lots` | TaxLotResult[] | Hesaplanmış FIFO satır verileri |
| `taxRate` | number | Uygulanan vergi oranı |

**Davranışlar**
- Kâr pozitifse yeşil, negatifse kırmızı gösterilir
- Tablo altında toplam kâr/zarar ve toplam vergi satırı
- Boş tablo: "Bu yıla ait satış işlemi bulunamadı"
