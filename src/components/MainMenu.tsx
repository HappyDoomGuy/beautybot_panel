import React from 'react';
import { AppType } from '../App';

interface MainMenuProps {
  onAppSelect: (app: AppType) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onAppSelect }) => {
  const apps = [
           {
             id: 'horoscope' as AppType,
             title: 'Гороскоп красоты',
             description: 'Персональный гороскоп красоты на основе вашего знака зодиака',
             icon: '✨',
             gradient: 'from-pink-300 to-rose-300',
             hoverGradient: 'from-pink-400 to-rose-400',
             bgColor: 'bg-white',
           },
           {
             id: 'lab-analysis' as AppType,
             title: 'Лабораторные анализы',
             description: 'Расшифровка результатов анализов крови с помощью ИИ',
             icon: '🧪',
             gradient: 'from-pink-300 to-rose-300',
             hoverGradient: 'from-pink-400 to-rose-400',
             bgColor: 'bg-white',
           },
           {
             id: 'bmi-calculator' as AppType,
             title: 'Калькулятор ИМТ с ИИ',
             description: 'Расчет ИМТ, планирование питания и персональные рекомендации',
             icon: '⚖️',
             gradient: 'from-pink-300 to-rose-300',
             hoverGradient: 'from-pink-400 to-rose-400',
             bgColor: 'bg-white',
           },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="text-center mb-8 sm:mb-12">
        <div className="animate-fade-in">
          <h1 className="heading-primary mb-4">
            Beauty Panel
          </h1>
          <p className="text-lg sm:text-xl text-gray-800 max-w-2xl mx-auto font-medium">
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
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`
                app-card w-full p-8
                ${app.bgColor}
                group cursor-pointer
                flex flex-col
              `}>
                {/* Main Content */}
                <div className="flex-1">
                  {/* Icon */}
                  <div className="text-6xl mb-4 group-hover:animate-bounce-gentle">
                    {app.icon}
                  </div>

                  {/* Text Content */}
                  <div className="space-y-3">
                    <h2 className="heading-secondary">
                      {app.title}
                    </h2>
                    
                    <p className="text-gray-700 leading-relaxed font-medium">
                      {app.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Right - Action Button */}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => onAppSelect(app.id)}
                    className={`
                      inline-flex items-center px-6 py-3 rounded-xl
                      bg-gradient-to-r ${app.gradient}
                      hover:bg-gradient-to-r hover:${app.hoverGradient}
                      text-white font-semibold
                      transition-all duration-300
                      whitespace-nowrap
                    `}
                  >
                    Открыть
                    <svg 
                      className="w-5 h-5 ml-2 transition-transform duration-300 hover:translate-x-1" 
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
      <footer className="mt-16 sm:mt-20 text-center">
        <div className="text-gray-700 text-sm font-medium">
          <p>&copy; {new Date().getFullYear()} Beauty Panel. Все рекомендации носят информационный характер.</p>
        </div>
      </footer>
    </div>
  );
};

export { MainMenu };
