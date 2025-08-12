import ChatPage from '@/components/ChatPage';
import PageLayout from '@/components/PageLayout';

export default function Home() {
  return (
    <PageLayout 
      title="Calorie Chat AI"
    >
      <ChatPage />
    </PageLayout>
  );
}

// Отключаем статическую генерацию для страницы с Telegram функциональностью
export const dynamic = 'force-dynamic'; 