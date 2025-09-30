import React from 'react';
import { ZodiacSignInfo } from '../types';

interface ZodiacSelectorProps {
  onSelect: (sign: ZodiacSignInfo) => void;
  zodiacSigns: ZodiacSignInfo[];
}

const ZodiacSelector: React.FC<ZodiacSelectorProps> = ({ onSelect, zodiacSigns }) => {
  return (
    <div className="w-full animate-fade-in">
        <div className="text-center mb-4 sm:mb-6">
            <div className="inline-block bg-white/90 backdrop-blur-lg rounded-3xl px-4 py-3 shadow-xl border-2 border-rose-200/50">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                    Выберите свой знак зодиака
                </h2>
                <p className="text-sm text-gray-700">Чтобы получить свой персональный гороскоп на сегодня.</p>
            </div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 md:gap-4">
            {zodiacSigns.map((sign) => (
                <button
                    key={sign.name}
                    onClick={() => onSelect(sign)}
                    className="group flex flex-col items-center p-3 bg-gradient-to-br from-pink-100/95 to-rose-100/95 backdrop-blur-md rounded-2xl border-2 border-rose-400 hover:border-rose-500 hover:from-pink-200/95 hover:to-rose-200/95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose-500 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                >
                    <span className="text-3xl sm:text-4xl mb-1 group-hover:scale-110 transition-transform duration-300">
                        {sign.symbol}
                    </span>
                    <span className="font-semibold text-xs sm:text-sm text-gray-800">{sign.name}</span>
                    <span className="text-xs text-gray-600 hidden sm:block">{sign.dates}</span>
                </button>
            ))}
        </div>
    </div>
  );
};

export default ZodiacSelector;
