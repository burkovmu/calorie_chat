import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Meal } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { userId, mealData } = await request.json();
    
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
    const validatedProducts = mealData.products.filter(product => 
      product.name && product.name.trim().length > 0
    );

    if (validatedProducts.length === 0) {
      return NextResponse.json(
        { error: 'Нет валидных продуктов для сохранения' },
        { status: 400 }
      );
    }

    // Вычисляем общую сумму калорий
    const totalCalories = validatedProducts.reduce((sum, product) => {
      return sum + (product.calories || 0);
    }, 0);

    // Начинаем транзакцию
    const { data: mealRecord, error: mealError } = await supabase
      .from('meals')
      .insert({
        user_id: userId,
        meal_time: new Date().toISOString(),
        total_calories: totalCalories,
        note: mealData.note || null
      })
      .select()
      .single();

    if (mealError) {
      console.error('Ошибка создания записи meal:', mealError);
      throw new Error(`Ошибка создания записи: ${mealError.message}`);
    }

    // Сохраняем продукты
    const mealProducts = validatedProducts.map(product => ({
      meal_id: mealRecord.id,
      product_name: product.name.trim(),
      weight_g: product.weight_g || null,
      calories: product.calories || null,
      notes: product.notes || null
    }));

    const { error: productsError } = await supabase
      .from('meal_products')
      .insert(mealProducts);

    if (productsError) {
      console.error('Ошибка создания записей продуктов:', productsError);
      
      // Откатываем создание meal
      await supabase
        .from('meals')
        .delete()
        .eq('id', mealRecord.id);
      
      throw new Error(`Ошибка создания продуктов: ${productsError.message}`);
    }

    // Получаем полную запись для возврата
    const { data: fullMeal, error: fetchError } = await supabase
      .from('meals')
      .select(`
        *,
        meal_products (*)
      `)
      .eq('id', mealRecord.id)
      .single();

    if (fetchError) {
      console.error('Ошибка получения полной записи:', fetchError);
    }

    console.log('Успешно сохранен прием пищи:', {
      mealId: mealRecord.id,
      userId,
      totalCalories,
      productsCount: validatedProducts.length
    });

    return NextResponse.json({
      success: true,
      mealId: mealRecord.id,
      meal: fullMeal || mealRecord,
      message: 'Прием пищи успешно сохранен'
    });

  } catch (error) {
    console.error('Ошибка в /api/saveMeal:', error);
    
    return NextResponse.json(
      { 
        error: 'Не удалось сохранить прием пищи',
        details: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
} 