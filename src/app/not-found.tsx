'use client';

import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    // Принудительно устанавливаем заголовки для динамического рендеринга
    if (typeof window !== 'undefined') {
      document.title = 'Страница не найдена - Calorie Chat AI';
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Страница не найдена
        </h2>
        <p className="text-gray-500 mb-8">
          К сожалению, запрашиваемая страница не существует.
        </p>
        <a
          href="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Вернуться на главную
        </a>
      </div>
    </div>
  );
}

// Отключаем статическую генерацию
export const dynamic = 'force-dynamic'; 