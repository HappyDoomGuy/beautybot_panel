import React, { useState } from 'react';
import { MainMenu } from './components/MainMenu';
import { HoroscopeApp } from './apps/HoroscopeApp';
import { LabAnalysisApp } from './apps/LabAnalysisApp';
import { BMICalculatorApp } from './apps/BMICalculatorApp';

export type AppType = 'home' | 'horoscope' | 'lab-analysis' | 'bmi-calculator';

const App: React.FC = () => {
  const [currentApp, setCurrentApp] = useState<AppType>('home');

  const renderCurrentApp = () => {
    switch (currentApp) {
      case 'horoscope':
        return <HoroscopeApp onBack={() => setCurrentApp('home')} />;
      case 'lab-analysis':
        return <LabAnalysisApp onBack={() => setCurrentApp('home')} />;
      case 'bmi-calculator':
        return <BMICalculatorApp onBack={() => setCurrentApp('home')} />;
      default:
        return <MainMenu onAppSelect={setCurrentApp} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {renderCurrentApp()}
    </div>
  );
};

export default App;
