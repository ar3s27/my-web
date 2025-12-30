'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

type Post = {
  id: number;
  slug: string;
  title: string;
  title_tr?: string;
  date: string;
  summary: string;
  summary_tr?: string;
  content: string;
  content_tr?: string;
};

export default function PostsAdmin() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<Post>();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch('/api/posts');
    const data = await res.json();
    setPosts(data);
  };

  const onSubmit = async (data: Post) => {
    if (currentPost) {
      // Update
      await fetch('/api/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, id: currentPost.id }),
      });
    } else {
      // Create
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    }
    setIsEditing(false);
    setCurrentPost(null);
    reset();
    fetchPosts();
  };

  const handleEdit = (post: Post) => {
    setCurrentPost(post);
    setIsEditing(true);
    setValue('slug', post.slug);
    setValue('title', post.title);
    setValue('title_tr', post.title_tr);
    setValue('date', post.date);
    setValue('summary', post.summary);
    setValue('summary_tr', post.summary_tr);
    setValue('content', post.content);
    setValue('content_tr', post.content_tr);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await fetch(`/api/posts?id=${id}`, { method: 'DELETE' });
      fetchPosts();
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Manage Posts</h2>
        <button
          onClick={() => {
            setIsEditing(!isEditing);
            setCurrentPost(null);
            reset();
          }}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {isEditing ? 'Cancel' : 'Add New Post'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg bg-white p-6 shadow-md">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title (EN)</label>
              <input {...register('title', { required: true })} className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title (TR)</label>
              <input {...register('title_tr')} className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Slug</label>
              <input {...register('slug', { required: true })} className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" {...register('date', { required: true })} className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Summary (EN)</label>
              <textarea {...register('summary', { required: true })} className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900" rows={3} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Summary (TR)</label>
              <textarea {...register('summary_tr')} className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900" rows={3} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Content (EN - Markdown)</label>
              <textarea {...register('content', { required: true })} className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 font-mono text-gray-900" rows={10} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Content (TR - Markdown)</label>
              <textarea {...register('content_tr')} className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 font-mono text-gray-900" rows={10} />
            </div>
          </div>
          <button type="submit" className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700">
            {currentPost ? 'Update Post' : 'Create Post'}
          </button>
        </form>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-900">{post.title}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-900">{post.date}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button onClick={() => handleEdit(post)} className="mr-4 text-indigo-600 hover:text-indigo-900">Edit</button>
                    <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-900">Delete</button>
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
