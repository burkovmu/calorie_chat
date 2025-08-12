'use client';

import { useEffect } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Принудительно устанавливаем заголовки для динамического рендеринга
    if (typeof window !== 'undefined') {
      // Устанавливаем мета-теги для динамического рендеринга
      const meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'noindex, nofollow';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="template-wrapper">
      {children}
    </div>
  );
}

// Отключаем статическую генерацию
export const dynamic = 'force-dynamic'; 