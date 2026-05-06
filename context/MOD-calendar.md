# MOD — Calendar (Takvim)

## Amaç
Alım-satım işlemlerini ve kullanıcı tanımlı etkinlikleri zaman ekseninde görselleştirir.

## Sorumluluklar
- Trade modülündeki işlemleri tarih bazında takvime yansıtma (senkronize)
- Manuel etkinlik (haber, hatırlatıcı) CRUD
- Aylık ve haftalık görünüm sunma
- Takvim öğesine tıklanınca detay gösterme

## API Endpoint'leri
| Yöntem | Yol | Açıklama |
|--------|-----|----------|
| GET | `/api/calendar/events?month=2025-06` | Etkinlik ve işlemleri döner |
| POST | `/api/calendar/events` | Manuel etkinlik ekle |
| PUT | `/api/calendar/events/:id` | Etkinlik güncelle |
| DELETE | `/api/calendar/events/:id` | Etkinlik sil |

## Veri Modeli
```
CalendarEvent {
  id          : UUID
  userId      : UUID
  type        : "trade" | "manual"
  title       : string
  date        : date
  description : string?
  tradeId     : UUID?   — type="trade" ise dolu
}
```

## İş Kuralları
- Trade kaydedildiğinde takvimde otomatik oluşur; silindiğinde senkronize kaldırılır
- Ekonomik takvim (tr.investing.com) entegrasyonu v2 kapsamında

---

## SAY — Calendar (Takvim Ekranı)
**Rota:** `/calendar`

### Bölümler
| Bölüm | Açıklama |
|-------|----------|
| Görünüm seçici | Aylık / haftalık geçiş |
| Takvim ızgarası | Günler ve üzerlerindeki olay noktaları |
| Etkinlik ekle butonu | Manuel etkinlik formu açar |
| Detay paneli | Tıklanan günün etkinlik ve işlem listesi |

---

### KOM — CalendarView
**Amaç:** İşlemleri ve etkinlikleri aylık veya haftalık ızgara üzerinde gösterir.

**Olay Renk Kodlaması**
| Tür | Renk |
|-----|------|
| Alım | Yeşil nokta |
| Satım | Kırmızı nokta |
| Manuel etkinlik | Mavi nokta |

**Props**
| Prop | Tür | Açıklama |
|------|-----|----------|
| `events` | CalendarEvent[] | Gösterilecek etkinlikler |
| `view` | "monthly" \| "weekly" | Takvim modu |
| `currentDate` | date | Gösterilen ay/hafta |
| `onDayClick` | (date) => void | Güne tıklanınca tetiklenir |
| `onViewChange` | (view) => void | Mod geçişi |
| `onNavigate` | ("prev" \| "next") => void | İleri/geri navigasyon |

**Davranışlar**
- Bir gün birden fazla olay içeriyorsa "+N daha" rozeti gösterilir
- Güne tıklanınca EventModal açılır

---

### KOM — EventModal
**Amaç:** Seçilen günün etkinliklerini listeler; yeni manuel etkinlik ekleme formu sunar.

**Detay Görünümü**
- Trade etkinlikleri: coin, tür, adet, fiyat
- Manuel etkinlikler: başlık, açıklama, silme butonu

**Ekleme Formu Alanları**
| Alan | Tür | Zorunlu |
|------|-----|---------|
| Başlık | text | evet |
| Tarih | date | evet (seçili günle dolu gelir) |
| Açıklama | textarea | hayır |

**Props**
| Prop | Tür | Açıklama |
|------|-----|----------|
| `date` | date | Seçili gün |
| `events` | CalendarEvent[] | O güne ait etkinlikler |
| `onAdd` | (EventData) => void | Yeni etkinlik kaydet |
| `onDelete` | (id) => void | Etkinlik sil |
| `onClose` | () => void | Modalı kapat |
