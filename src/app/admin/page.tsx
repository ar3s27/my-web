'use client';

import { useState, useEffect } from 'react';

interface Project {
  id: number;
  title: string;
  imageUrl: string;
}

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalProjects: 0, totalVisitors: 0, activeNow: 1 });


  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
        
        // Fetch stats
        const statsRes = await fetch('/api/stats');
        const statsData = await statsRes.json();
        setStats({
          totalProjects: data.length,
          totalVisitors: statsData.totalVisitors || 0,
          activeNow: 1 // Still mock as we don't have websocket/real-time tracking
        });
      }
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  };




  if (loading) return <div className="p-10 text-center">Loading projects...</div>;

  return (
    <div className="py-24 px-6 lg:px-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Admin Dashboard</h1>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Projects</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalProjects}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Visitors</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalVisitors.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Now</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.activeNow}</p>
        </div>
      </div>
    </div>
  );
}
