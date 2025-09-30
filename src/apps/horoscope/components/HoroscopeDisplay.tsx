import React from 'react';
import ReactMarkdown from 'react-markdown';
import { HoroscopeData, ZodiacSignInfo } from '../types';

interface HoroscopeDisplayProps {
  horoscopeData: HoroscopeData;
  zodiacSignData: ZodiacSignInfo;
  onReset: () => void;
}

const InfoPanel: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex flex-col items-center justify-center bg-purple-100 dark:bg-purple-900/30 rounded-lg p-4 border border-purple-200 dark:border-purple-800/30">
        <p className="text-xs text-purple-600 dark:text-purple-300 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-purple-800 dark:text-white mt-1">{value}</p>
    </div>
);

const HoroscopeDisplay: React.FC<HoroscopeDisplayProps> = ({ horoscopeData, zodiacSignData, onReset }) => {
  return (
    <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-2xl p-6 md:p-8 animate-fade-in-up">
      <div className="text-center mb-6">
          <div className="mx-auto text-6xl mb-2 text-yellow-500">{zodiacSignData.symbol}</div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{zodiacSignData.name}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{zodiacSignData.dates}</p>
      </div>

      <div className="space-y-6">
          <div>
              <h3 className="text-xl text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-3">{horoscopeData.title}</h3>
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm sm:prose-base dark:prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => (
                      <h2 className="text-lg font-semibold text-purple-600 dark:text-purple-300 mt-6 mb-3">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-base font-semibold text-purple-500 dark:text-purple-200 mt-4 mb-2">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                        {children}
                      </p>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-purple-700 dark:text-purple-200 font-semibold">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="text-indigo-600 dark:text-indigo-300 italic">
                        {children}
                      </em>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300 ml-2">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300 ml-2">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {children}
                      </li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-purple-400 pl-4 my-4 italic text-purple-600 dark:text-purple-200 bg-purple-50 dark:bg-purple-900/20 py-3 rounded-r">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {horoscopeData.horoscope_text}
                </ReactMarkdown>
              </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <InfoPanel label="Цвет дня" value={horoscopeData.lucky_color} />
              <InfoPanel label="Число дня" value={horoscopeData.lucky_number} />
          </div>
      </div>
      
      <div className="mt-8 text-center">
        <button
          onClick={onReset}
          className="px-8 py-2 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-purple-400"
        >
          Главное меню
        </button>
      </div>
    </div>
  );
};

export default HoroscopeDisplay;
