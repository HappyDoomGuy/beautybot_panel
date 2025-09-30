
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
  return 'text-slate-800 dark:text-slate-100'; 
};


const ResultsCard: React.FC<ResultsCardProps> = ({ results }) => {
  if (!results) {
    return null;
  }

  const neumorphicBaseClass = "transition-all duration-300 ease-in-out";
  const neumorphicExtrudeClass = `${neumorphicBaseClass} bg-gray-200 shadow-[6px_6px_12px_#BEBEBE,_-6px_-6px_12px_#FFFFFF] dark:bg-slate-800 dark:shadow-[6px_6px_12px_#141c2a,_-6px_-6px_12px_#2c3a50]`;
  const neumorphicInnerExtrudeClass = `bg-gray-200 shadow-[4px_4px_8px_#BEBEBE,_-4px_-4px_8px_#FFFFFF] dark:bg-slate-800 dark:shadow-[4px_4px_8px_#172031,_-4px_-4px_8px_#2a364b]`;

  const bmiValueColorClass = getTextColorFromBgClass(results.bmiCategory.color);

  return (
    <div className={`p-8 sm:p-10 rounded-2xl ${neumorphicExtrudeClass}`}>
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-8">Ваши результаты</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        <div className={`p-5 rounded-xl text-center ${neumorphicInnerExtrudeClass}`}>
          <p className="text-base text-slate-700 dark:text-slate-300 font-medium">Индекс Массы Тела (ИМТ)</p>
          <p className={`text-2xl font-bold ${bmiValueColorClass} mt-1`}>{results.bmi.toFixed(1)}</p>
          <p className={`mt-1.5 text-sm px-2.5 py-1 rounded-md inline-block ${results.bmiCategory.color} ${results.bmiCategory.textColor || 'text-white'}`}>
            {results.bmiCategory.label}
          </p>
        </div>
        <div className={`p-5 rounded-xl text-center ${neumorphicInnerExtrudeClass}`}>
          <p className="text-base text-slate-700 dark:text-slate-300 font-medium">Базальный метаболизм (BMR)</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{results.bmr.toFixed(0)} <span className="text-sm text-slate-600 dark:text-slate-400">ккал/день</span></p>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Энергия в состоянии покоя</p>
        </div>
        <div className={`p-5 rounded-xl text-center ${neumorphicInnerExtrudeClass}`}>
          <p className="text-base text-slate-700 dark:text-slate-300 font-medium">Общая потребность (TDEE)</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{results.tdee.toFixed(0)} <span className="text-sm text-slate-600 dark:text-slate-400">ккал/день</span></p>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">С учетом вашей активности</p>
        </div>
      </div>
    </div>
  );
};

export default ResultsCard;
