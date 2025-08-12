// Динамический импорт WebApp только на клиенте
let WebApp: any = null;
if (typeof window !== 'undefined') {
  try {
    WebApp = require('@twa-dev/sdk').default;
  } catch (error) {
    console.log('Telegram SDK not available');
  }
}

// Проверка, запущено ли приложение в Telegram
export const isTelegramWebApp = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'Telegram' in window && WebApp !== null;
};

// Получение данных пользователя
export const getTelegramUser = () => {
  if (!isTelegramWebApp() || !WebApp) return null;
  return WebApp.initDataUnsafe?.user || null;
};

// Получение темы Telegram
export const getTelegramTheme = () => {
  if (!isTelegramWebApp() || !WebApp) return null;
  return WebApp.themeParams || null;
};

// Валидация данных Telegram (для безопасности)
export const validateTelegramData = (initData: string, botToken: string): boolean => {
  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    
    if (!hash) return false;
    
    // Удаляем hash из параметров
    urlParams.delete('hash');
    
    // Сортируем параметры
    const params = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    // В продакшене здесь должна быть валидация через HMAC-SHA256
    // Для демо-версии просто проверяем наличие данных
    return params.length > 0;
  } catch (error) {
    console.error('Error validating Telegram data:', error);
    return false;
  }
};

// Настройка цветов Telegram
export const setupTelegramColors = () => {
  if (!isTelegramWebApp() || !WebApp) return;
  
  try {
    // Настройка цветов заголовка и фона
    if (WebApp.setHeaderColor) {
      WebApp.setHeaderColor('#3b82f6' as `#${string}`);
    }
    if (WebApp.setBackgroundColor) {
      WebApp.setBackgroundColor('#f9fafb' as `#${string}`);
    }
    
    // Настройка основной кнопки
    if (WebApp.MainButton && WebApp.MainButton.setText) {
      WebApp.MainButton.setText('Сохранить');
      WebApp.MainButton.setParams({
        color: '#3b82f6',
        text_color: '#ffffff',
      });
    }
  } catch (error) {
    console.error('Error setting up Telegram colors:', error);
  }
};

// Показ уведомлений через Telegram
export const showTelegramNotification = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
  if (!isTelegramWebApp() || !WebApp) {
    // Fallback для браузера
    console.log(`${type.toUpperCase()}: ${message}`);
    return;
  }
  
  try {
    if (WebApp.showAlert) {
      switch (type) {
        case 'success':
          WebApp.showAlert(message);
          break;
        case 'warning':
        case 'error':
          WebApp.showAlert(`⚠️ ${message}`);
          break;
        default:
          WebApp.showAlert(message);
      }
    }
  } catch (error) {
    console.error('Error showing Telegram notification:', error);
  }
};

// Шаринг данных через Telegram
export const shareViaTelegram = (text: string, title?: string) => {
  if (!isTelegramWebApp() || !WebApp) {
    // Fallback для браузера - копирование в буфер обмена
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('Текст скопирован в буфер обмена!');
    }
    return;
  }
  
  try {
    if (WebApp.showPopup) {
      WebApp.showPopup({
        title: title || 'Поделиться',
        message: text,
        buttons: [
          { id: 'share', type: 'ok' },
          { id: 'cancel', type: 'cancel' }
        ]
      });
    }
  } catch (error) {
    console.error('Error showing share popup:', error);
  }
};

// Получение размеров viewport Telegram
export const getTelegramViewport = () => {
  if (!isTelegramWebApp() || !WebApp) {
    return {
      height: window.innerHeight,
      stableHeight: window.innerHeight,
    };
  }
  
  return {
    height: WebApp.viewportHeight || window.innerHeight,
    stableHeight: WebApp.viewportStableHeight || window.innerHeight,
  };
};

// Настройка основной кнопки Telegram
export const setupMainButton = (text: string, onClick: () => void) => {
  if (!isTelegramWebApp() || !WebApp || !WebApp.MainButton) return;
  
  try {
    if (WebApp.MainButton.setText) WebApp.MainButton.setText(text);
    if (WebApp.MainButton.onClick) WebApp.MainButton.onClick(onClick);
    if (WebApp.MainButton.show) WebApp.MainButton.show();
  } catch (error) {
    console.error('Error setting up main button:', error);
  }
};

// Скрытие основной кнопки Telegram
export const hideMainButton = () => {
  if (!isTelegramWebApp() || !WebApp || !WebApp.MainButton) return;
  
  try {
    if (WebApp.MainButton.hide) WebApp.MainButton.hide();
  } catch (error) {
    console.error('Error hiding main button:', error);
  }
};

// Получение данных из localStorage (fallback для CloudStorage)
export const getTelegramStorage = async (key: string): Promise<string | null> => {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('Error getting from storage:', error);
    return null;
  }
};

// Сохранение данных в localStorage (fallback для CloudStorage)
export const setTelegramStorage = async (key: string, value: string): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error('Error setting storage:', error);
  }
};

// Инициализация Telegram Web App
export const initializeTelegram = () => {
  if (!isTelegramWebApp() || !WebApp) {
    console.log('Not running in Telegram Web App');
    return false;
  }
  
  try {
    if (WebApp.ready) WebApp.ready();
    setupTelegramColors();
    console.log('Telegram Web App initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Telegram Web App:', error);
    return false;
  }
}; 