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
        return 'bg-[#f8cf5d] text-black ml-auto max-w-[85%] sm:max-w-[80%] rounded-2xl rounded-br-md shadow-lg shadow-[#f8cf5d]/30';
      case 'assistant':
        return 'bg-white text-black border border-gray-200 mr-auto max-w-[85%] sm:max-w-[80%] rounded-2xl rounded-bl-md shadow-sm hover:shadow-md transition-shadow duration-300';
      case 'system':
        return 'bg-gray-50 text-black border border-gray-200 mx-auto max-w-[95%] sm:max-w-[90%] rounded-lg text-center shadow-sm';
      default:
        return 'bg-gray-50 text-black mx-auto max-w-[85%] sm:max-w-[80%] rounded-lg shadow-sm';
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
    <div className="space-y-4 py-4">
      {messages.map((message) => (
        <div key={message.id} className="flex items-start gap-3 animate-slide-up">
          {/* Иконка роли */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm border border-gray-200 shadow-sm">
            {getRoleIcon(message.role)}
          </div>

          {/* Сообщение */}
          <div className={`px-4 py-3 text-sm ${getMessageStyle(message.role)}`}>
            {/* Текст сообщения */}
            <div className="whitespace-pre-wrap break-words leading-relaxed">
              {message.text}
            </div>
            
            {/* Время */}
            <div className={`text-xs mt-2 ${
              message.role === 'user' ? 'text-black/70' : 'text-gray-600'
            }`}>
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>
      ))}

      {/* Пустое состояние с красивым дизайном */}
      {messages.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <div className="relative">
            <div className="text-6xl mb-6">🍽️</div>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200/20 to-gray-300/20 rounded-full blur-xl"></div>
          </div>
          <p className="text-xl font-semibold text-black mb-2">Начни чат!</p>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Опиши что ты съел, и я помогу подсчитать калории
          </p>
        </div>
      )}
    </div>
  );
} 