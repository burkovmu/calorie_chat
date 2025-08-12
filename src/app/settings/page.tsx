import Settings from '@/components/Settings';
import PageLayout from '@/components/PageLayout';

export default function SettingsPage() {
  return (
    <PageLayout 
      title="Настройки"
      subtitle="Настройте приложение под себя"
    >
      <Settings />
    </PageLayout>
  );
} 