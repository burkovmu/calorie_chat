import Link from 'next/link';

export default function Custom500() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Что-то пошло не так
        </h2>
        <p className="text-gray-500 mb-8">
          Произошла непредвиденная ошибка. Попробуйте обновить страницу.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Попробовать снова
          </button>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}

// Отключаем статическую генерацию
export const dynamic = 'force-dynamic'; 