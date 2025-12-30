'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const { t } = useLanguage();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 dark:bg-zinc-900/80 dark:border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              MyPortfolio
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link href="/" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                {t.nav.home}
              </Link>
              <Link href="/#projects" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                {t.nav.projects}
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                {t.nav.blog}
              </Link>
              <Link href="/#contact" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                {t.nav.contact}
              </Link>
              <div className="flex items-center gap-2 ml-4 border-l pl-4 border-gray-200 dark:border-gray-700">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
