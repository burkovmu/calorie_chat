# 🚀 Настройка Telegram Mini App для Calorie Chat AI

## 📋 Пошаговая инструкция

### 1. Создание Telegram бота

1. **Откройте Telegram** и найдите [@BotFather](https://t.me/botfather)
2. **Отправьте команду** `/newbot`
3. **Введите название бота**: `Calorie Chat AI Bot`
4. **Введите username**: `calorie_chat_ai_bot` (должен заканчиваться на `_bot`)
5. **Сохраните токен бота** - он понадобится позже

### 2. Настройка Mini App

1. **Отправьте команду** `/newapp` боту @BotFather
2. **Выберите созданный бот**
3. **Введите название приложения**: `Calorie Chat AI`
4. **Загрузите иконку** (512x512px) - можно использовать эмодзи 🍽️
5. **Получите ссылку на приложение**

### 3. Настройка команд бота

Отправьте боту @BotFather:

```
/setcommands
calorie_chat_ai_bot
start - Запустить приложение
help - Помощь по использованию
settings - Настройки
stats - Статистика калорий
goal - Установить цель по калориям
```

### 4. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```bash
# Telegram Bot Token
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_bot_token_here

# Supabase (если используется)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### 5. Настройка команд бота

Создайте файл `bot-commands.js` для настройки команд:

```javascript
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name;
  
  bot.sendMessage(chatId, 
    `Привет, ${userName}! 👋\n\nЯ помогу тебе вести дневник питания и подсчитывать калории.\n\nНажми кнопку ниже, чтобы открыть приложение:`, {
    reply_markup: {
      inline_keyboard: [[
        { text: '🍽️ Открыть Calorie Chat AI', web_app: { url: 'https://your-domain.com' } }
      ]]
    }
  });
});

// Команда /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, 
    `📚 Доступные команды:\n\n` +
    `/start - Запустить приложение\n` +
    `/help - Показать эту справку\n` +
    `/settings - Настройки\n` +
    `/stats - Статистика калорий\n` +
    `/goal - Установить цель по калориям\n\n` +
    `Для использования приложения нажми кнопку "Открыть Calorie Chat AI" в команде /start.`
  );
});

// Команда /stats
bot.onText(/\/stats/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, 
    `📊 Статистика калорий\n\n` +
    `Для просмотра подробной статистики откройте приложение через команду /start.`
  );
});

// Команда /goal
bot.onText(/\/goal/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, 
    `🎯 Установка цели по калориям\n\n` +
    `Для настройки целей по калориям откройте приложение через команду /start.`
  );
});

console.log('Telegram bot started!');
```

### 6. Деплой приложения

1. **Соберите приложение**:
   ```bash
   npm run build
   ```

2. **Загрузите на хостинг** (Vercel, Netlify, или свой сервер)

3. **Обновите ссылку в настройках бота**:
   - Отправьте `/myapps` боту @BotFather
   - Выберите ваше приложение
   - Обновите URL на новый домен

### 7. Тестирование

1. **Откройте бота** в Telegram
2. **Отправьте команду** `/start`
3. **Нажмите кнопку** "Открыть Calorie Chat AI"
4. **Протестируйте все функции**:
   - Анализ еды
   - Сохранение приемов пищи
   - Шаринг результатов
   - Настройки

## 🔧 Дополнительные настройки

### Настройка уведомлений

В файле `src/lib/telegram-config.ts` настройте:

```typescript
NOTIFICATIONS: {
  ENABLED: true,
  SCHEDULE: {
    BREAKFAST: '08:00',
    LUNCH: '13:00',
    DINNER: '19:00',
    SNACK: '15:00',
  },
}
```

### Настройка аналитики

```typescript
ANALYTICS: {
  ENABLED: true,
  EVENTS: {
    APP_OPENED: 'app_opened',
    MEAL_ADDED: 'meal_added',
    // ... другие события
  },
}
```

### Настройка безопасности

```typescript
SECURITY: {
  VALIDATE_INIT_DATA: true,
  MAX_MESSAGE_LENGTH: 1000,
  SESSION_TIMEOUT: 3600,
}
```

## 🚨 Важные моменты

### Безопасность

1. **Никогда не публикуйте токен бота** в публичных репозиториях
2. **Используйте переменные окружения** для конфиденциальных данных
3. **Валидируйте данные** от Telegram в продакшене

### Производительность

1. **Оптимизируйте изображения** для мобильных устройств
2. **Используйте кэширование** для часто запрашиваемых данных
3. **Минимизируйте размер бандла** для быстрой загрузки

### Пользовательский опыт

1. **Адаптируйте интерфейс** под размеры Telegram
2. **Используйте Telegram цвета** для консистентности
3. **Добавьте haptic feedback** для лучшего UX

## 📱 Оптимизация для мобильных

### Размеры элементов

```css
.telegram-button {
  min-height: 48px;
  font-size: 16px;
}

.telegram-input {
  min-height: 48px;
  font-size: 16px;
}
```

### Touch-friendly интерфейс

```css
.touch-target {
  min-width: 44px;
  min-height: 44px;
}
```

### Адаптивные отступы

```css
.telegram-container {
  padding: 0.5rem;
}

@media (min-width: 768px) {
  .telegram-container {
    padding: 1rem;
  }
}
```

## 🔍 Отладка

### Проверка в браузере

1. **Откройте DevTools**
2. **Проверьте консоль** на ошибки
3. **Имитируйте мобильное устройство**

### Проверка в Telegram

1. **Используйте @BotFather** для проверки настроек
2. **Проверьте логи бота** на сервере
3. **Тестируйте на разных устройствах**

## 📞 Поддержка

При возникновении проблем:

1. **Проверьте документацию** [Telegram Bot API](https://core.telegram.org/bots/api)
2. **Обратитесь в поддержку** [@BotSupport](https://t.me/botsupport)
3. **Создайте Issue** в репозитории проекта

## 🎯 Следующие шаги

После успешной настройки:

1. **Добавьте push-уведомления**
2. **Интегрируйте с календарем**
3. **Добавьте групповые цели**
4. **Создайте реферальную систему**

---

**Удачи с настройкой! 🚀**

Если у вас есть вопросы, создайте Issue в репозитории или обратитесь к документации. 