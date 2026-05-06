# PRD — Crypto Dashboard

## 1. Özet

Crypto Dashboard; bireysel kripto para yatırımcısının tüm portföyünü, işlem geçmişini, vergi yükümlülüklerini, hedeflerini ve gelir-gider dengesini tek bir arayüzden takip etmesini sağlayan web tabanlı bir uygulamadır.

---

## 2. Hedef Kullanıcı

| Özellik | Açıklama |
|---|---|
| Kitle | Bireysel kripto yatırımcısı |
| Teknik seviye | Orta — borsa kullanıcısı, geliştirici değil |
| Kullanım sıklığı | Günlük, birden fazla kez |
| Öncelik | Hız, sadelik, doğruluk |

---

## 3. Hedefler ve Başarı Kriterleri

| Hedef | Başarı Kriteri |
|---|---|
| Anlık fiyat bilgisi sunmak | Fiyatlar en fazla 15 saniye geride kalmalı |
| İşlem takibini kolaylaştırmak | Yeni bir işlem 15 saniyeden kısa sürede kaydedilebilmeli |
| Hedef ilerlemesini görünür kılmak | Hedef tamamlanma yüzdesi her oturumda görünmeli |
| Finansal özeti netleştirmek | Günlük/aylık kâr-zarar tek bakışta anlaşılabilmeli |
| Vergi yükümlülüğünü hesaplamak | Yıllık vergi tahmini işlem geçmişinden otomatik üretilmeli |

---

## 4. Kapsam Dışı (v1)

- Otomatik alım-satım / bot desteği
- Çoklu kullanıcı / takım hesapları
- Mobil uygulama (ilerleyen sürümler için planlanmış)
- Investing.com ekonomik takvim entegrasyonu (ilerleyen sürümler için planlanmış)

---

## 5. Özellikler

### 5.1 Varlık Listesi (Watchlist)

**Amaç:** Kullanıcının takip ettiği coin ve hisselerin anlık fiyatlarını görmek.

**Gereksinimler:**

- Coin / hisse sembolü, anlık fiyat (USDT coinler için, USD hisseler için), 24 saatlik değişim (%) gösterilmeli
- Kullanıcı varlık ekleyebilmeli, düzenleyebilmeli ve silebilmeli
- Fiyat verisi Binance API (birincil) ve CoinGecko API (fallback) üzerinden çekilmeli
- Otomatik yenileme aralığı kullanıcı tarafından ayarlanabilmeli

**Kabul Kriterleri:**

- [ ] Sayfa açıldığında varlık listesi maksimum 5 saniyede yüklenir
- [ ] Varlık ekleme/silme işlemi sayfa yenilemeye gerek kalmadan çalışır
- [ ] Binance API erişilemez olduğunda CoinGecko'ya otomatik geçiş yapılır
- [ ] Fiyat verisi en fazla 15 saniyelik gecikmeyle güncellenir

---

### 5.2 Cüzdan Özeti

**Amaç:** Kullanıcının sahip olduğu tüm varlıkların anlık toplam değerini USD/USDT cinsinden görmek.

**Gereksinimler:**

- Her varlık için miktar (adet) girilebilmeli
- Toplam portföy değeri = Σ (miktar × anlık fiyat) olarak hesaplanmalı
- Varlık bazında dağılım pasta grafiği olarak gösterilmeli
- 24 saatlik portföy değeri değişimi (USD ve %) gösterilmeli

**Kabul Kriterleri:**

- [ ] Miktar güncellendikten sonra toplam değer anında yeniden hesaplanır
- [ ] Grafik, toplam portföyün en az %80'ini temsil eder

---

### 5.3 Alım-Satım Not Defteri

**Amaç:** Gerçekleşen alım-satım işlemlerini kaydetmek ve geçmişe dönük analiz yapmak.

**Gereksinimler:**

- Her işlem için şu alanlar girilmeli: coin, işlem tipi (alım/satım), tarih, adet, fiyat, borsa, not
- İşlemler listelenebilmeli, filtrelenebilmeli (coin, tarih aralığı, işlem tipi) ve silinebilmeli
- İşlem bazında gerçekleşen kâr/zarar gösterilmeli
- Binance API entegrasyonu opsiyonel; kullanıcı API anahtarı girerek işlemleri otomatik çekebilmeli

**Kabul Kriterleri:**

- [ ] Manuel işlem kaydı form validasyonu ile sorunsuz çalışır
- [ ] Filtreleme sonuçları 1 saniyeden kısa sürede güncellenir
- [ ] Binance API bağlantısı kesilse bile manuel kayıtlar etkilenmez

---

### 5.4 Takvim

**Amaç:** Alım-satım işlemlerini ve önemli olayları zaman ekseninde görselleştirmek.

**Gereksinimler:**

