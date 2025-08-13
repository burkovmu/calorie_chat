'use client';

import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import MealCard from './MealCard';
import { useChatStore } from '../lib/store';
import { Message, Meal } from '../types';
import { useTelegram } from '../hooks/useTelegram';

export default function ChatPage() {
  const { messages, addMessage, pendingMeal, setPendingMeal, isLoading, setLoading, error, setError } = useChatStore();
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null);
  const [inputText, setInputText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { getUserId, getUserName, shareMeal, showAlert, isTelegramApp } = useTelegram();

  // Добавляем приветственное сообщение при первом загрузке
  useEffect(() => {
    const hasShownWelcome = sessionStorage.getItem('calorie-chat-welcome-shown');
    
    if (!hasShownWelcome && messages.length === 0) {
      const userName = getUserName();
      const welcomeMessage: Omit<Message, 'id' | 'timestamp'> = {
        role: 'assistant',
        text: `Привет, ${userName}! Я помогу тебе подсчитать калории. Просто опиши, что ты съел, и я проанализирую это для тебя.`,
      };
      addMessage(welcomeMessage);
      sessionStorage.setItem('calorie-chat-welcome-shown', 'true');
    }
  }, [messages.length, addMessage]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const messageText = inputText.trim();
    
    const userMessage: Omit<Message, 'id' | 'timestamp'> = {
      role: 'user',
      text: messageText,
    };

    addMessage(userMessage);
    setInputText('');
    setLoading(true);
    setError(null);

    try {
      // Отправляем запрос на анализ
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: messageText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Добавляем ответ ассистента
        const assistantMessage: Omit<Message, 'id' | 'timestamp'> = {
          role: 'assistant',
          text: data.displayText,
        };
        addMessage(assistantMessage);
        
        // Устанавливаем данные о еде для отображения
        setPendingMeal(data.mealData);
        setCurrentMeal(data.mealData);
      } else {
        throw new Error(data.error || 'Неизвестная ошибка');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при отправке сообщения';
      setError(errorMessage);
      
      // Добавляем сообщение об ошибке от ассистента
      const errorAssistantMessage: Omit<Message, 'id' | 'timestamp'> = {
        role: 'assistant',
        text: `Извините, произошла ошибка: ${errorMessage}. Попробуйте еще раз или опишите еду по-другому.`,
      };
      addMessage(errorAssistantMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMeal = async () => {
    if (!currentMeal || isSaving) return;

    setIsSaving(true);
    setError(null);

    try {
      // Используем Telegram userId или демо-режим
      const userId = getUserId();

      const response = await fetch('/api/saveMeal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId,
          mealData: currentMeal 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Добавляем сообщение об успешном сохранении
        const successMessage: Omit<Message, 'id' | 'timestamp'> = {
          role: 'assistant',
          text: 'Прием пищи успешно сохранен в дневник!',
        };
        addMessage(successMessage);
        
        // Очищаем текущую еду
        setCurrentMeal(null);
        setPendingMeal(null);
      } else {
        throw new Error(data.error || 'Неизвестная ошибка');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при сохранении';
      setError(errorMessage);
      
      // Добавляем сообщение об ошибке от ассистента
      const errorAssistantMessage: Omit<Message, 'id' | 'timestamp'> = {
        role: 'assistant',
        text: `Извините, произошла ошибка при сохранении: ${errorMessage}. Попробуйте еще раз.`,
      };
      addMessage(errorAssistantMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditMeal = (meal: Meal) => {
    // Пока что просто обновляем текущую еду
    setCurrentMeal(meal);
    setPendingMeal(meal);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    
    // Автоматическое изменение размера поля ввода
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Основной контент с отступом снизу для поля ввода */}
      <div className="flex-1 overflow-y-auto px-4 pb-32">
        <div className="max-w-4xl mx-auto">
          <MessageList messages={messages} />
          
          {/* Карточка еды */}
          {currentMeal && (
            <div className="mt-4">
              <MealCard 
                meal={currentMeal} 
                onConfirm={handleSaveMeal}
                onEdit={handleEditMeal}
                isLoading={isSaving}
              />
            </div>
          )}

          {/* Индикатор загрузки */}
          {isLoading && (
            <div className="flex justify-center items-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f8cf5d]"></div>
              <span className="ml-3 text-black font-medium">Анализирую...</span>
            </div>
          )}

          {/* Ошибка */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4 animate-slide-up">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Поле для ввода сообщения - прикреплено к низу экрана */}
      <div className="fixed bottom-20 left-0 right-0 z-40 px-4 pb-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <div className="relative bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 focus-within:border-[#f8cf5d] focus-within:shadow-2xl focus-within:shadow-[#f8cf5d]/30">
                <textarea
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  onKeyDown={handleKeyDown}
                  placeholder="Опиши что ты съел..."
                  className="w-full h-full px-6 py-3 pr-20 bg-transparent resize-none focus:outline-none text-black placeholder-gray-500 font-medium text-base leading-relaxed"
                  rows={1}
                  style={{ 
                    height: '45px',
                    minHeight: '45px',
                    maxHeight: '96px'
                  }}
                  disabled={isLoading}
                />
                
                
                {/* Кнопка отправки */}
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-[45px] w-[45px] bg-[#f8cf5d] hover:shadow-lg hover:shadow-[#f8cf5d]/30 text-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#f8cf5d]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center group"
                  title="Отправить сообщение"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
                  ) : (
                    <svg 
                      className="w-4 h-4 transform group-hover:scale-110 transition-transform duration-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2.5} 
                        d="M5 12h14M12 5l7 7-7 7" 
                      />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Подсказка */}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 