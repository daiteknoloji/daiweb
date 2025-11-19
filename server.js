import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import session from 'express-session'
import pool from './db.js'
import * as dbHelpers from './db-helpers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// PostgreSQL kullanılıyor mu kontrol et
const USE_POSTGRES = !!process.env.DATABASE_URL || !!process.env.POSTGRES_URL

// CORS Middleware - Session'dan önce
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',') 
  : ['http://localhost:5173', 'http://localhost:3000']

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('CORS policy violation'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Session middleware
app.use(session({
  secret: 'dai-teknoloji-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 saat
  }
}))

// Body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// İçerik dosyası yolu (fallback için)
const contentFilePath = path.join(__dirname, 'content.json')

// Varsayılan içerik yapısı (fallback için)
const defaultContent = {
  sections: [
    {
      id: 'uygulama',
      title: 'Akıllı Uygulama Geliştirme',
      description: 'Modern teknolojiler ve yapay zeka destekli çözümlerle hızlı, ölçeklenebilir ve kullanıcı odaklı uygulamalar geliştiriyoruz. AI hızı ve modern çerçevelerle işletmenizin dijital dönüşümünü hızlandırıyoruz.',
      items: [
        {
          id: 'uygulama-fullstack',
          title: 'Hızlandırılmış Full Stack Geliştirme',
          shortText: 'AI destekli geliştirme araçları ve modern çerçevelerle frontend, backend ve veritabanı geliştirmelerini tek bir ekip altında hızlıca tamamlıyoruz. React, Next.js, Node.js, Python gibi güncel teknolojilerle enterprise-grade çözümler üretiyoruz. Full stack geliştirme yaklaşımımız sayesinde tutarlı teknoloji yığını, hızlı geliştirme süreçleri ve sorunsuz entegrasyonlar sağlıyoruz.',
          expandedText: 'AI destekli kod üretimi ile geliştirme süresini %60\'a kadar kısaltıyoruz. Performans ve güvenlik odaklı teknolojiler kullanarak ölçeklenebilir, güvenli ve yüksek performanslı sistemler kuruyoruz. Kullanıcı deneyimi ön plandadır - modern tasarım prensipleri, responsive yaklaşımlar ve erişilebilirlik standartları ile her platformda mükemmel kullanıcı deneyimi sunuyoruz. Backend geliştirmede RESTful API\'ler, GraphQL endpoint\'leri ve mikroservis mimarileri kullanıyoruz. Veritabanı optimizasyonu, caching stratejileri ve load balancing ile yüksek performanslı sistemler kuruyoruz. Frontend\'de modern JavaScript framework\'leri, component-based mimariler ve state management çözümleri ile ölçeklenebilir uygulamalar geliştiriyoruz. CI/CD pipeline\'ları, automated testing ve code review süreçleri ile kalite garantisi sunuyoruz. Güvenlik standartları, veri koruma ve compliance gereksinimlerini karşılayan sistemler tasarlıyoruz.'
        },
        {
          id: 'uygulama-api',
          title: 'API Geliştirme ve Mikroservisler',
          shortText: 'RESTful API\'ler, GraphQL endpoint\'leri ve mikroservis mimarileri ile ölçeklenebilir, entegre edilebilir ve yüksek performanslı backend sistemleri geliştiriyoruz. Mikroservis mimarisi ile sisteminizi bağımsız, ölçeklenebilir ve bakımı kolay modüllere ayırıyoruz.',
          expandedText: 'Her servis kendi veritabanına sahip olabilir ve bağımsız olarak deploy edilebilir. API gateway, service discovery, load balancing ve container teknolojileri ile enterprise-grade bir altyapı kuruyoruz. Entegrasyon odaklı yaklaşımımız sayesinde mevcut sistemlerinizle sorunsuz çalışan, ölçeklenebilir ve güvenli API\'ler geliştiriyoruz. RESTful API tasarım prensipleri, versioning stratejileri ve documentation standartları ile geliştirici dostu API\'ler oluşturuyoruz. GraphQL ile esnek veri sorgulama, real-time subscriptions ve optimized data fetching sağlıyoruz. Authentication ve authorization mekanizmaları, rate limiting ve API security best practices ile güvenli API\'ler tasarlıyoruz. Microservices communication patterns, event-driven architectures ve distributed systems ile ölçeklenebilir sistemler kuruyoruz. Container orchestration, service mesh ve monitoring çözümleri ile production-ready altyapılar oluşturuyoruz. API testing, contract testing ve integration testing ile kalite garantisi sunuyoruz.'
        },
      ]
    },
    {
      id: 'otomasyon',
      title: 'Uçtan Uca İş Akışı Otomasyonu',
      description: 'Hiperotomasyon çözümleriyle işletmenizin tüm operasyonel süreçlerini otomatikleştiriyoruz. Yapay zeka ve RPA teknolojileriyle verimliliği maksimuma çıkarıyoruz.',
      items: [
        {
          id: 'otomasyon-entegrasyon',
          title: 'Sistem ve Veri Entegrasyonu (SaaS & Legacy)',
          shortText: 'SaaS uygulamaları ve legacy sistemlerinizi birbirine bağlayarak kesintisiz veri akışı sağlıyoruz. CRM, ERP, muhasebe ve diğer kurumsal sistemlerinizi entegre ediyoruz. Hiperotomasyon yaklaşımıyla sistemleriniz arasında gerçek zamanlı veri senkronizasyonu kuruyoruz.',
          expandedText: 'API entegrasyonları, webhook\'lar ve middleware çözümleriyle farklı sistemleri tek bir ekosistemde birleştiriyoruz. Veri akışı tamamen otomatik ve güvenli şekilde yönetilir. Legacy sistemlerinizi modern API\'lere dönüştürerek dijital dönüşümünüzü hızlandırıyoruz. Veri tutarlılığı, hata yönetimi ve monitoring sistemleri ile güvenilir bir entegrasyon altyapısı sunuyoruz. ETL (Extract, Transform, Load) süreçleri, veri mapping ve transformation ile farklı formatlardaki verileri uyumlu hale getiriyoruz. Real-time data synchronization, event-driven architectures ve message queue sistemleri ile anlık veri akışı sağlıyoruz. Data validation, error handling ve retry mekanizmaları ile güvenilir entegrasyonlar kuruyoruz. API gateway, service mesh ve integration platform as a service (iPaaS) çözümleri ile merkezi entegrasyon yönetimi sağlıyoruz. Legacy system modernization, API wrapper development ve data migration stratejileri ile eski sistemlerinizi modern ekosisteme entegre ediyoruz.'
        },
        {
          id: 'otomasyon-hiper',
          title: 'Hiperotomasyon Çözümleri (AI & RPA)',
          shortText: 'Yapay zeka destekli robotik süreç otomasyonu ile tekrarlayan görevleri otomatikleştiriyoruz. AI algoritmalarıyla karar verme süreçlerini de optimize ediyoruz. RPA botları ile masaüstü uygulamaları, web siteleri ve sistemler arasında otomatik iş akışları kuruyoruz.',
          expandedText: 'Yapay zeka entegrasyonu ile botlarınız öğrenir, adapte olur ve karmaşık kararlar alabilir. OCR teknolojisi ile belgeleri otomatik işliyor, doğal dil işleme ile metinleri analiz ediyoruz. Makine öğrenmesi modelleri ile tahmin yapıyor, anomali tespiti yapıyoruz. Sonuç olarak, sadece rutin işleri değil, karmaşık iş süreçlerini de otomatikleştiren akıllı bir sistem kuruyoruz. Intelligent document processing, form recognition ve data extraction ile belgelerden otomatik veri çıkarıyoruz. Natural language processing, sentiment analysis ve text classification ile metinleri anlamlandırıyoruz. Computer vision, image recognition ve object detection ile görsel içerikleri analiz ediyoruz. Predictive analytics, forecasting modelleri ve anomaly detection ile geleceği tahmin ediyoruz. Process mining, task mining ve workflow optimization ile süreçleri analiz edip optimize ediyoruz. Cognitive automation, decision automation ve intelligent routing ile akıllı karar verme sistemleri kuruyoruz.'
        },
        {
          id: 'otomasyon-crm',
          title: 'Müşteri İlişkileri Otomasyonu (CRM)',
          shortText: 'Satış ve pazarlama otomasyonu ile müşteri yolculuğunun her aşamasını otomatikleştiriyoruz. Lead yönetimi, müşteri segmentasyonu ve kampanya otomasyonu sağlıyoruz. CRM sisteminizi otomasyonlarla güçlendiriyoruz.',
          expandedText: 'Yeni lead\'ler otomatik olarak kaydedilir, segmentlere ayrılır ve uygun satış temsilcilerine atanır. E-posta kampanyaları, sosyal medya etkileşimleri ve müşteri destek talepleri otomatik yönetilir. Müşteri davranış analizi ile en uygun zamanda doğru mesajı gönderiyoruz. Satış pipeline\'ı otomasyonu, fırsat takibi ve raporlama sistemleri ile satış ekibinizin verimliliğini artırıyoruz. Müşteri memnuniyeti ve sadakat programları otomatik yönetilir. Lead scoring, lead qualification ve lead routing ile kaliteli lead\'leri otomatik olarak belirliyoruz. Customer journey mapping, touchpoint automation ve multi-channel communication ile müşteri deneyimini optimize ediyoruz. Sales pipeline automation, opportunity management ve deal tracking ile satış süreçlerini hızlandırıyoruz. Marketing automation, campaign management ve A/B testing ile pazarlama kampanyalarınızı optimize ediyoruz. Customer support automation, ticket routing ve SLA management ile müşteri desteğini otomatikleştiriyoruz. Customer retention, churn prediction ve loyalty program automation ile müşteri sadakatini artırıyoruz.'
        },
        {
          id: 'otomasyon-raporlama',
          title: 'Raporlama ve Analitik Otomasyonu',
          shortText: 'Veriye dayalı karar alma için otomatik raporlama ve analitik sistemleri kuruyoruz. Dashboard\'lar, KPI takibi ve gerçek zamanlı analizler sunuyoruz. Tüm operasyonel verilerinizi otomatik olarak toplayıp analiz ediyoruz.',
          expandedText: 'Görsel dashboard\'lar, interaktif grafikler ve detaylı raporlar ile işletmenizin performansını gerçek zamanlı takip edebilirsiniz. Yapay zeka destekli analiz motorları ile trendleri tahmin ediyor, anomali durumları tespit ediyoruz. E-posta ile otomatik rapor gönderimi, uyarı sistemleri ve performans karşılaştırmaları ile proaktif yönetim sağlıyoruz. Veri odaklı karar alma süreçlerinizi destekleyen kapsamlı bir analitik ekosistemi kuruyoruz. Data aggregation, ETL processes ve data warehouse integration ile tüm verilerinizi tek bir yerde topluyoruz. Real-time analytics, streaming analytics ve batch processing ile farklı hızlarda veri analizi yapıyoruz. Business intelligence, data visualization ve interactive dashboards ile görsel analizler sunuyoruz. Predictive analytics, machine learning models ve statistical analysis ile geleceği tahmin ediyoruz. Automated report generation, scheduled reports ve custom report builder ile ihtiyacınıza özel raporlar oluşturuyoruz. Alert systems, threshold monitoring ve anomaly detection ile kritik durumları anında bildiriyoruz.'
        }
      ]
    },
    {
      id: 'marka',
      title: 'Dijital Marka ve Etkileşim Çözümleri',
      description: 'Markanızın dijital dünyadaki varlığını güçlendiriyoruz. Kurumsal kimlik, web tasarım, e-posta pazarlama ve sosyal medya stratejileriyle marka değerinizi artırıyoruz.',
      items: [
        {
          id: 'marka-kimlik',
          title: 'Kurumsal Kimlik ve Grafik Tasarım',
          shortText: 'Marka varlığınızı güçlendiren kurumsal kimlik tasarımı ve görsel iletişim çözümleri sunuyoruz. Logo, kurumsal kimlik kılavuzu ve tüm görsel materyallerinizi tasarlıyoruz. Markanızın değerlerini yansıtan, hedef kitlenizle güçlü bağ kuran profesyonel tasarımlar üretiyoruz.',
          expandedText: 'Logo tasarımı, kurumsal renk paleti, tipografi, görsel dil ve marka kılavuzu oluşturuyoruz. Tüm dijital ve basılı materyallerinizde tutarlı bir görsel kimlik sağlıyoruz. Sosyal medya görselleri, web tasarımları, sunum şablonları ve reklam materyalleri ile markanızın dijital dünyadaki görünürlüğünü artırıyoruz. Yaratıcı konseptler, modern tasarım trendleri ve kullanıcı odaklı yaklaşımlarla etkileyici görsel çözümler sunuyoruz. Brand identity design, visual language development ve brand guidelines creation ile tutarlı bir marka görseli oluşturuyoruz. Print design, digital design ve packaging design ile tüm platformlarda profesyonel görünüm sağlıyoruz. Icon design, illustration ve infographic design ile görsel iletişimi güçlendiriyoruz. Brand asset management, design system development ve style guide creation ile marka tutarlılığını garanti ediyoruz. Creative direction, art direction ve design consultation ile markanızın görsel stratejisini belirliyoruz.'
        },
        {
          id: 'marka-mailing',
          title: 'E-posta Pazarlama (Mailing) Altyapısı',
          shortText: 'Etkileşim odaklı e-posta pazarlama kampanyaları ve otomatik müşteri iletişim sistemleri kuruyoruz. MailChimp, Brevo, HubSpot gibi platformlarla profesyonel çözümler sunuyoruz. Müşteri segmentasyonu ve kişiselleştirme ile doğru mesajı doğru müşteriye doğru zamanda iletmenizi sağlıyoruz.',
          expandedText: 'Otomatik e-posta serileri, hoş geldin kampanyaları, sipariş takip mesajları ve yeniden aktivasyon kampanyaları oluşturuyoruz. A/B testleri yaparak en etkili içerikleri belirliyor, performans metriklerini izliyoruz. E-posta açılma oranlarını yükselten tasarımlar, güçlü call-to-action metinleri ve satış odaklı kampanya akışları ile dönüşüm oranlarınızı artırıyoruz. Kampanya yönetimi, liste yönetimi ve raporlama sistemleri ile kapsamlı bir e-posta pazarlama altyapısı sunuyoruz. Email template design, responsive email development ve email deliverability optimization ile teknik mükemmellik sağlıyoruz. List segmentation, dynamic content ve personalization ile kişiselleştirilmiş kampanyalar oluşturuyoruz. Automated email sequences, trigger-based campaigns ve behavioral targeting ile doğru zamanda doğru mesajı gönderiyoruz. Email analytics, open rate optimization ve click-through rate improvement ile performansı sürekli iyileştiriyoruz. Spam filter compliance, email authentication ve reputation management ile deliverability garantisi sunuyoruz.'
        },
        {
          id: 'marka-web',
          title: 'Landing Page ve Kurumsal Web Sitesi Geliştirme',
          shortText: 'Dönüşüm odaklı web tasarımı ile landing page\'ler ve kurumsal web siteleri geliştiriyoruz. SEO optimizasyonu, hızlı yükleme ve mobil uyumluluk garantisi sunuyoruz. Kullanıcı deneyimi araştırmaları ve dönüşüm optimizasyonu ile web sitenizi ziyaretçilerinizi müşteriye dönüştürecek şekilde tasarlıyoruz.',
          expandedText: 'Modern tasarım prensipleri, responsive yaklaşımlar ve erişilebilirlik standartları ile her cihazda mükemmel deneyim sunuyoruz. SEO optimizasyonu, hızlı yükleme süreleri ve güvenlik standartları ile arama motorlarında üst sıralarda yer almanızı sağlıyoruz. CMS entegrasyonu ile içerik yönetimini kolaylaştırıyoruz. Analytics entegrasyonu, A/B testleri ve heatmap analizleri ile sürekli iyileştirme yapıyoruz. Landing page\'ler için özel tasarımlar ve dönüşüm odaklı formlar oluşturuyoruz. User experience design, user interface design ve conversion rate optimization ile kullanıcı odaklı web siteleri geliştiriyoruz. Responsive web design, mobile-first approach ve cross-browser compatibility ile her cihazda mükemmel deneyim sağlıyoruz. SEO optimization, technical SEO ve content SEO ile arama motoru görünürlüğünü artırıyoruz. Performance optimization, page speed optimization ve Core Web Vitals improvement ile hızlı yükleme garantisi sunuyoruz. Content management system integration, custom CMS development ve headless CMS solutions ile esnek içerik yönetimi sağlıyoruz.'
        },
        {
          id: 'marka-sosyal',
          title: 'Sosyal Medya ve İçerik Stratejisi Desteği',
          shortText: 'Dijital ayak izinizi güçlendiren sosyal medya stratejisi ve içerik planlaması hizmetleri sunuyoruz. Stratejik planlama, içerik üretimi ve etkileşim yönetimi sağlıyoruz. Markanızın sosyal medya varlığını profesyonel şekilde yönetiyoruz.',
          expandedText: 'İçerik stratejisi, yayın planlaması, hashtag araştırması ve topluluk yönetimi hizmetleri sunuyoruz. Görsel içerik üretimi, video prodüksiyonu ve infografik tasarımı ile etkileşim oranlarınızı artırıyoruz. Influencer işbirlikleri, reklam kampanyaları ve analitik raporlama ile sosyal medya performansınızı optimize ediyoruz. Marka sesinizi koruyarak tutarlı bir iletişim stratejisi oluşturuyoruz. Kriz yönetimi, müşteri geri bildirimleri ve topluluk etkileşimi ile marka itibarınızı güçlendiriyoruz. Social media strategy, content calendar planning ve brand voice development ile stratejik sosyal medya yönetimi sağlıyoruz. Content creation, graphic design ve video production ile etkileyici içerikler üretiyoruz. Community management, engagement optimization ve social listening ile topluluk yönetimi yapıyoruz. Influencer marketing, partnership management ve collaboration campaigns ile marka görünürlüğünü artırıyoruz. Social media advertising, paid social campaigns ve ad performance optimization ile reklam kampanyalarınızı optimize ediyoruz. Social media analytics, performance reporting ve ROI analysis ile kampanya performansını ölçüyoruz.'
        }
      ]
    }
  ],
  contact: {
    email: 'info@daiteknoloji.com',
    phone: '+90 (532) 735 89 35',
    address: 'İstanbul, Türkiye'
  },
  navbar: {
    logo: '/svglogo.png',
    links: [
      { path: '#uygulama', label: 'Akıllı Uygulama Geliştirme' },
      { path: '#otomasyon', label: 'Uçtan Uca İş Akışı Otomasyonu' },
      { path: '#marka', label: 'Dijital Marka ve Etkileşim Çözümleri' },
      { path: '#iletisim', label: 'İletişim' }
    ]
  },
  settings: {
    heroVideo: '/anavideo.mp4',
    logo: '/svglogo.png'
  },
  translations: {
    en: {
      sections: {
        appDev: {
          title: 'Smart Application Development',
          description: 'We develop fast, scalable, and user-centric applications with modern technologies and AI-powered solutions. We accelerate your business\'s digital transformation with AI speed and modern frameworks.'
        },
        automation: {
          title: 'End-to-End Workflow Automation',
          description: 'We automate all operational processes of your business with hyperautomation solutions. We maximize efficiency with artificial intelligence and RPA technologies.'
        },
        digitalBrand: {
          title: 'Digital Brand & Engagement Solutions',
          description: 'We strengthen your brand\'s presence in the digital world. We increase your brand value with corporate identity, web design, email marketing, and social media strategies.'
        }
      },
      items: {}
    }
  }
}

