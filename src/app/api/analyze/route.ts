import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Ajv from 'ajv';
import { Meal, Product } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// JSON Schema для валидации ответа ИИ
const mealSchema = {
  type: "object",
  required: ["products", "total_calories"],
  properties: {
    products: {
      type: "array",
      items: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          weight_g: { type: ["integer", "null"] },
          calories: { type: ["integer", "null"] },
          notes: { type: ["string", "null"] }
        }
      }
    },
    total_calories: { type: "integer" }
  }
};

const ajv = new Ajv();
const validateMeal = ajv.compile(mealSchema);

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Текст описания еды обязателен' },
        { status: 400 }
      );
    }

    if (text.length > 1000) {
      return NextResponse.json(
        { error: 'Текст слишком длинный (максимум 1000 символов)' },
        { status: 400 }
      );
    }

    const prompt = `Ты - помощник по питанию. Проанализируй описание еды пользователя и верни валидный JSON со следующей структурой:

{
  "products": [
    {"name": "название продукта", "weight_g": вес_в_граммах, "calories": калории, "notes": "заметки"}
  ],
  "total_calories": общее_количество_калорий
}

Правила:
- ВСЕГДА возвращай строго валидный JSON (без пояснительного текста вне JSON)
- Если вес не указан, оцени разумный вес и укажи в notes
- Используй реалистичные плотности калорий (ккал на 100г) для оценок
- Округляй калории до целых чисел
- Если значение неизвестно, установи null
- В notes объясни свои предположения

Описание пользователя:
---
${text}
---

Ответ (только JSON):`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
      temperature: 0.0,
    });

    const content = completion.choices[0]?.message?.content || '';
    
    if (!content) {
      throw new Error('Пустой ответ от OpenAI');
    }

    // Надежный парсинг JSON: ищем JSON-объект в ответе
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('JSON не найден в ответе модели');
    }

    let mealData: Meal;
    try {
      mealData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      throw new Error(`Ошибка парсинга JSON: ${parseError}`);
    }

    // Валидация структуры
    if (!validateMeal(mealData)) {
      console.error('Ошибка валидации JSON:', validateMeal.errors);
      throw new Error('Неверная структура JSON от ИИ');
    }

    // Проверка и исправление данных
    let totalCalories = 0;
    const validatedProducts = mealData.products.map((product, index) => {
      // Генерируем временный ID
      const validatedProduct: Product = {
        id: `temp_${index}`,
        name: product.name.trim(),
        weight_g: product.weight_g || undefined,
        calories: product.calories || undefined,
        notes: product.notes || undefined,
      };

      if (validatedProduct.calories) {
        totalCalories += validatedProduct.calories;
      }

      return validatedProduct;
    });

    // Обновляем общую сумму калорий
    const finalMeal: Meal = {
      products: validatedProducts,
      total_calories: totalCalories,
      timestamp: new Date().toISOString(),
    };

    // Формируем текст для отображения
    const displayText = validatedProducts.map((p, i) => {
      const weightText = p.weight_g ? `${p.weight_g} г` : '? г';
      const caloriesText = p.calories ? `${p.calories} ккал` : '? ккал';
      return `${i + 1}. ${p.name} — ${weightText} → ${caloriesText}`;
    }).join('\n') + `\n\n**Итого:** ${totalCalories} ккал`;

    // Логируем для отладки
    console.log('AI Response:', content);
    console.log('Parsed Meal:', finalMeal);

    return NextResponse.json({
      mealData: finalMeal,
      displayText,
      success: true
    });

  } catch (error) {
    console.error('Ошибка в /api/analyze:', error);
    
    return NextResponse.json(
      { 
        error: 'Не удалось проанализировать описание еды',
        details: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
} 