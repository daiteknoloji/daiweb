import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getContent, updateSectionTitle, updateSection, updateSectionItem, updateNavbar, updateContact, updateLogo, updateVideo, updateTranslation, updateSectionTranslation } from '../services/api'

// API Base URL - Production'da Railway backend URL'i, development'ta localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  
  const [content, setContent] = useState(null)
  const [activeTab, setActiveTab] = useState('sections') // sections, settings, translations
  const [activeSection, setActiveSection] = useState(null)
  const [activeItem, setActiveItem] = useState(null)
  const [activeTranslationItem, setActiveTranslationItem] = useState(null)
  const [activeTranslationSection, setActiveTranslationSection] = useState(null)
  const [saving, setSaving] = useState(false)
  
  // Settings
  const [logoPath, setLogoPath] = useState('')
  const [videoPath, setVideoPath] = useState('')
  
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadContent()
    }
  }, [isAuthenticated])

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/check`, {
        credentials: 'include'
      })
      const data = await response.json()
      setIsAuthenticated(data.authenticated)
      if (data.authenticated) {
        setUsername(data.username)
      }
    } catch (error) {
      console.error('Auth check error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setIsAuthenticated(true)
        setUsername(username)
        setPassword('')
      } else {
        setLoginError(data.message || 'Giriş başarısız')
      }
    } catch (error) {
      setLoginError('Bağlantı hatası')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
      })
      setIsAuthenticated(false)
      setUsername('')
      setContent(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const loadContent = async () => {
    try {
      const data = await getContent()
      setContent(data)
      if (data.settings) {
        setLogoPath(data.settings.logo || '/svglogo.png')
        setVideoPath(data.settings.heroVideo || '/anavideo.mp4')
      }
    } catch (error) {
      console.error('Content load error:', error)
    }
  }

  const handleSaveSectionTitle = async (sectionId, title) => {
    setSaving(true)
    try {
      const response = await fetch(`${API_BASE_URL}/sections/${sectionId}/title`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ title })
      })
      
      if (response.ok) {
        await loadContent()
        setActiveSection(null)
        alert('Başlık güncellendi!')
      }
    } catch (error) {
      alert('Güncelleme hatası: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSection = async (sectionId, data) => {
    setSaving(true)
    try {
      await updateSection(sectionId, data)
      await loadContent()
      setActiveSection(null)
      alert('Section güncellendi!')
    } catch (error) {
      alert('Güncelleme hatası: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveItem = async (sectionId, itemId, data) => {
    setSaving(true)
    try {
      await updateSectionItem(sectionId, itemId, data)
      await loadContent()
      setActiveItem(null)
      alert('İçerik güncellendi!')
    } catch (error) {
      alert('Güncelleme hatası: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveLogo = async () => {
    setSaving(true)
    try {
      await updateLogo(logoPath)
      await loadContent()
      alert('Logo güncellendi!')
    } catch (error) {
      alert('Güncelleme hatası: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveVideo = async () => {
    setSaving(true)
    try {
      await updateVideo(videoPath)
      await loadContent()
      alert('Video güncellendi!')
    } catch (error) {
      alert('Güncelleme hatası: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveTranslation = async (itemId, data) => {
    setSaving(true)
    try {
      await updateTranslation(itemId, data)
      await loadContent()
      setActiveTranslationItem(null)
      alert('İngilizce çeviri güncellendi!')
    } catch (error) {
      alert('Güncelleme hatası: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSectionTranslation = async (sectionId, data) => {
    setSaving(true)
    try {
      await updateSectionTranslation(sectionId, data)
      await loadContent()
      setActiveTranslationSection(null)
      alert('Section İngilizce çevirisi güncellendi!')
    } catch (error) {
      alert('Güncelleme hatası: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">Admin Paneli</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoComplete="current-password"
                required
              />
            </div>
            {loginError && (
              <div className="text-red-600 text-sm">{loginError}</div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    )
  }

  const translations = content?.translations?.en || {}
  const sectionTranslations = translations.sections || {}
  const itemTranslations = translations.items || {}

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-blue-900">Admin Paneli</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Hoş geldiniz, <strong>{username}</strong></span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('sections')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'sections'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Türkçe İçerikler
            </button>
            <button
              onClick={() => setActiveTab('translations')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'translations'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              İngilizce Çeviriler
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Ayarlar (Logo & Video)
            </button>
          </div>
        </div>

        {/* Content */}
        {content && (
          <>
            {/* Sections Tab */}
            {activeTab === 'sections' && (
              <div className="space-y-6">
                {content.sections.map((section) => (
                  <div key={section.id} className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        {activeSection === section.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              defaultValue={section.title}
                              onBlur={(e) => {
                                if (e.target.value !== section.title) {
                                  handleSaveSectionTitle(section.id, e.target.value)
                                } else {
                                  setActiveSection(null)
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.target.blur()
                                }
                                if (e.key === 'Escape') {
                                  setActiveSection(null)
                                }
                              }}
                              className="text-2xl font-bold text-blue-900 border-2 border-blue-500 rounded px-2 py-1 w-full"
                              autoFocus
                            />
                            <textarea
                              defaultValue={section.description}
                              onBlur={(e) => {
                                if (e.target.value !== section.description) {
                                  handleSaveSection(section.id, { description: e.target.value })
                                }
                              }}
                              className="text-gray-700 border-2 border-blue-500 rounded px-2 py-1 w-full"
                              rows="3"
                            />
                          </div>
                        ) : (
                          <div>
                            <h2
                              className="text-2xl font-bold text-blue-900 cursor-pointer hover:text-blue-700"
                              onClick={() => setActiveSection(section.id)}
                            >
                              {section.title}
                            </h2>
                            <p
                              className="text-gray-700 mt-2 cursor-pointer hover:text-gray-900"
                              onClick={() => setActiveSection(section.id)}
                            >
                              {section.description}
                            </p>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                        className="ml-4 text-blue-600 hover:text-blue-800"
                      >
                        {activeSection === section.id ? 'İptal' : 'Düzenle'}
                      </button>
                    </div>

                    {/* Items */}
                    {section.items && section.items.length > 0 && (
                      <div className="mt-4 space-y-4 border-t pt-4">
                        {section.items.map((item) => (
                          <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                            {activeItem === item.id ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  defaultValue={item.title}
                                  onBlur={(e) => {
                                    if (e.target.value !== item.title) {
                                      handleSaveItem(section.id, item.id, { title: e.target.value })
                                    } else {
                                      setActiveItem(null)
                                    }
                                  }}
                                  className="text-xl font-semibold text-blue-900 border-2 border-blue-500 rounded px-2 py-1 w-full"
                                  autoFocus
                                />
                                <textarea
                                  defaultValue={item.shortText}
                                  onBlur={(e) => {
                                    if (e.target.value !== item.shortText) {
                                      handleSaveItem(section.id, item.id, { shortText: e.target.value })
                                    }
                                  }}
                                  className="text-gray-700 border-2 border-blue-500 rounded px-2 py-1 w-full"
                                  rows="2"
                                  placeholder="Kısa metin"
                                />
                                <textarea
                                  defaultValue={item.expandedText}
                                  onBlur={(e) => {
                                    if (e.target.value !== item.expandedText) {
                                      handleSaveItem(section.id, item.id, { expandedText: e.target.value })
                                    }
                                  }}
                                  className="text-gray-700 border-2 border-blue-500 rounded px-2 py-1 w-full"
                                  rows="4"
                                  placeholder="Uzun metin"
                                />
                                <button
                                  onClick={() => setActiveItem(null)}
                                  className="text-sm text-gray-600 hover:text-gray-800"
                                >
                                  İptal
                                </button>
                              </div>
                            ) : (
                              <div>
                                <h3
                                  className="text-xl font-semibold text-blue-900 cursor-pointer hover:text-blue-700"
                                  onClick={() => setActiveItem(item.id)}
                                >
                                  {item.title}
                                </h3>
                                <p
                                  className="text-gray-700 mt-1 cursor-pointer hover:text-gray-900"
                                  onClick={() => setActiveItem(item.id)}
                                >
                                  {item.shortText?.substring(0, 100)}...
                                </p>
                                <button
                                  onClick={() => setActiveItem(item.id)}
                                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                                >
                                  Düzenle
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Translations Tab */}
            {activeTab === 'translations' && (
              <div className="space-y-6">
                {/* Section Translations */}
                {content.sections.map((section) => {
                  const sectionTrans = sectionTranslations[section.id] || {}
                  return (
                    <div key={section.id} className="bg-white rounded-lg shadow-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          {activeTranslationSection === section.id ? (
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">İngilizce Başlık</label>
                              <input
                                type="text"
                                defaultValue={sectionTrans.title || ''}
                                onBlur={(e) => {
                                  handleSaveSectionTranslation(section.id, {
                                    title: e.target.value,
                                    description: sectionTrans.description || ''
                                  })
                                }}
                                className="text-xl font-bold text-blue-900 border-2 border-blue-500 rounded px-2 py-1 w-full"
                                placeholder="English Title"
                                autoFocus
                              />
                              <label className="text-sm font-medium text-gray-700">İngilizce Açıklama</label>
                              <textarea
                                defaultValue={sectionTrans.description || ''}
                                onBlur={(e) => {
                                  handleSaveSectionTranslation(section.id, {
                                    title: sectionTrans.title || '',
                                    description: e.target.value
                                  })
                                }}
                                className="text-gray-700 border-2 border-blue-500 rounded px-2 py-1 w-full"
                                rows="3"
                                placeholder="English Description"
                              />
                              <button
                                onClick={() => setActiveTranslationSection(null)}
                                className="text-sm text-gray-600 hover:text-gray-800"
                              >
                                İptal
                              </button>
                            </div>
                          ) : (
                            <div>
                              <h2 className="text-2xl font-bold text-blue-900">
                                {section.title} (EN)
                              </h2>
                              <p className="text-gray-700 mt-2">
                                {sectionTrans.title || '(Çeviri yok)'}
                              </p>
                              <p className="text-gray-500 mt-1 text-sm">
                                {sectionTrans.description || '(Açıklama çevirisi yok)'}
                              </p>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => setActiveTranslationSection(activeTranslationSection === section.id ? null : section.id)}
                          className="ml-4 text-blue-600 hover:text-blue-800"
                        >
                          {activeTranslationSection === section.id ? 'İptal' : 'Düzenle'}
                        </button>
                      </div>

                      {/* Item Translations */}
                      {section.items && section.items.length > 0 && (
                        <div className="mt-4 space-y-4 border-t pt-4">
                          {section.items.map((item) => {
                            const itemTrans = itemTranslations[item.id] || {}
                            return (
                              <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                                {activeTranslationItem === item.id ? (
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">İngilizce Başlık</label>
                                    <input
                                      type="text"
                                      defaultValue={itemTrans.title || ''}
                                      onBlur={(e) => {
                                        handleSaveTranslation(item.id, {
                                          title: e.target.value,
                                          shortText: itemTrans.shortText || '',
                                          expandedText: itemTrans.expandedText || ''
                                        })
                                      }}
                                      className="text-xl font-semibold text-blue-900 border-2 border-blue-500 rounded px-2 py-1 w-full"
                                      placeholder="English Title"
                                      autoFocus
                                    />
                                    <label className="text-sm font-medium text-gray-700">İngilizce Kısa Metin</label>
                                    <textarea
                                      defaultValue={itemTrans.shortText || ''}
                                      onBlur={(e) => {
                                        handleSaveTranslation(item.id, {
                                          title: itemTrans.title || '',
                                          shortText: e.target.value,
                                          expandedText: itemTrans.expandedText || ''
                                        })
                                      }}
                                      className="text-gray-700 border-2 border-blue-500 rounded px-2 py-1 w-full"
                                      rows="2"
                                      placeholder="English Short Text"
                                    />
                                    <label className="text-sm font-medium text-gray-700">İngilizce Uzun Metin</label>
                                    <textarea
                                      defaultValue={itemTrans.expandedText || ''}
                                      onBlur={(e) => {
                                        handleSaveTranslation(item.id, {
                                          title: itemTrans.title || '',
                                          shortText: itemTrans.shortText || '',
                                          expandedText: e.target.value
                                        })
                                      }}
                                      className="text-gray-700 border-2 border-blue-500 rounded px-2 py-1 w-full"
                                      rows="4"
                                      placeholder="English Expanded Text"
                                    />
                                    <button
                                      onClick={() => setActiveTranslationItem(null)}
                                      className="text-sm text-gray-600 hover:text-gray-800"
                                    >
                                      İptal
                                    </button>
                                  </div>
                                ) : (
                                  <div>
                                    <h3 className="text-lg font-semibold text-blue-900">
                                      {item.title} (EN)
                                    </h3>
                                    <p className="text-gray-700 mt-1 text-sm">
                                      {itemTrans.title || '(Çeviri yok)'}
                                    </p>
                                    <button
                                      onClick={() => setActiveTranslationItem(item.id)}
                                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                                    >
                                      Düzenle
                                    </button>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-blue-900 mb-4">Logo Ayarları</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo Yolu (örn: /svglogo.png)
                      </label>
                      <input
                        type="text"
                        value={logoPath}
                        onChange={(e) => setLogoPath(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="/svglogo.png"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Logo dosyasını public klasörüne koyun ve yolunu buraya yazın
                      </p>
                    </div>
                    <button
                      onClick={handleSaveLogo}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Logo Kaydet
                    </button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold text-blue-900 mb-4">Video Ayarları</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hero Video Yolu (örn: /anavideo.mp4)
                      </label>
                      <input
                        type="text"
                        value={videoPath}
                        onChange={(e) => setVideoPath(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="/anavideo.mp4"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Video dosyasını public klasörüne koyun ve yolunu buraya yazın
                      </p>
                    </div>
                    <button
                      onClick={handleSaveVideo}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Video Kaydet
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {saving && (
          <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">
            Kaydediliyor...
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
