'use client';

import { useState, useEffect } from 'react';
import { Prompt } from '@/lib/api';

export default function AdminPromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Prompt>>({
    title: '',
    title_tr: '',
    description: '',
    description_tr: '',
    content: '',
    content_tr: '',
    category: 'General',
    tags: [],
    imageUrl: '',
  });

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
        setLoading(true);
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return;

    try {
      const res = await fetch(`/api/prompts?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPrompts(prompts.filter((p) => p.id !== id));
      } else {
        alert('Failed to delete prompt');
      }
    } catch (error) {
      console.error('Failed to delete prompt', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await fetch('/api/prompts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            const newPrompt = await res.json();
            setPrompts([newPrompt, ...prompts]);
            setIsModalOpen(false);
            setFormData({
                title: '',
                title_tr: '',
                description: '',
                description_tr: '',
                content: '',
                content_tr: '',
                category: 'General',
                tags: [],
                imageUrl: '',
            });
        } else {
            alert('Failed to create prompt');
        }
    } catch (error) {
        console.error('Failed to create prompt', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const tags = e.target.value.split(',').map(tag => tag.trim());
      setFormData((prev) => ({ ...prev, tags }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Prompts Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-500/30"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Add New Prompt
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 dark:text-gray-300">Loading prompts...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700 overflow-hidden flex flex-col group hover:shadow-md transition-all">
              {prompt.imageUrl && (
                  <div className="h-48 overflow-hidden relative">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                       <img src={prompt.imageUrl} alt={prompt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                       <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="font-bold text-lg">{prompt.title}</h3>
                            <p className="text-xs text-gray-200">{prompt.category}</p>
                       </div>
                  </div>
              )}
              {!prompt.imageUrl && (
                   <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center p-4">
                        <h3 className="font-bold text-white text-lg">{prompt.title}</h3>
                   </div>
              )}
              
              <div className="p-5 flex flex-col flex-1">
                 <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{prompt.description}</p>
                 <div className="bg-gray-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-gray-100 dark:border-zinc-700 mb-4 flex-1">
                     <code className="text-xs text-gray-800 dark:text-gray-400 font-mono line-clamp-3">{prompt.content}</code>
                 </div>
                 
                 <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-zinc-700">
                     <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(prompt.createdAt).toLocaleDateString()}</span>
                     <button
                        onClick={() => handleDelete(prompt.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                     >
                        Delete
                     </button>
                 </div>
              </div>
            </div>
          ))}
          {prompts.length === 0 && (
              <div className="col-span-full text-center py-20 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-700">
                  <p className="text-gray-500 dark:text-gray-400">No prompts found. Create your first one!</p>
              </div>
          )}
        </div>
      )}

      {/* Modal for Creating Prompt */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 dark:border-zinc-700 flex justify-between items-center sticky top-0 bg-white dark:bg-zinc-800 z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Prompt</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white border-b pb-2 dark:border-zinc-700">English Content</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (EN)</label>
                            <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Code Generator" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (EN)</label>
                            <textarea name="description" required value={formData.description} onChange={handleInputChange} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Short description..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prompt Content (EN)</label>
                            <textarea name="content" required value={formData.content} onChange={handleInputChange} rows={6} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" placeholder="The actual prompt text..." />
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white border-b pb-2 dark:border-zinc-700">Turkish Content (Optional)</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (TR)</label>
                            <input type="text" name="title_tr" value={formData.title_tr} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Örn. Kod Üretici" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (TR)</label>
                            <textarea name="description_tr" value={formData.description_tr} onChange={handleInputChange} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Kısa açıklama..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prompt Content (TR)</label>
                            <textarea name="content_tr" value={formData.content_tr} onChange={handleInputChange} rows={6} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" placeholder="İstem metni..." />
                        </div>
                     </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-zinc-700">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                        <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                            <option value="General">General</option>
                            <option value="Coding">Coding</option>
                            <option value="Writing">Writing</option>
                            <option value="Art">Art</option>
                            <option value="Productivity">Productivity</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma separated)</label>
                        <input type="text" name="tags" value={formData.tags?.join(', ')} onChange={handleTagsChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ai, gpt, midjourney" />
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image</label>
                    <div className="space-y-3">
                        {/* File Upload */}
                        <div className="flex items-center gap-3">
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    setUploading(true);
                                    const formData = new FormData();
                                    formData.append('file', file);

                                    try {
                                        const res = await fetch('/api/upload', {
                                            method: 'POST',
                                            body: formData,
                                        });
                                        const data = await res.json();
                                        if (data.success) {
                                            setFormData(prev => ({ ...prev, imageUrl: data.url }));
                                        } else {
                                            alert('Upload failed: ' + data.message);
                                        }
                                    } catch (error) {
                                        console.error('Upload error:', error);
                                        alert('Upload failed');
                                    } finally {
                                        setUploading(false);
                                    }
                                }}
                                className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100
                                dark:file:bg-blue-900/30 dark:file:text-blue-300"
                            />
                            {uploading && <span className="text-sm text-blue-600 animate-pulse">Uploading...</span>}
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-300 dark:border-zinc-700"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-2 bg-white dark:bg-zinc-800 text-sm text-gray-500">or provide URL</span>
                            </div>
                        </div>

                        <input 
                            type="text" 
                            name="imageUrl" 
                            value={formData.imageUrl} 
                            onChange={handleInputChange} 
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                            placeholder="https://example.com/image.png" 
                        />
                         {formData.imageUrl && (
                            <div className="mt-2 relative h-32 w-full rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">Create Prompt</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
