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
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-8">Ваши результаты</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl text-center bg-gray-50 dark:bg-gray-700">
          <p className="text-base text-gray-700 dark:text-gray-300 font-medium">Индекс Массы Тела (ИМТ)</p>
          <p className={`text-2xl font-bold ${bmiValueColorClass} mt-1`}>{results.bmi.toFixed(1)}</p>
          <p className={`mt-1.5 text-sm px-2.5 py-1 rounded-md inline-block ${results.bmiCategory.color} ${results.bmiCategory.textColor || 'text-white'}`}>
            {results.bmiCategory.label}
          </p>
        </div>
        <div className="p-5 rounded-xl text-center bg-gray-50 dark:bg-gray-700">
          <p className="text-base text-gray-700 dark:text-gray-300 font-medium">Базальный метаболизм (BMR)</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{results.bmr.toFixed(0)} <span className="text-sm text-gray-600 dark:text-gray-400">ккал/день</span></p>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">Энергия в состоянии покоя</p>
        </div>
        <div className="p-5 rounded-xl text-center bg-gray-50 dark:bg-gray-700">
          <p className="text-base text-gray-700 dark:text-gray-300 font-medium">Общая потребность (TDEE)</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{results.tdee.toFixed(0)} <span className="text-sm text-gray-600 dark:text-gray-400">ккал/день</span></p>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">С учетом вашей активности</p>
        </div>
      </div>
    </div>
  );
};

export default ResultsCard;
