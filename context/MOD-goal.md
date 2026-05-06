# MOD — Goal (Hedef Takibi)

## Amaç
Kullanıcının kâr hedefleri tanımlamasını, anlık ilerlemeyi izlemesini ve istatistiksel projeksiyonla tahmini bitiş tarihini görmesini sağlar.

## Sorumluluklar
- Hedef CRUD: oluşturma, düzenleme, silme
- Anlık ilerleme hesaplama: `(mevcut kâr / hedef kâr) × 100`
- Son 7 günlük hıza göre tahmini tamamlanma tarihi hesaplama
- Hedefe bitiş tarihinde yetişilemeyecekse uyarı üretme

## API Endpoint'leri
| Yöntem | Yol | Açıklama |
|--------|-----|----------|
| GET | `/api/goals` | Tüm aktif hedefler |
| POST | `/api/goals` | Yeni hedef oluştur |
| PUT | `/api/goals/:id` | Hedefi güncelle |
| DELETE | `/api/goals/:id` | Hedefi sil |

## Veri Modeli
```
Goal {
  id           : UUID
  userId       : UUID
  name         : string
  targetProfit : number (USD)
  deadline     : date
  createdAt    : datetime
}
```

## Hesaplamalar
| Değer | Formül |
|-------|--------|
| Anlık ilerleme | `currentProfit / targetProfit × 100` |
| Günlük oran | `currentProfit / geçen gün sayısı` |
| Tahmini bitiş | `bugün + (kalan kâr / günlük oran)` |
| Risk uyarısı | `tahmini bitiş > deadline` |

## İş Kuralları
- Birden fazla aktif hedef aynı anda tanımlanabilir
- Projeksiyon en az son 7 günlük veriyi baz alır
- İlerleme her oturum açılışında güncel veriyle hesaplanır

---

## SAY — Goals (Hedef Takibi Ekranı)
**Rota:** `/goals`

### Bölümler
| Bölüm | Açıklama |
|-------|----------|
| Aktif hedefler listesi | Her hedef için GoalCard |
| Hedef ekle butonu | Yeni hedef formu açar |
| Tamamlanan hedefler | Collapsed arşiv bölümü |

---

### KOM — GoalCard
**Amaç:** Tek bir kâr hedefinin özetini, ilerlemesini ve projeksiyonunu kart formatında gösterir.

**Gösterilen Bilgiler**
| Bilgi | Açıklama |
|-------|----------|
| Hedef adı | Kullanıcının verdiği isim |
| Hedef kâr | USD cinsinden |
| Bitiş tarihi | "X gün kaldı" ile birlikte |
| İlerleme | GoalProgress komponenti |
| Tahmini bitiş | Mevcut hıza göre projeksiyon tarihi |
| Risk rozeti | Tahmini bitiş > deadline ise kırmızı |

**Props**
| Prop | Tür | Açıklama |
|------|-----|----------|
| `goal` | Goal | Hedef verisi |
| `currentProfit` | number | Anlık gerçekleşen kâr (USD) |
| `onDelete` | (id) => void | Hedef silme |
| `onEdit` | (id) => void | Hedef düzenleme |

**Davranışlar**
- %100'e ulaşınca kart "Tamamlandı" rozeti alır
- Risk uyarısı varsa kart çerçevesi kırmızıya döner
- Dashboard'da mini versiyon olarak da kullanılır

---

### KOM — GoalProgress
**Amaç:** Bir hedefin tamamlanma yüzdesini görsel ilerleme çubuğu olarak gösterir.

**Görünüm:** `[████████░░░░░░]  42%`

**Props**
| Prop | Tür | Açıklama |
|------|-----|----------|
| `percentage` | number | 0–100 arası tamamlanma yüzdesi |
| `size` | "full" \| "mini" | Çubuk yüksekliği |
| `variant` | "default" \| "warning" \| "success" | Renk teması |

**Renk Mantığı**
| Durum | Variant | Renk |
|-------|---------|------|
| %100 tamamlandı | success | Yeşil |
| Risk uyarısı var | warning | Kırmızı |
| Normal ilerleme | default | Mavi |

**Davranışlar**
- `percentage > 100` olursa %100 gösterilir (overflow yok)
- `mini` modda yüzde sayısı gizlenir
