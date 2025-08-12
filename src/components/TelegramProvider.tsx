'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import WebApp from '@twa-dev/sdk';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramTheme {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
}

interface TelegramContextType {
  user: TelegramUser | null;
  theme: TelegramTheme | null;
  isReady: boolean;
  share: (text: string) => void;
  showAlert: (message: string) => void;
  showPopup: (params: any) => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
}

const TelegramContext = createContext<TelegramContextType | null>(null);

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [theme, setTheme] = useState<TelegramTheme | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Проверяем, что мы на клиенте
    if (typeof window === 'undefined') return;
    
    try {
      // Проверяем, доступен ли Telegram Web App
      if (typeof WebApp !== 'undefined' && WebApp.ready) {
        // Инициализация Telegram Web App
        WebApp.ready();
        
        // Настройка цветов заголовка и фона
        WebApp.setHeaderColor('#3b82f6' as `#${string}`);
        WebApp.setBackgroundColor('#f9fafb' as `#${string}`);
        
        // Получение данных пользователя
        const telegramUser = WebApp.initDataUnsafe?.user;
        if (telegramUser) {
          setUser(telegramUser);
        }
        
        // Получение темы
        const telegramTheme = WebApp.themeParams;
        if (telegramTheme) {
          setTheme(telegramTheme);
        }
        
        console.log('Telegram Web App initialized successfully');
      } else {
        console.log('Telegram Web App not available, running in fallback mode');
      }
      
      setIsReady(true);
    } catch (error) {
      console.error('Error initializing Telegram Web App:', error);
      // Если не в Telegram, устанавливаем демо-режим
      setIsReady(true);
    }
  }, []);

  const share = (text: string) => {
    if (typeof window === 'undefined' || typeof WebApp === 'undefined') return;
    
    try {
      WebApp.showPopup({
        title: 'Поделиться',
        message: text,
        buttons: [
          { id: 'share', type: 'ok' },
          { id: 'cancel', type: 'cancel' }
        ]
      });
    } catch (error) {
      console.error('Error showing share popup:', error);
    }
  };

  const showAlert = (message: string) => {
    if (typeof window === 'undefined') {
      console.log('Alert (server):', message);
      return;
    }
    
    try {
      if (typeof WebApp !== 'undefined' && WebApp.showAlert) {
        WebApp.showAlert(message);
      } else {
        // Fallback для браузера
        alert(message);
      }
    } catch (error) {
      console.error('Error showing alert:', error);
      // Fallback для браузера
      alert(message);
    }
  };

  const showPopup = (params: any) => {
    try {
      WebApp.showPopup(params);
    } catch (error) {
      console.error('Error showing popup:', error);
    }
  };

  const setHeaderColor = (color: string) => {
    try {
      WebApp.setHeaderColor(color as `#${string}`);
    } catch (error) {
      console.error('Error setting header color:', error);
    }
  };

  const setBackgroundColor = (color: string) => {
    try {
      WebApp.setBackgroundColor(color as `#${string}`);
    } catch (error) {
      console.error('Error setting background color:', error);
    }
  };

  return (
    <TelegramContext.Provider value={{ 
      user, 
      theme, 
      isReady, 
      share, 
      showAlert, 
      showPopup,
      setHeaderColor,
      setBackgroundColor
    }}>
      {children}
    </TelegramContext.Provider>
  );
}

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within TelegramProvider');
  }
  return context;
}; 