import MealHistory from '@/components/MealHistory';
import PageLayout from '@/components/PageLayout';

export default function HistoryPage() {
  // Используем UUID для демо-пользователя (в реальном приложении это будет ID из Supabase Auth)
  const userId = '550e8400-e29b-41d4-a716-446655440000';

  return (
    <PageLayout 
      title="История питания"
      subtitle="Отслеживайте свои приемы пищи"
    >
      <MealHistory userId={userId} />
    </PageLayout>
  );
} 