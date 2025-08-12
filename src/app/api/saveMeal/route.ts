import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId, mealData } = await request.json();
    
    console.log('Received data:', { userId, mealData });
    
    if (!userId || !mealData) {
      return NextResponse.json(
        { error: 'userId и mealData обязательны' },
        { status: 400 }
      );
    }

    if (!mealData.products || !Array.isArray(mealData.products)) {
      return NextResponse.json(
        { error: 'Неверная структура mealData' },
        { status: 400 }
      );
    }

    // Валидация данных
    const validatedProducts = mealData.products.filter((product: any) => 
      product.name && product.name.trim().length > 0
    );

    if (validatedProducts.length === 0) {
      return NextResponse.json(
        { error: 'Нет валидных продуктов для сохранения' },
        { status: 400 }
      );
    }

    // Вычисляем общую сумму калорий
    const totalCalories = validatedProducts.reduce((sum: number, product: any) => {
      return sum + (product.calories || 0);
    }, 0);

    console.log('Attempting to save meal with:', {
      userId,
      totalCalories,
      productsCount: validatedProducts.length
    });

    // ВРЕМЕННО: Имитируем сохранение без Supabase
    // TODO: Восстановить Supabase после настройки переменных окружения
    
    // Генерируем временный ID
    const tempMealId = `temp_${Date.now()}`;
    
    // Имитируем задержку
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('Успешно сохранен прием пищи (временно):', {
      mealId: tempMealId,
      userId,
      totalCalories,
      productsCount: validatedProducts.length
    });

    return NextResponse.json({
      success: true,
      mealId: tempMealId,
      meal: {
        id: tempMealId,
        user_id: userId,
        meal_time: new Date().toISOString(),
        total_calories: totalCalories,
        products: validatedProducts
      },
      message: 'Прием пищи успешно сохранен (временно)'
    });

  } catch (error) {
    console.error('Ошибка в /api/saveMeal:', error);
    
    return NextResponse.json(
      { 
        error: 'Не удалось сохранить прием пищи',
        details: error instanceof Error ? error.message : 'Неизвестная ошибка',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Отключаем статическую генерацию
export const dynamic = 'force-dynamic'; 