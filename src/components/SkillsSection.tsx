'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

export default function SkillsSection() {
  const { t } = useLanguage();
  
  const skills = [
    'Python', 'PyTorch', 'TensorFlow', 'SQL', 'Machine Learning', 
    'Deep Learning', 'Data Visualization', 'NLP', 'Computer Vision', 
    'Git', 'Docker', 'AWS'
  ];

  return (
    <section id="skills" className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          {t.skills.title}
        </h2>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white to-transparent dark:from-black"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white to-transparent dark:from-black"></div>
        
        <div className="flex">
          <motion.div 
            className="flex gap-8 flex-nowrap"
            animate={{ x: "-50%" }}
            transition={{ 
              repeat: Infinity, 
              ease: "linear", 
              duration: 30 
            }}
          >
            {[...skills, ...skills, ...skills].map((skill, index) => (
              <div 
                key={`${skill}-${index}`} 
                className="flex-shrink-0 px-8 py-4 bg-gray-50 dark:bg-zinc-900 rounded-full border border-gray-200 dark:border-zinc-800 text-lg font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap"
              >
                {skill}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
