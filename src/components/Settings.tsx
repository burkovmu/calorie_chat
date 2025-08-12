'use client';

import { useState } from 'react';

export default function Settings() {
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('ru');

  const handleSave = () => {
    // Здесь будет логика сохранения настроек
    alert('Настройки сохранены!');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Заголовок */}
      <div className="text-center mb-6">
        <p className="text-gray-600 font-medium">Настройте приложение под свои потребности</p>
      </div>

      {/* Основные настройки */}
      <div className="glass-effect rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 animate-slide-up">
        <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
          <span className="text-[#f8cf5d]">🎯</span>
          Основные настройки
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Дневная цель по калориям
            </label>
            <input
              type="number"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(Number(e.target.value))}
              min="800"
              max="5000"
              step="50"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f8cf5d] focus:border-[#f8cf5d] bg-white transition-all duration-300"
            />
            <p className="text-xs text-gray-500 mt-1 font-medium">
              Рекомендуется: 1200-2500 ккал в день
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Язык интерфейса
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f8cf5d] focus:border-[#f8cf5d] bg-white transition-all duration-300"
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      {/* Уведомления */}
      <div className="glass-effect rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 animate-slide-up">
        <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
          <span className="text-[#f8cf5d]">🔔</span>
          Уведомления
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-black">Включить уведомления</h4>
              <p className="text-sm text-gray-600">Получать напоминания о приемах пищи</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f8cf5d]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f8cf5d]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Внешний вид */}
      <div className="glass-effect rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 animate-slide-up">
        <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
          <span className="text-[#f8cf5d]">🎨</span>
          Внешний вид
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-black">Темная тема</h4>
              <p className="text-sm text-gray-600">Использовать темный режим интерфейса</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f8cf5d]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f8cf5d]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Информация о приложении */}
      <div className="glass-effect rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 animate-slide-up">
        <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
          <span className="text-[#f8cf5d]">ℹ️</span>
          О приложении
        </h3>
        
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Версия:</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>Разработчик:</span>
            <span className="font-medium">Calorie Chat AI Team</span>
          </div>
          <div className="flex justify-between">
            <span>Дата сборки:</span>
            <span className="font-medium">{new Date().toLocaleDateString('ru-RU')}</span>
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="flex space-x-4">
        <button
          onClick={handleSave}
          className="flex-1 bg-[#f8cf5d] text-black py-3 px-6 rounded-lg font-medium hover:shadow-lg hover:shadow-[#f8cf5d]/30 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          💾 Сохранить настройки
        </button>
        
        <button
          onClick={() => {
            setDailyGoal(2000);
            setNotifications(true);
            setDarkMode(false);
            setLanguage('ru');
          }}
          className="px-6 py-3 border border-gray-200 text-black rounded-lg font-medium hover:bg-gray-50 hover:border-[#f8cf5d] transition-all duration-300"
        >
          🔄 Сбросить
        </button>
      </div>
    </div>
  );
} 