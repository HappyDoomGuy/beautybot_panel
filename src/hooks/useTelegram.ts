import { useEffect, useState } from 'react';

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: any;
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
    hint_color?: string;
    bg_color?: string;
    text_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  BackButton: {
    isVisible: boolean;
    show(): void;
    hide(): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isProgressVisible: boolean;
    isActive: boolean;
    setText(text: string): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    showProgress(leaveActive?: boolean): void;
    hideProgress(): void;
    setParams(params: {
      text?: string;
      color?: string;
      text_color?: string;
      is_active?: boolean;
      is_visible?: boolean;
    }): void;
  };
  HapticFeedback: {
    impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
    notificationOccurred(type: 'error' | 'success' | 'warning'): void;
    selectionChanged(): void;
  };
  isVersionAtLeast(version: string): boolean;
  setHeaderColor(color: string): void;
  setBackgroundColor(color: string): void;
  enableClosingConfirmation(): void;
  disableClosingConfirmation(): void;
  onEvent(eventType: string, eventHandler: () => void): void;
  offEvent(eventType: string, eventHandler: () => void): void;
  sendData(data: string): void;
  openLink(url: string, options?: { try_instant_view?: boolean }): void;
  openTelegramLink(url: string): void;
  showPopup(params: {
    title?: string;
    message: string;
    buttons?: Array<{
      id?: string;
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
      text?: string;
    }>;
  }, callback?: (error: Error | null, result?: string) => void): void;
  showAlert(message: string, callback?: () => void): void;
  showConfirm(message: string, callback?: (confirmed: boolean) => void): void;
  ready(): void;
  expand(): void;
  close(): void;
  disableVerticalSwipes?(): void;
}

export const useTelegram = () => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeTelegram = () => {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        
        try {
          // Инициализация приложения
          tg.ready();
          tg.expand();
          
          // Устанавливаем стабильную высоту viewport
          tg.viewportStableHeight = 100;
          
          // Отключаем вертикальные свайпы
          if (tg.disableVerticalSwipes) {
            tg.disableVerticalSwipes();
          }
          
          setWebApp(tg);
          
          console.log('Telegram Web App initialized:', {
            version: tg.version,
            platform: tg.platform,
            colorScheme: tg.colorScheme,
            isExpanded: tg.isExpanded
          });
        } catch (error) {
          console.error('Error initializing Telegram Web App:', error);
        }
      } else {
        console.log('Telegram Web App not available - running in browser mode');
      }
      
      // Всегда помечаем как готовое
      setIsReady(true);
    };

    // Небольшая задержка для загрузки Telegram API
    const timer = setTimeout(() => {
      initializeTelegram();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const hapticFeedback = {
    impact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') => {
      webApp?.HapticFeedback.impactOccurred(style);
    },
    notification: (type: 'error' | 'success' | 'warning' = 'success') => {
      webApp?.HapticFeedback.notificationOccurred(type);
    },
    selection: () => {
      webApp?.HapticFeedback.selectionChanged();
    }
  };

  const showAlert = (message: string) => {
    return new Promise<void>((resolve) => {
      if (webApp?.showAlert) {
        webApp.showAlert(message, () => resolve());
      } else {
        alert(message);
        resolve();
      }
    });
  };

  const showConfirm = (message: string) => {
    return new Promise<boolean>((resolve) => {
      if (webApp?.showConfirm) {
        webApp.showConfirm(message, (confirmed) => resolve(confirmed));
      } else {
        resolve(confirm(message));
      }
    });
  };

  return {
    webApp,
    isTelegram: !!webApp,
    user: webApp?.initDataUnsafe?.user,
    hapticFeedback,
    showAlert,
    showConfirm
  };
};
