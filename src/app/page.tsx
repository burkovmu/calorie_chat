import ChatPage from '@/components/ChatPage';
import PageLayout from '@/components/PageLayout';

export default function Home() {
  return (
    <PageLayout>
      <ChatPage />
    </PageLayout>
  );
}

// Отключаем статическую генерацию для страницы с Telegram функциональностью
export const dynamic = 'force-dynamic'; 