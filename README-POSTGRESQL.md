# Railway PostgreSQL Kurulum Rehberi

Bu rehber, Railway'de PostgreSQL veritabanı kurulumu ve backend entegrasyonu için adımları içerir.

## Railway'de PostgreSQL Kurulumu

### 1. Railway Hesabı Oluşturma
- [Railway.app](https://railway.app) adresine gidin
- GitHub hesabınızla giriş yapın

### 2. Yeni Proje Oluşturma
- Dashboard'da "New Project" butonuna tıklayın
- "Empty Project" seçeneğini seçin

### 3. PostgreSQL Servisi Ekleme
- Proje sayfasında "New" butonuna tıklayın
- "Database" → "Add PostgreSQL" seçeneğini seçin
- Railway otomatik olarak PostgreSQL servisi oluşturur

### 4. Backend Servisi Ekleme
- Yine "New" butonuna tıklayın
- "GitHub Repo" seçeneğini seçin
- Repository'nizi seçin
- Root Directory: `backend` olarak ayarlayın

### 5. Environment Variables Ayarlama
Backend servisinde şu environment variable'ları ekleyin:

- `DATABASE_URL`: PostgreSQL servisinden otomatik olarak sağlanır (Variables sekmesinden kopyalayın)
- `CORS_ORIGIN`: Frontend URL'iniz (örn: `https://yourdomain.com,http://localhost:5173`)
- `PORT`: Railway otomatik ayarlar (genellikle ayarlamaya gerek yok)
- `SESSION_SECRET`: Güvenli bir secret key (rastgele string)

### 6. Migration Çalıştırma
Backend servisi deploy edildiğinde otomatik olarak migration çalışır (`npm run migrate`).

Manuel olarak çalıştırmak için:
```bash
railway run npm run migrate
```

## Local Development

### PostgreSQL Kurulumu (Local)
```bash
# PostgreSQL kurulumu (macOS)
brew install postgresql
brew services start postgresql

# PostgreSQL kurulumu (Ubuntu/Debian)
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Veritabanı oluştur
createdb daiweb
```

### Environment Variables (Local)
`.env` dosyası oluşturun:
```env
DATABASE_URL=postgresql://localhost:5432/daiweb
CORS_ORIGIN=http://localhost:5173
PORT=3001
SESSION_SECRET=your-local-secret-key
```

### Migration Çalıştırma (Local)
```bash
cd backend
npm install
npm run migrate
```

### Mevcut JSON Verilerini PostgreSQL'e Aktarma
Eğer `content.json` dosyanız varsa, server ilk başlatıldığında otomatik olarak PostgreSQL'e aktarılır.

## Veritabanı Yapısı

- `sections`: Section bilgileri
- `items`: Item bilgileri (section'a bağlı)
- `contact`: İletişim bilgileri
- `navbar`: Navbar ayarları
- `navbar_links`: Navbar linkleri
- `settings`: Genel ayarlar
- `translations`: Çeviriler

## API Endpoints

Tüm API endpoint'leri aynı şekilde çalışır. Backend otomatik olarak PostgreSQL kullanır (eğer `DATABASE_URL` ayarlanmışsa), aksi halde JSON dosyasına fallback yapar.

## Troubleshooting

### Bağlantı Hatası
- `DATABASE_URL` environment variable'ının doğru ayarlandığından emin olun
- Railway PostgreSQL servisinin çalıştığından emin olun

### Migration Hatası
- Veritabanı bağlantısını kontrol edin
- Migration script'ini manuel çalıştırın: `npm run migrate`

### Veri Aktarımı
- Eğer JSON'dan PostgreSQL'e veri aktarımı yapılamazsa, server loglarını kontrol edin
- Migration script'i tekrar çalıştırın

