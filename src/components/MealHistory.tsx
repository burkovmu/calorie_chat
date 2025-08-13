'use client';

import { useState, useEffect } from 'react';
import { Meal } from '@/types';
import Icon from './Icon';

interface MealHistoryProps {
  userId: string;
}

export default function MealHistory({ userId }: MealHistoryProps) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    minCalories: '',
    maxCalories: ''
  });

  useEffect(() => {
    fetchMeals();
  }, [userId]);

  useEffect(() => {
    applyFilters();
  }, [meals, filters]);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      // В реальном приложении здесь будет API запрос
      // Пока используем демо-данные
      const demoMeals: Meal[] = [
        {
          id: '1',
          products: [
            { id: '1', name: 'Куриная грудка', calories: 250, weight_g: 150 },
            { id: '2', name: 'Рис', calories: 200, weight_g: 100 },
            { id: '3', name: 'Овощной салат', calories: 100, weight_g: 200 },
            { id: '4', name: 'Сок', calories: 100, weight_g: 250 }
          ],
          total_calories: 650,
          note: 'Обед в кафе',
          timestamp: '2024-01-15T12:00:00'
        },
        {
          id: '2',
          products: [
            { id: '5', name: 'Овсянка', calories: 150, weight_g: 100 },
            { id: '6', name: 'Банан', calories: 90, weight_g: 120 },
            { id: '7', name: 'Молоко', calories: 80, weight_g: 200 }
          ],
          total_calories: 320,
          note: 'Завтрак дома',
          timestamp: '2024-01-15T08:30:00'
        },
        {
          id: '3',
          products: [
            { id: '8', name: 'Лосось', calories: 280, weight_g: 150 },
            { id: '9', name: 'Брокколи', calories: 50, weight_g: 200 },
            { id: '10', name: 'Киноа', calories: 250, weight_g: 100 }
          ],
          total_calories: 580,
          note: 'Ужин',
          timestamp: '2024-01-14T19:00:00'
        }
      ];
      
      setMeals(demoMeals);
      setFilteredMeals(demoMeals);
    } catch (err) {
      setError('Ошибка при загрузке истории');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...meals];

    if (filters.dateFrom) {
      filtered = filtered.filter(meal => 
        meal.timestamp && new Date(meal.timestamp) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(meal => 
        meal.timestamp && new Date(meal.timestamp) <= new Date(filters.dateTo)
      );
    }

    if (filters.minCalories) {
      filtered = filtered.filter(meal => 
        meal.total_calories >= parseInt(filters.minCalories)
      );
    }

    if (filters.maxCalories) {
      filtered = filtered.filter(meal => 
        meal.total_calories <= parseInt(filters.maxCalories)
      );
    }

    setFilteredMeals(filtered);
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      minCalories: '',
      maxCalories: ''
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTotalCalories = (meals: Meal[]) => {
    return meals.reduce((sum, meal) => sum + meal.total_calories, 0);
  };

  const getAverageCalories = (meals: Meal[]) => {
    if (meals.length === 0) return 0;
    return Math.round(getTotalCalories(meals) / meals.length);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f8cf5d]"></div>
        <span className="ml-3 text-black font-medium">Загрузка истории...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-800 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Заголовок */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">История питания</h1>
        <p className="text-gray-600 font-medium">Отслеживай свои приемы пищи и анализируй питание</p>
      </div>

      {/* Фильтры */}
      <div className="glass-effect rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 animate-slide-up">
        <h3 className="text-lg font-semibold text-black mb-4">Фильтры</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Дата от</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f8cf5d] focus:border-[#f8cf5d] bg-white transition-all duration-300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-black mb-2">Дата до</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f8cf5d] focus:border-[#f8cf5d] bg-white transition-all duration-300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-black mb-2">Мин. калории</label>
            <input
              type="number"
              value={filters.minCalories}
              onChange={(e) => setFilters(prev => ({ ...prev, minCalories: e.target.value }))}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f8cf5d] focus:border-[#f8cf5d] bg-white transition-all duration-300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-black mb-2">Макс. калории</label>
            <input
              type="number"
              value={filters.maxCalories}
              onChange={(e) => setFilters(prev => ({ ...prev, maxCalories: e.target.value }))}
              placeholder="5000"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f8cf5d] focus:border-[#f8cf5d] bg-white transition-all duration-300"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
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
            <div className="mb-2 flex justify-center">
              <Icon name="chat" size={32} />
            </div>
            <p className="text-lg font-medium">Приемы пищи не найдены</p>
            <p className="text-sm">Попробуйте изменить фильтры или добавить новые приемы пищи</p>
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
                    Прием пищи #{meal.id?.slice(-6) || 'unknown'}
                  </h4>
                  <p className="text-sm text-gray-600 font-medium">
                    {meal.timestamp ? new Date(meal.timestamp).toLocaleDateString('ru-RU') : 'Дата не указана'}
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
                        <span className="text-black font-medium">{product.name}</span>
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