// İçerik dosyasını oluştur veya yükle (fallback - JSON kullanılıyorsa)
async function loadContent() {
  if (USE_POSTGRES) {
    try {
      return await dbHelpers.getAllContent()
    } catch (error) {
      console.error('PostgreSQL\'den içerik yüklenirken hata:', error)
      // Fallback to JSON
      return loadContentFromJSON()
    }
  } else {
    return loadContentFromJSON()
  }
}

function loadContentFromJSON() {
  try {
    if (fs.existsSync(contentFilePath)) {
      const data = fs.readFileSync(contentFilePath, 'utf8')
      return JSON.parse(data)
    } else {
      fs.writeFileSync(contentFilePath, JSON.stringify(defaultContent, null, 2))
      return defaultContent
    }
  } catch (error) {
    console.error('İçerik yüklenirken hata:', error)
    return defaultContent
  }
}

// İçeriği kaydet (fallback - JSON kullanılıyorsa)
function saveContent(content) {
  if (USE_POSTGRES) {
    // PostgreSQL kullanılıyorsa bu fonksiyon kullanılmaz
    return true
  } else {
    try {
      fs.writeFileSync(contentFilePath, JSON.stringify(content, null, 2))
      return true
    } catch (error) {
      console.error('İçerik kaydedilirken hata:', error)
      return false
    }
  }
}

