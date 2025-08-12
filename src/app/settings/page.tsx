import Settings from '@/components/Settings';
import PageLayout from '@/components/PageLayout';

export default function SettingsPage() {
  return (
    <PageLayout 
      title="Настройки"
    >
      <Settings />
    </PageLayout>
  );
}

// Отключаем статическую генерацию для страницы с Telegram функциональностью
export const dynamic = 'force-dynamic'; 