import { create } from 'zustand';
import { Message, Meal, Product } from '@/types';

interface ChatState {
  messages: Message[];
  pendingMeal: Meal | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setPendingMeal: (meal: Meal | null) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  removeProduct: (productId: string) => void;
  recalculateCalories: () => void;
  clearChat: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  pendingMeal: null,
  isLoading: false,
  error: null,

  addMessage: (messageData) => {
    const message: Message = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...messageData
    };
    
    set((state) => ({
      messages: [...state.messages, message]
    }));
  },

  setPendingMeal: (meal) => {
    set({ pendingMeal: meal });
  },

  updateProduct: (productId, updates) => {
    set((state) => {
      if (!state.pendingMeal) return state;

      const updatedProducts = state.pendingMeal.products.map(product =>
        product.id === productId ? { ...product, ...updates } : product
      );

      const updatedMeal = {
        ...state.pendingMeal,
        products: updatedProducts
      };

      return { pendingMeal: updatedMeal };
    });

    // Пересчитываем калории после обновления
    get().recalculateCalories();
  },

  removeProduct: (productId) => {
    set((state) => {
      if (!state.pendingMeal) return state;

      const updatedProducts = state.pendingMeal.products.filter(
        product => product.id !== productId
      );

      const updatedMeal = {
        ...state.pendingMeal,
        products: updatedProducts
      };

      return { pendingMeal: updatedMeal };
    });

    // Пересчитываем калории после удаления
    get().recalculateCalories();
  },

  recalculateCalories: () => {
    set((state) => {
      if (!state.pendingMeal) return state;

      const totalCalories = state.pendingMeal.products.reduce((sum, product) => {
        return sum + (product.calories || 0);
      }, 0);

      return {
        pendingMeal: {
          ...state.pendingMeal,
          total_calories: totalCalories
        }
      };
    });
  },

  clearChat: () => {
    set({ messages: [], pendingMeal: null, error: null });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error });
  }
})); 