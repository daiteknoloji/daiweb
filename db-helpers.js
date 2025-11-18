import pool from './db.js'

// Sections
export async function getAllSections() {
  const result = await pool.query(`
    SELECT s.*, 
           COALESCE(
             json_agg(
               json_build_object(
                 'id', i.id,
                 'title', i.title,
                 'shortText', i.short_text,
                 'expandedText', i.expanded_text
               )
             ) FILTER (WHERE i.id IS NOT NULL),
             '[]'
           ) as items
    FROM sections s
    LEFT JOIN items i ON s.id = i.section_id
    GROUP BY s.id
    ORDER BY s.id
  `)
  return result.rows.map(row => ({
    id: row.id,
    title: row.title,
    description: row.description,
    items: row.items
  }))
}

export async function getSectionById(id) {
  const sectionResult = await pool.query('SELECT * FROM sections WHERE id = $1', [id])
  if (sectionResult.rows.length === 0) return null
  
  const section = sectionResult.rows[0]
  const itemsResult = await pool.query('SELECT * FROM items WHERE section_id = $1', [id])
  
  return {
    id: section.id,
    title: section.title,
    description: section.description,
    items: itemsResult.rows.map(item => ({
      id: item.id,
      title: item.title,
      shortText: item.short_text,
      expandedText: item.expanded_text
    }))
  }
}

export async function updateSection(id, data) {
  await pool.query(
    'UPDATE sections SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
    [data.title, data.description, id]
  )
  return getSectionById(id)
}

export async function updateSectionTitle(id, title) {
  await pool.query(
    'UPDATE sections SET title = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
    [title, id]
  )
  return getSectionById(id)
}

export async function updateItem(sectionId, itemId, data) {
  await pool.query(
    `UPDATE items 
     SET title = $1, short_text = $2, expanded_text = $3, updated_at = CURRENT_TIMESTAMP 
     WHERE id = $4 AND section_id = $5`,
    [data.title, data.shortText, data.expandedText, itemId, sectionId]
  )
  
  const result = await pool.query('SELECT * FROM items WHERE id = $1', [itemId])
  if (result.rows.length === 0) return null
  
  const item = result.rows[0]
  return {
    id: item.id,
    title: item.title,
    shortText: item.short_text,
    expandedText: item.expanded_text
  }
}

// Contact
export async function getContact() {
  const result = await pool.query('SELECT * FROM contact ORDER BY id DESC LIMIT 1')
  if (result.rows.length === 0) {
    // Varsayılan değerleri ekle
    await pool.query(
      'INSERT INTO contact (email, phone, address) VALUES ($1, $2, $3)',
      ['info@daiteknoloji.com', '+90 (532) 735 89 35', 'İstanbul, Türkiye']
    )
    const newResult = await pool.query('SELECT * FROM contact ORDER BY id DESC LIMIT 1')
    return newResult.rows[0]
  }
  return result.rows[0]
}

export async function updateContact(data) {
  const existing = await pool.query('SELECT * FROM contact ORDER BY id DESC LIMIT 1')
  if (existing.rows.length === 0) {
    await pool.query(
      'INSERT INTO contact (email, phone, address) VALUES ($1, $2, $3)',
      [data.email, data.phone, data.address]
    )
  } else {
    await pool.query(
      'UPDATE contact SET email = $1, phone = $2, address = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4',
      [data.email, data.phone, data.address, existing.rows[0].id]
    )
  }
  return getContact()
}

// Navbar
export async function getNavbar() {
  const navbarResult = await pool.query('SELECT * FROM navbar ORDER BY id DESC LIMIT 1')
  let navbar
  
  if (navbarResult.rows.length === 0) {
    const insertResult = await pool.query(
      'INSERT INTO navbar (logo) VALUES ($1) RETURNING *',
      ['/svglogo.png']
    )
    navbar = insertResult.rows[0]
  } else {
    navbar = navbarResult.rows[0]
  }
  
  const linksResult = await pool.query(
    'SELECT * FROM navbar_links WHERE navbar_id = $1 ORDER BY id',
    [navbar.id]
  )
  
  return {
    logo: navbar.logo,
    links: linksResult.rows.map(link => ({
      path: link.path,
      label: link.label
    }))
  }
}

