'use client';

import { useTelegram } from '@/hooks/useTelegram';
import { useState, useEffect } from 'react';

export default function TelegramTest() {
  const { 
    user, 
    theme, 
    isReady, 
    isTelegramApp, 
    getUserName, 
    getUserId,
    getThemeColor 
  } = useTelegram();
  
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="p-4">Загрузка...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-2">
          🧪 Тест Telegram интеграции
        </h1>
        <p className="text-gray-600">
          Проверка работы Telegram Mini App функциональности
        </p>
      </div>

      {/* Статус Telegram */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-blue-500">📱</span>
          Статус Telegram
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Telegram Web App:</span>
            <span className={`px-2 py-1 rounded text-sm font-medium ${
              isTelegramApp() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isTelegramApp() ? '✅ Да' : '❌ Нет'}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Готовность:</span>
            <span className={`px-2 py-1 rounded text-sm font-medium ${
              isReady ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isReady ? '✅ Готов' : '⏳ Загрузка...'}
            </span>
          </div>
        </div>
      </div>

      {/* Информация о пользователе */}
      {user && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-blue-500">👤</span>
            Информация о пользователе
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">Имя:</span>
              <span className="text-blue-700">{getUserName()}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">ID:</span>
              <span className="text-blue-700">{getUserId()}</span>
            </div>
            
            {user.username && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Username:</span>
                <span className="text-blue-700">@{user.username}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Тема Telegram */}
      {theme && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-blue-500">🎨</span>
            Тема Telegram
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Цвет фона:</span>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded border border-gray-300"
                  style={{ backgroundColor: getThemeColor('background') }}
                ></div>
                <span className="text-sm font-mono">{getThemeColor('background')}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Цвет текста:</span>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded border border-gray-300"
                  style={{ backgroundColor: getThemeColor('text') }}
                ></div>
                <span className="text-sm font-mono">{getThemeColor('text')}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Основной цвет:</span>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded border border-gray-300"
                  style={{ backgroundColor: getThemeColor('primary') }}
                ></div>
                <span className="text-sm font-mono">{getThemeColor('primary')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Тестовые кнопки */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-blue-500">🧪</span>
          Тестовые функции
        </h2>
        
        <div className="space-y-3">
          <button 
            onClick={() => {
              if (typeof window !== 'undefined' && 'Telegram' in window) {
                console.log('Telegram Web App доступен');
                console.log('WebApp:', (window as any).Telegram);
              } else {
                console.log('Telegram Web App недоступен');
              }
            }}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            🔍 Проверить Telegram Web App в консоли
          </button>
          
          <button 
            onClick={() => {
              console.log('Текущий пользователь:', user);
              console.log('Текущая тема:', theme);
              console.log('Готовность:', isReady);
            }}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            📊 Вывести данные в консоль
          </button>
        </div>
      </div>

      {/* Инструкции */}
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <h3 className="font-semibold text-yellow-800 mb-2">💡 Как протестировать:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Откройте DevTools (F12) и перейдите на вкладку Console</li>
          <li>• Нажмите кнопки выше для проверки функциональности</li>
          <li>• В Telegram: найдите бота и нажмите "Открыть приложение"</li>
          <li>• Вне Telegram: приложение работает в fallback режиме</li>
        </ul>
      </div>
    </div>
  );
} 