import TelegramTest from '@/components/TelegramTest';
import PageLayout from '@/components/PageLayout';

export default function TestTelegramPage() {
  return (
    <PageLayout>
      <TelegramTest />
    </PageLayout>
  );
}

// Отключаем статическую генерацию
export const dynamic = 'force-dynamic'; 