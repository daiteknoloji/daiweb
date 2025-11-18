import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'

const scrollToSection = (hash) => {
  // Kısa bir gecikme ekle ki sayfa tam yüklensin
  setTimeout(() => {
    const element = document.querySelector(hash)
    if (element) {
      const offset = 80 // Navbar yüksekliği için offset
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    } else {
      // Element bulunamazsa tekrar dene
      setTimeout(() => {
        const retryElement = document.querySelector(hash)
        if (retryElement) {
          const offset = 80
          const elementPosition = retryElement.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - offset
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }, 300)
    }
  }, 100)
}

const Navbar = ({ logoPath = '/svglogo.png' }) => {
  const { language, toggleLanguage } = useLanguage()
  const t = translations[language]
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [clickedMenu, setClickedMenu] = useState(null)
  const [dropdownKey, setDropdownKey] = useState(0)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      // Hero section'ın yüksekliğini kontrol et (100vh)
      const heroHeight = window.innerHeight
      setScrolled(window.scrollY > heroHeight - 100)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll() // İlk yüklemede kontrol et
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Dropdown dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clickedMenu) {
        // Dropdown container veya button içinde değilse kapat
        const isInsideDropdown = event.target.closest('[data-dropdown-container]')
        const isDropdownButton = event.target.closest('button[data-dropdown-button]')
        if (!isInsideDropdown && !isDropdownButton) {
          setClickedMenu(null)
        }
      }
    }
    if (clickedMenu) {
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside)
      }, 0)
    }
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [clickedMenu])

  const navLinks = [
    {
      path: '#uygulama',
      label: t.nav.appDev,
      dropdown: [
        { path: '#uygulama-fullstack', label: t.nav.fullstack },
        { path: '#uygulama-api', label: t.nav.api },
      ]
    },
    {
      path: '#otomasyon',
      label: t.nav.automation,
      dropdown: [
        { path: '#otomasyon-entegrasyon', label: t.nav.integration },
        { path: '#otomasyon-hiper', label: t.nav.hyperautomation },
        { path: '#otomasyon-crm', label: t.nav.crm },
        { path: '#otomasyon-raporlama', label: t.nav.reporting },
      ]
    },
    {
      path: '#marka',
      label: t.nav.digitalBrand,
      dropdown: [
        { path: '#marka-kimlik', label: t.nav.identity },
        { path: '#marka-mailing', label: t.nav.mailing },
        { path: '#marka-web', label: t.nav.web },
        { path: '#marka-sosyal', label: t.nav.social },
      ]
    },
    { path: '#iletisim', label: t.nav.contact, dropdown: null },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/98 backdrop-blur-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 relative">
          <Link 
            to="/" 
            className="flex items-center z-50"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })
            }}
          >
            <img 
              src={logoPath} 
              alt="DAI Teknoloji Logo" 
              className="h-[32px] w-auto transition-all duration-300"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center justify-center flex-1 space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <div
                key={link.path}
                className="relative"
              >
                {link.dropdown && link.dropdown.length > 0 ? (
                  <button
                    data-dropdown-button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (clickedMenu === link.path) {
                        setClickedMenu(null)
                      } else {
                        setClickedMenu(link.path)
                        setDropdownKey(prev => prev + 1)
                      }
                    }}
                    className={`text-lg font-medium transition-all duration-200 relative cursor-pointer ${
                      location.hash === link.path || clickedMenu === link.path ? 'text-blue-900' : 'text-blue-800 hover:text-blue-900'
                    }`}
                  >
                    {link.label}
                  </button>
                ) : (
                  <a
                    href={link.path}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection(link.path)
                    }}
                    className={`text-lg font-medium transition-all duration-200 relative cursor-pointer ${
                      location.hash === link.path ? 'text-blue-900' : 'text-blue-800 hover:text-blue-900'
                    }`}
                  >
                    {link.label}
                  </a>
                )}
                
                {clickedMenu === link.path && link.dropdown && link.dropdown.length > 0 && (
                  <div 
                    key={`dropdown-${link.path}-${dropdownKey}`}
                    data-dropdown-container
                    className="absolute top-full left-0 pt-2 z-50"
                  >
                    <div className="bg-white/99 shadow-lg overflow-hidden min-w-[300px] max-w-[450px] dropdown-animate" style={{ backdropFilter: 'blur(36px)' }}>
                      <div className="py-2">
                        <div className="flex flex-col gap-1">
                          {link.dropdown.map((item, idx) => (
                            <a
                              key={`${link.path}-${idx}-${dropdownKey}`}
                              href={item.path}
                              onClick={(e) => {
                                e.preventDefault()
                                scrollToSection(item.path)
                                setClickedMenu(null)
                              }}
                              className="px-4 py-3 hover:bg-gray-50 transition-all duration-200 cursor-pointer text-sm text-blue-800 hover:text-blue-900 dropdown-item"
                              style={{ 
                                '--delay': `${idx * 200}ms`
                              }}
                            >
                              {item.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Language Toggle Button - Sağ Üst */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm hover:bg-white/90 hover:shadow-md transition-all duration-300 group"
            title={language === 'tr' ? 'Switch to English' : 'Türkçe\'ye Geç'}
          >
            <span className={`text-lg transition-all duration-300 ${language === 'tr' ? 'opacity-100 scale-110' : 'opacity-40 scale-90'}`}>🇹🇷</span>
            <span className={`text-lg transition-all duration-300 ${language === 'en' ? 'opacity-100 scale-110' : 'opacity-40 scale-90'}`}>🇬🇧</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsOpen(prev => !prev)
            }}
            className="lg:hidden p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md bg-transparent border-0 text-blue-800 transition-all duration-300"
            aria-label={isOpen ? t.nav.menuClose : t.nav.menuOpen}
            aria-expanded={isOpen}
            type="button"
          >
            {isOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div 
            className="lg:hidden fixed top-14 left-0 right-0 bottom-0 bg-white z-[60] overflow-y-auto"
            style={{ height: 'calc(100vh - 3.5rem)', top: '56px' }}
          >
            <div className="w-full min-h-full">
              {/* Mobile Language Toggle */}
              <div className="px-4 py-4 border-b border-blue-200">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm hover:bg-white/90 hover:shadow-md transition-all duration-300 w-full justify-center"
                  title={language === 'tr' ? 'Switch to English' : 'Türkçe\'ye Geç'}
                >
                  <span className={`text-xl transition-all duration-300 ${language === 'tr' ? 'opacity-100 scale-110' : 'opacity-40 scale-90'}`}>🇹🇷</span>
                  <span className={`text-xl transition-all duration-300 ${language === 'en' ? 'opacity-100 scale-110' : 'opacity-40 scale-90'}`}>🇬🇧</span>
                </button>
              </div>
              <div className="px-4 py-4">
                {navLinks.map((link) => (
                  <div key={link.path} className="w-full border-b border-blue-200 last:border-b-0">
                    <a
                      href={link.path}
                      onClick={(e) => {
                        e.preventDefault()
                        setIsOpen(false)
                        scrollToSection(link.path)
                      }}
                      className={`block w-full py-4 px-2 text-base font-medium transition-colors cursor-pointer ${
                        location.hash === link.path
                          ? 'text-blue-900'
                          : 'text-blue-800'
                      }`}
                    >
                      {link.label}
                    </a>
                    {link.dropdown && link.dropdown.length > 0 && (
                      <div className="pb-2">
                        {link.dropdown.map((item, idx) => (
                          <a
                            key={idx}
                            href={item.path}
                            onClick={(e) => {
                              e.preventDefault()
                              setIsOpen(false)
                              scrollToSection(item.path)
                            }}
                            className="block py-2.5 px-6 text-sm text-blue-800 active:bg-blue-50 transition-all duration-200 cursor-pointer hover:text-blue-900 hover:translate-x-1"
                            style={{ animationDelay: `${idx * 50}ms` }}
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

