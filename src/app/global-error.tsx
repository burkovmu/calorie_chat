'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Принудительно устанавливаем заголовки для динамического рендеринга
    if (typeof window !== 'undefined') {
      document.title = 'Критическая ошибка - Calorie Chat AI';
    }
    
    // Логируем критическую ошибку
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-red-600 mb-4">⚠️</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Критическая ошибка
            </h2>
            <p className="text-gray-500 mb-8">
              Произошла критическая ошибка в приложении. Попробуйте обновить страницу.
            </p>
            <button
              onClick={reset}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

// Отключаем статическую генерацию
export const dynamic = 'force-dynamic'; 