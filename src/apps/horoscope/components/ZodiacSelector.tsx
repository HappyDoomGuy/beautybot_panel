import React from 'react';
import { ZodiacSignInfo } from '../types';

interface ZodiacSelectorProps {
  onSelect: (sign: ZodiacSignInfo) => void;
  zodiacSigns: ZodiacSignInfo[];
}

const ZodiacSelector: React.FC<ZodiacSelectorProps> = ({ onSelect, zodiacSigns }) => {
  return (
    <div className="w-full animate-fade-in">
        <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-2">
                Выберите свой знак зодиака
            </h2>
            <p className="text-gray-600 dark:text-gray-300">Чтобы получить свой персональный гороскоп на сегодня.</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 md:gap-6">
            {zodiacSigns.map((sign) => (
                <button
                    key={sign.name}
                    onClick={() => onSelect(sign)}
                    className="group flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                >
                    <span className="text-4xl sm:text-5xl mb-2 group-hover:scale-110 transition-transform duration-300">
                        {sign.symbol}
                    </span>
                    <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">{sign.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{sign.dates}</span>
                </button>
            ))}
        </div>
    </div>
  );
};

export default ZodiacSelector;
