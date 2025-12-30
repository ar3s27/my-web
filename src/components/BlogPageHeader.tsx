'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function BlogPageHeader() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">{t.blog.pageTitle}</h2>
      <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
        {t.blog.pageDescription}
      </p>
    </div>
  );
}
