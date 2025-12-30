'use client';

import { useState, useEffect } from 'react';

interface Comment {
  id: number;
  postId: string;
  nickname: string;
  content: string;
  date: string;
}

interface PostSummary {
  postId: string;
  count: number;
  lastCommentDate: string;
}

export default function AdminComments() {
  const [postSummaries, setPostSummaries] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch('/api/comments');
      const data: Comment[] = await res.json();
      
      // Group by postId
      const grouped: { [key: string]: PostSummary } = {};
      
      data.forEach(comment => {
        if (!grouped[comment.postId]) {
          grouped[comment.postId] = {
            postId: comment.postId,
            count: 0,
            lastCommentDate: comment.date
          };
        }
        grouped[comment.postId].count++;
        if (new Date(comment.date) > new Date(grouped[comment.postId].lastCommentDate)) {
          grouped[comment.postId].lastCommentDate = comment.date;
        }
      });

      setPostSummaries(Object.values(grouped).sort((a, b) => new Date(b.lastCommentDate).getTime() - new Date(a.lastCommentDate).getTime()));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading comments...</div>;

  return (
    <div className="py-24 px-6 lg:px-8 max-w-6xl mx-auto">
       <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Comments by Post</h1>
       
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {postSummaries.map((summary) => (
            <a 
              key={summary.postId}
              href={`/admin/comments/${summary.postId}`}
              className="block bg-white dark:bg-zinc-800 p-6 rounded-xl border border-gray-200 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 truncate">
                {summary.postId}
              </h2>
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>{summary.count} Comments</span>
                <span>{new Date(summary.lastCommentDate).toLocaleDateString()}</span>
              </div>
            </a>
          ))}
       </div>
       
       {postSummaries.length === 0 && (
          <div className="p-8 text-center text-gray-500">No comments found anywhere.</div>
       )}
    </div>
  );
}
