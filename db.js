import pkg from 'pg'
const { Pool } = pkg

// Railway PostgreSQL bağlantısı için DATABASE_URL environment variable'ını kullan
// Local development için fallback
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || 'postgresql://localhost:5432/daiweb'

const pool = new Pool({
  connectionString,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
})

// Bağlantı testi
pool.on('connect', () => {
  console.log('✅ PostgreSQL veritabanına bağlandı')
})

pool.on('error', (err) => {
  console.error('❌ PostgreSQL bağlantı hatası:', err)
  process.exit(-1)
})

export default pool

