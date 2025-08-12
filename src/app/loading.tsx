'use client';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Загрузка...
        </h2>
        <p className="text-gray-500">
          Пожалуйста, подождите, приложение загружается.
        </p>
      </div>
    </div>
  );
}

// Отключаем статическую генерацию
export const dynamic = 'force-dynamic'; 