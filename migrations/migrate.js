import pool from '../db.js'
import * as dbHelpers from '../db-helpers.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function loadContentFromJSON() {
  try {
    const contentFilePath = path.join(__dirname, '..', 'content.json')
    if (fs.existsSync(contentFilePath)) {
      const data = fs.readFileSync(contentFilePath, 'utf8')
      return JSON.parse(data)
    } else {
      console.log('⚠️  content.json bulunamadı, varsayılan içerik kullanılıyor')
      return null
    }
  } catch (error) {
    console.error('❌ JSON yüklenirken hata:', error)
    return null
  }
}

async function migrate() {
  try {
    console.log('🔄 Migration başlatılıyor...')
    
    // SQL dosyasını oku
    const sqlFile = path.join(__dirname, '001_create_tables.sql')
    const sql = fs.readFileSync(sqlFile, 'utf8')
    
    // SQL'i çalıştır
    await pool.query(sql)
    console.log('✅ Tablolar oluşturuldu!')
    
    // JSON'dan veri aktar
    console.log('🔄 JSON verileri aktarılıyor...')
    const jsonData = loadContentFromJSON()
    
    if (jsonData) {
      await dbHelpers.importFromJSON(jsonData)
      console.log('✅ Veriler PostgreSQL\'e aktarıldı!')
    } else {
      console.log('⚠️  JSON verisi bulunamadı, sadece tablolar oluşturuldu')
    }
    
    console.log('✅ Migration tamamlandı!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration hatası:', error)
    process.exit(1)
  }
}

migrate()



