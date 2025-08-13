// Конфигурация для Telegram Mini App
export const TELEGRAM_CONFIG = {
  // Название бота (замените на свое)
  BOT_NAME: 'Calorie Chat AI Bot',
  
  // Username бота (замените на свое)
  BOT_USERNAME: 'calorie_chat_ai_bot',
  
  // Токен бота (замените на свой)
  BOT_TOKEN: process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || '',
  
  // Название Mini App
  APP_NAME: 'Calorie Chat AI',
  
  // Описание Mini App
  APP_DESCRIPTION: 'Умный подсчет калорий через чат с ИИ',
  
  // Команды бота
  BOT_COMMANDS: [
    { command: 'start', description: 'Запустить приложение' },
    { command: 'help', description: 'Помощь по использованию' },
    { command: 'settings', description: 'Настройки' },
    { command: 'stats', description: 'Статистика калорий' },
    { command: 'goal', description: 'Установить цель по калориям' },
  ],
  
  // Настройки Mini App
  APP_SETTINGS: {
    // Цвета по умолчанию
    DEFAULT_COLORS: {
      header: '#f8cf5d', // Золотой цвет для шапки
      background: '#f9fafb',
      primary: '#f8cf5d', // Основной цвет тоже золотой
      secondary: '#f1f1f1',
      text: '#000000',
      textSecondary: '#666666',
    },
    
    // Размеры
    SIZES: {
      buttonHeight: 48,
      inputHeight: 48,
      borderRadius: 8,
      padding: 16,
    },
    
    // Анимации
    ANIMATIONS: {
      duration: 200,
      easing: 'ease',
    },
  },
  
  // Сообщения бота
  MESSAGES: {
    WELCOME: 'Привет! Я помогу тебе вести дневник питания и подсчитывать калории. Нажми кнопку ниже, чтобы открыть приложение.',
    HELP: `Доступные команды:
/start - Запустить приложение
/help - Показать эту справку
/settings - Настройки
/stats - Статистика калорий
/goal - Установить цель по калориям`,
    ERROR: 'Произошла ошибка. Попробуйте еще раз.',
    NOT_FOUND: 'Команда не найдена. Используйте /help для справки.',
  },
  
  // Настройки уведомлений
  NOTIFICATIONS: {
    ENABLED: true,
    TYPES: {
      MEAL_ADDED: 'meal_added',
      GOAL_REACHED: 'goal_reached',
      REMINDER: 'reminder',
    },
    SCHEDULE: {
      BREAKFAST: '08:00',
      LUNCH: '13:00',
      DINNER: '19:00',
      SNACK: '15:00',
    },
  },
  
  // Настройки аналитики
  ANALYTICS: {
    ENABLED: true,
    EVENTS: {
      APP_OPENED: 'app_opened',
      MEAL_ADDED: 'meal_added',
      MEAL_EDITED: 'meal_edited',
      MEAL_DELETED: 'meal_deleted',
      GOAL_SET: 'goal_set',
      SHARE_USED: 'share_used',
    },
  },
  
  // Настройки безопасности
  SECURITY: {
    // Валидация данных Telegram
    VALIDATE_INIT_DATA: true,
    
    // Максимальный размер сообщения
    MAX_MESSAGE_LENGTH: 1000,
    
    // Таймаут сессии (в секундах)
    SESSION_TIMEOUT: 3600,
  },
  
  // Настройки производительности
  PERFORMANCE: {
    // Кэширование данных
    CACHE_ENABLED: true,
    CACHE_TTL: 300, // 5 минут
    
    // Ленивая загрузка
    LAZY_LOADING: true,
    
    // Оптимизация изображений
    IMAGE_OPTIMIZATION: true,
  },
};

// Проверка конфигурации
export const validateTelegramConfig = () => {
  const requiredFields = ['BOT_TOKEN'];
  const missingFields = requiredFields.filter(field => !TELEGRAM_CONFIG[field as keyof typeof TELEGRAM_CONFIG]);
  
  if (missingFields.length > 0) {
    console.warn(`Missing required Telegram config fields: ${missingFields.join(', ')}`);
    return false;
  }
  
  return true;
};

// Получение конфигурации для окружения
export const getTelegramConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    ...TELEGRAM_CONFIG,
    isProduction,
    // В продакшене используем строгую валидацию
    SECURITY: {
      ...TELEGRAM_CONFIG.SECURITY,
      VALIDATE_INIT_DATA: isProduction,
    },
  };
}; 