- Aylık ve haftalık takvim görünümü
- İşlemler takvim üzerinde tarihine göre işaretlenmeli
- Kullanıcı manuel etkinlik (haber, hatırlatıcı vb.) ekleyebilmeli
- Takvim öğesine tıklandığında detay görüntülenmeli
- Ekonomik takvim verisi (tr.investing.com) ilerleyen sürümde entegre edilecek

**Kabul Kriterleri:**

- [ ] Not defterinden kaydedilen işlemler otomatik olarak takvimde görünür
- [ ] Etkinlik ekleme/silme takvim sayfasından yapılabilir

---

### 5.5 Hedef Takibi

**Amaç:** Kâr hedefi belirlemek ve gerçek zamanlı ilerlemeyi takip etmek.

**Gereksinimler:**

- Kullanıcı hedef adı, hedef kâr miktarı (USD) ve bitiş tarihi girebilmeli
- Anlık ilerleme: (mevcut kâr / hedef kâr) × 100 olarak hesaplanmalı
- İstatistiksel projeksiyon: mevcut ilerleme hızına göre tahmini tamamlanma tarihi gösterilmeli
- Süre kısıtı içinde hedefe ulaşılamayacaksa uyarı gösterilmeli

**Kabul Kriterleri:**

- [ ] Birden fazla aktif hedef aynı anda tanımlanabilir
- [ ] İlerleme çubuğu her oturum açılışında güncel veriyle yüklenir
- [ ] Projeksiyon hesabı en az son 7 günlük veriyi baz alır

---

### 5.6 Gelir-Gider Tablosu

**Amaç:** Kripto yatırımlarına bağlı gelir ve giderleri manuel olarak takip etmek.

**Gereksinimler:**

- Her kayıt için: tür (gelir/gider), kategori, tutar (USD/USDT), tarih, açıklama alanları
- Aylık ve yıllık özet gösterimi
- Kategori bazlı filtreleme ve sıralama
- CSV dışa aktarma

**Kabul Kriterleri:**

- [ ] Yeni kayıt anında tabloya yansır
- [ ] CSV dışa aktarma tüm filtrelenmiş veriyi doğru biçimde aktarır

---

### 5.7 Vergi Hesaplama

**Amaç:** Gerçekleşen alım-satım işlemlerinden doğan vergi yükümlülüğünü otomatik hesaplamak.

**Gereksinimler:**

- Alım-satım not defterindeki işlemler baz alınarak kâr/zarar hesabı yapılmalı
- FIFO (ilk giren ilk çıkar) yöntemi varsayılan hesaplama yöntemi olarak kullanılmalı
- Yıllık bazda toplam vergilendirilebilir kâr gösterilmeli
- Vergi oranı kullanıcı tarafından elle girilebilmeli (ülkeye göre farklılık gösterebilir)
- Hesaplama özeti CSV olarak dışa aktarılabilmeli

**Kabul Kriterleri:**

- [ ] Vergi hesabı, not defterine yeni işlem eklendiğinde otomatik güncellenir
- [ ] FIFO hesabı, aynı coinin birden fazla alım kaydı olduğunda doğru çalışır
- [ ] Kullanıcı vergi oranını değiştirdiğinde sonuç anında yeniden hesaplanır
- [ ] CSV çıktısı: tarih, coin, alış fiyatı, satış fiyatı, adet, kâr/zarar, vergi tutarı sütunlarını içerir

---

## 6. Teknik Gereksinimler

| Konu | Karar |
|---|---|
| Platform | Web (tarayıcı tabanlı) |
| Fiyat API'ı (birincil) | Binance API |
| Fiyat API'ı (fallback) | CoinGecko Public API |
| Para birimi | USDT (coinler), USD (hisseler) |
| Veri depolama | SQLite (geliştirme) veya PostgreSQL (üretim), v1'den itibaren |
| Kimlik doğrulama | Temel seviye (kullanıcı adı + parola), v1'den itibaren |
| Mobil destek | Responsive tasarım (v1), native app (ilerleyen sürümler) |
| Ekonomik takvim | tr.investing.com (ilerleyen sürümler) |

---

## 7. Önceliklendirme (MoSCoW)

| Öncelik | Özellik |
|---|---|
| Must Have | Kimlik doğrulama, Varlık listesi, Cüzdan özeti, Alım-satım not defteri, Vergi hesaplama |
| Should Have | Hedef takibi, Gelir-gider tablosu |
| Could Have | Takvim, Binance API otomatik işlem çekme, CSV dışa aktarma |
| Won't Have (v1) | Mobil uygulama, çoklu kullanıcı, otomatik işlem, Investing.com entegrasyonu |

---

## 8. Kararlar

| # | Konu | Karar |
|---|---|---|
| 1 | Fiyat API'ı | Binance birincil, CoinGecko fallback |
| 2 | Kimlik doğrulama | Temel seviye (v1'den itibaren zorunlu) |
| 3 | Veri depolama | SQLite veya PostgreSQL, v1'den itibaren |
| 4 | Para birimi | USDT (coinler), USD (hisseler) |
