# 🚀 Development Server Başlatma

## Windows için (PowerShell)

### Yöntem 1: Batch Script (Önerilen)
```bash
.\start-dev.bat
```

### Yöntem 2: Manuel Komutlar

**Terminal 1 - Backend:**
```powershell
cd backend
npm start
```

**Terminal 2 - Frontend:**
```powershell
npm run dev
```

## Linux/Mac için (Bash)

### Yöntem 1: Bash Script
```bash
chmod +x start-dev.sh
./start-dev.sh
```

### Yöntem 2: Manuel Komutlar

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Port Bilgileri

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Admin Panel**: http://localhost:5173/admin

## Login Bilgileri

- **Username**: admin
- **Password**: admin123

## Notlar

- Backend ve Frontend ayrı terminal pencerelerinde çalışmalıdır
- Backend önce başlatılmalıdır (frontend backend'e bağlanır)
- Backend port 3001'de çalışır
- Frontend port 5173'te çalışır (Vite default port)

