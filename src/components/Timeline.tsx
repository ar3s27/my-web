'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Briefcase, GraduationCap, Calendar, Star } from 'lucide-react';
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

  useEffect(() => {
    fetch('/api/timeline', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error('Failed to fetch timeline', err));
  }, []);

  const getIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('work') || t.includes('iş')) return <Briefcase className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />;
    if (t.includes('education') || t.includes('eğitim') || t.includes('school') || t.includes('okul')) return <GraduationCap className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />;
    return <Star className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />;
  };

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative border-l-2 border-indigo-200 dark:border-indigo-900 ml-3 space-y-12"
      >
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="mb-10 ml-8 relative"
          >
            <span className="absolute -left-11 flex items-center justify-center w-6 h-6 bg-indigo-100 dark:bg-indigo-900 rounded-full ring-8 ring-white dark:ring-black">
              {getIcon(event.type)}
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <div className="flex items-center flex-wrap gap-2">
                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                   {language === 'tr' ? (event.title_tr || event.title) : event.title}
                 </h3>
                 <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 capitalize">
                   {event.type}
                 </span>
                 {index === 0 && (
                  <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">
                    {language === 'tr' ? 'En Yeni' : 'Latest'}
                  </span>
                 )}
              </div>
              <time className="block mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500 sm:mb-0">
                {language === 'tr' ? (event.date_tr || event.date) : event.date}
              </time>
            </div>
            <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
               <span className="font-medium text-gray-800 dark:text-gray-200">
                 {language === 'tr' ? (event.company_tr || event.company) : event.company}
               </span> - {language === 'tr' ? (event.description_tr || event.description) : event.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
