-- Calorie Chat AI - Настройка базы данных Supabase
-- Выполните этот скрипт в SQL Editor вашего проекта Supabase

-- Включение расширений
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица приемов пищи
CREATE TABLE IF NOT EXISTS meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  meal_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_calories INTEGER,
  note TEXT
);

-- Таблица продуктов в приемах пищи
CREATE TABLE IF NOT EXISTS meal_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_id UUID REFERENCES meals(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  weight_g INTEGER,
  calories INTEGER,
  notes TEXT
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_meals_user_time ON meals(user_id, meal_time);
CREATE INDEX IF NOT EXISTS idx_meals_meal_time ON meals(meal_time);
CREATE INDEX IF NOT EXISTS idx_meal_products_meal_id ON meal_products(meal_id);
CREATE INDEX IF NOT EXISTS idx_meal_products_name ON meal_products(product_name);

-- RLS (Row Level Security) политики
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_products ENABLE ROW LEVEL SECURITY;

-- Политика для пользователей (каждый видит только свои данные)
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Политика для приемов пищи
CREATE POLICY "Users can view own meals" ON meals
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own meals" ON meals
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own meals" ON meals
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own meals" ON meals
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Политика для продуктов
CREATE POLICY "Users can view own meal products" ON meal_products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM meals 
      WHERE meals.id = meal_products.meal_id 
      AND meals.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert own meal products" ON meal_products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM meals 
      WHERE meals.id = meal_products.meal_id 
      AND meals.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can update own meal products" ON meal_products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM meals 
      WHERE meals.id = meal_products.meal_id 
      AND meals.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete own meal products" ON meal_products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM meals 
      WHERE meals.id = meal_products.meal_id 
      AND meals.user_id::text = auth.uid()::text
    )
  );

-- Функция для автоматического создания пользователя при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер для автоматического создания пользователя
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Функция для подсчета общего количества калорий за день
CREATE OR REPLACE FUNCTION get_daily_calories(user_uuid UUID, target_date DATE)
RETURNS TABLE (
  day DATE,
  total_calories BIGINT,
  meals_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(m.meal_time) as day,
    COALESCE(SUM(m.total_calories), 0) as total_calories,
    COUNT(m.id) as meals_count
  FROM meals m
  WHERE m.user_id = user_uuid
    AND DATE(m.meal_time) = target_date
  GROUP BY DATE(m.meal_time);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для получения статистики по продуктам
CREATE OR REPLACE FUNCTION get_product_stats(user_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS TABLE (
  product_name TEXT,
  total_weight BIGINT,
  total_calories BIGINT,
  usage_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mp.product_name,
    COALESCE(SUM(mp.weight_g), 0) as total_weight,
    COALESCE(SUM(mp.calories), 0) as total_calories,
    COUNT(mp.id) as usage_count
  FROM meal_products mp
  JOIN meals m ON m.id = mp.meal_id
  WHERE m.user_id = user_uuid
    AND m.meal_time >= NOW() - INTERVAL '1 day' * days_back
  GROUP BY mp.product_name
  ORDER BY usage_count DESC, total_calories DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Комментарии к таблицам
COMMENT ON TABLE users IS 'Таблица пользователей приложения';
COMMENT ON TABLE meals IS 'Таблица приемов пищи пользователей';
COMMENT ON TABLE meal_products IS 'Таблица продуктов в приемах пищи';

COMMENT ON COLUMN users.id IS 'Уникальный идентификатор пользователя';
COMMENT ON COLUMN users.email IS 'Email пользователя';
COMMENT ON COLUMN users.name IS 'Имя пользователя';
COMMENT ON COLUMN users.created_at IS 'Дата создания профиля';

COMMENT ON COLUMN meals.id IS 'Уникальный идентификатор приема пищи';
COMMENT ON COLUMN meals.user_id IS 'Ссылка на пользователя';
COMMENT ON COLUMN meals.meal_time IS 'Время приема пищи';
COMMENT ON COLUMN meals.total_calories IS 'Общее количество калорий';
COMMENT ON COLUMN meals.note IS 'Заметка к приему пищи';

COMMENT ON COLUMN meal_products.id IS 'Уникальный идентификатор продукта';
COMMENT ON COLUMN meal_products.meal_id IS 'Ссылка на прием пищи';
COMMENT ON COLUMN meal_products.product_name IS 'Название продукта';
COMMENT ON COLUMN meal_products.weight_g IS 'Вес в граммах';
COMMENT ON COLUMN meal_products.calories IS 'Калории';
COMMENT ON COLUMN meal_products.notes IS 'Заметки о продукте';

-- Проверка создания таблиц
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'meals', 'meal_products')
ORDER BY table_name, ordinal_position; 