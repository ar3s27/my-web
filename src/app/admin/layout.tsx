'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Posts', href: '/admin/posts' },
    { name: 'Projects', href: '/admin/projects' },
    { name: 'Comments', href: '/admin/comments' },
    { name: 'Timeline', href: '/admin/timeline' },
    { name: 'Prompts', href: '/admin/prompts' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-zinc-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-800 shadow-md border-r border-gray-100 dark:border-zinc-700">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Panel</h1>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 ${
                pathname === item.href 
                  ? 'border-r-4 border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="block w-full px-6 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
