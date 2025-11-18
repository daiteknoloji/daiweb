@echo off
REM DAI Teknoloji - Development Server Startup Script (Windows)
REM Bu script frontend ve backend'i ayrı PowerShell pencerelerinde başlatır

echo 🚀 DAI Teknoloji Development Servers Starting...
echo.

REM Backend'i yeni PowerShell penceresinde başlat
echo 📦 Starting Backend Server (port 3001)...
start powershell -NoExit -Command "cd backend; npm start"

REM Kısa bir bekleme
timeout /t 2 /nobreak >nul

REM Frontend'i mevcut pencerede başlat
echo ⚛️  Starting Frontend Server (port 5173)...
npm run dev

