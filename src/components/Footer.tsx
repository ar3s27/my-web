'use client';

import { useLanguage } from '@/context/LanguageContext';

import { Github, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-gray-100 dark:bg-zinc-900 dark:border-zinc-800">
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-6">
          <a href="https://github.com/ar3s27" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">GitHub</span>
            <Github className="h-6 w-6" />
          </a>
          <a href="https://linkedin.com/in/muhammed-veysel-erkoyuncu" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">LinkedIn</span>
            <Linkedin className="h-6 w-6" />
          </a>
           <a href="https://instagram.com/veysel.erkoyuncu" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Instagram</span>
            <Instagram className="h-6 w-6" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Twitter</span>
            <Twitter className="h-6 w-6" />
          </a>
        </div>
        <p className="mt-8 text-center text-base text-gray-400">
          &copy; {new Date().getFullYear()} MyPortfolio. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