// Tüm içeriği getir
app.get('/api/content', async (req, res) => {
  try {
    const content = await loadContent()
    res.json(content)
  } catch (error) {
    console.error('İçerik getirme hatası:', error)
    res.status(500).json({ error: 'İçerik yüklenemedi' })
  }
})

// Belirli bir section'ı getir
app.get('/api/sections/:id', async (req, res) => {
  try {
    if (USE_POSTGRES) {
      const section = await dbHelpers.getSectionById(req.params.id)
      if (section) {
        res.json(section)
      } else {
        res.status(404).json({ error: 'Section bulunamadı' })
      }
    } else {
      const content = await loadContent()
      const section = content.sections.find(s => s.id === req.params.id)
      if (section) {
        res.json(section)
      } else {
        res.status(404).json({ error: 'Section bulunamadı' })
      }
    }
  } catch (error) {
    console.error('Section getirme hatası:', error)
    res.status(500).json({ error: 'Section yüklenemedi' })
  }
})

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  
  if (username === 'admin' && password === 'admin123') {
    req.session.isAuthenticated = true
    req.session.username = username
    res.json({ success: true, message: 'Giriş başarılı' })
  } else {
    res.status(401).json({ success: false, message: 'Kullanıcı adı veya şifre hatalı' })
  }
})

