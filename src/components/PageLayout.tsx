'use client';

import React from 'react';
import BottomNavigation from './BottomNavigation';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function PageLayout({ children, title, subtitle }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-white">
      {/* Красивая шапка */}
      <header className="glass-effect border-b border-gray-200 shadow-sm sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center h-16">
            {/* Заголовок по центру */}
            <div className="text-center">
              <h1 className="text-lg font-semibold text-black truncate">{title}</h1>
              {subtitle && (
                <p className="text-xs text-gray-600 mt-0.5 truncate font-medium">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      </header>

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