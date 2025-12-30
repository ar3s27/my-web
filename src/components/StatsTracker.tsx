'use client';

import { useEffect, useRef } from 'react';

export default function StatsTracker() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Simple visit counting mechanism
    // In a real app, you'd use a session cookie or proper analytics
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (!hasVisited) {
      fetch('/api/stats', { method: 'POST' });
      sessionStorage.setItem('hasVisited', 'true');
    }
  }, []);

  return null;
}
