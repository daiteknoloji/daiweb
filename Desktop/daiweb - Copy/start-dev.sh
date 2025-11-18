#!/bin/bash

# DAI Teknoloji - Development Server Startup Script
# Bu script frontend ve backend'i ayrı terminal pencerelerinde başlatır

echo "🚀 DAI Teknoloji Development Servers Starting..."
echo ""

# Backend'i yeni terminal penceresinde başlat
echo "📦 Starting Backend Server (port 3001)..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows (Git Bash)
    start bash -c "cd backend && npm start"
else
    # Linux/Mac
    gnome-terminal -- bash -c "cd backend && npm start; exec bash" 2>/dev/null || \
    xterm -e "cd backend && npm start" 2>/dev/null || \
    osascript -e 'tell app "Terminal" to do script "cd backend && npm start"' 2>/dev/null || \
    (cd backend && npm start &)
fi

# Kısa bir bekleme
sleep 2

# Frontend'i mevcut terminalde başlat
echo "⚛️  Starting Frontend Server (port 5173)..."
npm run dev

