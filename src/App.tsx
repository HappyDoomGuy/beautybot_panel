import React, { useState, useEffect } from 'react';
import { MainMenu } from './components/MainMenu';
import { HoroscopeApp } from './apps/HoroscopeApp';
import { LabAnalysisApp } from './apps/LabAnalysisApp';
import { BMICalculatorApp } from './apps/BMICalculatorApp';
import { AffirmationApp } from './apps/AffirmationApp';
import { useTelegram } from './hooks/useTelegram';

export type AppType = 'home' | 'horoscope' | 'lab-analysis' | 'bmi-calculator' | 'affirmation';

const App: React.FC = () => {
  const [currentApp, setCurrentApp] = useState<AppType>(() => {
    // Читаем параметр app из URL при первой загрузке
    const params = new URLSearchParams(window.location.search);
    const appParam = params.get('app');
    const validApps: AppType[] = ['home', 'horoscope', 'lab-analysis', 'bmi-calculator', 'affirmation'];
    if (appParam && validApps.includes(appParam as AppType)) {
      return appParam as AppType;
    }
    return 'home';
  });
  const { webApp, isTelegram, hapticFeedback } = useTelegram();

  // Инициализация Telegram Web App
  useEffect(() => {
    if (isTelegram && webApp) {
      try {
        // Устанавливаем цвета темы Telegram
        webApp.setHeaderColor('#fdf2f8'); // Нежно-розовый
        webApp.setBackgroundColor('#ffffff'); // Белый
        
        // Включаем подтверждение закрытия
        webApp.enableClosingConfirmation();
        
        console.log('Telegram Web App ready:', {
          user: webApp.initDataUnsafe?.user,
          theme: webApp.colorScheme,
          version: webApp.version
        });
      } catch (error) {
        console.error('Error configuring Telegram Web App:', error);
      }
    }
  }, [isTelegram, webApp]);

  // Обновляем URL при изменении раздела
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (currentApp === 'home') {
      // Удаляем параметр для главной страницы
      params.delete('app');
    } else {
      params.set('app', currentApp);
    }
    const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }, [currentApp]);

  const handleAppSelect = (app: AppType) => {
    hapticFeedback.selection();
    setCurrentApp(app);
  };

  const handleBack = () => {
    hapticFeedback.impact('light');
    setCurrentApp('home');
  };

  const renderCurrentApp = () => {
    switch (currentApp) {
      case 'horoscope':
        return <HoroscopeApp onBack={handleBack} />;
      case 'lab-analysis':
        return <LabAnalysisApp onBack={handleBack} />;
      case 'bmi-calculator':
        return <BMICalculatorApp onBack={handleBack} />;
      case 'affirmation':
        return <AffirmationApp onBack={handleBack} />;
      default:
        return <MainMenu onAppSelect={handleAppSelect} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentApp()}
    </div>
  );
};

export default App;
