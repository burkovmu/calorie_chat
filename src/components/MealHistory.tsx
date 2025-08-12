'use client';

import { useState, useEffect } from 'react';
import { MealRecord } from '@/types';

interface MealHistoryProps {
  userId: string;
}

export default function MealHistory({ userId }: MealHistoryProps) {
  const [meals, setMeals] = useState<MealRecord[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<MealRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    fetchMeals();
  }, [userId]);

  useEffect(() => {
    filterMeals();
  }, [meals, dateFilter, startDate, endDate]);

  const fetchMeals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/meals?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки данных');
      }
      
      const data = await response.json();
      setMeals(data.meals || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  const filterMeals = () => {
    let filtered = [...meals];

    if (dateFilter) {
      const today = new Date();
      const filterDate = new Date(dateFilter);
      
      filtered = filtered.filter(meal => {
        const mealDate = new Date(meal.meal_time);
        return mealDate.toDateString() === filterDate.toDateString();
      });
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      filtered = filtered.filter(meal => {
        const mealDate = new Date(meal.meal_time);
        return mealDate >= start && mealDate <= end;
      });
    }

    setFilteredMeals(filtered);
  };

  const getTotalCalories = (meals: MealRecord[]) => {
    return meals.reduce((sum, meal) => sum + (meal.total_calories || 0), 0);
  };

  const getAverageCalories = (meals: MealRecord[]) => {
    if (meals.length === 0) return 0;
    return Math.round(getTotalCalories(meals) / meals.length);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const clearFilters = () => {
    setDateFilter('');
    setStartDate('');
    setEndDate('');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
        <span className="ml-2 text-primary-600 font-medium">Загружаю историю...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-4 animate-slide-up">
        <p className="text-red-800 font-medium">{error}</p>
        <button
          onClick={fetchMeals}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Заголовок */}
      <div className="text-center mb-6">
        <p className="text-gray-600 font-medium">Отслеживайте свои приемы пищи и анализируйте питание</p>
      </div>

      {/* Фильтры */}
      <div className="glass-effect rounded-2xl shadow-lg border border-gray-200 p-4 mb-6 animate-slide-up">
        <h3 className="text-lg font-semibold text-black mb-3 flex items-center gap-2">
          <span className="text-[#f8cf5d]">🔍</span>
          Фильтры
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Конкретная дата
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f8cf5d] focus:border-[#f8cf5d] bg-white transition-all duration-300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              С даты
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f8cf5d] focus:border-[#f8cf5d] bg-white transition-all duration-300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              По дату
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f8cf5d] focus:border-[#f8cf5d] bg-white transition-all duration-300"
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-[#f8cf5d] underline font-medium transition-colors duration-300"
          >
            Очистить фильтры
          </button>
          
          <div className="text-sm text-gray-600 font-medium">
            Найдено: {filteredMeals.length} приемов пищи
          </div>
        </div>
      </div>

      {/* Статистика */}
      {filteredMeals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="glass-effect border border-gray-200 rounded-2xl p-4 text-center animate-slide-up hover:shadow-lg transition-all duration-300">
            <div className="text-2xl font-bold text-black">
              {filteredMeals.length}
            </div>
            <div className="text-sm text-gray-600 font-medium">Приемов пищи</div>
          </div>
          
          <div className="glass-effect border border-gray-200 rounded-2xl p-4 text-center animate-slide-up hover:shadow-lg transition-all duration-300">
            <div className="text-2xl font-bold text-black">
              {getTotalCalories(filteredMeals)} ккал
            </div>
            <div className="text-sm text-gray-600 font-medium">Общее количество калорий</div>
          </div>
          
          <div className="glass-effect border border-gray-200 rounded-2xl p-4 text-center animate-slide-up hover:shadow-lg transition-all duration-300">
            <div className="text-2xl font-bold text-black">
              {getAverageCalories(filteredMeals)} ккал
            </div>
            <div className="text-sm text-gray-600 font-medium">Среднее за прием</div>
          </div>
        </div>
      )}

      {/* Список приемов пищи */}
      <div className="space-y-4">
        {filteredMeals.length === 0 ? (
          <div className="text-center py-8 text-gray-500 animate-fade-in">
            <div className="text-4xl mb-2">🍽️</div>
            <p className="text-lg font-medium">Приемы пищи не найдены</p>
            <p className="text-sm">Попробуйте изменить фильтры или добавьте новые приемы пищи</p>
          </div>
        ) : (
          filteredMeals.map((meal, index) => (
            <div
              key={meal.id}
              className="glass-effect rounded-2xl shadow-lg border border-gray-200 p-4 hover:shadow-xl transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-black">
                    Прием пищи #{meal.id.slice(-6)}
                  </h4>
                  <p className="text-sm text-gray-600 font-medium">
                    {formatDate(meal.meal_time)}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-black">
                    {meal.total_calories || 0} ккал
                  </div>
                </div>
              </div>

              {meal.note && (
                <p className="text-black mb-3 italic bg-[#f8cf5d]/10 px-3 py-2 rounded-lg">"{meal.note}"</p>
              )}

              {meal.products && meal.products.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-black">Продукты:</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {meal.products.map((product) => (
                      <div
                        key={product.id}
                        className="flex justify-between items-center text-sm bg-gradient-to-r from-gray-50/50 to-white px-3 py-2 rounded-lg border border-gray-200/50"
                      >
                        <span className="text-black font-medium">{product.product_name}</span>
                        <span className="text-gray-600">
                          {product.calories || 0} ккал
                          {product.weight_g && ` (${product.weight_g}г)`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 