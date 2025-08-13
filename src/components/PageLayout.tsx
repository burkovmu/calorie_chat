'use client';

import React from 'react';
import BottomNavigation from './BottomNavigation';

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-white">
      {/* Основной контент с красивым фоном */}
      <main className="flex-1 relative pb-32">
        {/* Декоративный элемент */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-100/40 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-gray-200/30 to-transparent rounded-full blur-2xl pointer-events-none"></div>
        
        {children}
      </main>

      {/* Нижнее меню в стиле iPhone */}
      <BottomNavigation />
    </div>
  );
} 