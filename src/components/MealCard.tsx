'use client';

import React, { useState } from 'react';
import { Meal, Product } from '@/types';
import EditProductModal from './EditProductModal';
import Icon from './Icon';

interface MealCardProps {
  meal: Meal;
  onConfirm: () => void;
  onEdit: (meal: Meal) => void;
  isLoading?: boolean;
}

export default function MealCard({ meal, onConfirm, onEdit, isLoading = false }: MealCardProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = meal.products.filter(p => p.id !== productId);
    const updatedMeal = {
      ...meal,
      products: updatedProducts,
      total_calories: updatedProducts.reduce((sum, p) => sum + (p.calories || 0), 0)
    };
    onEdit(updatedMeal);
  };

  const handleSaveProduct = (updatedProduct: Product) => {
    const updatedProducts = meal.products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    );
    const updatedMeal = {
      ...meal,
      products: updatedProducts,
      total_calories: updatedProducts.reduce((sum, p) => sum + (p.calories || 0), 0)
    };
    onEdit(updatedMeal);
    setEditingProduct(null);
  };

  const handleConfirmMeal = () => {
    onConfirm();
  };

  return (
    <>
      <div className="glass-effect rounded-2xl shadow-lg border border-gray-200 overflow-hidden animate-slide-up">
        {/* Заголовок */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-[#f8cf5d]/20 to-[#f8cf5d]/10 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-black flex items-center gap-2">
            <Icon name="chat" size={20} />
            Анализ еды
          </h3>
        </div>

        {/* Список продуктов */}
        <div className="px-3 sm:px-6 py-3 sm:py-4">
          <div className="space-y-3">
            {meal.products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50/50 to-white rounded-xl border border-gray-200/50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-black truncate">{product.name}</h4>
                    {product.weight_g && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {product.weight_g}г
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-black">
                      {product.calories || 0} ккал
                    </span>
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
                    <Icon name="edit" size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id!)}
                    className="p-1.5 sm:p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110"
                    title="Удалить"
                  >
                    <Icon name="delete" size={16} />
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
                    <span className="hidden sm:inline">Сохранить в дневник</span>
                    <span className="sm:hidden">Сохранить</span>
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