// Logout endpoint
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Çıkış yapılamadı' })
    }
    res.json({ success: true, message: 'Çıkış başarılı' })
  })
})

// Check authentication
app.get('/api/auth/check', (req, res) => {
  if (req.session.isAuthenticated) {
    res.json({ authenticated: true, username: req.session.username })
  } else {
    res.json({ authenticated: false })
  }
})

// Middleware: Protected routes
const requireAuth = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next()
  } else {
    res.status(401).json({ error: 'Yetkisiz erişim. Lütfen giriş yapın.' })
  }
}

// Protected routes - sadece admin erişebilir
app.put('/api/sections/:id', requireAuth, async (req, res) => {
  try {
    if (USE_POSTGRES) {
      const updated = await dbHelpers.updateSection(req.params.id, req.body)
      if (updated) {
        res.json(updated)
      } else {
        res.status(404).json({ error: 'Section bulunamadı' })
      }
    } else {
      const content = await loadContent()
      const index = content.sections.findIndex(s => s.id === req.params.id)
      
      if (index !== -1) {
        content.sections[index] = { ...content.sections[index], ...req.body }
        if (saveContent(content)) {
          res.json(content.sections[index])
        } else {
          res.status(500).json({ error: 'İçerik kaydedilemedi' })
        }
      } else {
        res.status(404).json({ error: 'Section bulunamadı' })
      }
    }
  } catch (error) {
    console.error('Section güncelleme hatası:', error)
    res.status(500).json({ error: 'Section güncellenemedi' })
  }
})

