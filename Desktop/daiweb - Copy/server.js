import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Static dosyaları serve et
app.use(express.static(join(__dirname, 'dist')))

// SPA için tüm route'ları index.html'e yönlendir
app.get('*', (req, res) => {
  try {
    const html = readFileSync(join(__dirname, 'dist', 'index.html'), 'utf8')
    res.send(html)
  } catch (error) {
    res.status(500).send('Build dosyaları bulunamadı. Lütfen önce "npm run build" çalıştırın.')
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Frontend server çalışıyor: http://localhost:${PORT}`)
})

