'use client';

import { useState, useEffect } from 'react';

export default function SimpleTestPage() {
  const [isClient, setIsClient] = useState(false);
  const [telegramAvailable, setTelegramAvailable] = useState(false);
  const [webAppData, setWebAppData] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Проверяем доступность Telegram Web App
    if (typeof window !== 'undefined' && 'Telegram' in window) {
      setTelegramAvailable(true);
      
      try {
        const WebApp = (window as any).Telegram?.WebApp;
        if (WebApp) {
          setWebAppData({
            version: WebApp.version,
            platform: WebApp.platform,
            colorScheme: WebApp.colorScheme,
            themeParams: WebApp.themeParams,
            initDataUnsafe: WebApp.initDataUnsafe,
          });
        }
      } catch (error) {
        console.error('Error accessing Telegram Web App:', error);
      }
    }
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            🧪 Простой тест Telegram интеграции
          </h1>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h2 className="font-semibold text-blue-800 mb-2">📱 Статус Telegram</h2>
              <p className="text-blue-700">
                Telegram Web App доступен: 
                <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
                  telegramAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {telegramAvailable ? '✅ Да' : '❌ Нет'}
                </span>
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h2 className="font-semibold text-green-800 mb-2">🌐 Окружение</h2>
              <p className="text-green-700">
                Тип: {typeof window !== 'undefined' ? 'Браузер' : 'Сервер'}
              </p>
              <p className="text-green-700">
                User Agent: {typeof navigator !== 'undefined' ? navigator.userAgent : 'Недоступен'}
              </p>
            </div>

            {webAppData && (
              <div className="p-4 bg-purple-50 rounded-lg">
                <h2 className="font-semibold text-purple-800 mb-2">📊 Данные Web App</h2>
                <div className="space-y-2 text-sm">
                  <p><strong>Версия:</strong> {webAppData.version}</p>
                  <p><strong>Платформа:</strong> {webAppData.platform}</p>
                  <p><strong>Цветовая схема:</strong> {webAppData.colorScheme}</p>
                  <p><strong>Пользователь:</strong> {webAppData.initDataUnsafe?.user ? 'Да' : 'Нет'}</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h2 className="font-semibold text-yellow-800 mb-2">🔧 Тестовые действия</h2>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    console.log('=== ТЕСТ TELEGRAM ===');
                    console.log('Window доступен:', typeof window !== 'undefined');
                    console.log('Telegram доступен:', 'Telegram' in window);
                    if (typeof window !== 'undefined' && 'Telegram' in window) {
                      console.log('Telegram объект:', (window as any).Telegram);
                    }
                  }}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  📝 Вывести информацию в консоль
                </button>
                
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      alert('Тест alert работает!');
                    }
                  }}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  🚨 Тест alert
                </button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="font-semibold text-gray-800 mb-2">💡 Инструкции</h2>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Откройте DevTools (F12) → Console</li>
                <li>• Нажмите кнопку "Вывести информацию в консоль"</li>
                <li>• Проверьте, что нет ошибок MetaMask</li>
                <li>• В Telegram: найдите бота и откройте Mini App</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Отключаем статическую генерацию
export const dynamic = 'force-dynamic'; 