app.put('/api/sections/:sectionId/items/:itemId', requireAuth, async (req, res) => {
  try {
    if (USE_POSTGRES) {
      const updated = await dbHelpers.updateItem(
        req.params.sectionId,
        req.params.itemId,
        {
          title: req.body.title,
          shortText: req.body.shortText,
          expandedText: req.body.expandedText
        }
      )
      if (updated) {
        res.json(updated)
      } else {
        res.status(404).json({ error: 'Item bulunamadı' })
      }
    } else {
      const content = await loadContent()
      const section = content.sections.find(s => s.id === req.params.sectionId)
      
      if (section) {
        const itemIndex = section.items.findIndex(i => i.id === req.params.itemId)
        if (itemIndex !== -1) {
          section.items[itemIndex] = { ...section.items[itemIndex], ...req.body }
          if (saveContent(content)) {
            res.json(section.items[itemIndex])
          } else {
            res.status(500).json({ error: 'İçerik kaydedilemedi' })
          }
        } else {
          res.status(404).json({ error: 'Item bulunamadı' })
        }
      } else {
        res.status(404).json({ error: 'Section bulunamadı' })
      }
    }
  } catch (error) {
    console.error('Item güncelleme hatası:', error)
    res.status(500).json({ error: 'Item güncellenemedi' })
  }
})

