-- Sections tablosu
CREATE TABLE IF NOT EXISTS sections (
  id VARCHAR(255) PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items tablosu
CREATE TABLE IF NOT EXISTS items (
  id VARCHAR(255) PRIMARY KEY,
  section_id VARCHAR(255) NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  short_text TEXT,
  expanded_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact tablosu
CREATE TABLE IF NOT EXISTS contact (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  phone VARCHAR(255),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Navbar tablosu
CREATE TABLE IF NOT EXISTS navbar (
  id SERIAL PRIMARY KEY,
  logo VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Navbar links tablosu
CREATE TABLE IF NOT EXISTS navbar_links (
  id SERIAL PRIMARY KEY,
  navbar_id INTEGER REFERENCES navbar(id) ON DELETE CASCADE,
  path VARCHAR(255),
  label TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings tablosu
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Translations tablosu
CREATE TABLE IF NOT EXISTS translations (
  id SERIAL PRIMARY KEY,
  item_id VARCHAR(255),
  language VARCHAR(10) NOT NULL,
  field VARCHAR(50) NOT NULL,
  value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(item_id, language, field)
);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_items_section_id ON items(section_id);
CREATE INDEX IF NOT EXISTS idx_translations_item_id ON translations(item_id);
CREATE INDEX IF NOT EXISTS idx_translations_language ON translations(language);

