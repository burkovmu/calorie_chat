import Analytics from '@/components/Analytics';
import PageLayout from '@/components/PageLayout';

export default function AnalyticsPage() {
  // Используем UUID для демо-пользователя (в реальном приложении это будет ID из Supabase Auth)
  const userId = '550e8400-e29b-41d4-a716-446655440000';

  return (
    <PageLayout 
      title="Аналитика питания"
    >
      <Analytics userId={userId} />
    </PageLayout>
  );
}

// Отключаем статическую генерацию
export const dynamic = 'force-dynamic'; 