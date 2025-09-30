import React, { useState, useCallback } from 'react';
import { ZodiacSign, HoroscopeData, ZodiacSignInfo } from './horoscope/types';
import { ZODIAC_SIGNS } from './horoscope/constants';
import ZodiacSelector from './horoscope/components/ZodiacSelector';
import HoroscopeDisplay from './horoscope/components/HoroscopeDisplay';
import LoadingSpinner from './horoscope/components/LoadingSpinner';
import { AppNavigation } from '../components/AppNavigation';
import { getHoroscope } from './horoscope/services/geminiService';

interface HoroscopeAppProps {
  onBack: () => void;
}

const HoroscopeApp: React.FC<HoroscopeAppProps> = ({ onBack }) => {
  const [selectedSign, setSelectedSign] = useState<ZodiacSignInfo | null>(null);
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectSign = useCallback(async (sign: ZodiacSignInfo) => {
    setSelectedSign(sign);
    setIsLoading(true);
    setError(null);
    setHoroscope(null);
    try {
      const data = await getHoroscope(sign.name);
      setHoroscope(data);
    } catch (err) {
      setError('Не удалось получить гороскоп. Пожалуйста, попробуйте еще раз.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setSelectedSign(null);
    setHoroscope(null);
    setError(null);
  }, []);
  
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return (
          <div className="text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
              <p>{error}</p>
              <button
                  onClick={handleReset}
                  className="mt-4 px-6 py-2 bg-indigo-500 text-white font-semibold rounded-full hover:bg-indigo-400 transition-colors duration-300"
              >
                  Попробовать снова
              </button>
          </div>
      );
    }
    if (horoscope && selectedSign) {
      return <HoroscopeDisplay horoscopeData={horoscope} zodiacSignData={selectedSign} onReset={onBack} />;
    }
    return <ZodiacSelector onSelect={handleSelectSign} zodiacSigns={ZODIAC_SIGNS} />;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AppNavigation 
        title="Гороскоп красоты" 
        onBack={onBack}
        icon="✨"
        gradient="from-pink-500 to-rose-500"
      />
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          {renderContent()}
        </div>
      </main>
      
      <footer className="w-full text-center p-4 text-xs text-gray-500 dark:text-gray-400 mt-auto">
        <p>&copy; {new Date().getFullYear()} Beauty Panel. Все прогнозы созданы искусственным интеллектом.</p>
      </footer>
    </div>
  );
};

export { HoroscopeApp };
