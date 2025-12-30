'use client';

import { Project } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export default function ProjectCard({ project }: { project: Project }) {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-lg border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="flex-shrink-0">
        {/* Placeholder for image if not present or real image */}
        <div className="h-48 w-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center text-gray-400">
           {project.imageUrl ? (
             <div className="relative h-48 w-full">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img 
                 className="h-48 w-full object-cover" 
                 src={project.imageUrl} 
                 alt={project.title}
                 onError={(e) => {
                   e.currentTarget.style.display = 'none';
                   e.currentTarget.nextElementSibling?.classList.remove('hidden');
                 }}
               />
               <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-zinc-800 text-gray-400">
                 No Image
               </div>
             </div>
           ) : (
             <span>No Image</span>
           )}
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {language === 'tr' ? (project.title_tr || project.title) : project.title}
          </h3>
          <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
            {language === 'tr' ? (project.description_tr || project.description) : project.description}
          </p>
        </div>
        <div className="mt-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-4">
            {project.demoUrl && (
              <a href={project.demoUrl} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                Live Demo
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} className="text-sm font-medium text-gray-500 hover:text-gray-400">
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
