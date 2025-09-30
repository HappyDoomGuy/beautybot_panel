import React, { useState, useEffect } from 'react';
import { AppNavigation } from '../components/AppNavigation';
import { affirmationsData } from './affirmation/affirmationsData';

interface AffirmationAppProps {
  onBack: () => void;
}

interface Progress {
  completedDays: number[];
  currentDay: number;
  startDate: string;
}

const AffirmationApp: React.FC<AffirmationAppProps> = ({ onBack }) => {
  const [progress, setProgress] = useState<Progress>({
    completedDays: [],
    currentDay: 1,
    startDate: new Date().toISOString()
  });
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Загрузка прогресса из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('affirmationProgress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  // Сохранение прогресса в localStorage
  const saveProgress = (newProgress: Progress) => {
    setProgress(newProgress);
    localStorage.setItem('affirmationProgress', JSON.stringify(newProgress));
  };

  // Отметить день как выполненный
  const completeDay = (day: number) => {
    if (!progress.completedDays.includes(day)) {
      const newProgress = {
        ...progress,
        completedDays: [...progress.completedDays, day].sort((a, b) => a - b),
        currentDay: Math.min(day + 1, 30)
      };
      saveProgress(newProgress);
    }
  };

  // Сброс прогресса
  const resetProgress = () => {
    const newProgress = {
      completedDays: [],
      currentDay: 1,
      startDate: new Date().toISOString()
    };
    saveProgress(newProgress);
    setShowResetConfirm(false);
  };

  const currentDayData = affirmationsData[progress.currentDay - 1];
  const progressPercentage = (progress.completedDays.length / 30) * 100;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'self-love': return 'bg-pink-100 text-pink-800 border-pink-300';
      case 'confidence': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'beauty': return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'health': return 'bg-green-100 text-green-800 border-green-300';
      case 'mindfulness': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'self-love': return 'Любовь к себе';
      case 'confidence': return 'Уверенность';
      case 'beauty': return 'Красота';
      case 'health': return 'Здоровье';
      case 'mindfulness': return 'Осознанность';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 flex flex-col">
      <AppNavigation 
        title="Аффирмация красоты" 
        onBack={onBack}
        gradient="from-pink-500 to-rose-500"
      />
      
      <main className="flex-1 p-4 sm:p-6 pb-20">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Заголовок и прогресс */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              30-дневный челлендж красоты
            </h1>
            
            {/* Прогресс бар */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Прогресс</span>
                <span className="font-semibold">{progress.completedDays.length}/30 дней</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Текущий день */}
          {progress.completedDays.length < 30 && currentDayData && (
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border-2 border-pink-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-pink-600">День {currentDayData.day}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(currentDayData.category)}`}>
                  {getCategoryName(currentDayData.category)}
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 leading-relaxed">
                "{currentDayData.affirmation}"
              </h2>
              
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-5 mb-6">
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-xl">✨</span> Задание на сегодня
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {currentDayData.task}
                </p>
              </div>
              
              <button
                onClick={() => completeDay(progress.currentDay)}
                disabled={progress.completedDays.includes(progress.currentDay)}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-200 ${
                  progress.completedDays.includes(progress.currentDay)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {progress.completedDays.includes(progress.currentDay) ? '✓ Выполнено' : 'Отметить как выполненное'}
              </button>
            </div>
          )}

          {/* Поздравление при завершении */}
          {progress.completedDays.length === 30 && (
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl shadow-xl p-8 text-center border-2 border-pink-300">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Поздравляем!
              </h2>
              <p className="text-gray-700 text-lg mb-6">
                Вы прошли весь 30-дневный челлендж красоты! Вы великолепны! ✨
              </p>
            </div>
          )}

          {/* Календарь дней */}
          <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-pink-200">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">Календарь челленджа</h3>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {affirmationsData.map((day) => {
                const isCompleted = progress.completedDays.includes(day.day);
                const isCurrent = day.day === progress.currentDay && !isCompleted;
                
                return (
                  <div
                    key={day.day}
                    className={`
                      aspect-square rounded-lg flex items-center justify-center font-semibold text-sm transition-all duration-200
                      ${isCompleted ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-md' : ''}
                      ${isCurrent ? 'bg-pink-200 text-pink-800 ring-2 ring-pink-500 ring-offset-2' : ''}
                      ${!isCompleted && !isCurrent ? 'bg-gray-100 text-gray-400' : ''}
                    `}
                  >
                    {isCompleted ? '✓' : day.day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Кнопка сброса */}
          <div className="text-center">
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="text-gray-500 hover:text-gray-700 text-sm underline transition-colors"
              >
                Начать заново
              </button>
            ) : (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 space-y-3">
                <p className="text-red-800 font-semibold">
                  Вы уверены? Весь прогресс будет удален.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={resetProgress}
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Да, сбросить
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="w-full text-center p-4 text-xs text-gray-500 bg-white border-t border-gray-200">
        <p>&copy; {new Date().getFullYear()} Beauty Advice. Будьте прекрасны каждый день! 💖</p>
      </footer>
    </div>
  );
};

export { AffirmationApp };