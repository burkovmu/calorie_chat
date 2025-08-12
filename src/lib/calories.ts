import { Product } from '@/types';

// Lookup table для калорий на 100г (kcal per 100g)
export const KCAL_PER_100G: Record<string, number> = {
  // Мясо и птица
  "куриная грудка": 165,
  "курица": 165,
  "индейка": 189,
  "говядина": 250,
  "свинина": 242,
  "баранина": 294,
  
  // Рыба
  "лосось": 208,
  "тунец": 144,
  "треска": 82,
  "минтай": 72,
  
  // Овощи
  "огурец": 16,
  "помидор": 18,
  "морковь": 41,
  "картофель": 77,
  "капуста": 25,
  "брокколи": 34,
  "шпинат": 23,
  "салат": 17,
  
  // Фрукты
  "яблоко": 52,
  "банан": 89,
  "апельсин": 47,
  "груша": 57,
  "виноград": 62,
  
  // Крупы и зерновые
  "рис": 130,
  "гречка": 110,
  "овсянка": 68,
  "хлеб": 265,
  "хлеб белый": 265,
  "хлеб ржаной": 259,
  "хлеб цельнозерновой": 247,
  
  // Молочные продукты
  "молоко": 42,
  "йогурт": 59,
  "творог": 98,
  "сыр": 402,
  "сметана": 193,
  
  // Яйца и масла
  "яйцо": 155,
  "масло сливочное": 717,
  "масло растительное": 884,
  "оливковое масло": 884,
  
  // Сладости и добавки
  "сахар": 400,
  "мед": 304,
  "шоколад": 545,
  "варенье": 250,
  
  // Напитки
  "чай": 1,
  "кофе": 2,
  "сок апельсиновый": 45,
  "сок яблочный": 46,
  
  // Орехи и семена
  "грецкий орех": 654,
  "миндаль": 579,
  "подсолнечник": 584,
  "тыквенные семечки": 559,
};

// Функция для расчета калорий
export function calculateCalories(weightG: number, kcalPer100g: number): number {
  return Math.round((kcalPer100g / 100) * weightG);
}

// Функция для поиска продукта в lookup table
export function findProductCalories(productName: string): number | null {
  const normalizedName = productName.toLowerCase().trim();
  
  // Прямой поиск
  if (KCAL_PER_100G[normalizedName]) {
    return KCAL_PER_100G[normalizedName];
  }
  
  // Поиск по частичному совпадению
  for (const [key, value] of Object.entries(KCAL_PER_100G)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return value;
    }
  }
  
  return null;
}

// Функция для оценки веса по описанию
export function estimateWeight(description: string): number {
  const text = description.toLowerCase();
  
  // Оценка по размеру порции
  if (text.includes('кусочек') || text.includes('ломтик')) return 30;
  if (text.includes('столовая ложка') || text.includes('ст.л.')) return 15;
  if (text.includes('чайная ложка') || text.includes('ч.л.')) return 5;
  if (text.includes('стакан') || text.includes('чашка')) return 200;
  if (text.includes('порция')) return 150;
  if (text.includes('маленькая')) return 100;
  if (text.includes('большая')) return 200;
  
  // Оценка по типу продукта
  if (text.includes('хлеб')) return 30;
  if (text.includes('салат')) return 200;
  if (text.includes('суп')) return 300;
  if (text.includes('каша')) return 200;
  if (text.includes('мясо') || text.includes('рыба')) return 150;
  
  // По умолчанию
  return 100;
}

// Функция для пересчета калорий продукта
export function recalculateProductCalories(product: Product): Product {
  if (product.weight_g && !product.calories) {
    const kcalPer100g = findProductCalories(product.name);
    if (kcalPer100g) {
      return {
        ...product,
        calories: calculateCalories(product.weight_g, kcalPer100g)
      };
    }
  }
  return product;
}

// Функция для пересчета общей суммы калорий
export function recalculateTotalCalories(products: Product[]): number {
  return products.reduce((total, product) => {
    if (product.calories) {
      return total + product.calories;
    }
    return total;
  }, 0);
} 