export async function updateNavbar(data) {
  const navbarResult = await pool.query('SELECT * FROM navbar ORDER BY id DESC LIMIT 1')
  let navbar
  
  if (navbarResult.rows.length === 0) {
    const insertResult = await pool.query(
      'INSERT INTO navbar (logo) VALUES ($1) RETURNING *',
      [data.logo || '/svglogo.png']
    )
    navbar = insertResult.rows[0]
  } else {
    await pool.query(
      'UPDATE navbar SET logo = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [data.logo || navbarResult.rows[0].logo, navbarResult.rows[0].id]
    )
    navbar = navbarResult.rows[0]
  }
  
  // Links'i güncelle
  if (data.links) {
    await pool.query('DELETE FROM navbar_links WHERE navbar_id = $1', [navbar.id])
    for (const link of data.links) {
      await pool.query(
        'INSERT INTO navbar_links (navbar_id, path, label) VALUES ($1, $2, $3)',
        [navbar.id, link.path, link.label]
      )
    }
  }
  
  return getNavbar()
}

// Settings
export async function getSetting(key) {
  const result = await pool.query('SELECT value FROM settings WHERE key = $1', [key])
  return result.rows.length > 0 ? result.rows[0].value : null
}

export async function setSetting(key, value) {
  await pool.query(
    `INSERT INTO settings (key, value) VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP`,
    [key, value]
  )
  return getSetting(key)
}

// Translations
export async function getTranslation(itemId, language, field) {
  const result = await pool.query(
    'SELECT value FROM translations WHERE item_id = $1 AND language = $2 AND field = $3',
    [itemId, language, field]
  )
  return result.rows.length > 0 ? result.rows[0].value : null
}

export async function setTranslation(itemId, language, field, value) {
  await pool.query(
    `INSERT INTO translations (item_id, language, field, value) VALUES ($1, $2, $3, $4)
     ON CONFLICT (item_id, language, field) DO UPDATE SET value = $4, updated_at = CURRENT_TIMESTAMP`,
    [itemId, language, field, value]
  )
  return getTranslation(itemId, language, field)
}

// Tüm içeriği getir (JSON formatında)
export async function getAllContent() {
  const sections = await getAllSections()
  const contact = await getContact()
  const navbar = await getNavbar()
  const heroVideo = await getSetting('heroVideo') || '/anavideo.mp4'
  const logo = await getSetting('logo') || '/svglogo.png'
  
  // Translations
  const translationsResult = await pool.query('SELECT * FROM translations WHERE language = $1', ['en'])
  const translations = { en: { items: {}, sections: {} } }
  
  for (const trans of translationsResult.rows) {
    if (!translations.en.items[trans.item_id]) {
      translations.en.items[trans.item_id] = {}
    }
    translations.en.items[trans.item_id][trans.field] = trans.value
  }
  
  return {
    sections,
    contact: {
      email: contact.email,
      phone: contact.phone,
      address: contact.address
    },
    navbar,
    settings: {
      heroVideo,
      logo
    },
    translations
  }
}

// JSON'dan PostgreSQL'e veri aktarımı (migration için)
export async function importFromJSON(jsonData) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    
    // Sections ve items'ı temizle
    await client.query('DELETE FROM items')
    await client.query('DELETE FROM sections')
    
    // Sections ekle
    for (const section of jsonData.sections || []) {
      await client.query(
        'INSERT INTO sections (id, title, description) VALUES ($1, $2, $3)',
        [section.id, section.title, section.description]
      )
      
      // Items ekle
      for (const item of section.items || []) {
        await client.query(
          'INSERT INTO items (id, section_id, title, short_text, expanded_text) VALUES ($1, $2, $3, $4, $5)',
          [item.id, section.id, item.title, item.shortText, item.expandedText]
        )
      }
    }
    
    // Contact
    if (jsonData.contact) {
      await client.query('DELETE FROM contact')
      await client.query(
        'INSERT INTO contact (email, phone, address) VALUES ($1, $2, $3)',
        [jsonData.contact.email, jsonData.contact.phone, jsonData.contact.address]
      )
    }
    
    // Navbar
    if (jsonData.navbar) {
      await client.query('DELETE FROM navbar_links')
      await client.query('DELETE FROM navbar')
      const navbarResult = await client.query(
        'INSERT INTO navbar (logo) VALUES ($1) RETURNING *',
        [jsonData.navbar.logo || '/svglogo.png']
      )
      
      for (const link of jsonData.navbar.links || []) {
        await client.query(
          'INSERT INTO navbar_links (navbar_id, path, label) VALUES ($1, $2, $3)',
          [navbarResult.rows[0].id, link.path, link.label]
        )
      }
    }
    
    // Settings
    if (jsonData.settings) {
      if (jsonData.settings.heroVideo) {
        await setSetting('heroVideo', jsonData.settings.heroVideo)
      }
      if (jsonData.settings.logo) {
        await setSetting('logo', jsonData.settings.logo)
      }
    }
    
    await client.query('COMMIT')
    console.log('✅ JSON verileri PostgreSQL\'e aktarıldı')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

