'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface Comment {
  id: number;
  postId: string;
  nickname: string;
  content: string;
  date: string;
}

export default function Comments() {
  const { t } = useLanguage();
  const pathname = usePathname();
  // Extract slug from pathname (e.g., /blog/my-post -> my-post)
  const slug = pathname.split('/').pop() || '';

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (slug) {
      fetchComments();
    }
  }, [slug]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?postId=${slug}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.reverse()); // Show newest first
      }
    } catch (e) {
      console.error('Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !content.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: slug,
          nickname,
          content,
        }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments([newComment, ...comments]);
        setContent(''); // Clear content but keep nickname
      } else {
        setError(t.comments.error);
      }
    } catch (e) {
      setError('An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-20 mb-24 max-w-3xl mx-auto px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{t.comments.title} ({comments.length})</h2>

      <form onSubmit={handleSubmit} className="mb-12 bg-gray-50 dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-zinc-800">
        <div className="mb-4">
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.comments.nickname}</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            placeholder={t.comments.placeholderName}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.comments.message}</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            placeholder={t.comments.placeholderMessage}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? t.comments.posting : t.comments.post}
        </button>
      </form>

      {loading ? (
        <p className="text-gray-500 text-center">{t.comments.loading}</p>
      ) : (
        <div className="space-y-6">
           <AnimatePresence mode='popLayout'>
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-zinc-900/50 p-6 rounded-xl border border-gray-100 dark:border-zinc-800"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{comment.nickname}</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
          {comments.length === 0 && (
            <p className="text-center text-gray-500 italic">{t.comments.noComments}</p>
          )}
        </div>
      )}
    </div>
  );
}
