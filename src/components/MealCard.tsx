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
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mobile-card mx-2 sm:mx-0">
        {/* Заголовок карточки - адаптивный */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            📊 Результат анализа
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Проверь и отредактируй данные перед сохранением
          </p>
        </div>

        {/* Список продуктов - адаптивный */}
        <div className="px-3 sm:px-6 py-3 sm:py-4">
          <div className="space-y-2 sm:space-y-3">
            {meal.products.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{product.name}</div>
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
                    className="p-1.5 sm:p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Редактировать"
                  >
                    <span className="text-sm sm:text-base">✏️</span>
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id!)}
                    className="p-1.5 sm:p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Удалить"
                  >
                    <span className="text-sm sm:text-base">🗑️</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Итого - адаптивный */}
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-primary-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-base sm:text-lg font-semibold text-primary-900">
                Итого калорий:
              </span>
              <span className="text-xl sm:text-2xl font-bold text-primary-600">
                {meal.total_calories} ккал
              </span>
            </div>
          </div>
        </div>

        {/* Кнопки действий - адаптивные для мобильных */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              {meal.products.length} продукт{meal.products.length !== 1 ? 'а' : ''}
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <button
                onClick={() => onEdit(meal)}
                className="px-3 sm:px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors mobile-button text-sm sm:text-base"
              >
                Изменить
              </button>
              
              <button
                onClick={handleConfirmMeal}
                disabled={isLoading || meal.products.length === 0}
                className="px-4 sm:px-6 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mobile-button text-sm sm:text-base"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
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