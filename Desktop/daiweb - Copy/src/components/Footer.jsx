import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'

const Footer = () => {
  const { language } = useLanguage()
  const t = translations[language]
  
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

  return (
    <footer className="bg-gradient-to-b from-blue-50 to-white border-t-2 border-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo ve Açıklama */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <img 
                src="/svglogo.png" 
                alt="DAI Teknoloji Logo" 
                className="h-10 w-auto"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-3">DAI Teknoloji</h3>
            <p className="text-sm text-blue-700 leading-relaxed mb-4">
              {t.footer.tagline}
            </p>
          </div>

          {/* Hizmetler */}
          <div>
            <h4 className="text-base font-bold text-blue-900 mb-5 uppercase tracking-wide">{t.footer.services}</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#otomasyon" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('#otomasyon'); }} 
                  className="text-sm text-blue-700 hover:text-blue-900 hover:underline transition-all duration-200 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 group-hover:bg-blue-700 transition-colors"></span>
                  {t.nav.automation}
                </a>
              </li>
              <li>
                <a 
                  href="#uygulama" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('#uygulama'); }} 
                  className="text-sm text-blue-700 hover:text-blue-900 hover:underline transition-all duration-200 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 group-hover:bg-blue-700 transition-colors"></span>
                  {t.nav.appDev}
                </a>
              </li>
              <li>
                <a 
                  href="#marka" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('#marka'); }} 
                  className="text-sm text-blue-700 hover:text-blue-900 hover:underline transition-all duration-200 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 group-hover:bg-blue-700 transition-colors"></span>
                  {t.nav.digitalBrand}
                </a>
              </li>
              <li>
                <a 
                  href="#iletisim" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('#iletisim'); }} 
                  className="text-sm text-blue-700 hover:text-blue-900 hover:underline transition-all duration-200 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 group-hover:bg-blue-700 transition-colors"></span>
                  {t.nav.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h4 className="text-base font-bold text-blue-900 mb-5 uppercase tracking-wide">{t.footer.contact}</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@daiteknoloji.com" className="text-sm text-blue-700 hover:text-blue-900 transition-colors">
                  info@daiteknoloji.com
                </a>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+905327358935" className="text-sm text-blue-700 hover:text-blue-900 transition-colors">
                  +90 (532) 735 89 35
                </a>
              </li>
            </ul>
          </div>

          {/* Sosyal Medya */}
          <div>
            <h4 className="text-base font-bold text-blue-900 mb-5 uppercase tracking-wide">{t.footer.follow}</h4>
            <div className="flex flex-wrap gap-3">
              <a 
                href="https://www.linkedin.com/company/daiteknoloji" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-all duration-200 group hover:scale-110"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5 text-blue-700 group-hover:text-blue-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="https://twitter.com/daiteknoloji" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-all duration-200 group hover:scale-110"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5 text-blue-700 group-hover:text-blue-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a 
                href="https://www.facebook.com/daiteknoloji" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-all duration-200 group hover:scale-110"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 text-blue-700 group-hover:text-blue-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/daiteknoloji" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg flex items-center justify-center transition-all duration-200 group hover:scale-110"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://www.tiktok.com/@daiteknoloji" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-900 hover:bg-gray-800 rounded-lg flex items-center justify-center transition-all duration-200 group hover:scale-110"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Alt Kısım - Copyright */}
        <div className="mt-10 pt-8 border-t border-blue-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-blue-700 mb-4 md:mb-0">
              {t.footer.copyright}
            </p>
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <span>Made with</span>
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>by DAI Teknoloji</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer


