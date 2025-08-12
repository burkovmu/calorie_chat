# 🤖 Интеграция с Telegram Mini App

## 📱 Что такое Telegram Mini App

Telegram Mini App - это веб-приложения, которые работают внутри Telegram и предоставляют пользователям доступ к функциональности без необходимости покидать мессенджер.

## 🚀 Преимущества для Calorie Chat AI

- **Встроенная аутентификация** через Telegram
- **Готовые пользователи** - не нужно регистрироваться
- **Push-уведомления** через Telegram
- **Поделиться** результатами в чатах
- **Кроссплатформенность** - работает на всех устройствах

## 🔧 Настройка Telegram Bot

### 1. Создание бота

1. Напишите [@BotFather](https://t.me/botfather) в Telegram
2. Отправьте команду `/newbot`
3. Следуйте инструкциям:
   - Введите название бота (например: "Calorie Chat AI")
   - Введите username (например: "calorie_chat_ai_bot")
4. Сохраните полученный токен бота

### 2. Настройка Mini App

1. Отправьте команду `/newapp` боту @BotFather
2. Выберите созданный бот
3. Введите название приложения
4. Загрузите иконку (512x512px)
5. Получите ссылку на приложение

### 3. Настройка команд бота

Отправьте боту @BotFather:

```
/setcommands
calorie_chat_ai_bot
start - Запустить приложение
help - Помощь
settings - Настройки
```

## 🌐 Интеграция в веб-приложение

### 1. Добавление Telegram Web App SDK

```bash
npm install @twa-dev/sdk
```

### 2. Инициализация в компоненте

```tsx
import { WebApp } from '@twa-dev/sdk';

useEffect(() => {
  // Инициализация Telegram Web App
  WebApp.ready();
  
  // Настройка темы
  WebApp.setHeaderColor('#3b82f6');
  WebApp.setBackgroundColor('#f9fafb');
  
  // Получение данных пользователя
  const user = WebApp.initDataUnsafe?.user;
  if (user) {
    console.log('Telegram user:', user);
  }
}, []);
```

### 3. Адаптация под Telegram

```tsx
// Использование Telegram цветов
const telegramColors = {
  primary: WebApp.themeParams.button_color || '#3b82f6',
  text: WebApp.themeParams.text_color || '#000000',
  background: WebApp.themeParams.bg_color || '#ffffff',
};

// Адаптация под размер окна Telegram
const viewportHeight = WebApp.viewportHeight;
const viewportStableHeight = WebApp.viewportStableHeight;
```

## 📋 Структура Telegram Mini App

### 1. Основные файлы

```
src/
├── components/
│   ├── TelegramProvider.tsx    # Провайдер Telegram контекста
│   ├── TelegramAuth.tsx        # Компонент аутентификации
│   └── TelegramShare.tsx       # Компонент для шаринга
├── hooks/
│   └── useTelegram.ts          # Хук для работы с Telegram API
├── lib/
│   └── telegram.ts             # Утилиты для Telegram
└── types/
    └── telegram.ts             # Типы Telegram
```

### 2. Telegram Provider

```tsx
// src/components/TelegramProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { WebApp } from '@twa-dev/sdk';

interface TelegramContextType {
  user: any;
  theme: any;
  isReady: boolean;
  share: (text: string) => void;
}

const TelegramContext = createContext<TelegramContextType | null>(null);

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    WebApp.ready();
    setUser(WebApp.initDataUnsafe?.user);
    setTheme(WebApp.themeParams);
    setIsReady(true);
  }, []);

  const share = (text: string) => {
    WebApp.showPopup({
      title: 'Поделиться',
      message: text,
      buttons: [
        { text: 'Поделиться', type: 'default' },
        { text: 'Отмена', type: 'cancel' }
      ]
    });
  };

  return (
    <TelegramContext.Provider value={{ user, theme, isReady, share }}>
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
```

### 3. Адаптация ChatPage

```tsx
// src/components/ChatPage.tsx
import { useTelegram } from './TelegramProvider';

export default function ChatPage() {
  const { user, theme, share } = useTelegram();
  
  // Использование Telegram данных
  const [userId] = useState(user?.id?.toString() || 'demo-user');
  
  // Шаринг результатов
  const handleShare = () => {
    if (pendingMeal) {
      const shareText = `🍽️ Я съел ${pendingMeal.total_calories} ккал:\n${pendingMeal.products.map(p => `• ${p.name} - ${p.calories} ккал`).join('\n')}`;
      share(shareText);
    }
  };
  
  // ... остальной код
}
```

## 🎨 Адаптация дизайна

### 1. Telegram цветовая схема

```css
/* src/app/globals.css */
:root {
  --tg-theme-bg-color: #ffffff;
  --tg-theme-text-color: #000000;
  --tg-theme-button-color: #3b82f6;
  --tg-theme-button-text-color: #ffffff;
  --tg-theme-hint-color: #999999;
  --tg-theme-link-color: #3b82f6;
  --tg-theme-secondary-bg-color: #f1f1f1;
}

/* Использование Telegram цветов */
.telegram-theme {
  background-color: var(--tg-theme-bg-color);
  color: var(--tg-theme-text-color);
}

.telegram-button {
  background-color: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
}
```

### 2. Адаптивные размеры

```css
/* Мобильные размеры для Telegram */
@media (max-width: 480px) {
  .telegram-container {
    padding: 0.5rem;
  }
  
  .telegram-button {
    min-height: 48px;
    font-size: 16px;
  }
  
  .telegram-input {
    min-height: 48px;
    font-size: 16px;
  }
}
```

## 🔐 Аутентификация через Telegram

### 1. Валидация данных

```tsx
// src/lib/telegram.ts
import crypto from 'crypto';

export function validateTelegramData(initData: string, botToken: string): boolean {
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
  
  // Создаем секретный ключ
  const secretKey = crypto.createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();
  
  // Вычисляем хеш
  const calculatedHash = crypto.createHmac('sha256', secretKey)
    .update(params)
    .digest('hex');
  
  return calculatedHash === hash;
}
```

### 2. Интеграция с Supabase

```tsx
// src/lib/supabase.ts
import { supabase } from './supabase';

export async function signInWithTelegram(initData: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `telegram_${Date.now()}@telegram.app`,
      password: initData, // Используем initData как пароль
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Telegram auth error:', error);
    throw error;
  }
}
```

## 📱 Оптимизация для мобильных

### 1. Touch-friendly интерфейс

```css
/* Минимальные размеры для касания */
.touch-target {
  min-width: 44px;
  min-height: 44px;
}

/* Отступы между элементами */
.touch-spacing {
  margin: 8px;
  padding: 12px;
}
```

### 2. Жесты и анимации

```css
/* Плавные переходы */
.smooth-transition {
  transition: all 0.2s ease;
}

/* Анимации для мобильных */
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.slide-up {
  animation: slideUp 0.3s ease-out;
}
```

## 🚀 Деплой для Telegram

### 1. Подготовка к продакшену

```bash
# Сборка для продакшена
npm run build

# Проверка сборки
npm run start
```

### 2. Настройка домена

1. Загрузите приложение на хостинг (Vercel, Netlify)
2. Убедитесь, что домен использует HTTPS
3. Обновите ссылку в настройках бота

### 3. Тестирование

1. Откройте бота в Telegram
2. Нажмите на кнопку Mini App
3. Протестируйте все функции
4. Проверьте на разных устройствах

## 📊 Аналитика и мониторинг

### 1. Telegram Analytics

```tsx
// Отправка событий в Telegram
WebApp.sendData('meal_added', {
  calories: meal.total_calories,
  products_count: meal.products.length,
  timestamp: new Date().toISOString()
});
```

### 2. Обработка ошибок

```tsx
// Логирование ошибок
WebApp.showAlert('Произошла ошибка при анализе еды');
WebApp.showPopup({
  title: 'Ошибка',
  message: 'Не удалось проанализировать описание еды',
  buttons: [{ text: 'OK', type: 'default' }]
});
```

## 🔮 Дальнейшее развитие

### 1. Дополнительные функции

- **Push-уведомления** о приемах пищи
- **Интеграция с календарем** Telegram
- **Шаринг рецептов** в чаты
- **Групповые цели** по калориям

### 2. Оптимизация

- **Lazy loading** компонентов
- **Service Worker** для офлайн работы
- **Кэширование** данных
- **Оптимизация изображений**

---

## 📞 Поддержка

При возникновении проблем:

1. Проверьте [документацию Telegram Bot API](https://core.telegram.org/bots/api)
2. Обратитесь в [Telegram Bot Support](https://t.me/botsupport)
3. Создайте Issue в репозитории проекта

**Удачи с интеграцией! 🚀** 