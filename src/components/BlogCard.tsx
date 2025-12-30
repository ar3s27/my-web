'use client';

import Link from 'next/link';
import { BlogPost } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export default function BlogCard({ post }: { post: BlogPost }) {
  const { language } = useLanguage();

  return (
    <article className="flex flex-col items-start justify-between p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-x-4 text-xs">
        <time dateTime={post.date} className="text-gray-500 dark:text-gray-400">
          {new Date(post.date).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </div>
      <div className="group relative">
        <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300">
          <Link href={`/blog/${post.slug}`}>
            <span className="absolute inset-0" />
            {language === 'tr' ? (post.title_tr || post.title) : post.title}
          </Link>
        </h3>
        <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
          {language === 'tr' ? (post.summary_tr || post.summary) : post.summary}
        </p>
      </div>
    </article>
  );
}
