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
      gradient: 'from-purple-400 to-pink-400',
      hoverGradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20',
    },
    {
      id: 'lab-analysis' as AppType,
      title: 'Лабораторные анализы',
      description: 'Расшифровка результатов анализов крови с помощью ИИ',
      icon: '🧪',
      gradient: 'from-green-400 to-blue-400',
      hoverGradient: 'from-green-500 to-blue-500',
      bgColor: 'bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20',
    },
    {
      id: 'bmi-calculator' as AppType,
      title: 'Калькулятор ИМТ с ИИ',
      description: 'Расчет ИМТ, планирование питания и персональные рекомендации',
      icon: '⚖️',
      gradient: 'from-yellow-400 to-orange-400',
      hoverGradient: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20',
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
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
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
              <button
                onClick={() => onAppSelect(app.id)}
                className={`
                  app-card w-full p-8 text-left
                  ${app.bgColor}
                  group cursor-pointer
                `}
              >
                {/* Icon */}
                <div className="text-6xl mb-6 group-hover:animate-bounce-gentle">
                  {app.icon}
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h2 className="heading-secondary">
                    {app.title}
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {app.description}
                  </p>

                  {/* Action Button */}
                  <div className="pt-4">
                    <div className={`
                      inline-flex items-center px-6 py-3 rounded-xl
                      bg-gradient-to-r ${app.gradient}
                      group-hover:bg-gradient-to-r group-hover:${app.hoverGradient}
                      text-white font-semibold
                      shadow-lg group-hover:shadow-xl
                      transition-all duration-300
                      transform group-hover:scale-105
                    `}>
                      Открыть
                      <svg 
                        className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 sm:mt-20 text-center">
        <div className="text-gray-500 dark:text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Beauty Panel. Все рекомендации носят информационный характер.</p>
        </div>
      </footer>
    </div>
  );
};

export { MainMenu };
