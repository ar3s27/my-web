'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface TimelineEvent {
  id: number;
  type: string;
  date: string;
  date_tr?: string;
  title: string;
  title_tr?: string;
  company: string;
  company_tr?: string;
  description: string;
  description_tr?: string;
}

export default function AdminTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const { register, handleSubmit, reset, setValue } = useForm<TimelineEvent>();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await fetch('/api/timeline');
    const data = await res.json();
    setEvents(data);
  };

  const onSubmit = async (data: TimelineEvent) => {
    let updatedEvents = [...events];
    if (isEditing) {
      updatedEvents = events.map(e => e.id === data.id ? data : e);
    } else {
      data.id = Date.now();
      updatedEvents.push(data);
    }

    await fetch('/api/timeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEvents),
    });

    setEvents(updatedEvents);
    reset();
    setIsEditing(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this event?')) return;
    const updatedEvents = events.filter(e => e.id !== id);
    await fetch('/api/timeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEvents),
    });
    setEvents(updatedEvents);
  };

  const handleEdit = (event: TimelineEvent) => {
    setValue('id', event.id);
    setValue('type', event.type);
    setValue('date', event.date);
    setValue('date_tr', event.date_tr || '');
    setValue('title', event.title);
    setValue('title_tr', event.title_tr || '');
    setValue('company', event.company);
    setValue('company_tr', event.company_tr || '');
    setValue('description', event.description);
    setValue('description_tr', event.description_tr || '');
    setIsEditing(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">To Manage Timeline</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input {...register('type')} placeholder="Type (e.g. Work, Education, Award)" className="p-2 rounded border bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-indigo-500" required />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:col-span-2">
            <div className="flex flex-col gap-1">
              <input {...register('date')} placeholder="Date (e.g. January 2024)" className="p-2 rounded border bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-indigo-500" required />
              <span className="text-xs text-gray-500">Format: Month Year (e.g. October 2023) or Year (2023)</span>
            </div>
            <input {...register('date_tr')} placeholder="Tarih (TR) (Örn: Ocak 2024)" className="p-2 rounded border bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:col-span-2">
            <input {...register('title')} placeholder="Title (EN)" className="p-2 rounded border bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-indigo-500" required />
            <input {...register('title_tr')} placeholder="Başlık (TR)" className="p-2 rounded border bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:col-span-2">
            <input {...register('company')} placeholder="Company (EN)" className="p-2 rounded border bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-indigo-500" required />
            <input {...register('company_tr')} placeholder="Şirket/Kurum (TR)" className="p-2 rounded border bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:col-span-2">
            <textarea {...register('description')} placeholder="Description (EN)" className="p-2 rounded border bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-indigo-500" required />
            <textarea {...register('description_tr')} placeholder="Açıklama (TR)" className="p-2 rounded border bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            {isEditing ? 'Update Event' : 'Add Event'}
          </button>
          {isEditing && (
             <button type="button" onClick={() => { setIsEditing(false); reset(); }} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
               Cancel
             </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{event.title}</h3>
              <p className="text-sm text-gray-500">{event.company} • {event.date}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(event)} className="p-2 text-blue-600 hover:bg-blue-50 rounded dark:hover:bg-blue-900/20"><Edit2 size={20} /></button>
              <button onClick={() => handleDelete(event.id)} className="p-2 text-red-600 hover:bg-red-50 rounded dark:hover:bg-red-900/20"><Trash2 size={20} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
