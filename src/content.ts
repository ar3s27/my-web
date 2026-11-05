// All site copy lives here (Turkish + English).

export type Lang = 'tr' | 'en';
export type L = { tr: string; en: string };
export type LList = { tr: string[]; en: string[] };

export const profile = {
  first: 'Muhammed',
  middle: 'Veysel',
  last: 'Erkoyuncu',
  role: { tr: 'Yapay Zekâ & Veri Bilimci', en: 'AI & Data Scientist' } as L,
  location: 'Siirt, TR',
  coords: '37.93°N — 41.94°E',
};

export const socials = [
  { label: 'LinkedIn', handle: 'veysel-erkoyuncu', href: 'https://www.linkedin.com/in/veysel-erkoyuncu/' },
  { label: 'GitHub', handle: '@ar3s27', href: 'https://github.com/ar3s27' },
  { label: 'X', handle: '@VeyselErkoyunc3', href: 'https://x.com/VeyselErkoyunc3' },
  { label: 'Instagram', handle: '@veyselares27', href: 'https://instagram.com/veyselares27' },
];

export const ui = {
  meta: {
    title: {
      tr: 'Muhammed Veysel Erkoyuncu — Yapay Zekâ & Veri Bilimci',
      en: 'Muhammed Veysel Erkoyuncu — AI & Data Scientist',
    } as L,
  },
  nav: {
    about: { tr: 'Hakkımda', en: 'About' } as L,
    services: { tr: 'Uzmanlık', en: 'Expertise' } as L,
    skills: { tr: 'Yetenekler', en: 'Skills' } as L,
    projects: { tr: 'Projeler', en: 'Work' } as L,
    contact: { tr: 'İletişim', en: 'Contact' } as L,
    cta: { tr: 'Bana ulaş', en: 'Get in touch' } as L,
    menu: { tr: 'Menü', en: 'Menu' } as L,
    close: { tr: 'Kapat', en: 'Close' } as L,
  },
  loader: { tr: 'Nöronlar ısınıyor', en: 'Warming up the neurons' } as L,
  hero: {
    intro: {
      tr: 'Veriden anlam çıkaran, öğrenen sistemler kuruyorum — ve onları gerçek hayatta çalışan ürünlere dönüştürüyorum.',
      en: 'I build systems that learn from data — and turn them into products that run in the real world.',
    } as L,
    ctaWork: { tr: 'Projelerimi incele', en: 'See my work' } as L,
    ctaContact: { tr: 'İletişime geç', en: 'Get in touch' } as L,
    scroll: { tr: 'Kaydır', en: 'Scroll' } as L,
  },
  about: {
    label: { tr: 'Hakkımda', en: 'About' } as L,
    body: {
      tr: "Ben Muhammed Veysel. Veriden anlam çıkaran, öğrenen sistemler kuran ve bunları gerçek hayatta çalışan ürünlere dönüştüren bir yapay zekâ ve veri bilimciyim. Makine öğrenmesi modellerinden harita tabanlı veri görselleştirmeye, kurum içi araçlardan kendi sunucumda çalışan servislere kadar fikirden canlıya her adımı üstlenmeyi seviyorum.",
      en: "I'm Muhammed Veysel — an AI & data scientist who builds systems that learn from data and turns them into products that run in the real world. From machine learning models to map-based data visualization, from internal tools to services running on my own server, I love owning every step from idea to production.",
    } as L,
    stats: [
      { value: 25, label: { tr: "GitHub'da açık kaynak depo", en: 'open-source repos on GitHub' } as L },
      { value: 37, label: { tr: 'araçlı, kendi sunucusunda çalışan PDF platformu', en: 'tools in a self-hosted PDF platform' } as L },
      { value: 3, label: { tr: 'kendi sunucumda yayında olan canlı servis', en: 'live services running on my own server' } as L },
    ],
  },
  services: {
    label: { tr: 'Uzmanlık', en: 'Expertise' } as L,
    title: { tr: 'Neler yapıyorum', en: 'What I do' } as L,
    items: [
      {
        title: { tr: 'Makine Öğrenmesi & Derin Öğrenme', en: 'Machine & Deep Learning' } as L,
        text: {
          tr: 'Sınıflandırma, zaman serisi tahmini, doğal dil işleme ve görüntü işleme için modeller tasarlıyor, eğitiyor ve değerlendiriyorum.',
          en: 'I design, train and evaluate models for classification, time-series forecasting, NLP and computer vision.',
        } as L,
        tags: ['PyTorch', 'TensorFlow', 'NLP', 'Computer Vision'],
      },
      {
        title: { tr: 'Veri Analizi & Görselleştirme', en: 'Data Analysis & Visualization' } as L,
        text: {
          tr: 'Ham veriyi temizleyip keşfediyor; harita tabanlı (GIS) görselleştirmeler ve etkileşimli arayüzlerle anlaşılır hale getiriyorum.',
          en: 'I clean and explore raw data, then make it readable with map-based (GIS) visualizations and interactive interfaces.',
        } as L,
        tags: ['SQL', 'PostGIS', 'Leaflet', 'Jupyter'],
      },
      {
        title: { tr: 'Uçtan Uca Uygulamalar', en: 'End-to-end Products' } as L,
        text: {
          tr: "Python backend'lerinden web ve masaüstü arayüzlerine kadar bir fikri baştan sona çalışan bir ürüne dönüştürüyorum.",
          en: 'From Python backends to web and desktop interfaces, I turn an idea into a product that works end to end.',
        } as L,
        tags: ['FastAPI', 'Flask', 'PyQt6', 'React'],
      },
      {
        title: { tr: 'Self-hosting & DevOps', en: 'Self-hosting & DevOps' } as L,
        text: {
          tr: 'Uygulamalarımı Docker ile paketleyip kendi sunucumda yayınlıyorum — Cloudflare Tunnel ve şifreli otomatik yedekleme dahil.',
          en: 'I package my apps with Docker and run them on my own server — Cloudflare Tunnel and encrypted automatic backups included.',
        } as L,
        tags: ['Docker', 'Linux', 'Cloudflare', 'Git'],
      },
    ],
  },
  skills: {
    label: { tr: 'Yetenekler', en: 'Skills' } as L,
    title: { tr: 'Araç kutum', en: 'My toolbox' } as L,
    groups: [
      { title: { tr: 'Yapay Zekâ', en: 'AI' } as L, items: ['Python', 'PyTorch', 'TensorFlow', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Gemini API'] },
      { title: { tr: 'Veri', en: 'Data' } as L, items: ['SQL', 'Data Visualization', 'PostGIS', 'Folium / Leaflet', 'Jupyter', 'Web Scraping'] },
      { title: { tr: 'Geliştirme', en: 'Development' } as L, items: ['FastAPI', 'Flask', 'PyQt6', 'TypeScript', 'React', 'Next.js', 'C#'] },
      { title: { tr: 'Altyapı', en: 'Infrastructure' } as L, items: ['Docker', 'Linux', 'Git', 'AWS', 'Cloudflare'] },
    ],
  },
  projects: {
    label: { tr: 'Projeler', en: 'Work' } as L,
    title: { tr: 'Seçili işler', en: 'Selected work' } as L,
    intro: {
      tr: 'Kurum içi platformlardan veri görselleştirmeye ve yapay zekâ servislerine kadar son dönemde geliştirdiğim projeler.',
      en: 'Recent projects — from internal platforms to data visualization and AI services.',
    } as L,
    hint: { tr: 'Kaydırmaya devam et', en: 'Keep scrolling' } as L,
    details: { tr: 'Detaylar', en: 'Details' } as L,
    highlights: { tr: 'Öne çıkanlar', en: 'Highlights' } as L,
    stack: { tr: 'Teknolojiler', en: 'Stack' } as L,
    links: { tr: 'Bağlantılar', en: 'Links' } as L,
    role: { tr: 'Rol', en: 'Role' } as L,
    year: { tr: 'Yıl', en: 'Year' } as L,
    privateNote: {
      tr: 'Kurum içi proje — kaynak kodu ve canlı sürümü herkese açık değil.',
      en: 'Internal project — source code and live version are not public.',
    } as L,
    close: { tr: 'Kapat', en: 'Close' } as L,
    next: { tr: 'Sonraki proje', en: 'Next project' } as L,
  },
  contact: {
    label: { tr: 'İletişim', en: 'Contact' } as L,
    title1: { tr: 'Bir fikrin mi var?', en: 'Got an idea?' } as L,
    title2: { tr: 'Hadi konuşalım.', en: "Let's talk." } as L,
    text: {
      tr: 'Yapay zekâ, veri ya da uçtan uca bir ürün… Birlikte çalışmak ya da sadece merhaba demek için hesaplarımdan bana ulaşabilirsin.',
      en: 'AI, data or an end-to-end product… Reach out on any of my accounts to work together — or just to say hi.',
    } as L,
    button: { tr: "LinkedIn'den yaz", en: 'Message me' } as L,
    localTime: { tr: 'Siirt yerel saat', en: 'Local time in Siirt' } as L,
    top: { tr: 'Başa dön', en: 'Back to top' } as L,
    rights: { tr: 'Tüm hakları saklıdır.', en: 'All rights reserved.' } as L,
  },
};

export interface Project {
  id: string;
  year: string;
  title: L;
  summary: L;
  description: L;
  role: L;
  highlights: LList;
  tags: string[];
  links: { label: L; href: string }[];
  hues: [string, string];
  isPrivate?: boolean;
}

export const projects: Project[] = [
  {
    id: 'ilovetcdd',
    year: '2026',
    title: { tr: 'iLoveTCDD', en: 'iLoveTCDD' },
    summary: {
      tr: 'Kendi sunucusunda çalışan, 37 araçlı ve gizlilik odaklı PDF platformu.',
      en: 'A privacy-first, self-hosted PDF platform with 37 tools.',
    },
    description: {
      tr: "Kurum içinde kullanılmak üzere tasarladığım, tamamen kendi sunucusunda çalışan bir PDF araç sitesi. Belgeler hiçbir bulut servisine gönderilmez: yalnızca bellekte işlenir, indirilir ve kısa süre içinde kalıcı olarak silinir. Bir aracın çıktısı tek tıkla diğerine aktarılabilir — örneğin birleştir → sıkıştır → parolayla koru.",
      en: "A PDF toolkit I designed for internal use that runs entirely on its own server. Documents never go to a cloud service: they are processed in memory only, downloaded and permanently deleted shortly after. Any tool's output can be chained into the next one — e.g. merge → compress → password-protect.",
    },
    role: { tr: 'Tasarım & geliştirme', en: 'Design & development' },
    highlights: {
      tr: [
        '37 araç: birleştir, böl, sıkıştır, OCR, imzala, karart, dönüştür…',
        'Yapay zekâ ile özetleme ve çeviri',
        'Dış bağlantı yok: LibreOffice, Ghostscript, Tesseract ve Chromium Docker imajının içinde',
        'Dosyalar tmpfs üzerinde tutulur; diske hiç yazılmaz ve otomatik silinir',
      ],
      en: [
        '37 tools: merge, split, compress, OCR, sign, redact, convert…',
        'AI-powered summarizing and translation',
        'No outbound calls: LibreOffice, Ghostscript, Tesseract and Chromium ship inside the Docker image',
        'Files live on tmpfs — never written to disk and deleted automatically',
      ],
    },
    tags: ['Python', 'Uvicorn', 'Docker', 'Tesseract OCR', 'LibreOffice', 'AI'],
    links: [],
    hues: ['#5eead4', '#3b82f6'],
    isPrivate: true,
  },
  {
    id: 'tcdd-signal',
    year: '2026',
    title: { tr: 'TCDD Sinyalizasyon & Envanter', en: 'TCDD Signalization & Inventory' },
    summary: {
      tr: 'Demiryolu saha operasyonlarını ve sinyalizasyon envanterini dijitalleştiren uçtan uca sistem.',
      en: 'An end-to-end system that digitizes railway field operations and signalization inventory.',
    },
    description: {
      tr: 'TCDD saha operasyonlarını, sinyalizasyon altyapısını ve demiryolu hat yönetimini dijitalleştirmek için mimarisini uçtan uca kurgulayıp geliştirdiğim envanter ve kontrol sistemi. Saha verisi harita motoru üzerinde konumuyla birlikte görselleştirilir.',
      en: 'An inventory and control system I architected and built end to end to digitize TCDD (Turkish State Railways) field operations, signalization infrastructure and line management. Field data is visualized on a map engine together with its location.',
    },
    role: { tr: 'Proje mimarı & geliştirici', en: 'Lead architect & developer' },
    highlights: {
      tr: [
        'Uçtan uca mimari: veri modeli, arayüz ve harita katmanı',
        'PyQt6 ile masaüstü arayüzü',
        'Folium / Leaflet ile GIS harita motoru',
        'PostGIS veritabanıyla kendi sunucumda çalışan web sürümü',
      ],
      en: [
        'End-to-end architecture: data model, interface and map layer',
        'Desktop interface built with PyQt6',
        'GIS map engine with Folium / Leaflet',
        'Web version running on my own server with a PostGIS database',
      ],
    },
    tags: ['Python', 'PyQt6', 'Folium', 'Leaflet', 'PostGIS', 'SQLite'],
    links: [],
    hues: ['#f472b6', '#f59e0b'],
    isPrivate: true,
  },
  {
    id: 'finsight',
    year: '2025',
    title: { tr: 'FinSightAI', en: 'FinSightAI' },
    summary: {
      tr: 'Hisse fiyatlarını zaman serileri ve finans haberleriyle tahmin etmeyi hedefleyen YZ servisi.',
      en: 'An AI service that aims to forecast stock prices from time series and financial news.',
    },
    description: {
      tr: 'Borsa hisse fiyatlarını zaman serisi yöntemleriyle analiz eden ve finans haberlerini kullanarak gelecekteki fiyatları tahmin etmeyi amaçlayan yapay zekâ tabanlı bir uygulama arayüzü. Amaç, yatırımcılara stratejik kararlarında yol gösterecek öngörüler sunmak.',
      en: 'An AI-based application that analyzes stock prices with time-series methods and aims to forecast future prices using financial news. The goal is to give investors forward-looking insights for strategic decisions.',
    },
    role: { tr: 'Veri bilimi & arayüz', en: 'Data science & interface' },
    highlights: {
      tr: ['Zaman serisi analizi', 'Finans haberlerinden sinyal çıkarımı (NLP)', 'Jupyter tabanlı deneyler', 'Tanıtım arayüzü'],
      en: ['Time-series analysis', 'Signals extracted from financial news (NLP)', 'Experiments in Jupyter', 'Product landing interface'],
    },
    tags: ['Python', 'Time Series', 'NLP', 'Jupyter'],
    links: [{ label: { tr: 'GitHub', en: 'GitHub' }, href: 'https://github.com/ar3s27/FinSightAIHtml' }],
    hues: ['#a78bfa', '#22d3ee'],
  },
  {
    id: 'yemekai',
    year: '2025',
    title: { tr: 'YemekAI', en: 'YemekAI' },
    summary: {
      tr: 'Google Gemini destekli, kişiye özel yemek önerileri sunan web uygulaması.',
      en: 'A Google Gemini–powered web app that suggests meals tailored to you.',
    },
    description: {
      tr: 'Kullanıcı hesapları olan ve Google Gemini API ile kişiye özel yemek önerileri üreten bir Flask web uygulaması. Veriler SQLAlchemy ile saklanır, formlar Flask-WTF ile doğrulanır.',
      en: 'A Flask web app with user accounts that generates personalized meal suggestions with the Google Gemini API. Data is stored with SQLAlchemy and forms are validated with Flask-WTF.',
    },
    role: { tr: 'Full-stack geliştirme', en: 'Full-stack development' },
    highlights: {
      tr: ['Gemini API ile üretken öneriler', 'Kullanıcı girişi (Flask-Login)', 'SQLAlchemy veri modeli ve migrasyonlar'],
      en: ['Generative suggestions with the Gemini API', 'User sign-in (Flask-Login)', 'SQLAlchemy data model and migrations'],
    },
    tags: ['Python', 'Flask', 'Gemini API', 'SQLAlchemy'],
    links: [{ label: { tr: 'GitHub', en: 'GitHub' }, href: 'https://github.com/ar3s27/yemekAi' }],
    hues: ['#fb7185', '#a3e635'],
  },
  {
    id: 'deprem',
    year: '2024',
    title: { tr: 'Deprem Görselleştirme', en: 'Earthquake Visualization' },
    summary: {
      tr: 'AFAD deprem verilerini harita ve tablo üzerinde canlı gösteren uygulamalar.',
      en: 'Apps that show live AFAD earthquake data on a map and table.',
    },
    description: {
      tr: "AFAD'ın yayımladığı son deprem verilerini FastAPI ile yazdığım bir backend üzerinden çekip işleyen ve harita ile tablo üzerinde gösteren uygulama. OpenStreetMap tabanlı ikinci bir sürümü de bulunuyor.",
      en: 'An app that fetches and processes the latest earthquake data published by AFAD through a FastAPI backend I wrote, and shows it on a map and in a table. There is also a second, OpenStreetMap-based version.',
    },
    role: { tr: 'Backend & görselleştirme', en: 'Backend & visualization' },
    highlights: {
      tr: ['AFAD verisinin FastAPI ile toplanıp işlenmesi', 'Harita ve tablo görünümü', 'OpenStreetMap tabanlı ikinci sürüm', "Vercel'de canlı"],
      en: ['AFAD data collected and processed with FastAPI', 'Map and table views', 'Second, OpenStreetMap-based version', 'Live on Vercel'],
    },
    tags: ['Python', 'FastAPI', 'JavaScript', 'OpenStreetMap'],
    links: [
      { label: { tr: 'Canlı demo', en: 'Live demo' }, href: 'https://deprem-gorsellestirme.vercel.app' },
      { label: { tr: 'OSM sürümü', en: 'OSM version' }, href: 'https://deprem-tahmini.vercel.app' },
      { label: { tr: 'GitHub', en: 'GitHub' }, href: 'https://github.com/ar3s27/depremGorsellestirme' },
    ],
    hues: ['#f97316', '#ef4444'],
  },
  {
    id: 'mesafe',
    year: '2024',
    title: { tr: 'İlçeden İlçeye Mesafe API', en: 'District Distance API' },
    summary: {
      tr: 'İl ve ilçe adlarıyla iki nokta arasındaki mesafeyi hesaplayan API.',
      en: 'An API that returns the distance between two Turkish districts.',
    },
    description: {
      tr: 'İl ve ilçe adları girilerek aralarındaki mesafeyi kullanıcıya bildiren bir API. Basit bir istekle iki ilçe arasındaki uzaklığı döndürür ve Vercel üzerinde yayında.',
      en: 'An API that tells you the distance between two districts when you enter their province and district names. A single request returns the distance, and it is live on Vercel.',
    },
    role: { tr: 'Geliştirme', en: 'Development' },
    highlights: {
      tr: ['İl / ilçe adına göre sorgu', 'Mesafe hesabı tek istekte', "Vercel'de canlı"],
      en: ['Query by province / district name', 'Distance in a single request', 'Live on Vercel'],
    },
    tags: ['Python', 'REST API', 'Vercel'],
    links: [
      { label: { tr: 'Canlı API', en: 'Live API' }, href: 'https://ilceden-ilceye-mesafe.vercel.app' },
      { label: { tr: 'GitHub', en: 'GitHub' }, href: 'https://github.com/ar3s27/ilceden-ilceye-mesafe' },
    ],
    hues: ['#38bdf8', '#34d399'],
  },
];
