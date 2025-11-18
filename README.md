# DAI Teknoloji Backend API

Bu backend, website içeriklerini dinamik olarak yönetmek için kullanılır.

## Kurulum

```bash
cd backend
npm install
npm start
```

## API Endpoints

### Tüm İçeriği Getir
```
GET /api/content
```

### Section Getir
```
GET /api/sections/:id
```

### Section Başlığını Güncelle
```
PUT /api/sections/:id/title
Body: { "title": "Yeni Başlık" }
```

### Section Güncelle
```
PUT /api/sections/:id
Body: { "title": "...", "description": "..." }
```

### Section Item Güncelle
```
PUT /api/sections/:sectionId/items/:itemId
Body: { "title": "...", "shortText": "...", "expandedText": "..." }
```

### Navbar Güncelle
```
PUT /api/navbar
Body: { "logo": "...", "links": [...] }
```

### İletişim Bilgilerini Güncelle
```
PUT /api/contact
Body: { "email": "...", "phone": "...", "address": "..." }
```

## Örnek Kullanım

### Ana başlığı değiştir:
```bash
curl -X PUT http://localhost:3001/api/sections/otomasyon/title \
  -H "Content-Type: application/json" \
  -d '{"title": "Yeni Otomasyon Başlığı"}'
```

### Section açıklamasını değiştir:
```bash
curl -X PUT http://localhost:3001/api/sections/otomasyon \
  -H "Content-Type: application/json" \
  -d '{"description": "Yeni açıklama metni"}'
```

## İçerik Dosyası

İçerikler `backend/content.json` dosyasında saklanır. Bu dosya otomatik olarak oluşturulur.


