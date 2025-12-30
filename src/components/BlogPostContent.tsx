'use client';

import { BlogPost } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '@/context/LanguageContext';
import { motion, useScroll, useSpring } from 'framer-motion';
import Comments from './Comments';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

export default function BlogPostContent({ post }: { post: BlogPost }) {
  const { language } = useLanguage();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const title = language === 'tr' ? (post.title_tr || post.title) : post.title;
  const content = language === 'tr' ? (post.content_tr || post.content) : post.content;

  // Calculate Reading Time
  const words = content.split(/\s+/).length;
  const readTimeMinutes = Math.ceil(words / 200);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-indigo-600 origin-left z-50"
        style={{ scaleX }}
      />
      
      <article className="px-6 py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700 dark:text-gray-300">
          <div className="text-center mb-10">
            <p className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">
              {new Date(post.date).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              <span className="mx-2">•</span>
              {readTimeMinutes} {language === 'tr' ? 'dk okuma' : 'min read'}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">{title}</h1>
          </div>
          
          <div className="mt-10 max-w-2xl prose dark:prose-invert mx-auto">
             <ReactMarkdown
               components={{
                 code(props) {
                   const { children, className, node, ...rest } = props;
                   const match = /language-(\w+)/.exec(className || '');
                   const [copied, setCopied] = useState(false);

                   const handleCopy = () => {
                     if (children) {
                       navigator.clipboard.writeText(String(children));
                       setCopied(true);
                       setTimeout(() => setCopied(false), 2000);
                     }
                   };

                   return match ? (
                     <div className="relative group">
                       <button
                         onClick={handleCopy}
                         className="absolute right-2 top-2 p-1.5 rounded-lg bg-gray-700/50 hover:bg-gray-700 text-gray-300 opacity-0 group-hover:opacity-100 transition-all z-10"
                         aria-label="Copy code"
                       >
                         {copied ? <Check size={16} /> : <Copy size={16} />}
                       </button>
                       {/* @ts-ignore */}
                       <SyntaxHighlighter
                         {...rest}
                         PreTag="div"
                         children={String(children).replace(/\n$/, '')}
                         language={match[1]}
                         style={vscDarkPlus}
                         className="rounded-xl !bg-[#1e1e1e] !p-4 !my-0 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
                       />
                     </div>
                   ) : (
                     <code {...rest} className={className}>
                       {children}
                     </code>
                   );
                 }
               }}
             >
               {content}
             </ReactMarkdown>
          </div>
        </div>
      </article>
      
      <Comments />
    </>
  );
}
