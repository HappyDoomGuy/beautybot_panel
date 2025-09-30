import React from 'react';
import { AppType } from '../App';
import { useTelegram } from '../hooks/useTelegram';

interface MainMenuProps {
  onAppSelect: (app: AppType) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onAppSelect }) => {
  const { hapticFeedback } = useTelegram();
  const apps = [
           {
             id: 'horoscope' as AppType,
             title: 'Гороскоп красоты',
             description: 'Персональный гороскоп красоты на основе вашего знака зодиака',
             icon: '✨',
             iconAnimation: 'group-hover:animate-[iconGentleRotate_3s_ease-in-out_infinite]',
             gradient: 'from-pink-300 to-rose-300',
             hoverGradient: 'from-pink-400 to-rose-400',
             bgColor: 'bg-white',
           },
           {
             id: 'lab-analysis' as AppType,
             title: 'Лабораторные анализы',
             description: 'Расшифровка результатов анализов крови с помощью ИИ',
             icon: '🧪',
             iconAnimation: 'group-hover:animate-[iconGentleRotate_3s_ease-in-out_infinite]',
             gradient: 'from-pink-300 to-rose-300',
             hoverGradient: 'from-pink-400 to-rose-400',
             bgColor: 'bg-white',
           },
           {
             id: 'bmi-calculator' as AppType,
             title: 'Калькулятор ИМТ с ИИ',
             description: 'Расчет ИМТ, планирование питания и персональные рекомендации',
             icon: '⚖️',
             iconAnimation: 'group-hover:animate-[iconGentleRotate_3s_ease-in-out_infinite]',
             gradient: 'from-pink-300 to-rose-300',
             hoverGradient: 'from-pink-400 to-rose-400',
             bgColor: 'bg-white',
           },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="text-center mb-6 sm:mb-8 md:mb-12">
        <div className="animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            Beauty Panel
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-800 max-w-2xl mx-auto font-medium px-4">
            Комплексное приложение для красоты и здоровья
          </p>
        </div>
      </header>

      {/* Apps Grid */}
      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {apps.map((app, index) => (
            <div
              key={app.id}
              className={`animate-card-entrance-${index + 1}`}
            >
              <div className={`
                app-card w-full p-6 sm:p-8
                ${app.bgColor}
                group cursor-pointer
                flex flex-col
              `}>
                {/* Main Content */}
                <div className="flex-1">
                  {/* Icon */}
                  <div className="icon-container mb-3 sm:mb-4">
                    <div className={`text-5xl sm:text-6xl ${app.iconAnimation}`}>
                      {app.icon}
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="space-y-2 sm:space-y-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-pink-700 mb-2">
                      {app.title}
                    </h2>
                    
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                      {app.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Right - Action Button */}
                <div className="flex justify-end mt-4 sm:mt-6">
                  <button
                    onClick={() => {
                      hapticFeedback.impact('medium');
                      onAppSelect(app.id);
                    }}
                    className="inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-pink-400 to-rose-400 hover:bg-gradient-to-r hover:from-pink-300 hover:to-rose-300 text-white text-sm sm:text-base font-semibold transition-all duration-300 whitespace-nowrap"
                  >
                    Открыть
                    <svg 
                      className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:ml-2 transition-transform duration-300 hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 sm:mt-16 md:mt-20 text-center">
        <div className="text-gray-700 text-xs sm:text-sm font-medium px-4">
          <p>&copy; {new Date().getFullYear()} Beauty Panel. Все рекомендации носят информационный характер.</p>
        </div>
      </footer>
    </div>
  );
};

export { MainMenu };
