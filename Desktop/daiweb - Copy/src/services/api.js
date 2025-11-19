// API Base URL - Production'da Railway backend URL'i, development'ta localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Login
export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    })
    return await response.json()
  } catch (error) {
    console.error('API hatası:', error)
    return null
  }
}

// Logout
export const logout = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      credentials: 'include'
    })
    return await response.json()
  } catch (error) {
    console.error('API hatası:', error)
    return null
  }
}

// Check auth
export const checkAuth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/check`, {
      credentials: 'include'
    })
    return await response.json()
  } catch (error) {
    console.error('API hatası:', error)
    return null
  }
}

// Tüm içeriği getir
export const getContent = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/content`)
    if (!response.ok) throw new Error('İçerik yüklenemedi')
    return await response.json()
  } catch (error) {
    console.error('API hatası:', error)
    return null
  }
}

// Section getir
export const getSection = async (sectionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sections/${sectionId}`)
    if (!response.ok) throw new Error('Section yüklenemedi')
    return await response.json()
  } catch (error) {
    console.error('API hatası:', error)
    return null
  }
}

// Section başlığını güncelle
export const updateSectionTitle = async (sectionId, title) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sections/${sectionId}/title`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ title })
    })
    if (!response.ok) throw new Error('Başlık güncellenemedi')
    return await response.json()
  } catch (error) {
    console.error('API hatası:', error)
    return null
  }
}

// Section güncelle
export const updateSection = async (sectionId, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sections/${sectionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Section güncellenemedi')
    return await response.json()
  } catch (error) {
    console.error('API hatası:', error)
    return null
  }
}

// Section item güncelle
export const updateSectionItem = async (sectionId, itemId, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sections/${sectionId}/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Item güncellenemedi')
    return await response.json()
  } catch (error) {
    console.error('API hatası:', error)
    return null
  }
}

// Navbar güncelle
export const updateNavbar = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/navbar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Navbar güncellenemedi')
    return await response.json()
  } catch (error) {
    console.error('API hatası:', error)
    return null
  }
}

// İletişim bilgilerini güncelle
export const updateContact = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('İletişim bilgileri güncellenemedi')
    return await response.json()
  } catch (error) {
    console.error('API hatası:', error)
    return null
  }
}

// Logo güncelle
export const updateLogo = async (logoPath) => {
  try {
    const response = await fetch(`${API_BASE_URL}/settings/logo`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ logo: logoPath })
    })
    if (!response.ok) throw new Error('Logo güncellenemedi')
    return await response.json()
  } catch (error) {
    console.error('API hatası:', error)
    return null
  }
}

// Video güncelle
export const updateVideo = async (videoPath) => {
  try {
    const response = await fetch(`${API_BASE_URL}/settings/video`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ video: videoPath })
    })
    if (!response.ok) throw new Error('Video güncellenemedi')
    return await response.json()
  } catch (error) {
    console.error('API hatası:', error)
    return null
  }
}

// İngilizce çeviri güncelle (item)
export const updateTranslation = async (itemId, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/translations/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Çeviri güncellenemedi')
    return await response.json()
  } catch (error) {
    console.error('API hatası:', error)
    return null
  }
}

// Section çevirisi güncelle
export const updateSectionTranslation = async (sectionId, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/translations/sections/${sectionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Section çevirisi güncellenemedi')
    return await response.json()
  } catch (error) {
    console.error('API hatası:', error)
    return null
  }
}

