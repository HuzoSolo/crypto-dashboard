# MOD — Income-Expense (Gelir-Gider)

## Amaç
Kripto yatırımlarına bağlı gelir ve giderlerin manuel takibini sağlar; aylık/yıllık özetler ve CSV dışa aktarma sunar.

## Sorumluluklar
- Gelir/gider kaydı CRUD
- Aylık ve yıllık net bakiye hesaplama
- Kategori bazlı filtreleme ve sıralama
- Filtrelenmiş veriyi CSV olarak dışa aktarma

## API Endpoint'leri
| Yöntem | Yol | Açıklama |
|--------|-----|----------|
| GET | `/api/income-expense` | Kayıt listesi (filtre destekli) |
| POST | `/api/income-expense` | Yeni kayıt ekle |
| PUT | `/api/income-expense/:id` | Kayıt güncelle |
| DELETE | `/api/income-expense/:id` | Kayıt sil |
| GET | `/api/income-expense/summary` | Aylık/yıllık özet |
| GET | `/api/income-expense/export` | CSV dışa aktarma |

## Veri Modeli
```
IncomeExpenseEntry {
  id          : UUID
  userId      : UUID
  type        : "income" | "expense"
  category    : string
  amount      : number (USD/USDT)
  date        : date
  description : string?
}
```

## Hesaplamalar
| Değer | Formül |
|-------|--------|
| Aylık net | `Σ gelirler − Σ giderler` (seçili ay) |
| Yıllık net | `Σ gelirler − Σ giderler` (seçili yıl) |

## İş Kuralları
- Yeni kayıt anında tabloya yansır
- CSV çıktısı yalnızca aktif filtreler kapsamındaki veriyi içerir

---

## SAY — Income-Expense (Gelir-Gider Ekranı)
**Rota:** `/income-expense`

### Bölümler
| Bölüm | Açıklama |
|-------|----------|
| Özet başlığı | Toplam gelir, gider, net bakiye |
| Dönem seçici | Aylık / yıllık filtre |
| Kategori filtresi | Kategori bazlı daralma |
| Kayıt tablosu | Tüm gelir-gider satırları |
| Kayıt ekle butonu | Modal form tetikler |
| CSV dışa aktar | Filtrelenmiş veriyi indirir |

---

### KOM — IncomeExpenseForm
**Amaç:** Yeni gelir veya gider kaydı girmek için modal form bileşenidir.

**Alanlar**
| Alan | Tür | Zorunlu |
|------|-----|---------|
| Tür | gelir / gider | evet |
| Kategori | select + serbest metin | evet |
| Tutar (USD/USDT) | number | evet |
| Tarih | date picker | evet |
| Açıklama | textarea | hayır |

**Props**
| Prop | Tür | Açıklama |
|------|-----|----------|
| `onSubmit` | (EntryData) => void | Formu kaydet |
| `onClose` | () => void | Modal kapat |
| `categories` | string[] | Mevcut kategori listesi |

**Davranışlar**
- Tür seçimine göre form rengi değişir: gelir → yeşil, gider → kırmızı
- "Diğer" kategorisi seçilince serbest metin alanı açılır
- Başarılı kayıt sonrası tablo anlık güncellenir, modal kapanır

---

### KOM — IncomeExpenseTable
**Amaç:** Tüm gelir ve gider kayıtlarını filtrelenmiş şekilde listeler.

**Sütunlar**
| Sütun | Açıklama |
|-------|----------|
| Tarih | Kayıt tarihi |
| Tür | Gelir (yeşil) / Gider (kırmızı) |
| Kategori | Kategori adı |
| Tutar | USD/USDT |
| Açıklama | Opsiyonel not |
| — | Sil butonu |

**Props**
| Prop | Tür | Açıklama |
|------|-----|----------|
| `entries` | IncomeExpenseEntry[] | Gösterilecek kayıtlar |
| `onDelete` | (id) => void | Silme tetikleyicisi |

**Davranışlar**
- Varsayılan sıralama: en yeni kayıt üstte
- Tablo altında dönem toplamları (gelir / gider / net) gösterilir
- Boş listede "Henüz kayıt yok" mesajı
