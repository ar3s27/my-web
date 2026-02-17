'use client';

import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { Prompt } from '@/lib/api';

export default function PromptsPage() {
  const { t, language } = useLanguage();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrompts = async () => {
        try {
            const res = await fetch('/api/prompts');
            const data = await res.json();
            if (Array.isArray(data)) {
                setPrompts(data);
            }
        } catch (error) {
            console.error('Failed to fetch prompts', error);
        } finally {
            setLoading(false);
        }
    };
    fetchPrompts();
  }, []);

  const handleCopy = (text: string, id: string) => {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <Navbar />
      
      {/* Hero / Banner Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Banner with Gradient/Image */}
        <div className="w-full relative h-64 md:h-80 rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-purple-500/20 ring-1 ring-gray-900/5 dark:ring-white/10 group">
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black opacity-100 flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
                <div className="relative z-10 text-center px-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                        {t.prompts.bannerTitle}
                    </h2>
                    <p className="text-blue-200/80 text-lg">{t.prompts.bannerSubtitle}</p>
                </div>
           </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl mb-6">
          {t.prompts.pageTitle}
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300 mb-12">
          {t.prompts.pageDescription}
        </p>

        {/* Prompt Showcase Section */}
        {loading ? (
             <div className="flex justify-center py-20">
                 <div className="animate-pulse flex space-x-4">
                      <div className="h-12 w-12 bg-gray-200 dark:bg-zinc-800 rounded-full"></div>
                 </div>
             </div>
        ) : (
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {prompts.map((prompt) => {
                    const title = language === 'tr' && prompt.title_tr ? prompt.title_tr : prompt.title;
                    const description = language === 'tr' && prompt.description_tr ? prompt.description_tr : prompt.description;
                    const content = language === 'tr' && prompt.content_tr ? prompt.content_tr : prompt.content;

                    return (
                        <div key={prompt.id} className="relative group bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-zinc-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 transition duration-500 blur"></div>
                            
                            <div className="relative flex-1 flex flex-col">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                        {prompt.category}
                                    </span>
                                    {prompt.tags && prompt.tags.length > 0 && (
                                         <div className="flex gap-1">
                                             {prompt.tags.slice(0, 2).map((tag, i) => (
                                                  <span key={i} className="text-xs text-gray-500 dark:text-gray-400">#{tag}</span>
                                             ))}
                                         </div>
                                    )}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
                                
                                <div className="bg-gray-50 dark:bg-black/50 rounded-lg p-4 mb-4 border border-gray-100 dark:border-zinc-800 flex-1 overflow-hidden relative">
                                    <code className="text-sm font-mono text-gray-700 dark:text-zinc-300 block overflow-x-auto whitespace-pre-wrap max-h-60 overflow-y-auto">
                                        {content}
                                    </code>
                                </div>
                                <button 
                                    onClick={() => handleCopy(content, prompt.id)}
                                    className="w-full py-2 px-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group-active:scale-95 duration-150"
                                >
                                    {copiedId === prompt.id ? (
                                        <>
                                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            <span className="text-green-500">{t.prompts.copied}</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                                            <span>{t.prompts.copy}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
