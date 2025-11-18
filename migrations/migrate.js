import pool from '../db.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function migrate() {
  try {
    console.log('🔄 Migration başlatılıyor...')
    
    // SQL dosyasını oku
    const sqlFile = path.join(__dirname, '001_create_tables.sql')
    const sql = fs.readFileSync(sqlFile, 'utf8')
    
    // SQL'i çalıştır
    await pool.query(sql)
    
    console.log('✅ Migration tamamlandı!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration hatası:', error)
    process.exit(1)
  }
}

migrate()

