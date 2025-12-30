'use client';

import { Project } from '@/lib/api';
import ProjectCard from './ProjectCard';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import clsx from 'clsx';

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = useMemo(() => {
    const tags = new Set(projects.flatMap(p => p.tags));
    return ['All', ...Array.from(tags)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return activeFilter === 'All' 
      ? projects 
      : projects.filter(p => p.tags.includes(activeFilter));
  }, [projects, activeFilter]);

  return (
    <section id="projects" className="py-24 bg-gray-50 dark:bg-zinc-900/50">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-12"
        >
          {t.projects.title}
        </motion.h2>
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={clsx(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                activeFilter === filter
                  ? "bg-indigo-600 text-white"
                  : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <a href="https://github.com/ar3s27" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
            {t.projects.viewAll} <span aria-hidden="true">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
