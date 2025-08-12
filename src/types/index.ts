export type Product = {
  id?: string;
  name: string;
  weight_g?: number;
  calories?: number;
  notes?: string;
};

export type Meal = {
  id?: string;
  products: Product[];
  total_calories: number;
  timestamp?: string;
  note?: string;
};

export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: Date;
  meta?: any;
};

export type User = {
  id: string;
  email: string;
  name?: string;
  created_at: string;
};

export type MealProduct = {
  id: string;
  meal_id: string;
  product_name: string;
  weight_g?: number;
  calories?: number;
  notes?: string;
};

export type MealRecord = {
  id: string;
  user_id: string;
  meal_time: string;
  total_calories?: number;
  note?: string;
  products: MealProduct[];
}; 