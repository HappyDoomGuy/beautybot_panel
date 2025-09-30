import React, { useState, useEffect } from 'react';
import { MainMenu } from './components/MainMenu';
import { HoroscopeApp } from './apps/HoroscopeApp';
import { LabAnalysisApp } from './apps/LabAnalysisApp';
import { BMICalculatorApp } from './apps/BMICalculatorApp';
import { useTelegram } from './hooks/useTelegram';

export type AppType = 'home' | 'horoscope' | 'lab-analysis' | 'bmi-calculator' | 'affirmation';

const App: React.FC = () => {
  const [currentApp, setCurrentApp] = useState<AppType>('home');
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
        // Заглушка для аффирмации красоты
        return (
          <div className="min-h-screen bg-white flex flex-col">
            <AppNavigation 
              title="Аффирмация красоты" 
              onBack={handleBack}
              icon="💖"
              gradient="from-pink-500 to-rose-500"
            />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💖</div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Аффирмация красоты</h1>
                <p className="text-gray-600 mb-6">Скоро здесь будут персональные аффирмации для красоты и уверенности</p>
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl border-2 border-rose-200">
                  <p className="text-gray-700 italic">"Я красива, уверена в себе и излучаю позитивную энергию"</p>
                </div>
              </div>
            </main>
            <footer className="w-full text-center p-4 text-xs text-gray-500">
              <p>&copy; {new Date().getFullYear()} Beauty Panel. Раздел в разработке.</p>
            </footer>
          </div>
        );
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
