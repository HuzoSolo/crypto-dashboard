# MOD — Shared (Paylaşılan Layout ve Dashboard)

## Amaç
Tüm korumalı sayfalarda ortak kullanılan layout bileşenlerini ve farklı modüllerin özetlerini bir araya getiren dashboard ekranını barındırır.

---

## SAY — Dashboard (Ana Ekran)
**Rota:** `/dashboard` — varsayılan giriş ekranı, korumalı

### Amaç
Giriş yapıldıktan sonra tüm modüllerin özetini tek ekranda sunar.

### Bölümler
| Bölüm | Kaynak Modül | Açıklama |
|-------|-------------|----------|
| Portföy özet kartı | MOD-portfolio | Toplam değer + 24s değişim |
| Varlık dağılım grafiği | MOD-portfolio | Pasta grafik (mini) |
| Aktif hedefler | MOD-goal | Her hedef için mini ilerleme çubuğu |
| Son 5 işlem | MOD-trade | Kısa işlem listesi |
| Aylık gelir-gider özeti | MOD-income-expense | Net bakiye |
| Hızlı navigasyon | — | Tüm sayfalara kısayol kartları |

---

### KOM — Header
**Amaç:** Tüm korumalı sayfalarda gösterilen üst navigasyon çubuğu.

**Görünüm:** `[ Logo ]  ————————————————  [ Kullanıcı Adı ▾ ]  [ Çıkış ]`

**Props**
| Prop | Tür | Açıklama |
|------|-----|----------|
| `username` | string | Giriş yapmış kullanıcı adı |

**Etkileşimler**
| Eylem | Sonuç |
|-------|-------|
| Logo / isme tıkla | `/dashboard`'a yönlendir |
| Çıkış butonuna tıkla | Auth logout → `/login`'e yönlendir |

**Kullanıldığı sayfalar:** Tüm korumalı sayfalar

---

### KOM — Sidebar
**Amaç:** Tüm korumalı sayfalarda sabit duran sol kenar menüsü.

**Navigasyon Öğeleri**
| Etiket | Rota |
|--------|------|
| Ana Sayfa | `/dashboard` |
| Varlık Listesi | `/watchlist` |
| Cüzdan | `/portfolio` |
| İşlemler | `/trades` |
| Takvim | `/calendar` |
| Hedefler | `/goals` |
| Gelir-Gider | `/income-expense` |
| Vergi | `/tax` |

**Props**
| Prop | Tür | Açıklama |
|------|-----|----------|
| `activePath` | string | Mevcut rota; aktif öğeyi vurgular |

**Davranışlar**
- Aktif rota ilgili menü öğesini vurgular
- Dar ekranda yalnızca ikonlar gösterilir (v2)

**Kullanıldığı sayfalar:** Tüm korumalı sayfalar
