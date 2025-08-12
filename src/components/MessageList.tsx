'use client';

import { Message } from '@/types';
import dayjs from 'dayjs';

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const formatTime = (timestamp: Date) => {
    return dayjs(timestamp).format('HH:mm');
  };

  const getMessageStyle = (role: Message['role']) => {
    switch (role) {
      case 'user':
        return 'bg-primary-500 text-white ml-auto max-w-[85%] sm:max-w-[80%] rounded-2xl rounded-br-md';
      case 'assistant':
        return 'bg-white text-gray-900 border border-gray-200 mr-auto max-w-[85%] sm:max-w-[80%] rounded-2xl rounded-bl-md';
      case 'system':
        return 'bg-green-50 text-green-800 border border-green-200 mx-auto max-w-[95%] sm:max-w-[90%] rounded-lg text-center';
      default:
        return 'bg-gray-100 text-gray-900 mx-auto max-w-[85%] sm:max-w-[80%] rounded-lg';
    }
  };

  const getRoleIcon = (role: Message['role']) => {
    switch (role) {
      case 'user':
        return '👤';
      case 'assistant':
        return '🤖';
      case 'system':
        return '✅';
      default:
        return '💬';
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="flex items-start gap-2 sm:gap-3 animate-fade-in">
          {/* Иконка роли - адаптивная */}
          <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs sm:text-sm">
            {getRoleIcon(message.role)}
          </div>

          {/* Сообщение - адаптивное */}
          <div className={`px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base ${getMessageStyle(message.role)}`}>
            {/* Текст сообщения */}
            <div className="whitespace-pre-wrap break-words leading-relaxed">
              {message.text}
            </div>
            
            {/* Время - адаптивное */}
            <div className={`text-xs mt-1 sm:mt-2 ${
              message.role === 'user' ? 'text-primary-100' : 'text-gray-500'
            }`}>
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>
      ))}

      {/* Пустое состояние - адаптивное */}
      {messages.length === 0 && (
        <div className="text-center py-8 sm:py-12 text-gray-500">
          <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🍽️</div>
          <p className="text-base sm:text-lg font-medium">Начни чат!</p>
          <p className="text-xs sm:text-sm mt-1">Опиши что ты съел, и я помогу подсчитать калории</p>
        </div>
      )}
    </div>
  );
} 