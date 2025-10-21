/**
 * Утилита для отправки аналитики посещений в Google Sheets через Apps Script
 */

// URL вашего Google Apps Script Web App
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyqihzVxodDXLghH6U3LQkOZh-L7E3mYKaX-4_0Irum_TIrUQoOGHrTiuAhQrzc2BnY/exec';

export type AppSection = 'bmi-calculator' | 'lab-analysis' | 'horoscope' | 'affirmation';

interface AnalyticsData {
  userId: string;
  fullName: string;
  section: AppSection;
  timestamp: string;
}

/**
 * Отправляет данные о посещении раздела в Google Sheets
 */
export const trackSectionVisit = async (section: AppSection, userId?: string): Promise<void> => {
  // Если URL не настроен, не отправляем данные
  if (GOOGLE_APPS_SCRIPT_URL.includes('YOUR_SCRIPT_ID')) {
    console.log('Analytics: Google Apps Script URL not configured');
    return;
  }

  // Получаем данные пользователя из Telegram WebApp
  let telegramUserId = userId || 'anonymous';
  let fullName = 'Anonymous';

  if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
    const webApp = (window as any).Telegram.WebApp;
    const user = webApp.initDataUnsafe?.user;
    
    if (user) {
      telegramUserId = user.id?.toString() || 'anonymous';
      
      // Формируем полное имя из first_name и last_name
      const firstName = user.first_name || '';
      const lastName = user.last_name || '';
      fullName = `${firstName} ${lastName}`.trim() || user.username || 'Anonymous';
    }
  }

  const data: AnalyticsData = {
    userId: telegramUserId,
    fullName: fullName,
    section,
    timestamp: new Date().toISOString(),
  };

  try {
    // Отправляем данные в Google Apps Script
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script требует no-cors
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('Analytics tracked:', { section, userId: telegramUserId });
  } catch (error) {
    console.error('Failed to track analytics:', error);
    // Не бросаем ошибку, чтобы не ломать пользовательский опыт
  }
};

/**
 * Получает ID пользователя из Telegram WebApp
 */
export const getTelegramUserId = (): string => {
  if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
    const webApp = (window as any).Telegram.WebApp;
    return webApp.initDataUnsafe?.user?.id?.toString() || 'anonymous';
  }
  return 'anonymous';
};

