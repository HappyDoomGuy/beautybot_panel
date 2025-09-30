
import React, { useState, useCallback } from 'react';
import { ZodiacSign, HoroscopeData, ZodiacSignInfo } from './types';
import { ZODIAC_SIGNS } from './constants';
import ZodiacSelector from './components/ZodiacSelector';
import HoroscopeDisplay from './components/HoroscopeDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import { getHoroscope } from './services/geminiService';

const App: React.FC = () => {
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
          <div className="text-center text-red-400 bg-red-900/20 p-6 rounded-lg">
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
      return <HoroscopeDisplay horoscopeData={horoscope} zodiacSignData={selectedSign} onReset={handleReset} />;
    }
    return <ZodiacSelector onSelect={handleSelectSign} zodiacSigns={ZODIAC_SIGNS} />;
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center p-4 selection:bg-purple-500 selection:text-white relative z-10">
      <Header onReset={handleReset} showReset={!!(selectedSign || horoscope)} />
      <main className="w-full max-w-2xl mx-auto flex-grow flex items-center justify-center">
        {renderContent()}
      </main>
      <footer className="w-full text-center p-4 text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} Beauty Oracle. Все прогнозы созданы искусственным интеллектом.</p>
      </footer>
    </div>
  );
};

export default App;