'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Comment {
  id: number;
  postId: string;
  nickname: string;
  content: string;
  date: string;
}

export default function PostComments() {
  const params = useParams();
  const postId = params.postId as string;
  const router = useRouter();

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      const data: Comment[] = await res.json();
      setComments(data.reverse());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await fetch(`/api/comments?id=${id}`, { method: 'DELETE' });
      setComments(comments.filter(c => c.id !== id));
      
      // If no comments left, go back to main list
      if (comments.length <= 1) {
        router.push('/admin/comments');
      }
    } catch (e) {
      alert('Failed to delete comment');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="py-24 px-6 lg:px-8 max-w-6xl mx-auto">
       <div className="flex items-center mb-8">
         <Link href="/admin/comments" className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            <ArrowLeft className="h-6 w-6 text-gray-700 dark:text-gray-300" />
         </Link>
         <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Comments: {postId}</h1>
       </div>
       
       <div className="bg-white dark:bg-zinc-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
            <thead className="bg-gray-50 dark:bg-zinc-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
              {comments.map((comment) => (
                <tr key={comment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {comment.nickname}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-md truncate">
                    {comment.content}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(comment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDelete(comment.id)} className="text-red-600 hover:text-red-900 dark:hover:text-red-400 transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {comments.length === 0 && (
            <div className="p-8 text-center text-gray-500">No comments found for this post.</div>
          )}
       </div>
    </div>
  );
}
