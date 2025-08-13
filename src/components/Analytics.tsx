'use client';

import { useState, useEffect } from 'react';
import Icon from './Icon';

interface AnalyticsProps {
  userId: string;
}

interface DailyStats {
  date: string;
  calories: number;
  mealCount: number;
}

export default function Analytics({ userId }: AnalyticsProps) {
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [goal] = useState(2000);

  useEffect(() => {
    fetchAnalytics();
  }, [userId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // В реальном приложении здесь будет API запрос
      // Пока используем демо-данные
      const demoStats: DailyStats[] = [
        { date: '2024-01-15', calories: 1250, mealCount: 3 },
        { date: '2024-01-14', calories: 1890, mealCount: 4 },
        { date: '2024-01-13', calories: 2100, mealCount: 5 },
        { date: '2024-01-12', calories: 1650, mealCount: 3 },
        { date: '2024-01-11', calories: 1950, mealCount: 4 },
        { date: '2024-01-10', calories: 1400, mealCount: 3 },
        { date: '2024-01-09', calories: 2200, mealCount: 5 }
      ];
      
      setDailyStats(demoStats);
    } catch (err) {
      setError('Ошибка при загрузке аналитики');
    } finally {
      setLoading(false);
    }
  };

  const getTotalCalories = () => {
    return dailyStats.reduce((sum, day) => sum + day.calories, 0);
  };

  const getAverageCalories = () => {
    if (dailyStats.length === 0) return 0;
    return Math.round(getTotalCalories() / dailyStats.length);
  };

  const getGoalProgress = () => {
    const total = getTotalCalories();
    return Math.min((total / (goal * dailyStats.length)) * 100, 100);
  };

  const getBarHeight = (calories: number) => {
    const maxCalories = Math.max(...dailyStats.map(d => d.calories));
    return maxCalories > 0 ? (calories / maxCalories) * 200 : 0;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f8cf5d]"></div>
        <span className="ml-3 text-black font-medium">Загрузка аналитики...</span>
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
        <h1 className="text-3xl font-bold text-black mb-2">Аналитика питания</h1>
        <p className="text-gray-600 font-medium">Отслеживай свои калории и анализируй питание</p>
      </div>

      {/* Общая статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-effect border border-gray-200 rounded-2xl p-4 text-center animate-slide-up hover:shadow-lg transition-all duration-300">
          <div className="text-2xl font-bold text-black">
            {getTotalCalories()} ккал
          </div>
          <div className="text-sm text-gray-600 font-medium">Общее количество калорий</div>
        </div>
        
        <div className="glass-effect border border-gray-200 rounded-2xl p-4 text-center animate-slide-up hover:shadow-lg transition-all duration-300">
          <div className="text-2xl font-bold text-black">
            {getAverageCalories()} ккал
          </div>
          <div className="text-sm text-gray-600 font-medium">Среднее за день</div>
        </div>
        
        <div className="glass-effect border border-gray-200 rounded-2xl p-4 text-center animate-slide-up hover:shadow-lg transition-all duration-300">
          <div className="text-2xl font-bold text-black">
            {Math.round(getGoalProgress())}%
          </div>
          <div className="text-sm text-gray-600 font-medium">Прогресс к цели</div>
        </div>
      </div>

      {/* Прогресс к цели */}
      <div className="glass-effect rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 animate-slide-up">
        <h3 className="text-lg font-semibold text-black mb-4">Прогресс к дневной цели</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-black">Цель: {goal} ккал/день</span>
            <span className="text-sm font-medium text-black">{Math.round(getGoalProgress())}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-[#f8cf5d] h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getGoalProgress()}%` }}
            ></div>
          </div>
          
          <div className="text-xs text-gray-600 text-center">
            За {dailyStats.length} дней съедено {getTotalCalories()} ккал из {goal * dailyStats.length} ккал
          </div>
        </div>
      </div>

      {/* График калорий по дням */}
      <div className="glass-effect rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 animate-slide-up">
        <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
          <Icon name="system" size={20} />
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
            <div className="mb-2 flex justify-center">
              <Icon name="system" size={32} />
            </div>
            <p className="font-medium">Нет данных для отображения</p>
          </div>
        )}
      </div>

      {/* Детальная таблица */}
      <div className="glass-effect rounded-2xl shadow-lg border border-gray-200 p-6 animate-slide-up">
        <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
          <Icon name="chat" size={20} />
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