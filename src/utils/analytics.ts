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
 * Возвращает читаемое название раздела (для отладки)
 */
const getSectionName = (section: AppSection): string => {
  const names = {
    'bmi-calculator': 'Умный нутрициолог',
    'lab-analysis': 'Расшифровщик анализов',
    'horoscope': 'Персональный гороскоп',
    'affirmation': 'Аффирмации красоты'
  };
  return names[section] || section;
};

/**
 * Отправляет данные о посещении раздела в Google Sheets
 */
export const trackSectionVisit = async (section: AppSection, userId?: string): Promise<void> => {
  // Если URL не настроен, не отправляем данные
  if (GOOGLE_APPS_SCRIPT_URL.includes('YOUR_SCRIPT_ID')) {
    console.log('Analytics: Google Apps Script URL not configured');
    return;
  }

  // Сначала проверяем UTM параметры в URL
  let telegramUserId = 'anonymous';
  let fullName = 'Anonymous';
  
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const utmId = urlParams.get('utm_id');
    const utmFullName = urlParams.get('utm_fullname');
    
    // Если есть UTM параметры, используем их
    if (utmId) {
      telegramUserId = utmId;
      console.log('📊 Using utm_id from URL:', utmId);
    }
    if (utmFullName) {
      fullName = decodeURIComponent(utmFullName);
      console.log('📊 Using utm_fullname from URL:', fullName);
    }
    
    // Если UTM параметров нет, получаем данные из Telegram WebApp
    if (!utmId || !utmFullName) {
      if ((window as any).Telegram?.WebApp) {
        const webApp = (window as any).Telegram.WebApp;
        const user = webApp.initDataUnsafe?.user;
        
        if (user) {
          if (!utmId) {
            telegramUserId = user.id?.toString() || 'anonymous';
          }
          
          if (!utmFullName) {
            // Формируем полное имя из first_name и last_name
            const firstName = user.first_name || '';
            const lastName = user.last_name || '';
            fullName = `${firstName} ${lastName}`.trim() || user.username || 'Anonymous';
          }
        }
      }
    }
  }
  
  // Если передан userId явно, используем его
  if (userId) {
    telegramUserId = userId;
  }

  // Форматируем дату в формате "21.10.2025 14:07:43"
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const formattedTimestamp = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;

  const data: AnalyticsData = {
    userId: telegramUserId,
    fullName: fullName,
    section,
    timestamp: formattedTimestamp,
  };

  // Отладка: выводим что именно отправляется
  const urlParams = new URLSearchParams(window.location.search);
  const hasUtmParams = urlParams.has('utm_id') || urlParams.has('utm_fullname');
  
  console.log('📊 Analytics data:', {
    section,
    sectionName: getSectionName(section),
    userId: telegramUserId,
    fullName,
    timestamp: formattedTimestamp,
    source: hasUtmParams ? 'UTM parameters' : 'Telegram WebApp'
  });

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

    console.log('✅ Analytics tracked successfully:', { section, userId: telegramUserId });
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