app.put('/api/navbar', requireAuth, async (req, res) => {
  try {
    if (USE_POSTGRES) {
      const updated = await dbHelpers.updateNavbar(req.body)
      res.json(updated)
    } else {
      const content = await loadContent()
      content.navbar = { ...content.navbar, ...req.body }
      if (saveContent(content)) {
        res.json(content.navbar)
      } else {
        res.status(500).json({ error: 'İçerik kaydedilemedi' })
      }
    }
  } catch (error) {
    console.error('Navbar güncelleme hatası:', error)
    res.status(500).json({ error: 'Navbar güncellenemedi' })
  }
})

app.put('/api/contact', requireAuth, async (req, res) => {
  try {
    if (USE_POSTGRES) {
      const updated = await dbHelpers.updateContact(req.body)
      res.json({
        email: updated.email,
        phone: updated.phone,
        address: updated.address
      })
    } else {
      const content = await loadContent()
      content.contact = { ...content.contact, ...req.body }
      if (saveContent(content)) {
        res.json(content.contact)
      } else {
        res.status(500).json({ error: 'İçerik kaydedilemedi' })
      }
    }
  } catch (error) {
    console.error('Contact güncelleme hatası:', error)
    res.status(500).json({ error: 'Contact güncellenemedi' })
  }
})

