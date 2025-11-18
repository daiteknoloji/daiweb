import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Admin from './pages/Admin'
import { getContent } from './services/api'

function App() {
  const [logoPath, setLogoPath] = useState('/svglogo.png')

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const content = await getContent()
        if (content?.settings?.logo) {
          setLogoPath(content.settings.logo)
        }
      } catch (error) {
        console.error('Logo yüklenirken hata:', error)
      }
    }
    loadLogo()
  }, [])

  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={
            <>
              <Navbar logoPath={logoPath} />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<Home />} />
              </Routes>
              <Footer />
            </>
          } />
        </Routes>
      </Router>
    </LanguageProvider>
  )
}

export default App

