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
      id: 'bmi-calculator' as AppType,
      title: 'Калькулятор ИМТ с ИИ',
      description: 'Расчет ИМТ, планирование питания и персональные рекомендации',
      colorClass: 'bg-pink-mist',
      hoverColor: 'bg-bubblegum',
      textColor: 'text-gray-800',
    },
    {
      id: 'lab-analysis' as AppType,
      title: 'Лабораторные анализы',
      description: 'Расшифровка результатов анализов крови с помощью ИИ',
      colorClass: 'bg-bubblegum',
      hoverColor: 'bg-cherry-soda',
      textColor: 'text-gray-800',
    },
    {
      id: 'horoscope' as AppType,
      title: 'Гороскоп красоты',
      description: 'Персональный гороскоп красоты на основе вашего знака зодиака',
      colorClass: 'bg-cherry-soda',
      hoverColor: 'bg-ruby-petals',
      textColor: 'text-white',
    },
    {
      id: 'affirmation' as AppType,
      title: 'Аффирмация красоты',
      description: 'Персональные аффирмации для красоты и уверенности',
      colorClass: 'bg-ruby-petals',
      hoverColor: 'bg-ruby-petals',
      textColor: 'text-white',
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 flex items-center justify-center">

            {/* Apps Cards - Vertical Stack */}
            <main className="max-w-sm mx-auto">
              <div className="space-y-3">
                {apps.map((app, index) => (
                  <div
                    key={app.id}
                    className={`animate-card-entrance-${index + 1}`}
                  >
                    <div 
                      className={`
                        w-full h-28 p-5 shadow-lg rounded-3xl
                        ${app.colorClass} hover:${app.hoverColor}
                        group cursor-pointer
                        transition-all duration-300
                        transform hover:-translate-y-1 hover:scale-105
                        border border-white/20
                        flex items-center justify-center
                      `}
                      onClick={() => {
                        hapticFeedback.impact('medium');
                        onAppSelect(app.id);
                      }}
                    >
                      {/* Title and Description */}
                      <div className="text-center">
                        <h2 className={`text-lg font-bold ${app.textColor} mb-1 ${app.textColor === 'text-white' ? 'text-shadow-crisp' : ''}`}>
                          {app.title}
                        </h2>
                        <p className={`text-sm ${app.textColor} opacity-80 leading-relaxed ${app.textColor === 'text-white' ? 'text-shadow-crisp' : ''}`}>
                          {app.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </main>
    </div>
  );
};

export { MainMenu };
