import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Типы для базы данных
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          created_at?: string;
        };
      };
      meals: {
        Row: {
          id: string;
          user_id: string;
          meal_time: string;
          total_calories: number | null;
          note: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          meal_time?: string;
          total_calories?: number | null;
          note?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          meal_time?: string;
          total_calories?: number | null;
          note?: string | null;
        };
      };
      meal_products: {
        Row: {
          id: string;
          meal_id: string;
          product_name: string;
          weight_g: number | null;
          calories: number | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          meal_id: string;
          product_name: string;
          weight_g?: number | null;
          calories?: number | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          meal_id?: string;
          product_name?: string;
          weight_g?: number | null;
          calories?: number | null;
          notes?: string | null;
        };
      };
    };
  };
}; 