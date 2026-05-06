# MOD — Auth (Kimlik Doğrulama)

## Amaç
Kullanıcı oturum yönetimini sağlar: kayıt, giriş, token yönetimi ve korumalı rotalara erişim kontrolü.

## Sorumluluklar
- Kullanıcı adı + parola ile kayıt ve giriş
- JWT token üretimi, doğrulaması ve yenilenmesi
- Oturum süresi dolduğunda otomatik `/login` yönlendirmesi
- Tüm korumalı route'lar için auth guard

## API Endpoint'leri
| Yöntem | Yol | Açıklama |
|--------|-----|----------|
| POST | `/api/auth/register` | Yeni kullanıcı kaydı |
| POST | `/api/auth/login` | Giriş; token döner |
| POST | `/api/auth/logout` | Oturumu sonlandırır |
| GET | `/api/auth/me` | Mevcut kullanıcı bilgisi |

## Veri Modeli
```
User {
  id        : UUID
  username  : string (unique)
  password  : string (bcrypt hash)
  createdAt : datetime
}
```

## İş Kuralları
- Parola min. 8 karakter
- 5 başarısız girişten sonra 15 dk bekleme
- Token süresi: 24 saat

---

## SAY — Login (Giriş Ekranı)
**Rota:** `/login` — oturum açıksa `/dashboard`'a yönlendirir

### Bölümler
| Bölüm | Açıklama |
|-------|----------|
| Logo / uygulama adı | Sayfanın üstünde ortalanmış |
| Giriş formu | Kullanıcı adı + parola |
| Kayıt linki | "Hesabın yok mu? Kayıt ol" yönlendirmesi |
| Hata mesajı | Hatalı girişte satır içi gösterim |

### Akış
1. Kullanıcı bilgileri girer → "Giriş Yap"a tıklar
2. Auth modülü doğrular; başarılıysa token kaydedilir
3. `/dashboard`'a yönlendirilir; hatalıysa form altında uyarı gösterilir

### KOM — LoginForm
**Amaç:** Kullanıcı adı ve parola alanlarını barındıran form bileşeni.

**Alanlar**
| Alan | Tür | Zorunlu | Validasyon |
|------|-----|---------|------------|
| Kullanıcı adı | text | evet | min 3 karakter |
| Parola | password | evet | min 8 karakter |

**Props**
| Prop | Tür | Açıklama |
|------|-----|----------|
| `onSubmit` | (credentials) => void | Giriş isteği tetikler |
| `error` | string? | Sunucudan gelen hata mesajı |
| `loading` | boolean | Buton yükleniyor durumu |

**Davranışlar**
- Zorunlu alan boşsa gönder butonu devre dışı kalır
- `loading = true` iken buton spinner gösterir
- `error` varsa form altında kırmızı banner görünür
