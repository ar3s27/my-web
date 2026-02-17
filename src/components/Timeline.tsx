'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Briefcase, GraduationCap, Calendar, Star, Trophy } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface TimelineEvent {
  id: number;
  type: string;
  date: string;
  date_tr?: string;
  title: string;
  title_tr?: string;
  company: string;
  company_tr?: string;
  description: string;
  description_tr?: string;
}

export default function Timeline() {
  const { language } = useLanguage();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/timeline', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch timeline', err);
        setLoading(false);
      });
  }, []);

  const getIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('work') || t.includes('iş')) return <Briefcase className="w-5 h-5" />;
    if (t.includes('education') || t.includes('eğitim') || t.includes('school') || t.includes('okul')) return <GraduationCap className="w-5 h-5" />;
    if (t.includes('award') || t.includes('ödül')) return <Trophy className="w-5 h-5" />;
    return <Star className="w-5 h-5" />;
  };

  const getTypeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('work') || t.includes('iş')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    if (t.includes('education') || t.includes('eğitim')) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    if (t.includes('award') || t.includes('ödül')) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    return 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 border-violet-200 dark:border-violet-800';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 space-y-8 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-zinc-800" />
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
        >
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block mb-4">
                {language === 'tr' ? 'Deneyim & Eğitim' : 'Experience & Education'}
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" />
        </motion.div>

      <div className="relative border-l-2 border-gray-200 dark:border-zinc-800 ml-3 md:ml-6 space-y-12">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-8 md:pl-12 group"
          >
            {/* Timeline Dot */}
            <div className={`absolute -left-[9px] md:-left-[9px] top-0 flex items-center justify-center w-5 h-5 rounded-full ring-4 ring-white dark:ring-black bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-125`}>
               <div className="w-2 h-2 bg-white rounded-full" />
            </div>

            {/* Content Card */}
            <div className="relative p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 hover:border-indigo-200 dark:hover:border-indigo-900/50">
              
              {/* Date & Type Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                  <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    {language === 'tr' ? (event.date_tr || event.date) : event.date}
                  </div>
              </div>

              {/* Title & Company */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {language === 'tr' ? (event.title_tr || event.title) : event.title}
                </h3>
                <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm font-medium">
                  {getIcon(event.type)}
                  <span className="ml-2">
                    {language === 'tr' ? (event.company_tr || event.company) : event.company}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base border-t border-gray-100 dark:border-zinc-800 pt-4 mt-4">
                {language === 'tr' ? (event.description_tr || event.description) : event.description}
              </p>
              
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
