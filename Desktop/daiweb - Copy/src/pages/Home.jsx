import { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import { getContent } from '../services/api'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'

const Home = () => {
  const { language } = useLanguage()
  const t = translations[language]
  
  // Tüm accordion'ları varsayılan olarak kapalı yap - sadece resim ve başlık görünsün
  const allSectionIds = [
    'uygulama-fullstack',
    'uygulama-api',
    'otomasyon-entegrasyon',
    'otomasyon-hiper',
    'otomasyon-crm',
    'otomasyon-raporlama',
    'marka-kimlik',
    'marka-mailing',
    'marka-web',
    'marka-sosyal'
  ]
  
  const initialOpenSections = {}
  allSectionIds.forEach(id => {
    initialOpenSections[id] = false // Kapalı başlat
  })
  
  const [openSections, setOpenSections] = useState(initialOpenSections)
  const [expandedSections, setExpandedSections] = useState({})
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  // Backend'den içeriği yükle
  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getContent()
        if (data) {
          setContent(data)
        }
      } catch (error) {
        console.error('İçerik yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }
    loadContent()
  }, [language]) // Dil değiştiğinde yeniden yükle
  
  // İçerik uzunluğuna göre "Daha fazla oku" butonunu göster
  const shouldShowReadMore = (expandedText) => {
    if (!expandedText) return false
    return expandedText.length > 200 // Expanded text 200 karakterden fazlaysa göster
  }
  
  // Her section için expanded text içeriği (fallback - backend'den gelirse kullanılır)
  const expandedContents = {
    'uygulama-fullstack': 'Full stack geliştirme yaklaşımımız sayesinde tutarlı teknoloji yığını, hızlı geliştirme süreçleri ve sorunsuz entegrasyonlar sağlıyoruz. AI destekli kod üretimi ile geliştirme süresini %60\'a kadar kısaltıyoruz.',
    'uygulama-api': 'Mikroservis mimarisi ile sisteminizi bağımsız, ölçeklenebilir ve bakımı kolay modüllere ayırıyoruz.',
    'otomasyon-entegrasyon': 'Hiperotomasyon yaklaşımıyla sistemleriniz arasında gerçek zamanlı veri senkronizasyonu kuruyoruz.',
    'otomasyon-hiper': 'RPA botları ile masaüstü uygulamaları, web siteleri ve sistemler arasında otomatik iş akışları kuruyoruz.',
    'otomasyon-crm': 'CRM sisteminizi otomasyonlarla güçlendiriyoruz. Yeni lead\'ler otomatik olarak kaydedilir ve segmentlere ayrılır.',
    'otomasyon-raporlama': 'Tüm operasyonel verilerinizi otomatik olarak toplayıp analiz ediyoruz.',
    'marka-kimlik': 'Markanızın değerlerini yansıtan, hedef kitlenizle güçlü bağ kuran profesyonel tasarımlar üretiyoruz.',
    'marka-mailing': 'Müşteri segmentasyonu ve kişiselleştirme ile doğru mesajı doğru müşteriye doğru zamanda iletmenizi sağlıyoruz.',
    'marka-web': 'Kullanıcı deneyimi araştırmaları ve dönüşüm optimizasyonu ile web sitenizi ziyaretçilerinizi müşteriye dönüştürecek şekilde tasarlıyoruz.',
    'marka-sosyal': 'Markanızın sosyal medya varlığını profesyonel şekilde yönetiyoruz.'
  }

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const expandSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const scrollToSection = (hash) => {
    const element = document.querySelector(hash)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  // Backend'den section verisi al (fallback ile)
  const getSection = (sectionId) => {
    if (!content || !content.sections) return null
    return content.sections.find(s => s.id === sectionId)
  }

  // Backend'den item verisi al (fallback ile)
  const getItem = (sectionId, itemId) => {
    const section = getSection(sectionId)
    if (!section || !section.items) return null
    return section.items.find(item => item.id === itemId)
  }

  // Render Item Component - Backend'den gelen item'ları render eder
  const RenderItem = ({ sectionId, itemId }) => {
    const item = getItem(sectionId, itemId)
    if (!item) return null
    
    // Çeviri varsa kullan, yoksa backend'den gelen içeriği kullan
    const translatedItem = t.items && t.items[itemId] ? t.items[itemId] : null
    const itemTitle = translatedItem ? translatedItem.title : item.title
    const shortText = translatedItem ? translatedItem.shortText : (item.shortText || '')
    const expandedText = translatedItem ? translatedItem.expandedText : (item.expandedText || expandedContents[itemId] || '')
    
    return (
      <div id={itemId} className="scroll-mt-20 border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 w-full relative">
        {/* Görsel - sadece uygulama-fullstack için başlığın üstünde */}
        {itemId === 'uygulama-fullstack' && (
          <div className="w-full flex justify-center pt-6 md:pt-8 pb-4">
            <img 
              src="/Otomasyonu.png" 
              alt="Full Stack Development"
              className="w-auto h-auto max-w-full max-h-24 md:max-h-32 lg:max-h-40 object-contain"
            />
          </div>
        )}
        {/* Video - sadece uygulama-api için başlığın üstünde */}
        {itemId === 'uygulama-api' && (
          <div className="w-full flex justify-center pt-6 md:pt-8 pb-4">
            <video 
              src="/3.mp4" 
              autoPlay
              loop
              muted
              playsInline
              className="w-auto h-auto max-w-full max-h-24 md:max-h-32 lg:max-h-40 object-contain rounded-lg"
            />
          </div>
        )}
        {/* GIF görseli - sadece otomasyon-entegrasyon için başlığın üstünde */}
        {itemId === 'otomasyon-entegrasyon' && (
          <div className="w-full flex justify-center pt-6 md:pt-8 pb-4">
            <img 
              src="/4.gif" 
              alt="System Integration"
              className="w-auto h-auto max-w-full max-h-24 md:max-h-32 lg:max-h-40 object-contain"
            />
          </div>
        )}
        {/* Görsel - sadece otomasyon-hiper için başlığın üstünde */}
        {itemId === 'otomasyon-hiper' && (
          <div className="w-full flex justify-center pt-6 md:pt-8 pb-4">
            <img 
              src="/5.png" 
              alt="Hyperautomation Solutions"
              className="w-auto h-auto max-w-full max-h-24 md:max-h-32 lg:max-h-40 object-contain"
            />
          </div>
        )}
        {/* Görsel - sadece otomasyon-crm için başlığın üstünde */}
        {itemId === 'otomasyon-crm' && (
          <div className="w-full flex justify-center pt-6 md:pt-8 pb-4">
            <img 
              src="/crm.png" 
              alt="CRM Automation"
              className="w-auto h-auto max-w-full max-h-24 md:max-h-32 lg:max-h-40 object-contain"
            />
          </div>
        )}
        {/* Görsel - sadece marka-kimlik için başlığın üstünde */}
        {itemId === 'marka-kimlik' && (
          <div className="w-full flex justify-center pt-6 md:pt-8 pb-4">
            <img 
              src="/grafik.png" 
              alt="Corporate Identity & Graphic Design"
              className="w-auto h-auto max-w-full max-h-24 md:max-h-32 lg:max-h-40 object-contain"
            />
          </div>
        )}
        {/* Görsel - sadece otomasyon-raporlama için başlığın üstünde */}
        {itemId === 'otomasyon-raporlama' && (
          <div className="w-full flex justify-center pt-6 md:pt-8 pb-4">
            <img 
              src="/reports.png" 
              alt="Reporting & Analytics Automation"
              className="w-auto h-auto max-w-full max-h-24 md:max-h-32 lg:max-h-40 object-contain"
            />
          </div>
        )}
        {/* Görsel - sadece marka-mailing için başlığın üstünde */}
        {itemId === 'marka-mailing' && (
          <div className="w-full flex justify-center pt-6 md:pt-8 pb-4">
            <img 
              src="/mailing.png" 
              alt="Email Marketing Infrastructure"
              className="w-auto h-auto max-w-full max-h-24 md:max-h-32 lg:max-h-40 object-contain"
            />
          </div>
        )}
        {/* Görsel - sadece marka-web için başlığın üstünde */}
        {itemId === 'marka-web' && (
          <div className="w-full flex justify-center pt-6 md:pt-8 pb-4">
            <img 
              src="/landing.png" 
              alt="Landing Page & Website Development"
              className="w-auto h-auto max-w-full max-h-24 md:max-h-32 lg:max-h-40 object-contain"
            />
          </div>
        )}
        {/* Görsel - sadece marka-sosyal için başlığın üstünde */}
        {itemId === 'marka-sosyal' && (
          <div className="w-full flex justify-center pt-6 md:pt-8 pb-4">
            <img 
              src="/social.png" 
              alt="Social Media & Content Strategy"
              className="w-auto h-auto max-w-full max-h-24 md:max-h-32 lg:max-h-40 object-contain"
            />
          </div>
        )}
        <button
          onClick={() => toggleSection(itemId)}
          className="w-full px-8 md:px-12 lg:px-16 xl:px-20 py-8 md:py-10 lg:py-12 flex items-center hover:bg-transparent transition-colors relative"
        >
          <h3 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-blue-900 text-center flex-1 tracking-tight leading-tight">
            {itemTitle}
          </h3>
          <svg
            className={`w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-blue-600 transition-transform flex-shrink-0 absolute right-8 md:right-12 lg:right-16 xl:right-20 ${openSections[itemId] ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {openSections[itemId] && (
          <div className="px-8 md:px-12 lg:px-16 xl:px-20 pb-10 md:pb-12 lg:pb-14">
            {/* İç div - görseldeki gibi yumuşak köşeler ve tonlar */}
            <div className="bg-gradient-to-br from-blue-50/30 to-white rounded-2xl border border-blue-100/50 shadow-sm p-6 md:p-8 lg:p-10 transition-all duration-300">
              <div className="prose prose-lg max-w-none text-blue-800">
                <p className="mb-8 md:mb-10 text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed font-normal tracking-wide">
                  {shortText}
                </p>
                {expandedSections[itemId] && expandedText ? (
                  <div className="space-y-8 md:space-y-10 animate-fadeIn">
                    <p className="mb-8 md:mb-10 text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed font-normal tracking-wide">
                      {expandedText}
                    </p>
                  </div>
                ) : null}
                {shouldShowReadMore(expandedText) && (
                  <button
                    onClick={() => expandSection(itemId)}
                    className="read-more-btn mt-8 md:mt-10 text-blue-600 hover:text-blue-700 font-medium text-base md:text-lg lg:text-xl flex items-center gap-3 w-full justify-center py-3 md:py-4"
                  >
                    <span className="relative z-10">{expandedSections[itemId] ? t.readLess : t.readMore}</span>
                    <svg className={`w-5 h-5 md:w-6 md:h-6 relative z-10 transition-transform duration-500 ease-in-out ${expandedSections[itemId] ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
                {/* Basit asimetrik çizgiler - sadece uygulama-fullstack için */}
                {expandedSections[itemId] && itemId === 'uygulama-fullstack' && (
                  <div className="mt-10 md:mt-12 w-full relative overflow-hidden rounded-xl" style={{ backgroundColor: '#ffffff', minHeight: '150px' }}>
                    <svg 
                      width="100%" 
                      height="150" 
                      viewBox="0 0 1200 150" 
                      preserveAspectRatio="none"
                      className="absolute inset-0"
                      style={{ opacity: 0.03 }}
                    >
                      {/* Çok basit asimetrik çizgiler */}
                      <path 
                        d="M0,50 Q200,30 400,45 T800,40 T1200,35" 
                        stroke="#3b82f6" 
                        strokeWidth="1" 
                        fill="none"
                      />
                      <path 
                        d="M0,80 Q300,70 600,75 T1200,70" 
                        stroke="#3b82f6" 
                        strokeWidth="0.8" 
                        fill="none"
                      />
                      <path 
                        d="M0,110 Q150,100 300,105 T600,102 T900,108 T1200,105" 
                        stroke="#3b82f6" 
                        strokeWidth="0.6" 
                        fill="none"
                      />
                      <path 
                        d="M0,30 Q250,25 500,28 T1000,26 T1200,32" 
                        stroke="#3b82f6" 
                        strokeWidth="0.7" 
                        fill="none"
                      />
                      <path 
                        d="M0,130 Q180,125 360,128 T720,126 T1200,132" 
                        stroke="#3b82f6" 
                        strokeWidth="0.5" 
                        fill="none"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Backend içeriğini çevir
  const translateContent = (content) => {
    if (!content || language === 'tr') return content
    
    const contentMap = {
      'uygulama': { title: t.sections.appDev.title, description: t.sections.appDev.description },
      'otomasyon': { title: t.sections.automation.title, description: t.sections.automation.description },
      'marka': { title: t.sections.digitalBrand.title, description: t.sections.digitalBrand.description },
    }
    
    if (content.sections) {
      content.sections = content.sections.map(section => {
        const translated = contentMap[section.id]
        if (translated) {
          return { ...section, title: translated.title, description: translated.description }
        }
        return section
      })
    }
    
    return content
  }

  // Render Section Component - Backend'den gelen section'ları render eder
  const RenderSection = ({ sectionId }) => {
    const section = getSection(sectionId)
    if (!section) return null
    
    // Section başlık ve açıklamasını çevir
    const sectionMap = {
      'uygulama': { title: t.sections.appDev.title, description: t.sections.appDev.description },
      'otomasyon': { title: t.sections.automation.title, description: t.sections.automation.description },
      'marka': { title: t.sections.digitalBrand.title, description: t.sections.digitalBrand.description },
    }
    
    const translated = sectionMap[sectionId] || {}
    
    return (
      <section id={sectionId} className="py-20 md:py-28 lg:py-32 scroll-mt-20" style={{ backgroundColor: '#ffffff' }}>
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-16 md:mb-20 relative">
            <CodeIllustration />
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-blue-900 mb-8 md:mb-10 relative z-10 tracking-tight">
              {translated.title || section.title}
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-blue-800 max-w-4xl mx-auto leading-relaxed mb-8 relative z-10 font-light tracking-wide">
              {translated.description || section.description}
            </p>
          </div>
          <div className="space-y-6 md:space-y-8 w-full">
            {section.items && section.items.map((item) => (
              <RenderItem key={item.id} sectionId={sectionId} itemId={item.id} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Code Illustration SVG Component
  const CodeIllustration = () => (
    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
      <svg width="400" height="300" viewBox="0 0 400 300" className="animate-pulse-slow">
        <rect x="20" y="20" width="360" height="260" rx="8" fill="#3b82f6" opacity="0.1"/>
        <rect x="20" y="20" width="360" height="30" rx="8" fill="#3b82f6" opacity="0.2"/>
        <circle cx="40" cy="35" r="5" fill="#3b82f6" opacity="0.3"/>
        <circle cx="60" cy="35" r="5" fill="#3b82f6" opacity="0.3"/>
        <circle cx="80" cy="35" r="5" fill="#3b82f6" opacity="0.3"/>
        <line x1="40" y1="70" x2="340" y2="70" stroke="#3b82f6" strokeWidth="2" opacity="0.4" className="animate-draw-line"/>
        <line x1="40" y1="90" x2="280" y2="90" stroke="#3b82f6" strokeWidth="2" opacity="0.4" className="animate-draw-line" style={{animationDelay: '0.2s'}}/>
        <line x1="40" y1="110" x2="320" y2="110" stroke="#3b82f6" strokeWidth="2" opacity="0.4" className="animate-draw-line" style={{animationDelay: '0.4s'}}/>
        <line x1="40" y1="130" x2="260" y2="130" stroke="#3b82f6" strokeWidth="2" opacity="0.4" className="animate-draw-line" style={{animationDelay: '0.6s'}}/>
        <line x1="40" y1="150" x2="300" y2="150" stroke="#3b82f6" strokeWidth="2" opacity="0.4" className="animate-draw-line" style={{animationDelay: '0.8s'}}/>
        <rect x="50" y="180" width="80" height="20" rx="4" fill="#3b82f6" opacity="0.2" className="animate-fade-in-out"/>
        <rect x="150" y="180" width="60" height="20" rx="4" fill="#3b82f6" opacity="0.2" className="animate-fade-in-out" style={{animationDelay: '0.3s'}}/>
        <rect x="230" y="180" width="100" height="20" rx="4" fill="#3b82f6" opacity="0.2" className="animate-fade-in-out" style={{animationDelay: '0.6s'}}/>
        <path d="M50 200 L40 210 L50 220" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.3"/>
        <path d="M350 200 L360 210 L350 220" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.3"/>
      </svg>
    </div>
  )

  // Dil'e göre video path'i belirle
  const getVideoPath = () => {
    if (language === 'tr') {
      return '/tr.mp4'
    } else {
      return content?.settings?.heroVideo || '/anavideo.mp4'
    }
  }
  
  const videoPath = getVideoPath()

  if (loading) {
    return (
      <>
        <Hero videoPath={videoPath} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-800">{t.contact.loading}</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Hero videoPath={videoPath} />
      
      {/* Backend'den gelen section'ları dinamik render et */}
      {content && content.sections && content.sections.map((section) => (
        <RenderSection key={section.id} sectionId={section.id} />
      ))}
      
      {/* İletişim Section */}
      <section id="iletisim" className="py-8 md:py-10 scroll-mt-20" style={{ backgroundColor: '#ffffff' }}>
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-3">
              {t.contact.title}
            </h2>
            <p className="text-sm md:text-base text-blue-800 max-w-2xl mx-auto">
              {t.contact.description}
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white border-gray-200 rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">{t.contact.formTitle}</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-blue-800 mb-2">
                    {t.contact.name}
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.contact.namePlaceholder}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-blue-800 mb-2">
                    {t.contact.email}
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.contact.emailPlaceholder}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-blue-800 mb-2">
                    {t.contact.phone}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.contact.phonePlaceholder}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-blue-800 mb-2">
                    {t.contact.message}
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.contact.messagePlaceholder}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  {t.contact.send}
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <a 
                href="mailto:info@daiteknoloji.com" 
                className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-blue-200"
              >
                <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-blue-700 mb-1 uppercase tracking-wide">{t.contact.email}</p>
                <p className="text-sm font-medium text-blue-900 group-hover:text-blue-700 transition-colors">info@daiteknoloji.com</p>
              </a>
              <a 
                href="tel:+905327358935" 
                className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-blue-200"
              >
                <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-blue-700 mb-1 uppercase tracking-wide">{t.contact.phone}</p>
                <p className="text-sm font-medium text-blue-900 group-hover:text-blue-700 transition-colors">+90 (532) 735 89 35</p>
              </a>
              <a 
                href="https://wa.me/905327358935" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-green-200"
              >
                <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <p className="text-xs font-semibold text-green-700 mb-1 uppercase tracking-wide">WhatsApp</p>
                <p className="text-sm font-medium text-green-900 group-hover:text-green-700 transition-colors">{t.contact.sendWhatsApp}</p>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
