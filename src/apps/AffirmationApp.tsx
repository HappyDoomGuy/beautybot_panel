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
      case 'confidence': return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'beauty': return 'bg-pink-100 text-pink-700 border-pink-300';
      case 'health': return 'bg-rose-100 text-rose-700 border-rose-300';
      case 'mindfulness': return 'bg-pink-50 text-rose-800 border-rose-200';
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
    <div className="min-h-screen flex flex-col">
      <AppNavigation 
        title="Beauty Advice" 
        onBack={onBack}
        gradient="from-pink-500 to-rose-500"
      />
      
      <main className="flex-1 p-3 sm:p-4 pb-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Заголовок и прогресс */}
          <div className="text-center space-y-3">
            <div className="inline-block bg-white/90 backdrop-blur-lg rounded-3xl px-5 py-3 shadow-xl border-2 border-rose-200/50">
              <h1 className="text-2xl sm:text-3xl font-bold text-rose-800">
                30-дневный челлендж красоты
              </h1>
            </div>
          </div>
          
          {/* Прогресс бар */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow-lg border-2 border-rose-200/50">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Прогресс</span>
                <span className="font-semibold">{progress.completedDays.length}/30 дней</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-pink-400 to-rose-400 transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Текущий день */}
          {progress.completedDays.length < 30 && currentDayData && (
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-xl p-6 sm:p-8 border-2 border-pink-200/60">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-pink-600">День {currentDayData.day}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(currentDayData.category)}`}>
                  {getCategoryName(currentDayData.category)}
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 leading-relaxed">
                "{currentDayData.affirmation}"
              </h2>
              
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-5 mb-6">
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
                    : 'bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-300 hover:to-rose-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {progress.completedDays.includes(progress.currentDay) ? '✓ Выполнено' : 'Отметить как выполненное'}
              </button>
            </div>
          )}

          {/* Поздравление при завершении */}
          {progress.completedDays.length === 30 && (
            <div className="bg-gradient-to-br from-pink-100/95 to-rose-100/95 backdrop-blur-lg rounded-3xl shadow-xl p-8 text-center border-2 border-rose-300/60">
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
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-xl p-6 border-2 border-pink-200/60">
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
                      ${isCompleted ? 'bg-gradient-to-br from-pink-400 to-rose-400 text-white shadow-md' : ''}
                      ${isCurrent ? 'bg-rose-200 text-rose-800 ring-2 ring-rose-500 ring-offset-2' : ''}
                      ${!isCompleted && !isCurrent ? 'bg-gray-100 text-gray-400' : ''}
                    `}
                  >
                    {isCompleted ? '✓' : day.day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Кнопка сброса и футер в одной плашке */}
          <div className="bg-white/85 backdrop-blur-lg rounded-2xl p-4 shadow-lg border-2 border-rose-200/50 space-y-3">
            {!showResetConfirm ? (
              <>
                <div className="text-center">
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="text-gray-600 hover:text-gray-800 text-sm underline transition-colors"
                  >
                    Начать заново
                  </button>
                </div>
                <div className="text-center border-t border-rose-200/50 pt-3">
                  <p className="text-xs text-gray-700">&copy; {new Date().getFullYear()} Beauty Advice. Будьте прекрасны каждый день! 💖</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-red-800 font-semibold text-sm text-center">
                    Вы уверены? Весь прогресс будет удален.
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={resetProgress}
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors shadow-md text-sm"
                  >
                    Да, сбросить
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-6 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg font-semibold transition-colors border border-gray-300 shadow-md text-sm"
                  >
                    Отмена
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export { AffirmationApp };