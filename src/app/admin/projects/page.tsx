'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

type Project = {
  id: number;
  title: string;
  title_tr?: string;
  description: string;
  description_tr?: string;
  tags: string[];
  imageUrl: string;
  demoUrl: string;
  repoUrl: string;
  featured: boolean;
};

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<any>();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch('/api/projects', { cache: 'no-store' });
    const data = await res.json();
    setProjects(data);
  };

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      if (data.success) {
        setValue('imageUrl', data.url);
      } else {
        alert('Image upload failed');
      }
    } catch (e) {
      console.error(e);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: any) => {
    // Generate IDs locally if creating new (simple strategy)
    // Or let the server handle it. Here we do it mostly client side for JSON file.
    
    // Convert tags string to array
    const formattedData = {
      ...data,
      tags: typeof data.tags === 'string' ? data.tags.split(',').map((t: string) => t.trim()) : data.tags,
      featured: Boolean(data.featured),
    };

    let updatedProjects = [...projects];

    if (currentProject) {
      // Update existing
      updatedProjects = projects.map(p => 
        p.id === currentProject.id ? { ...formattedData, id: currentProject.id } : p
      );
    } else {
      // Create new
      const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
      updatedProjects.push({ ...formattedData, id: newId });
    }

    // Send the ENTIRE updated array to the API
    await fetch('/api/projects', {
      method: 'POST', // The route handles POST as "Overwrite File"
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProjects),
    });

    setIsEditing(false);
    setCurrentProject(null);
    reset();
    fetchProjects();
  };

  const handleEdit = (project: Project) => {
    setCurrentProject(project);
    setIsEditing(true);
    setValue('title', project.title);
    setValue('title_tr', project.title_tr);
    setValue('description', project.description);
    setValue('description_tr', project.description_tr);
    setValue('tags', project.tags.join(', '));
    setValue('imageUrl', project.imageUrl);
    setValue('demoUrl', project.demoUrl);
    setValue('repoUrl', project.repoUrl);
    setValue('featured', project.featured);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
      fetchProjects();
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Projects</h2>
        <button
          onClick={() => {
            setIsEditing(!isEditing);
            setCurrentProject(null);
            reset();
          }}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          {isEditing ? 'Cancel' : 'Add New Project'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg bg-white dark:bg-zinc-800 p-6 shadow-md border border-gray-100 dark:border-zinc-700">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title (EN)</label>
              <input {...register('title', { required: true })} className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 p-2 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title (TR)</label>
              <input {...register('title_tr')} className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 p-2 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags (comma separated)</label>
              <input {...register('tags', { required: true })} className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 p-2 text-gray-900 dark:text-white" placeholder="Next.js, TypeScript" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (EN)</label>
              <textarea {...register('description', { required: true })} className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 p-2 text-gray-900 dark:text-white" rows={3} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (TR)</label>
              <textarea {...register('description_tr')} className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 p-2 text-gray-900 dark:text-white" rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
              <div className="flex gap-2">
                <input {...register('imageUrl', { required: true })} className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 p-2 text-gray-900 dark:text-white" placeholder="/images/project.jpg" />
                <label className="mt-1 cursor-pointer rounded-md bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-500 flex items-center justify-center whitespace-nowrap">
                  Upload
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
                    }}
                  />
                </label>
              </div>
              {uploading && <p className="text-sm text-indigo-500 mt-1">Uploading image...</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Demo URL</label>
              <input {...register('demoUrl')} className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 p-2 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Repo URL</label>
              <input {...register('repoUrl')} className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 p-2 text-gray-900 dark:text-white" />
            </div>
            <div className="flex items-center">
              <input type="checkbox" {...register('featured')} className="h-4 w-4 rounded border-gray-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500" />
              <label className="ml-2 block text-sm text-gray-900 dark:text-white">Featured Project</label>
            </div>
          </div>
          <button type="submit" className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50" disabled={uploading}>
            {currentProject ? 'Update Project' : 'Create Project'}
          </button>
        </form>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white dark:bg-zinc-800 shadow-md border border-gray-100 dark:border-zinc-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
            <thead className="bg-gray-50 dark:bg-zinc-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Featured</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700 bg-white dark:bg-zinc-800">
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-900 dark:text-white">{project.title}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-900 dark:text-white">{project.featured ? 'Yes' : 'No'}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button onClick={() => handleEdit(project)} className="mr-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">Edit</button>
                    <button onClick={() => handleDelete(project.id)} className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
