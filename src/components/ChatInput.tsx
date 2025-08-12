'use client';

import { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (!text.trim() || disabled) return;
    
    onSend(text.trim());
    setText('');
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-end gap-2 sm:gap-3">
      {/* Поле ввода - адаптивное для мобильных */}
      <div className="flex-1 relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Опиши что ты съел... Например: куриная грудка 150г, салат из огурцов и помидоров, кусочек хлеба"
          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed mobile-input text-sm sm:text-base text-gray-900 bg-white placeholder-gray-500"
          rows={2}
          maxLength={1000}
          disabled={disabled}
        />
        
        {/* Счетчик символов - адаптивный */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          {text.length}/1000
        </div>
      </div>

      {/* Кнопка отправки - адаптивная для мобильных */}
      <button
        onClick={handleSubmit}
        disabled={!text.trim() || disabled}
        className="px-4 sm:px-6 py-2 sm:py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mobile-button text-sm sm:text-base whitespace-nowrap"
      >
        {disabled ? (
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
            <span className="hidden sm:inline">Отправка...</span>
            <span className="sm:hidden">...</span>
          </div>
        ) : (
          <>
            <span className="hidden sm:inline">Отправить</span>
            <span className="sm:hidden">→</span>
          </>
        )}
      </button>
    </div>
  );
} 