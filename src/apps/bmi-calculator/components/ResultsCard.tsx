import React from 'react';
import { CalculationResults } from '../types';

interface ResultsCardProps {
  results: CalculationResults | null;
}

const getTextColorFromBgClass = (bgClass: string): string => {
  if (bgClass.startsWith('bg-')) {
    const parts = bgClass.split('-');
    if (parts.length === 3) { // e.g., bg-green-500
      return `text-${parts[1]}-${parts[2]}`;
    } else if (parts.length === 2) { // e.g., bg-red (though unlikely for categories)
       return `text-${parts[1]}-500`; // Default shade if not specified
    }
  }
  // Fallback for unexpected formats or if conversion is not direct
  return 'text-gray-800 dark:text-gray-100'; 
};

const ResultsCard: React.FC<ResultsCardProps> = ({ results }) => {
  if (!results) {
    return null;
  }

  const bmiValueColorClass = getTextColorFromBgClass(results.bmiCategory.color);

  return (
    <div className="bg-gradient-to-br from-pink-50/95 to-rose-50/95 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-lg border-2 border-rose-200/60 overflow-hidden">
      <h3 className="text-xl font-semibold text-rose-800 mb-6">Ваши результаты</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="p-5 rounded-xl text-center bg-white border border-rose-100">
          <p className="text-base text-gray-700 font-medium">Индекс Массы Тела (ИМТ)</p>
          <p className={`text-2xl font-bold ${bmiValueColorClass} mt-1`}>{results.bmi.toFixed(1)}</p>
          <p className={`mt-1.5 text-sm px-2.5 py-1 rounded-md inline-block ${results.bmiCategory.color} ${results.bmiCategory.textColor || 'text-white'}`}>
            {results.bmiCategory.label}
          </p>
        </div>
        <div className="p-5 rounded-xl text-center bg-white border border-rose-100">
          <p className="text-base text-gray-700 font-medium">Базальный метаболизм (BMR)</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{results.bmr.toFixed(0)} <span className="text-sm text-gray-700">ккал/день</span></p>
          <p className="mt-1.5 text-sm text-gray-700 font-medium">Энергия в состоянии покоя</p>
        </div>
        <div className="p-5 rounded-xl text-center bg-white border border-rose-100">
          <p className="text-base text-gray-700 font-medium">Общая потребность (TDEE)</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{results.tdee.toFixed(0)} <span className="text-sm text-gray-700">ккал/день</span></p>
          <p className="mt-1.5 text-sm text-gray-700 font-medium">С учетом вашей активности</p>
        </div>
      </div>
    </div>
  );
};

export default ResultsCard;
