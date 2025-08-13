'use client';

import { useState, useEffect } from 'react';
import { useTelegram } from '@/hooks/useTelegram';
import Icon from './Icon';

export default function TelegramTest() {
  const { user, isTelegramApp, isReady } = useTelegram();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const runBasicTests = () => {
    addTestResult('Запуск базовых тестов...');
    
    // Тест 1: Проверка доступности Telegram
    if (isTelegramApp()) {
      addTestResult('Telegram Web App доступен');
    } else {
      addTestResult('Telegram Web App недоступен');
    }
    
    // Тест 2: Проверка готовности
    if (isReady) {
      addTestResult('Приложение готово');
    } else {
      addTestResult('Приложение загружается...');
    }
    
    // Тест 3: Проверка пользователя
    if (user) {
      addTestResult(`Пользователь: ${user.first_name} ${user.last_name || ''}`);
    } else {
      addTestResult('Пользователь не найден');
    }
  };

  const runAdvancedTests = () => {
    addTestResult('Запуск расширенных тестов...');
    
    try {
      // Тест Web App API
      if (typeof window !== 'undefined' && 'Telegram' in window) {
        const WebApp = (window as any).Telegram?.WebApp;
        if (WebApp) {
          addTestResult(`Web App версия: ${WebApp.version}`);
          addTestResult(`Платформа: ${WebApp.platform}`);
          addTestResult(`Цветовая схема: ${WebApp.colorScheme}`);
        } else {
          addTestResult('Web App API недоступен');
        }
      } else {
        addTestResult('Telegram объект не найден');
      }
    } catch (error) {
      addTestResult(`Ошибка тестирования: ${error}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Заголовок */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Тест Telegram интеграции</h1>
        <p className="text-gray-600 font-medium">Проверь работу Telegram Mini App функций</p>
      </div>

      {/* Статус Telegram */}
      <div className="glass-effect rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 animate-slide-up">
        <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
          <Icon name="chat" size={20} />
          Статус Telegram
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-blue-500 text-2xl mb-2">
              <Icon name="chat" size={24} />
            </div>
            <h4 className="font-medium text-black">Telegram Web App</h4>
            <p className="text-sm text-gray-600">
              {isTelegramApp() ? 'Да' : 'Нет'}
            </p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-green-500 text-2xl mb-2">
              <Icon name="system" size={24} />
            </div>
            <h4 className="font-medium text-black">Готовность</h4>
            <p className="text-sm text-gray-600">
              {isReady ? 'Готов' : 'Загрузка...'}
            </p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-purple-500 text-2xl mb-2">
              <Icon name="user" size={24} />
            </div>
            <h4 className="font-medium text-black">Пользователь</h4>
            <p className="text-sm text-gray-600">
              {user ? 'Да' : 'Нет'}
            </p>
          </div>
        </div>
      </div>

      {/* Информация о пользователе */}
      {user && (
        <div className="glass-effect rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 animate-slide-up">
          <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
            <Icon name="user" size={20} />
            Информация о пользователе
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-black mb-2">Имя</h4>
              <p className="text-gray-600">{user.first_name} {user.last_name || ''}</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-black mb-2">Username</h4>
              <p className="text-gray-600">@{user.username || 'не указан'}</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-black mb-2">ID</h4>
              <p className="text-gray-600">{user.id}</p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-black mb-2">Язык</h4>
              <p className="text-gray-600">{user.language_code || 'не указан'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Тестирование функций */}
      <div className="glass-effect rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 animate-slide-up">
        <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
          <Icon name="system" size={20} />
          Тестирование функций
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={runBasicTests}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-300"
          >
            Запустить базовые тесты
          </button>
          
          <button
            onClick={runAdvancedTests}
            className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors duration-300"
          >
            Запустить расширенные тесты
          </button>
        </div>
        
        <div className="flex justify-between items-center">
          <button
            onClick={clearResults}
            className="px-4 py-2 text-gray-600 hover:text-red-600 underline font-medium transition-colors duration-300"
          >
            Очистить результаты
          </button>
          
          <div className="text-sm text-gray-600 font-medium">
            Тестов выполнено: {testResults.length}
          </div>
        </div>
      </div>

      {/* Результаты тестов */}
      {testResults.length > 0 && (
        <div className="glass-effect rounded-2xl shadow-lg border border-gray-200 p-6 animate-slide-up">
          <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
            <Icon name="info" size={20} />
            Результаты тестов
          </h3>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm font-mono">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Инструкции */}
      <div className="glass-effect rounded-2xl shadow-lg border border-gray-200 p-6 animate-slide-up">
        <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
          <Icon name="info" size={20} />
          Как протестировать:
        </h3>
        
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <span className="text-[#f8cf5d] font-bold">1.</span>
            <span>Откройте DevTools (F12) → Console</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#f8cf5d] font-bold">2.</span>
            <span>Нажмите кнопку "Запустить базовые тесты"</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#f8cf5d] font-bold">3.</span>
            <span>Проверьте, что нет ошибок в консоли</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#f8cf5d] font-bold">4.</span>
            <span>В Telegram: найдите бота и откройте Mini App</span>
          </div>
        </div>
      </div>
    </div>
  );
} 