'use client';

import { useState } from 'react';
import { Meal, Product } from '@/types';
import { useChatStore } from '@/lib/store';
import EditProductModal from './EditProductModal';

interface MealCardProps {
  meal: Meal;
  onConfirm: () => void;
  onEdit: (meal: Meal) => void;
  isLoading?: boolean;
}

export default function MealCard({ meal, onConfirm, onEdit, isLoading = false }: MealCardProps) {
  const { updateProduct, removeProduct } = useChatStore();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSaveProduct = (updatedProduct: Product) => {
    updateProduct(updatedProduct.id!, updatedProduct);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    removeProduct(productId);
  };

  const handleConfirmMeal = () => {
    onConfirm();
  };

  return (
    <>
      <div className="glass-effect rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 mobile-card mx-2 sm:mx-0 animate-slide-up">
        {/* Заголовок карточки - адаптивный */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50/50 to-white rounded-t-2xl">
          <h3 className="text-base sm:text-lg font-semibold text-black flex items-center gap-2">
            <span className="text-[#f8cf5d]">📊</span>
            Результат анализа
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
            Проверь и отредактируй данные перед сохранением
          </p>
        </div>

        {/* Список продуктов - адаптивный */}
        <div className="px-3 sm:px-6 py-3 sm:py-4">
          <div className="space-y-2 sm:space-y-3">
            {meal.products.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-2 sm:p-3 bg-gradient-to-r from-gray-50/30 to-white rounded-xl border border-gray-200/50 hover:border-[#f8cf5d] transition-all duration-300">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-black text-sm sm:text-base truncate">{product.name}</div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    {product.weight_g ? `${product.weight_g} г` : 'вес не указан'} 
                    {product.calories && ` • ${product.calories} ккал`}
                  </div>
                  {product.notes && (
                    <div className="text-xs text-gray-500 mt-1 italic truncate">
                      {product.notes}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1 sm:gap-2 ml-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="p-1.5 sm:p-2 text-gray-600 hover:text-[#f8cf5d] hover:bg-[#f8cf5d]/10 rounded-lg transition-all duration-300 hover:scale-110"
                    title="Редактировать"
                  >
                    <span className="text-sm sm:text-base">✏️</span>
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id!)}
                    className="p-1.5 sm:p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110"
                    title="Удалить"
                  >
                    <span className="text-sm sm:text-base">🗑️</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Итого - адаптивный с золотистым акцентом */}
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-[#f8cf5d]/20 to-[#f8cf5d]/10 rounded-xl border border-[#f8cf5d]/30">
            <div className="flex items-center justify-between">
              <span className="text-base sm:text-lg font-semibold text-black">
                Итого калорий:
              </span>
              <span className="text-xl sm:text-2xl font-bold text-black bg-white px-3 py-1 rounded-lg shadow-sm">
                {meal.total_calories} ккал
              </span>
            </div>
          </div>
        </div>

        {/* Кнопки действий - адаптивные для мобильных */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50/30 to-white rounded-b-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left font-medium">
              {meal.products.length} продукт{meal.products.length !== 1 ? 'а' : ''}
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <button
                onClick={() => onEdit(meal)}
                className="px-3 sm:px-4 py-2 text-black bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-[#f8cf5d] focus:ring-2 focus:ring-[#f8cf5d] focus:ring-offset-2 transition-all duration-300 mobile-button text-sm sm:text-base font-medium"
              >
                Изменить
              </button>
              
              <button
                onClick={handleConfirmMeal}
                disabled={isLoading || meal.products.length === 0}
                className="px-4 sm:px-6 py-2 bg-[#f8cf5d] text-black rounded-lg font-medium hover:shadow-lg hover:shadow-[#f8cf5d]/30 focus:ring-2 focus:ring-[#f8cf5d] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 mobile-button text-sm sm:text-base transform hover:scale-105 active:scale-95"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-black"></div>
                    <span className="hidden sm:inline">Сохранение...</span>
                    <span className="sm:hidden">...</span>
                  </div>
                ) : (
                  <>
                    <span className="hidden sm:inline">✅ Сохранить в дневник</span>
                    <span className="sm:hidden">💾 Сохранить</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно редактирования продукта */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => setEditingProduct(null)}
        />
      )}
    </>
  );
} 