// Logo güncelleme
app.put('/api/settings/logo', requireAuth, async (req, res) => {
  try {
    if (USE_POSTGRES) {
      const logo = await dbHelpers.setSetting('logo', req.body.logo || '/svglogo.png')
      res.json({ logo })
    } else {
      const content = await loadContent()
      if (!content.settings) content.settings = {}
      content.settings.logo = req.body.logo || '/svglogo.png'
      if (saveContent(content)) {
        res.json({ logo: content.settings.logo })
      } else {
        res.status(500).json({ error: 'Logo kaydedilemedi' })
      }
    }
  } catch (error) {
    console.error('Logo güncelleme hatası:', error)
    res.status(500).json({ error: 'Logo güncellenemedi' })
  }
})

// Video güncelleme
app.put('/api/settings/video', requireAuth, async (req, res) => {
  try {
    if (USE_POSTGRES) {
      const video = await dbHelpers.setSetting('heroVideo', req.body.video || '/anavideo.mp4')
      res.json({ video })
    } else {
      const content = await loadContent()
      if (!content.settings) content.settings = {}
      content.settings.heroVideo = req.body.video || '/anavideo.mp4'
      if (saveContent(content)) {
        res.json({ video: content.settings.heroVideo })
      } else {
        res.status(500).json({ error: 'Video kaydedilemedi' })
      }
    }
  } catch (error) {
    console.error('Video güncelleme hatası:', error)
    res.status(500).json({ error: 'Video güncellenemedi' })
  }
})

// İngilizce çevirileri güncelleme
app.put('/api/translations/:itemId', requireAuth, async (req, res) => {
  try {
    if (USE_POSTGRES) {
      await dbHelpers.setTranslation(req.params.itemId, 'en', 'title', req.body.title || '')
      await dbHelpers.setTranslation(req.params.itemId, 'en', 'shortText', req.body.shortText || '')
      await dbHelpers.setTranslation(req.params.itemId, 'en', 'expandedText', req.body.expandedText || '')
      
      res.json({
        title: await dbHelpers.getTranslation(req.params.itemId, 'en', 'title'),
        shortText: await dbHelpers.getTranslation(req.params.itemId, 'en', 'shortText'),
        expandedText: await dbHelpers.getTranslation(req.params.itemId, 'en', 'expandedText')
      })
    } else {
      const content = await loadContent()
      if (!content.translations) content.translations = { en: { items: {} } }
      if (!content.translations.en) content.translations.en = { items: {} }
      if (!content.translations.en.items) content.translations.en.items = {}
      
      content.translations.en.items[req.params.itemId] = {
        title: req.body.title || '',
        shortText: req.body.shortText || '',
        expandedText: req.body.expandedText || ''
      }
      
      if (saveContent(content)) {
        res.json(content.translations.en.items[req.params.itemId])
      } else {
        res.status(500).json({ error: 'Çeviri kaydedilemedi' })
      }
    }
  } catch (error) {
    console.error('Translation güncelleme hatası:', error)
    res.status(500).json({ error: 'Çeviri güncellenemedi' })
  }
})

