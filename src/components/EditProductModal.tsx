'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { findProductCalories, calculateCalories } from '@/lib/calories';

interface EditProductModalProps {
  product: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

export default function EditProductModal({ product, onSave, onCancel }: EditProductModalProps) {
  const [editedProduct, setEditedProduct] = useState<Product>(product);
  const [estimatedCalories, setEstimatedCalories] = useState<number | null>(null);

  useEffect(() => {
    // Автоматически оцениваем калории при изменении веса
    if (editedProduct.weight_g && !editedProduct.calories) {
      const kcalPer100g = findProductCalories(editedProduct.name);
      if (kcalPer100g) {
        const estimated = calculateCalories(editedProduct.weight_g, kcalPer100g);
        setEstimatedCalories(estimated);
      }
    } else {
      setEstimatedCalories(null);
    }
  }, [editedProduct.weight_g, editedProduct.name, editedProduct.calories]);

  const handleSave = () => {
    // Если есть оценка калорий и пользователь не указал свои, используем оценку
    if (estimatedCalories && !editedProduct.calories) {
      editedProduct.calories = estimatedCalories;
    }
    
    onSave(editedProduct);
  };

  const handleWeightChange = (weight: string) => {
    const weightNum = weight === '' ? null : parseInt(weight);
    setEditedProduct(prev => ({
      ...prev,
      weight_g: weightNum
    }));
  };

  const handleCaloriesChange = (calories: string) => {
    const caloriesNum = calories === '' ? null : parseInt(calories);
    setEditedProduct(prev => ({
      ...prev,
      calories: caloriesNum
    }));
  };

  const handleNameChange = (name: string) => {
    setEditedProduct(prev => ({
      ...prev,
      name: name.trim()
    }));
  };

  const handleNotesChange = (notes: string) => {
    setEditedProduct(prev => ({
      ...prev,
      notes: notes.trim() || null
    }));
  };

  const isValid = editedProduct.name.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 modal-overlay">
      <div className="glass-effect rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto animate-slide-up border border-gray-200/50">
        {/* Заголовок - адаптивный с золотистым акцентом */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50/30 to-white rounded-t-2xl">
          <h3 className="text-base sm:text-lg font-semibold text-black flex items-center gap-2">
            <span className="text-[#f8cf5d]">✏️</span>
            Редактировать продукт
          </h3>
        </div>

        {/* Форма - адаптивная для мобильных */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4">
          {/* Название продукта */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-black mb-2">
              Название продукта *
            </label>
            <input
              type="text"
              value={editedProduct.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3 sm:px-3 py-2 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f8cf5d] focus:border-[#f8cf5d] mobile-input text-sm sm:text-base bg-white transition-all duration-300"
              placeholder="Например: куриная грудка"
            />
          </div>

          {/* Вес */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-black mb-2">
              Вес (граммы)
            </label>
            <input
              type="number"
              value={editedProduct.weight_g || ''}
              onChange={(e) => handleWeightChange(e.target.value)}
              className="w-full px-3 sm:px-3 py-2 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f8cf5d] focus:border-[#f8cf5d] mobile-input text-sm sm:text-base bg-white transition-all duration-300"
              placeholder="150"
              min="1"
              max="10000"
            />
          </div>

          {/* Калории */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-black mb-2">
              Калории
            </label>
            <input
              type="number"
              value={editedProduct.calories || ''}
              onChange={(e) => handleCaloriesChange(e.target.value)}
              className="w-full px-3 sm:px-3 py-2 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f8cf5d] focus:border-[#f8cf5d] mobile-input text-sm sm:text-base bg-white transition-all duration-300"
              placeholder="248"
              min="0"
              max="10000"
            />
            
            {/* Показываем оценку калорий если доступна */}
            {estimatedCalories && !editedProduct.calories && (
              <p className="text-xs sm:text-sm text-[#f8cf5d] mt-1 font-medium bg-[#f8cf5d]/10 px-2 py-1 rounded-lg inline-block">
                💡 Примерная оценка: {estimatedCalories} ккал
              </p>
            )}
          </div>

          {/* Заметки */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-black mb-2">
              Заметки
            </label>
            <textarea
              value={editedProduct.notes || ''}
              onChange={(e) => handleNotesChange(e.target.value)}
              className="w-full px-3 sm:px-3 py-2 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f8cf5d] focus:border-[#f8cf5d] mobile-input text-sm sm:text-base bg-white transition-all duration-300"
              placeholder="Дополнительная информация о продукте"
              rows={2}
            />
          </div>
        </div>

        {/* Кнопки - адаптивные для мобильных с золотистыми акцентами */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50/30 to-white rounded-b-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3">
            <button
              onClick={onCancel}
              className="px-3 sm:px-4 py-2 text-black bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#f8cf5d] focus:ring-2 focus:ring-[#f8cf5d] focus:ring-offset-2 transition-all duration-300 mobile-button text-sm sm:text-base font-medium"
            >
              Отмена
            </button>
            
            <button
              onClick={handleSave}
              disabled={!isValid}
              className="px-3 sm:px-4 py-2 bg-[#f8cf5d] text-black rounded-lg font-medium hover:shadow-lg hover:shadow-[#f8cf5d]/30 focus:ring-2 focus:ring-[#f8cf5d] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 mobile-button text-sm sm:text-base transform hover:scale-105 active:scale-95"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 