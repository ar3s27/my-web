'use client';

import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Timeline from './Timeline';

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-24 bg-gray-50 dark:bg-zinc-900/50">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-12"
        >
          {t.about.title}
        </motion.h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="aspect-square rounded-2xl bg-gray-200 dark:bg-zinc-800 overflow-hidden relative"
          >
            <Image 
              src="/images/ProfilePhoto.png" 
              alt={t.about.profilePhoto}
              fill
              className="object-cover"
            />
          </motion.div>
          <motion.div
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {t.about.content}
            </p>
            <a href="#" className="text-indigo-600 font-semibold hover:text-indigo-500">{t.about.downloadResume} &rarr;</a>
          </motion.div>
        </div>
        <div className="mt-16">
          <Timeline />
        </div>
      </div>
    </section>
  );
}
