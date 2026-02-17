export const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      projects: 'Projects',
      blog: 'Blog',
      contact: 'Contact',
    },
    hero: {
      greeting: "Hi, I'm",
      role: 'AI & Data Scientist',
      description: 'I build intelligent systems and derive insights from data. Passionate about Machine Learning, Deep Learning, and Data Engineering.',
      cta: 'View Projects',
    },
    about: {
      title: 'About Me',
      content: 'I am Muhammed Veysel Erkoyuncu, a dedicated AI and Data Science professional. I specialize in developing machine learning models, analyzing complex datasets, and building scalable data pipelines.',
      downloadResume: 'Download Resume',
      profilePhoto: 'Profile Photo',
    },
    projects: {
      title: 'Featured Projects', 
      viewProject: 'View Project',
      viewAll: 'View all projects on GitHub',
    },
    blog: {
      title: 'Latest Posts',
      readMore: 'Read More',
      pageTitle: 'From the Blog',
      pageDescription: 'Thoughts on AI, Data Science, and Technology.',
    },
    contact: {
      title: 'Get In Touch',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send Message',
      description: "Have a project in mind or just want to say hi? I'd love to hear from you.",
    },
    footer: {
      rights: 'All rights reserved.',
    },
    skills: {
      title: 'Skills',
    },
    comments: {
      title: 'Comments',
      noComments: 'No comments yet. Be the first to share your thoughts!',
      nickname: 'Nickname',
      message: 'Message',
      placeholderName: 'Your name',
      placeholderMessage: 'Write a comment...',
      post: 'Post Comment',
      posting: 'Posting...',
      loading: 'Loading comments...',
      error: 'Failed to post comment. Please try again.',
    },
  },
  tr: {
    nav: {
      home: 'Ana Sayfa',
      about: 'Hakkımda',
      projects: 'Projeler',
      blog: 'Blog',
      contact: 'İletişim',
    },
    hero: {
      greeting: 'Merhaba, Ben',
      role: 'Yapay Zeka & Veri Bilimci',
      description: 'Akıllı sistemler geliştiriyor ve veriden anlamlı içgörüler çıkarıyorum. Makine Öğrenmesi, Derin Öğrenme ve Veri Mühendisliği tutkunuyum.',
      cta: 'Projelerimi İncele',
    },
    about: {
      title: 'Hakkımda',
      content: 'Ben Muhammed Veysel Erkoyuncu, kendini geliştirmeye adamış bir Yapay Zeka ve Veri Bilimi uzmanıyım. Makine öğrenmesi modelleri geliştirme, karmaşık veri setlerini analiz etme ve ölçeklenebilir veri hatları kurma konularında uzmanlaşıyorum.',
      downloadResume: 'Özgeçmişi İndir',
      profilePhoto: 'Profil Fotoğrafı',
    },
    projects: {
      title: 'Öne Çıkan Projeler',
      viewProject: 'Projeyi Görüntüle',
      viewAll: 'Tüm projeleri GitHub\'da görüntüle',
    },
    blog: {
      title: 'Son Yazılar',
      readMore: 'Devamını Oku',
      pageTitle: 'Blogdan Yazılar',
      pageDescription: 'Yapay Zeka, Veri Bilimi ve Teknoloji üzerine düşünceler.',
    },
    contact: {
      title: 'İletişime Geç',
      name: 'İsim',
      email: 'E-posta',
      message: 'Mesaj',
      send: 'Mesaj Gönder',
      description: 'Aklınızda bir proje mi var veya sadece merhaba mı demek istiyorsunuz? Sizi duymak isterim.',
    },
    footer: {
      rights: 'Tüm hakları saklıdır.',
    },
    skills: {
      title: 'Yetenekler',
    },
    comments: {
      title: 'Yorumlar',
      noComments: 'Henüz yorum yok. İlk yorumu sen yap!',
      nickname: 'Takma Ad',
      message: 'Mesaj',
      placeholderName: 'İsminiz',
      placeholderMessage: 'Bir yorum yaz...',
      post: 'Yorum Yap',
      posting: 'Gönderiliyor...',
      loading: 'Yorumlar yükleniyor...',
      error: 'Yorum gönderilemedi. Lütfen tekrar deneyin.',
    },
  },
};

export type Language = 'en' | 'tr';
export type TranslationKeys = typeof translations.en;
