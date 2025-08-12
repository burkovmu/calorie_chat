'use client';

import { useState, useEffect } from 'react';
import { MealRecord } from '@/types';

interface AnalyticsProps {
  userId: string;
}

interface DailyStats {
  date: string;
  calories: number;
  mealCount: number;
}

export default function Analytics({ userId }: AnalyticsProps) {
  const [meals, setMeals] = useState<MealRecord[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d');
  
  useEffect(() => {
    fetchMeals();
  }, [userId]);

  useEffect(() => {
    if (meals.length > 0) {
      calculateDailyStats();
    }
  }, [meals, period]);

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

  const calculateDailyStats = () => {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const stats: DailyStats[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const dayMeals = meals.filter(meal => {
        const mealDate = new Date(meal.meal_time).toISOString().split('T')[0];
        return mealDate === dateString;
      });
      
      const totalCalories = dayMeals.reduce((sum, meal) => sum + (meal.total_calories || 0), 0);
      
      stats.push({
        date: dateString,
        calories: totalCalories,
        mealCount: dayMeals.length
      });
    }
    
    setDailyStats(stats);
  };

  const getTotalCalories = () => {
    return dailyStats.reduce((sum, day) => sum + day.calories, 0);
  };

  const getAverageCalories = () => {
    if (dailyStats.length === 0) return 0;
    return Math.round(getTotalCalories() / dailyStats.length);
  };

  const getMaxCalories = () => {
    return Math.max(...dailyStats.map(day => day.calories));
  };

  const getMinCalories = () => {
    return Math.min(...dailyStats.map(day => day.calories));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const getBarHeight = (calories: number) => {
    const maxCalories = getMaxCalories();
    if (maxCalories === 0) return 0;
    return Math.max((calories / maxCalories) * 100, 5);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
        <span className="ml-2 text-primary-600 font-medium">Загружаю аналитику...</span>
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
    <div className="max-w-6xl mx-auto p-4">
      {/* Заголовок */}
      <div className="text-center mb-6">
        <p className="text-gray-600 font-medium">Анализируйте свои пищевые привычки и прогресс</p>
      </div>

      {/* Период анализа */}
      <div className="glass-effect rounded-2xl shadow-lg border border-gray-200 p-4 mb-6 animate-slide-up">
        <h3 className="text-lg font-semibold text-black mb-3 flex items-center gap-2">
          <span className="text-[#f8cf5d]">📅</span>
          Период анализа
        </h3>
        <div className="flex space-x-2">
          {[
            { value: '7d', label: '7 дней' },
            { value: '30d', label: '30 дней' },
            { value: '90d', label: '90 дней' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setPeriod(option.value as '7d' | '30d' | '90d')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                period === option.value
                  ? 'bg-[#f8cf5d] text-black shadow-lg shadow-[#f8cf5d]/30'
                  : 'bg-white text-black border border-gray-200 hover:bg-gray-50 hover:border-[#f8cf5d]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Общая статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-effect border border-gray-200 rounded-2xl p-4 text-center animate-slide-up hover:shadow-lg transition-all duration-300">
          <div className="text-2xl font-bold text-black">
            {getTotalCalories()} ккал
          </div>
          <div className="text-sm text-gray-600 font-medium">Общее количество</div>
        </div>
        
        <div className="glass-effect border border-gray-200 rounded-2xl p-4 text-center animate-slide-up hover:shadow-lg transition-all duration-300">
          <div className="text-2xl font-bold text-black">
            {getAverageCalories()} ккал
          </div>
          <div className="text-sm text-gray-600 font-medium">Среднее в день</div>
        </div>
        
        <div className="glass-effect border border-gray-200 rounded-2xl p-4 text-center animate-slide-up hover:shadow-lg transition-all duration-300">
          <div className="text-2xl font-bold text-black">
            {getMaxCalories()} ккал
          </div>
          <div className="text-sm text-gray-600 font-medium">Максимум в день</div>
        </div>
        
        <div className="glass-effect border border-gray-200 rounded-2xl p-4 text-center animate-slide-up hover:shadow-lg transition-all duration-300">
          <div className="text-2xl font-bold text-black">
            {getMinCalories()} ккал
          </div>
          <div className="text-sm text-gray-600 font-medium">Минимум в день</div>
        </div>
      </div>

      {/* График калорий по дням */}
      <div className="glass-effect rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 animate-slide-up">
        <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
          <span className="text-[#f8cf5d]">📊</span>
          Калории по дням
        </h3>
        
        {dailyStats.length > 0 ? (
          <div className="space-y-4">
            {/* График */}
            <div className="flex items-end justify-between h-64 px-4 border-b border-gray-200">
              {dailyStats.map((day, index) => (
                <div key={day.date} className="flex flex-col items-center">
                  <div className="relative">
                    <div
                      className="w-8 bg-[#f8cf5d] rounded-t transition-all duration-300 hover:shadow-lg hover:shadow-[#f8cf5d]/30"
                      style={{ height: `${getBarHeight(day.calories)}px` }}
                    ></div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded-lg opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                      {day.calories} ккал
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-2 text-center font-medium">
                    {formatDate(day.date)}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Легенда */}
            <div className="flex justify-center items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#f8cf5d] rounded mr-2"></div>
                <span className="font-medium">Калории</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p className="font-medium">Нет данных для отображения</p>
          </div>
        )}
      </div>

      {/* Детальная таблица */}
      <div className="glass-effect rounded-2xl shadow-lg border border-gray-200 p-6 animate-slide-up">
        <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
          <span className="text-[#f8cf5d]">📋</span>
          Детальная статистика по дням
        </h3>
        
        {dailyStats.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-black">Дата</th>
                  <th className="text-center py-3 px-4 font-medium text-black">Калории</th>
                  <th className="text-center py-3 px-4 font-medium text-black">Приемов пищи</th>
                  <th className="text-center py-3 px-4 font-medium text-black">Статус</th>
                </tr>
              </thead>
              <tbody>
                {dailyStats.map((day) => {
                  const status = day.calories === 0 ? 'Нет данных' :
                               day.calories < 1200 ? 'Низко' :
                               day.calories > 2500 ? 'Высоко' : 'Нормально';
                  
                  const statusColor = day.calories === 0 ? 'text-gray-500' :
                                    day.calories < 1200 ? 'text-yellow-600' :
                                    day.calories > 2500 ? 'text-red-600' : 'text-green-600';
                  
                  return (
                    <tr key={day.date} className="border-b border-gray-100 hover:bg-gray-50/30 transition-colors duration-300">
                      <td className="py-3 px-4 text-black font-medium">
                        {formatDate(day.date)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-semibold text-black">
                          {day.calories} ккал
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-600">
                        {day.mealCount}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-medium ${statusColor}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="font-medium">Нет данных для отображения</p>
          </div>
        )}
      </div>
    </div>
  );
} 