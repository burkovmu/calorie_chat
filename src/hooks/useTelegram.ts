import { useTelegram as useTelegramContext } from '@/components/TelegramProvider';

export const useTelegram = () => {
  const telegram = useTelegramContext();
  
  const isTelegramApp = () => {
    return typeof window !== 'undefined' && 'Telegram' in window;
  };
  
  const getUserId = () => {
    return telegram.user?.id?.toString() || 'demo-user';
  };
  
  const getUserName = () => {
    if (telegram.user?.first_name) {
      return telegram.user.last_name 
        ? `${telegram.user.first_name} ${telegram.user.last_name}`
        : telegram.user.first_name;
    }
    return 'Пользователь';
  };
  
  const getThemeColor = (colorType: 'primary' | 'text' | 'background' | 'secondary') => {
    if (!telegram.theme) return getDefaultColor(colorType);
    
    switch (colorType) {
      case 'primary':
        return telegram.theme.button_color || '#3b82f6';
      case 'text':
        return telegram.theme.text_color || '#000000';
      case 'background':
        return telegram.theme.bg_color || '#ffffff';
      case 'secondary':
        return telegram.theme.secondary_bg_color || '#f1f1f1';
      default:
        return getDefaultColor(colorType);
    }
  };
  
  const getDefaultColor = (colorType: 'primary' | 'text' | 'background' | 'secondary') => {
    switch (colorType) {
      case 'primary':
        return '#3b82f6';
      case 'text':
        return '#000000';
      case 'background':
        return '#ffffff';
      case 'secondary':
        return '#f1f1f1';
      default:
        return '#3b82f6';
    }
  };
  
  const shareMeal = (meal: any) => {
    if (!meal) return;
    
    const shareText = `Я съел ${meal.total_calories} ккал:\n${meal.products.map((p: any) => `• ${p.name} - ${p.calories} ккал`).join('\n')}`;
    telegram.share(shareText);
  };
  
  const shareCalorieGoal = (goal: number, current: number) => {
    const percentage = Math.round((current / goal) * 100);
    const shareText = `Моя цель по калориям: ${goal} ккал\nСъедено: ${current} ккал (${percentage}%)`;
    telegram.share(shareText);
  };
  
  return {
    ...telegram,
    isTelegramApp,
    getUserId,
    getUserName,
    getThemeColor,
    shareMeal,
    shareCalorieGoal,
  };
}; 