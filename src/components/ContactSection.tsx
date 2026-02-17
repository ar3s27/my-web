'use client';

import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';

export default function ContactSection() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error || 'Failed to send');
      
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24">
      <div className="max-w-xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-6">{t.contact.title}</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
          {t.contact.description}
        </p>
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
           <div>
             <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">{t.contact.email}</label>
             <div className="mt-2">
               <input type="email" name="email" id="email" className="block w-full rounded-md border-0 py-1.5 px-3.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-transparent" placeholder="you@example.com" />
             </div>
           </div>
           <div>
             <label htmlFor="message" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">{t.contact.message}</label>
             <div className="mt-2">
               <textarea name="message" id="message" rows={4} className="block w-full rounded-md border-0 py-1.5 px-3.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-transparent" />
             </div>
           </div>
            <button 
              type="submit" 
              disabled={loading}
              className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400"
            >
              {loading ? 'Sending...' : t.contact.send}
            </button>
            {success && <p className="text-green-600 text-center mt-2">Message sent successfully!</p>}
            {error && <p className="text-red-600 text-center mt-2">{error}</p>}
        </form>
      </div>
    </section>
  );
}
