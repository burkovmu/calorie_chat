
# Calorie Chat App — Техническая спецификация для реализации в Cursor

> Этот файл — подробная инструкция по созданию приложения в формате **чата**, где ИИ помогает пользователю фиксировать потреблённую еду, уточнять данные и сохранять приёмы пищи в базу данных. Предполагается развёртывание в среде Cursor (Next.js/React), бекенд — Next.js API routes; база — PostgreSQL / Supabase.

---

## Содержание
1. [Идея и поведение](#идея-и-поведение)  
2. [UX / сценарии общения (пример)](#ux--сценарии-общения-пример)  
3. [Архитектура приложения](#архитектура-приложения)  
4. [Фронтенд (Cursor / Next.js + React)](#фронтенд-cursor--nextjs--react)  
5. [Бекенд — API](#бекенд--api)  
6. [ИИ: промпты, проверка структуры, парсинг JSON](#ии-промпты-проверка-структуры-парсинг-json)  
7. [База данных — схема и транзакции](#база-данных--схема-и-транзакции)  
8. [Аутентификация и пользователи](#аутентификация-и-пользователи)  
9. [Обработка ошибок, логирование, валидация](#обработка-ошибок-логирование-валидация)  
10. [Тестирование и QA](#тестирование-и-qa)  
11. [Развёртывание и окружение](#развёртывание-и-окружение)  
12. [Расширения и roadmap](#расширения-и-roadmap)  
13. [Контрольные пункты / чеклист](#контрольные-пункты--чеклист)

---

## Идея и поведение

Приложение — чат, пользователь пишет что он съел, ИИ извлекает продукты (название, примерный вес, калории), отображает результат в чате разбитым по позициям и суммой. Пользователь может исправить любую позицию (вес, название, даже удалить позицию). Когда всё подтверждено — нажать "Сохранить в дневник" и данные заносятся в базу.  

Ключевые требования:
- Понятный диалогный интерфейс, быстрый ответ ИИ.
- Редактирование позиций inline (модал/инлайн-редактор).
- Защита от неверного JSON от ИИ: валидировать и корректно обрабатывать.
- Хранение каждого продукта как отдельной записи (для аналитики и отчётов).
- Возможность расширения: фото-распознавание, barcode, рецепты, импорты.

---

## UX / сценарии общения (пример)

**Пользователь:**  
> Сегодня на обед ел куриную грудку, салат из огурцов и помидоров, кусочек хлеба и чай с сахаром.

**ИИ (ответ):**  
> Я понял так (предположения по весам — их можно поправить):  
> 1. Куриная грудка — 150 г → 248 ккал  
> 2. Салат (огурцы, помидоры) — 200 г → 34 ккал  
> 3. Хлеб — 30 г → 80 ккал  
> 4. Чай с сахаром (1 ч.л. ~ 4 г сахара) — 200 мл → 16 ккал  
> **Итого:** 378 ккал  
> [✏️ Исправить] [✅ Всё верно]

> **Примечание по расчёту:** калории оценены на основании стандартных значений:
> - куриная грудка (готовая) — 165 ккал / 100 г → 1.65 ккал/г → 150 г × 1.65 = 247.5 → 248 ккал  
> - салат (среднее) — ~17 ккал / 100 г → 0.17 ккал/г → 200 г × 0.17 = 34 ккал  
> - хлеб — 265 ккал / 100 г → 2.65 ккал/г → 30 г × 2.65 = 79.5 → 80 ккал  
> - сахар — 4 ккал / г → 4 г × 4 = 16 ккал

Если пользователь нажимает "✏️ Исправить" у курицы и пишет "Не 150, а 120 г", ИИ пересчитывает и показывает новую сумму.

**После подтверждения**: данные сохраняются в таблицу `meals` (по одной записи на продукт) с привязкой к user_id и дате/времени.

---

## Архитектура приложения

Коротко:  
- Frontend: React (Next.js в Cursor), компоненты чата, карточки продуктов, модальные окна редактирования.  
- Backend: Next.js API routes (`/api/analyze`, `/api/saveMeal`, `/api/meals`, `/api/editMeal`). Бизнес-логика: подготовка промпта, вызов ИИ, парсинг результата, валидация, сохранение.  
- AI: OpenAI (или совместимая LLM) — отвечает JSON со структурой продуктов.  
- DB: PostgreSQL / Supabase.  

Диаграмма (логическая):
```
[Browser/Client (Cursor UI)] <--HTTP--> [Next.js API routes] <--HTTP/SQL--> [Postgres/Supabase]
                                        \
                                         -> [OpenAI / LLM] (chat completions)
```

---

## Фронтенд (Cursor / Next.js + React)

### Зависимости (пример `package.json`)
```json
{
  "dependencies": {
    "react": "18.x",
    "next": "13.x",
    "swr": "^2.0.0",
    "axios": "^1.0.0",
    "zustand": "^4.0.0",
    "dayjs": "^1.11.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

### Компоненты (структура)
- `ChatPage` — главная страница с чатом.  
- `MessageList` — отображение истории (user / assistant / system).  
- `ChatInput` — поле ввода + кнопка отправить + файл/фото.  
- `MealCard` — карточка результата ИИ: список продуктов, веса, калории, кнопки `✏️` и `✅`.  
- `EditProductModal` — модальное окно редактирования продукта.  

### Пример: `ChatPage` (React + hooks, упрощённый)
```jsx
// components/ChatPage.jsx
import { useState } from "react";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import MealCard from "./MealCard";

export default function ChatPage({ user }) {
  const [messages, setMessages] = useState([]); // {role, text, meta}
  const [pendingMeal, setPendingMeal] = useState(null); // meal JSON от ИИ

  async function handleSend(text) {
    setMessages(prev => [...prev, { role: "user", text }]);
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    const json = await res.json();
    // json: { mealData, displayText }
    setPendingMeal(json.mealData);
    setMessages(prev => [...prev, { role: "assistant", text: json.displayText }]);
  }

  async function handleConfirm() {
    // Отправить pendingMeal в /api/saveMeal
    await fetch("/api/saveMeal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, mealData: pendingMeal })
    });
    setMessages(prev => [...prev, { role: "system", text: "Записано в дневник" }]);
    setPendingMeal(null);
  }

  return (
    <div>
      <MessageList messages={messages} />
      {pendingMeal && <MealCard meal={pendingMeal} onConfirm={handleConfirm} onEdit={setPendingMeal} />}
      <ChatInput onSend={handleSend} />
    </div>
  );
}
```

### `MealCard` — отображение и редактирование
- Отображает список продуктов с отдельными кнопками `✏️` и `🗑`.
- При редактировании можно изменить `weight` или `name`. После изменения — фронтенд пересчитывает калории (опционально) или отправляет корректировку в `/api/analyze`/`/api/recalculate`.

Пример интерфейса данных на фронтенде (TypeScript):
```ts
type Product = {
  id?: string; // временный локальный id
  name: string;
  weight_g?: number; // граммы
  calories?: number; // integer
};

type Meal = {
  products: Product[];
  total_calories: number;
  timestamp?: string;
};
```

### Вариант пересчёта на фронтенде
- Для скорости пересчёт можно делать в браузере по известным плотностям (kcal/100g) — держать небольшой lookup table. Но при сомнении отправлять на сервер/ИИ для оценки.

---

## Бекенд — API

Обязательные эндпоинты (минимум):
- `POST /api/analyze` — принимает текст описания еды, возвращает `mealData` (JSON).
- `POST /api/saveMeal` — сохраняет подтверждённый mealData в базу с user_id.
- `GET /api/meals?date=YYYY-MM-DD` — возвращает список приёмов пищи за дату.
- `PATCH /api/meals/:mealId` — редактирует сохранённый приём (опционально).
- `POST /api/recalculate` — опция: пересчитать калории (вызывать ИИ) после правок.

### Пример реализации `/api/analyze` (Node.js, Next.js)
```js
// pages/api/analyze.js
import fetch from "node-fetch";

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export default async function handler(req, res) {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "text required" });

    const prompt = `
You are a nutrition assistant. Parse the user's free-text description of what they ate and return a JSON with keys:
{
  "products": [
    {"name": "...", "weight_g": 120, "calories": 198}
  ],
  "total_calories": 198
}
Rules:
- If weight is not specified, estimate a reasonable weight and note assumptions.
- Use kcal per 100g typical values when estimating.
- Return strictly valid JSON only (no extra commentary).
User text:
---
${text}
---
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 700,
        temperature: 0.0
      })
    });
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Надёжный парсинг JSON: ищем JSON-объект в ответе
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in model response");

    const mealData = JSON.parse(jsonMatch[0]);
    // TODO: validate mealData against schema (see below)

    return res.status(200).json({
      mealData,
      displayText: mealData.products.map((p, i) => `${i+1}. ${p.name} — ${p.weight_g ?? "?"} г (${p.calories ?? "?"} ккал)`).join("\n") + `\n\nИтого: ${mealData.total_calories} ккал`
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "server error" });
  }
}
```

### Пример `/api/saveMeal` (с транзакцией)
```js
// pages/api/saveMeal.js
import { pool } from "../../lib/db"; // pg pool, или supabase client

export default async function handler(req, res) {
  const { userId, mealData } = req.body;
  if (!userId || !mealData) return res.status(400).json({ error: "userId and mealData required" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const insertMealQuery = `INSERT INTO meals (user_id, meal_time, total_calories) VALUES ($1, NOW(), $2) RETURNING id`;
    const mealResult = await client.query(insertMealQuery, [userId, mealData.total_calories ?? null]);
    const mealId = mealResult.rows[0].id;

    const insertProductText = `INSERT INTO meal_products (meal_id, product_name, weight_g, calories) VALUES ($1, $2, $3, $4)`;
    for (const p of mealData.products) {
      await client.query(insertProductText, [mealId, p.name, p.weight_g ?? null, p.calories ?? null]);
    }
    await client.query("COMMIT");
    res.status(200).json({ success: true, mealId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}
```

---

## ИИ: промпты, проверка структуры, парсинг JSON

### Промпт (рекомендуемый шаблон)
```
You are a helpful nutrition assistant. Given the user message describing foods, produce valid JSON following this schema:

{
  "products": [
    {"name": string, "weight_g": int_or_null, "calories": int_or_null, "notes": string_optional}
  ],
  "total_calories": int
}

Guidelines:
- Always return strictly valid JSON (no explanatory text outside JSON).
- If a value is unknown, set it to null and add a short "notes" explanation.
- Use realistic calorie densities (kcal per 100 g) for estimates and state assumptions in "notes" if necessary.
- Round calories to nearest integer.
```

### Валидация ответа ИИ
- Используй библиотеку валидации (например, `ajv` или `zod`) в бекенде, чтобы подтвердить соответствие JSON-схеме.  
- Если модель ответила неверно (не JSON, поле пропущено) — сделай до 2 повторных промптов (в один запрос добавь `You MUST return only JSON` и прикрепи последнюю модель-выдачу в качестве контекста), а если всё же не получилось — ответь пользователю с аккуратным запросом на уточнение: *"Не удалось автоматически распознать — напиши, пожалуйста, примерные граммы курицы и т.д."*

### Пример JSON-schema (ajv)
```json
{
  "type": "object",
  "required": ["products", "total_calories"],
  "properties": {
    "products": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name"],
        "properties": {
          "name": {"type": "string"},
          "weight_g": {"type": ["integer", "null"]},
          "calories": {"type": ["integer", "null"]},
          "notes": {"type": ["string", "null"]}
        }
      }
    },
    "total_calories": {"type": "integer"}
  }
}
```

---

## База данных — схема и транзакции

### Рекомендованная нормализованная схема (Postgres)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE meals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  meal_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_calories INTEGER,
  note TEXT
);

CREATE TABLE meal_products (
  id SERIAL PRIMARY KEY,
  meal_id INTEGER REFERENCES meals(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  weight_g INTEGER,
  calories INTEGER,
  notes TEXT
);
```

- `meals` хранит приём пищи как единицу (дата-время, суммарные калории).  
- `meal_products` — одна запись на продукт для аналитики.

### Индексы и запросы
- Индекс по `user_id` и `meal_time` для быстрого получения данных за период.
- Для аналитики: суммировать `calories` по дням:
```sql
SELECT date_trunc('day', meal_time) as day, SUM(total_calories) as total
FROM meals WHERE user_id = $1 AND meal_time >= $2 AND meal_time < $3
GROUP BY day ORDER BY day;
```

---

## Аутентификация и пользователи

Рекомендация: Supabase Auth или NextAuth.js  
- Supabase даёт готовую Postgres и управление пользователями.  
- Для мобильной/десктоп версии — JWT из Supabase/NextAuth используется на фронтенде для аутентификации запросов к `/api/*`.

Передавайте `userId` в теле запросов или извлекайте из сессии (рекомендуемый способ).

---

## Обработка ошибок, логирование, валидация

1. Всегда логируйте ответы ИИ (полезно для отладки), но **не** храните лишние входные персональные данные без явного согласия пользователя.  
2. Валидируйте вход пользователя (размер текста, длина).  
3. При невалидном JSON от ИИ:
   - Попробовать автоисправление (regex извлечь JSON).
   - Если не удаётся — отправить понятное сообщение пользователю с просьбой уточнить граммы/количество.  
4. Логируйте ошибки в Sentry / Logflare.

---

## Тестирование и QA

- Юнит-тесты для:
  - парсера ответа ИИ (валидные/невалидные JSON);
  - сохранения в БД (транзакции);
  - фронтенд-компонентов (рендер карточки, редактирование).
- Интеграционные тесты:
  - "end-to-end" сценарий: ввод текста → анализ → правка → сохранение → проверка записей в БД.
- Тесты производительности: нагрузочное тестирование API (максимум пара запросов/сек на пользователя, но учтите лимиты OpenAI).

---

## Развёртывание и окружение

### Переменные окружения (пример)
```
DATABASE_URL=postgres://...
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
NEXTAUTH_URL=https://your-app.example
SUPABASE_URL=...
SUPABASE_KEY=...
```

### Хостинг
- Cursor (если поддерживает Next.js) — фронтенд и API в одном проекте.
- Postgres: Supabase, Neon, Heroku Postgres.
- CI/CD: GitHub Actions → deploy to Cursor / Vercel.

---

## Расширения и roadmap

- Распознавание фото еды (интеграция с Vision API) → предварительный список продуктов + оценка порции.  
- Barcode scanner → искать в БД продуктов с точной информацией о порции и калориях.  
- Синхронизация с трекерами активности.  
- Подсчёт БЖУ (белки / жиры / углеводы).  
- Персональные цели калорий и уведомления.

---

## Примеры диалогов и тонкие места (практические рекомендации)

1. **Неоднозначность**: "салат" — спрашивать: "был ли в салате майонез/масло/сыр?"  
2. **Множественные порции**: "ел два кусочка хлеба" — корректно суммировать вес.  
3. **Напитки**: если не указано, спрашивать: "чай без сахара или с сахаром? сколько ложек?"  
4. **Хлеб/булочки**: лучше спрашивать форму/тип (батон, ржаной, цельнозерновой), так как у них разная калорийность.

---

## Чеклист этапов разработки

1. Настроить проект Cursor/Next.js, подключить базу (Supabase).  
2. Реализовать базовую страницу чата (ввод/отправка).  
3. Сделать `/api/analyze` и протестировать с OpenAI (валидный JSON).  
4. Отобразить результат в `MealCard` с кнопками редактирования.  
5. Реализовать `/api/saveMeal` с транзакцией и тестами.  
6. Добавить аутентификацию.  
7. Логирование и обработка ошибок.  
8. UI/UX polishing (модальные, подсказки).  
9. Тестирование и развёртывание.

---

## Приложение: пример полного сценария со счётом (числа посчитаны аккуратно)

**Ввод:** "На обед — куриная грудка 120 г, салат 200 г, хлеб 30 г, чай с 1 ч.л. сахара."

**Оценки (плотности):**
- Куриная грудка: 165 ккал / 100 г → 1.65 ккал/г → 120 × 1.65 = 198 ккал  
- Салат (огурец/помидор среднее): 17 ккал / 100 г → 0.17 ккал/г → 200 × 0.17 = 34 ккал  
- Хлеб: 265 ккал / 100 г → 2.65 ккал/г → 30 × 2.65 = 79.5 → округляем до 80 ккал  
- Сахар: 4 ккал / г → 1 ч.л. ≈ 4 г → 4 × 4 = 16 ккал

**Итого:** 198 + 34 + 80 + 16 = **328 ккал**

---

## Приложение: полезные утилиты и lookup table (кратко)

```js
// kcal per 100g lookup (пример)
const KCAL_PER_100G = {
  "chicken_breast": 165,
  "cucumber": 16,
  "tomato": 18,
  "bread_white": 265,
  "sugar": 400 // kcal per 100g -> 4 kcal/g
};

// Использовать при перерасчёте на фронтенде
function kcalFor(grams, kcalPer100g) {
  return Math.round((kcalPer100g / 100) * grams);
}
```

---

## Заключение

В этом файле — подробная дорожная карта и набор кодовых фрагментов для быстрого старта реализации чат-приложения для подсчёта калорий в Cursor. Если хочешь — могу:
- Сформировать готовый репозиторий (README + примерная структура файлов).  
- Сгенерировать диаграмму архитектуры (png / mermaid).  
- Подготовить список API-тестов (Postman / Insomnia).

---

Автор: AI-помощник — спецификация на русском для разработчика Cursor  
Дата: 2025-08-12


ps.
деплой будет vercel
бд supabase