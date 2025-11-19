# 🚀 Netlify Hızlı Kurulum (1 Saat İçin)

## ✅ HAZIRLIK TAMAM!

**Oluşturulan dosyalar:**
- ✅ `netlify.toml` - Netlify yapılandırması
- ✅ `public/_redirects` - SPA routing için

---

## 🎯 ADIM 1: Netlify'da Site Oluştur (5 dk)

1. **Netlify Dashboard:** https://app.netlify.com
2. **Add new site** → **Import an existing project**
3. **GitHub** → `daiteknoloji/daiweb` seç
4. **Build settings:**
   - **Base directory:** (boş bırak)
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `dist`

---

## 🔐 ADIM 2: Environment Variables (2 dk)

**Site settings** → **Environment variables** → **Add variable:**

```
VITE_API_URL = https://backend-xxxxx.up.railway.app/api
```

⚠️ **ÖNEMLİ:** Backend domain'ini Railway'den alıp buraya yazın!

---

## 🌐 ADIM 3: Domain Ayarları (10 dk)

### Netlify'da:
1. **Site settings** → **Domain management**
2. **Add custom domain** → GoDaddy domain'inizi yazın
3. Netlify size DNS kayıtlarını verecek

### GoDaddy'de:
1. DNS Management'e git
2. Şu kayıtları ekle:

**Frontend için (Netlify):**
```
Type: CNAME
Name: www (veya @)
Value: your-site.netlify.app
TTL: 600
```

**Backend için (Railway):**
```
Type: CNAME  
Name: api (veya backend)
Value: backend-xxxxx.up.railway.app
TTL: 600
```

---

## ⚡ ADIM 4: Deploy! (Otomatik)

1. Netlify otomatik deploy edecek
2. İlk deploy 2-3 dakika sürer
3. Sonraki deploy'lar çok hızlı (30 saniye)

---

## 📋 KONTROL LİSTESİ

- [ ] Netlify'da site oluşturuldu
- [ ] GitHub repo bağlandı
- [ ] Build settings doğru
- [ ] `VITE_API_URL` environment variable eklendi
- [ ] Domain bağlandı
- [ ] DNS kayıtları yapıldı
- [ ] İlk deploy başarılı

---

## 🎉 TAMAMLANDI!

**Frontend:** `https://yourdomain.com` (Netlify)
**Backend API:** `https://api.yourdomain.com` (Railway)
**Admin Panel:** `https://yourdomain.com/admin`

---

## ⚠️ ÖNEMLİ NOTLAR

1. **CORS:** Railway backend'de `CORS_ORIGIN` environment variable'ına Netlify domain'inizi ekleyin:
   ```
   https://yourdomain.com,https://www.yourdomain.com
   ```

2. **Session Cookies:** Netlify ve Railway farklı domain'lerde olduğu için session cookies çalışmayabilir. Bu durumda backend'de CORS credentials ayarlarını kontrol edin.

3. **API URL:** Production'da `VITE_API_URL` mutlaka set edilmeli!

