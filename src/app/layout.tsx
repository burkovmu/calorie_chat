import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';
import ErrorBoundary from '../components/ErrorBoundary';
import { TelegramProvider } from '../components/TelegramProvider';

const openSans = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Calorie Chat AI - Подсчет калорий через чат',
  description: 'Опиши что съел, и ИИ подсчитает калории. Удобный чат-интерфейс для ведения дневника питания.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Calorie Chat AI',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="telegram-app">
      <head>
        {/* Telegram Mini App мета-теги */}
        <meta name="telegram:channel" content="@your_channel" />
        <meta name="telegram:bot" content="@your_bot" />
        
        {/* PWA мета-теги */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Calorie Chat AI" />
        
        {/* iOS специфичные */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Calorie Chat AI" />
        
        {/* Android специфичные */}
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={`${openSans.className} antialiased`}>
        <ErrorBoundary>
          <TelegramProvider>
            {children}
          </TelegramProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
} 