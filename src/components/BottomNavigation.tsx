'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChatBubbleLeftRightIcon, 
  ChartBarIcon, 
  ClockIcon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Чат',
      href: '/',
      icon: ChatBubbleLeftRightIcon,
      active: pathname === '/'
    },
    {
      name: 'Аналитика',
      href: '/analytics',
      icon: ChartBarIcon,
      active: pathname === '/analytics'
    },
    {
      name: 'История',
      href: '/history',
      icon: ClockIcon,
      active: pathname === '/history'
    },
    {
      name: 'Настройки',
      href: '/settings',
      icon: Cog6ToothIcon,
      active: pathname === '/settings'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-t border-gray-200/60 shadow-lg animate-slide-up-bottom">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-300 ease-out transform ${
                  item.active
                    ? 'text-primary-600 bg-primary-50/90 scale-105 shadow-md shadow-primary-200/50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50/80 hover:scale-105'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 transition-all duration-300 ${
                  item.active ? 'scale-110 text-primary-600' : 'group-hover:scale-110'
                }`} />
                <span className={`text-xs font-medium transition-all duration-300 ${
                  item.active ? 'text-primary-700 font-semibold' : 'text-gray-600 group-hover:text-gray-800'
                }`}>
                  {item.name}
                </span>
                
                {/* Индикатор активной страницы */}
                {item.active && (
                  <div className="absolute -top-1 w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Безопасная зона для iPhone */}
      <div className="h-safe-area-inset-bottom bg-white/90 backdrop-blur-2xl" />
    </nav>
  );
} 