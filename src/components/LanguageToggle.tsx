'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setLanguage('tr')}
        className={`rounded px-2 py-1 text-sm font-medium ${
          language === 'tr' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        }`}
      >
        TR
      </button>
      <span className="text-gray-300">|</span>
      <button
        onClick={() => setLanguage('en')}
        className={`rounded px-2 py-1 text-sm font-medium ${
          language === 'en' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        }`}
      >
        EN
      </button>
    </div>
  );
}
