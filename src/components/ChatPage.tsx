'use client';

import { useState, useEffect } from 'react';
import { useChatStore } from '@/lib/store';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import MealCard from './MealCard';
import { Meal } from '@/types';

export default function ChatPage() {
  const { 
    messages, 
    pendingMeal, 
    isLoading, 
    error,
    addMessage, 
    setPendingMeal, 
    setLoading, 
    setError 
  } = useChatStore();

  // Используем UUID для демо-пользователя (в реальном приложении это будет ID из Supabase Auth)
  const [userId] = useState('550e8400-e29b-41d4-a716-446655440000');

  useEffect(() => {
    // Добавляем приветственное сообщение
    if (messages.length === 0) {
      addMessage({
        role: 'assistant',
        text: 'Привет! Я помогу тебе подсчитать калории. Просто опиши, что ты съел, и я проанализирую это для тебя.'
      });
    }
  }, [messages.length, addMessage]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Добавляем сообщение пользователя
    addMessage({ role: 'user', text });
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка анализа');
      }

      // Добавляем ответ ИИ
      addMessage({ 
        role: 'assistant', 
        text: data.displayText,
        meta: { mealData: data.mealData }
      });

      // Устанавливаем pending meal для редактирования
      setPendingMeal(data.mealData);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      addMessage({ 
        role: 'assistant', 
        text: `Извини, произошла ошибка: ${errorMessage}. Попробуй еще раз или опиши еду по-другому.`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!pendingMeal) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/saveMeal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          mealData: pendingMeal 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка сохранения');
      }

      // Добавляем системное сообщение об успешном сохранении
      addMessage({ 
        role: 'system', 
        text: `✅ Прием пищи сохранен в дневник! Всего калорий: ${pendingMeal.total_calories} ккал` 
      });

      // Очищаем pending meal
      setPendingMeal(null);
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      setError(error instanceof Error ? error.message : 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (updatedMeal: Meal) => {
    setPendingMeal(updatedMeal);
  };

  return (
    <div className="flex flex-col h-screen h-dvh bg-gray-50 safe-area">
      {/* Заголовок - адаптивный для мобильных */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 safe-top">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left">
          🍽️ Calorie Chat AI
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 text-center sm:text-left">
          Опиши что съел, и ИИ подсчитает калории
        </p>
      </div>

      {/* Основной контент */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Список сообщений */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4 swipe-area">
          <MessageList messages={messages} />
          
          {/* Карточка с результатом анализа */}
          {pendingMeal && (
            <div className="mt-4 animate-slide-up">
              <MealCard 
                meal={pendingMeal} 
                onConfirm={handleConfirm}
                onEdit={handleEdit}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Индикатор загрузки */}
          {isLoading && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary-500"></div>
              <span className="ml-2 text-sm sm:text-base text-gray-600">Анализирую...</span>
            </div>
          )}

          {/* Ошибка */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mt-4 mx-2 sm:mx-0">
              <p className="text-sm sm:text-base text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Поле ввода - адаптивное для мобильных */}
        <div className="border-t border-gray-200 bg-white p-3 sm:p-6 safe-bottom">
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
} 