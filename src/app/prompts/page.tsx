'use client';

import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PromptsPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      
      {/* Hero / Banner Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Banner with Gradient/Image */}
        <div className="w-full relative h-64 md:h-80 rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-purple-500/20 ring-1 ring-gray-900/5 dark:ring-white/10 group">
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black opacity-100 flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
                <div className="relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                        Unlock Creativity
                    </h2>
                    <p className="text-blue-200/80 text-lg">AI-Powered Prompt Library</p>
                </div>
           </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl mb-6">
          Curated AI Prompts
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300 mb-12">
          Explore a collection of high-quality prompts designed to get the most out of LLMs. 
          Perfect for developers, writers, and creators.
        </p>

        {/* Prompt Showcase Section */}
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Example Card 1 */}
            <div className="relative group bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-zinc-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 transition duration-500 blur"></div>
                
                <div className="relative">
                    <div className="flex justify-between items-center mb-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                             Creative Writing
                        </span>
                        
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Sci-Fi Plot Generator</h3>
                    <div className="bg-gray-50 dark:bg-zinc-950 rounded-lg p-4 mb-4 border border-gray-100 dark:border-zinc-800">
                        <code className="text-sm font-mono text-gray-600 dark:text-zinc-400 block overflow-x-auto">
                            You are an expert creative writing assistant. Help me brainstorm a plot for a sci-fi novel set on a water-covered planet. 
                            Focus on themes of isolation...
                        </code>
                    </div>
                     <button 
                        className="w-full py-2 px-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <span>Copy Prompt</span>
                    </button>
                </div>
            </div>

             {/* Example Card 2 */}
             <div className="relative group bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-zinc-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-20 transition duration-500 blur"></div>
                
                <div className="relative">
                    <div className="flex justify-between items-center mb-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                             Coding
                        </span>
                        
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">React Component Generator</h3>
                    <div className="bg-gray-50 dark:bg-zinc-950 rounded-lg p-4 mb-4 border border-gray-100 dark:border-zinc-800">
                        <code className="text-sm font-mono text-gray-600 dark:text-zinc-400 block overflow-x-auto">
                            Create a responsive React component for a pricing table using Tailwind CSS. 
                            Include 3 tiers: Basic, Pro, and Enterprise...
                        </code>
                    </div>
                     <button 
                        className="w-full py-2 px-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <span>Copy Prompt</span>
                    </button>
                </div>
            </div>

        </div>

      </section>

      <Footer />
    </main>
  );
}
