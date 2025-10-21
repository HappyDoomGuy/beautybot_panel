import React from 'react';
import ReactMarkdown from 'react-markdown';
import { HoroscopeData, ZodiacSignInfo } from '../types';
import ZodiacIcon from './ZodiacIcon';

interface HoroscopeDisplayProps {
  horoscopeData: HoroscopeData;
  zodiacSignData: ZodiacSignInfo;
  onReset: () => void;
}

const InfoPanel: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-pink-100/90 to-rose-100/90 backdrop-blur-sm rounded-lg p-4 border-2 border-rose-200/70">
        <p className="text-xs text-rose-600 uppercase tracking-wider font-semibold">{label}</p>
        <p className="text-2xl font-bold text-rose-800 mt-1">{value}</p>
    </div>
);

const HoroscopeDisplay: React.FC<HoroscopeDisplayProps> = ({ horoscopeData, zodiacSignData, onReset }) => {
  return (
    <div className="w-full max-w-2xl bg-gradient-to-br from-pink-50/95 to-rose-50/95 backdrop-blur-lg rounded-3xl border-2 border-rose-200/60 shadow-2xl p-6 md:p-8 animate-fade-in-up">
      <div className="text-center mb-6">
          <div className="mx-auto mb-2">
            <ZodiacIcon sign={zodiacSignData.name} className="text-6xl" />
          </div>
          <h2 className="text-3xl font-bold text-rose-700">{zodiacSignData.name}</h2>
          <p className="text-sm text-gray-600">{zodiacSignData.dates}</p>
      </div>

      <div className="space-y-6">
          <div>
              <h3 className="text-xl text-center text-rose-800 font-semibold mb-3">{horoscopeData.title}</h3>
              <div className="text-gray-800 leading-relaxed prose prose-sm sm:prose-base max-w-none">
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => (
                      <h2 className="text-lg font-semibold text-rose-700 mt-6 mb-3">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-base font-semibold text-rose-600 mt-4 mb-2">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="mb-4 text-gray-800 leading-relaxed font-medium">
                        {children}
                      </p>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-gray-900 font-semibold">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="text-gray-800 italic font-medium">
                        {children}
                      </em>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-800 ml-2">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-800 ml-2">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-gray-800 leading-relaxed font-medium">
                        {children}
                      </li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-rose-400 pl-4 my-4 italic text-rose-700 bg-gradient-to-r from-pink-50 to-rose-50 py-3 rounded-r font-medium">
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
          className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-pink-400 to-rose-400 hover:bg-gradient-to-r hover:from-pink-300 hover:to-rose-300 text-white font-semibold transition-all duration-300 whitespace-nowrap"
        >
          <svg 
            className="w-5 h-5 mr-2 transition-transform duration-300 hover:-translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Главное меню
        </button>
      </div>
    </div>
  );
};

export default HoroscopeDisplay;
