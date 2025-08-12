import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId обязателен' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('meals')
      .select(`
        *,
        meal_products (*)
      `)
      .eq('user_id', userId)
      .order('meal_time', { ascending: false })
      .limit(limit);

    // Фильтр по дате если указана
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      query = query
        .gte('meal_time', startDate.toISOString())
        .lt('meal_time', endDate.toISOString());
    }

    const { data: meals, error } = await query;

    if (error) {
      console.error('Ошибка получения приемов пищи:', error);
      throw new Error(`Ошибка получения данных: ${error.message}`);
    }

    // Группируем продукты по приемам пищи
    const mealsWithProducts = meals?.map(meal => ({
      id: meal.id,
      user_id: meal.user_id,
      meal_time: meal.meal_time,
      total_calories: meal.total_calories,
      note: meal.note,
      products: meal.meal_products || []
    })) || [];

    return NextResponse.json({
      success: true,
      meals: mealsWithProducts,
      count: mealsWithProducts.length
    });

  } catch (error) {
    console.error('Ошибка в /api/meals:', error);
    
    return NextResponse.json(
      { 
        error: 'Не удалось получить приемы пищи',
        details: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { mealId, updates } = await request.json();
    
    if (!mealId || !updates) {
      return NextResponse.json(
        { error: 'mealId и updates обязательны' },
        { status: 400 }
      );
    }

    // Обновляем основную запись приема пищи
    const { data: updatedMeal, error: mealError } = await supabase
      .from('meals')
      .update(updates)
      .eq('id', mealId)
      .select()
      .single();

    if (mealError) {
      console.error('Ошибка обновления приема пищи:', mealError);
      throw new Error(`Ошибка обновления: ${mealError.message}`);
    }

    return NextResponse.json({
      success: true,
      meal: updatedMeal,
      message: 'Прием пищи успешно обновлен'
    });

  } catch (error) {
    console.error('Ошибка в PATCH /api/meals:', error);
    
    return NextResponse.json(
      { 
        error: 'Не удалось обновить прием пищи',
        details: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
}

// Отключаем статическую генерацию
export const dynamic = 'force-dynamic'; 