// Section çevirileri güncelleme
app.put('/api/translations/sections/:sectionId', requireAuth, async (req, res) => {
  try {
    if (USE_POSTGRES) {
      await dbHelpers.setTranslation(req.params.sectionId, 'en', 'title', req.body.title || '')
      await dbHelpers.setTranslation(req.params.sectionId, 'en', 'description', req.body.description || '')
      
      res.json({
        title: await dbHelpers.getTranslation(req.params.sectionId, 'en', 'title'),
        description: await dbHelpers.getTranslation(req.params.sectionId, 'en', 'description')
      })
    } else {
      const content = await loadContent()
      if (!content.translations) content.translations = { en: { sections: {} } }
      if (!content.translations.en) content.translations.en = { sections: {} }
      if (!content.translations.en.sections) content.translations.en.sections = {}
      
      content.translations.en.sections[req.params.sectionId] = {
        title: req.body.title || '',
        description: req.body.description || ''
      }
      
      if (saveContent(content)) {
        res.json(content.translations.en.sections[req.params.sectionId])
      } else {
        res.status(500).json({ error: 'Çeviri kaydedilemedi' })
      }
    }
  } catch (error) {
    console.error('Section translation güncelleme hatası:', error)
    res.status(500).json({ error: 'Çeviri güncellenemedi' })
  }
})

app.put('/api/sections/:id/title', requireAuth, async (req, res) => {
  try {
    if (USE_POSTGRES) {
      const updated = await dbHelpers.updateSectionTitle(req.params.id, req.body.title)
      if (updated) {
        res.json({ title: updated.title })
      } else {
        res.status(404).json({ error: 'Section bulunamadı' })
      }
    } else {
      const content = await loadContent()
      const section = content.sections.find(s => s.id === req.params.id)
      
      if (section) {
        section.title = req.body.title
        if (saveContent(content)) {
          res.json({ title: section.title })
        } else {
          res.status(500).json({ error: 'İçerik kaydedilemedi' })
        }
      } else {
        res.status(404).json({ error: 'Section bulunamadı' })
      }
    }
  } catch (error) {
    console.error('Section title güncelleme hatası:', error)
    res.status(500).json({ error: 'Section title güncellenemedi' })
  }
})

// Açılış mesajı
app.get('/', (req, res) => {
  res.json({ 
    message: 'DAI Teknoloji Backend API',
    endpoints: {
      'POST /api/login': 'Admin girişi',
      'POST /api/logout': 'Çıkış',
      'GET /api/auth/check': 'Oturum kontrolü',
      'GET /api/content': 'Tüm içeriği getir',
      'GET /api/sections/:id': 'Belirli bir section getir',
      'PUT /api/sections/:id': 'Section güncelle (Admin)',
      'PUT /api/sections/:id/title': 'Section başlığını güncelle (Admin)',
      'PUT /api/sections/:sectionId/items/:itemId': 'Section item güncelle (Admin)',
      'PUT /api/navbar': 'Navbar güncelle (Admin)',
      'PUT /api/contact': 'İletişim bilgilerini güncelle (Admin)'
    }
  })
})

// Server başlatma
async function startServer() {
  // PostgreSQL kullanılıyorsa bağlantıyı test et
  if (USE_POSTGRES) {
    try {
      await pool.query('SELECT NOW()')
      console.log('✅ PostgreSQL bağlantısı başarılı')
      
      // Eğer tablolar yoksa migration çalıştır
      const tableCheck = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'sections'
        )
      `)
      
      if (!tableCheck.rows[0].exists) {
        console.log('⚠️  Tablolar bulunamadı. Migration çalıştırılıyor...')
        const migrateModule = await import('./migrations/migrate.js')
        // Migration script'i çalıştırıldıktan sonra JSON'dan veri aktar
        const content = loadContentFromJSON()
        await dbHelpers.importFromJSON(content)
        console.log('✅ Veriler PostgreSQL\'e aktarıldı')
      } else {
        // Tablolar var, içerik kontrolü yap
        const sectionCount = await pool.query('SELECT COUNT(*) FROM sections')
        if (sectionCount.rows[0].count === '0') {
          console.log('⚠️  Tablolar var ama içerik yok. JSON\'dan veri aktarılıyor...')
          const content = loadContentFromJSON()
          await dbHelpers.importFromJSON(content)
          console.log('✅ Veriler PostgreSQL\'e aktarıldı')
        }
      }
    } catch (error) {
      console.error('❌ PostgreSQL bağlantı hatası:', error.message)
      console.log('⚠️  JSON fallback moduna geçiliyor...')
    }
  } else {
    console.log('📝 JSON dosyası kullanılıyor:', contentFilePath)
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 Backend server çalışıyor: http://localhost:${PORT}`)
    console.log(`💾 Veritabanı: ${USE_POSTGRES ? 'PostgreSQL' : 'JSON'}`)
  })
}

startServer()

