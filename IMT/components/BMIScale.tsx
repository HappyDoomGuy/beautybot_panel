
import React, { useState, useEffect } from 'react';
import { BMICategory } from '../types';
import { BMI_CATEGORIES } from '../constants';

interface BMIScaleProps {
  bmi: number | null;
  currentCategory: BMICategory | null;
}

const getCategoryDisplayRange = (category: BMICategory): string => {
  const min = category.min;
  const max = category.max;
  const minStr = min.toFixed(1);

  if (max === Infinity) return `${minStr} и более`;
  if (min === 0) return `Менее ${max.toFixed(1)}`;
  const displayMax = (max - 0.1).toFixed(1); // Ensure max is exclusive for display
  return `${minStr} - ${displayMax}`;
};

const BMIScale: React.FC<BMIScaleProps> = ({ bmi, currentCategory }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BMICategory | null>(null);

  const [animatedLeftPosition, setAnimatedLeftPosition] = useState('0%');
  const [pointerColorClass, setPointerColorClass] = useState('bg-indigo-600 dark:bg-indigo-400'); 

  useEffect(() => {
    if (bmi === null) {
      setAnimatedLeftPosition('0%');
      return;
    }

    const visualMinBmi = BMI_CATEGORIES[0].min > 0 ? BMI_CATEGORIES[0].min : 10;
    const lastCategory = BMI_CATEGORIES[BMI_CATEGORIES.length - 1];
    const visualMaxBmi = lastCategory.max !== Infinity && lastCategory.max < 50 ? lastCategory.max : 45;
    const visualRange = visualMaxBmi - visualMinBmi;

    if (visualRange <= 0) {
      setAnimatedLeftPosition('50%');
      return;
    }

    let clampedBmi = Math.max(visualMinBmi, Math.min(bmi, visualMaxBmi));
    const percentage = ((clampedBmi - visualMinBmi) / visualRange) * 100;
    const targetPosition = `${Math.max(0, Math.min(100, percentage))}%`;

    setAnimatedLeftPosition(targetPosition);

  }, [bmi]);

  useEffect(() => {
    if (currentCategory) {
      setPointerColorClass(currentCategory.color); // Use category color for pointer
    } else {
      setPointerColorClass('bg-indigo-600 dark:bg-indigo-400'); // Default if no category
    }
  }, [currentCategory]);

  const handleCategoryClick = (category: BMICategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };
  
  const neumorphicBaseClass = "transition-all duration-300 ease-in-out";
  const neumorphicExtrudeClass = `${neumorphicBaseClass} bg-gray-200 shadow-[6px_6px_12px_#BEBEBE,_-6px_-6px_12px_#FFFFFF] dark:bg-slate-800 dark:shadow-[6px_6px_12px_#141c2a,_-6px_-6px_12px_#2c3a50]`;
  const primaryButtonClass = `w-full font-semibold py-3 px-5 rounded-xl text-white text-base focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-200 dark:ring-offset-slate-800 transition-all duration-200 ease-in-out bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-400 shadow-[3px_3px_7px_#B0B0B0,_-3px_-3px_7px_#FFFFFF] dark:shadow-[3px_3px_7px_#111827,_-3px_-3px_7px_#2a3647] hover:shadow-[4px_4px_8px_#B0B0B0,_-4px_-4px_8px_#FFFFFF] dark:hover:shadow-[4px_4px_8px_#111827,_-4px_-4px_8px_#2a3647] active:shadow-[inset_2px_2px_5px_#B0B0B0,_inset_-2px_-2px_5px_#FFFFFF] dark:active:shadow-[inset_2px_2px_5px_#111827,_inset_-2px_-2px_5px_#2a3647]`;


  if (bmi === null || !currentCategory) {
    return (
      <div className={`p-8 rounded-2xl ${neumorphicExtrudeClass}`}>
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">Шкала Индекса Массы Тела (ИМТ)</h3>
        <p className="text-slate-500 dark:text-slate-400 text-center py-6 text-base">Введите данные и рассчитайте ИМТ, чтобы увидеть шкалу.</p>
      </div>
    );
  }

  return (
    <div className={`p-8 sm:p-10 rounded-2xl ${neumorphicExtrudeClass}`} aria-label="Шкала Индекса Массы Тела">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">Шкала индекса массы тела</h3>
      {bmi !== null && currentCategory && (
         <div className="text-xl text-slate-600 dark:text-slate-400 mb-8 flex flex-col items-center sm:flex-row sm:items-baseline sm:justify-start" aria-live="polite"> {/* Increased from text-base to text-xl */}
            <span className="mr-0 sm:mr-2"> {/* Removed right margin for mobile when centered */}
                Ваш ИМТ: <span className="font-bold">{bmi.toFixed(1)}</span>
            </span>
            <span className={`mt-1 sm:mt-0 px-2 py-1 text-sm rounded ${currentCategory.color} ${currentCategory.textColor || 'text-white'}`}> {/* Category label size kept as text-sm for contrast if desired, or can be increased */}
                {currentCategory.label}
            </span>
        </div>
      )}
      <div className="relative w-full mb-10 pt-6">
        <div className="h-7 flex rounded-full overflow-hidden border border-[#DEE2E6] dark:border-slate-700 shadow-[inset_1px_1px_2px_#BEBEBE,_inset_-1px_-1px_2px_#FFFFFF] dark:shadow-[inset_1px_1px_2px_#141c2a,_inset_-1px_-1px_2px_#2c3a50]" role="listbox" aria-label="Категории ИМТ">
          {BMI_CATEGORIES.map((category, index) => (
            <div
              key={index}
              className={`h-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity ${category.color} ${category.textColor || 'text-white'}`}
              style={{ width: `${(1 / BMI_CATEGORIES.length) * 100}%` }}
              title={`${category.label}: ${getCategoryDisplayRange(category)}`}
              onClick={() => handleCategoryClick(category)}
              role="option"
              aria-selected={currentCategory?.label === category.label}
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCategoryClick(category)}
              aria-label={`Категория ИМТ: ${category.label}, диапазон: ${getCategoryDisplayRange(category)}`}
            >
              <span className="text-sm font-medium hidden sm:inline">{category.label.split(' ')[0]}</span>
            </div>
          ))}
        </div>

        {bmi !== null && (
          <div
            className="absolute top-0 left-0 w-px flex flex-col items-center pointer-events-none"
            style={{
              left: animatedLeftPosition,
              transform: 'translateX(-50%)',
              transition: 'left 700ms ease-out'
            }}
            aria-hidden="true"
          >
            <div
              className={`w-6 h-6 rounded-full border-[3px] border-gray-200 dark:border-slate-800 shadow-[2px_2px_4px_#B0B0B0,_-2px_-2px_4px_#FFFFFF] dark:shadow-[2px_2px_4px_#111726,_-2px_-2px_4px_#2b384e] mt-0.5 z-10 ${pointerColorClass} transition-colors duration-500 ease-in-out`}
            ></div>
            <div
              className={`w-0.5 h-9 ${pointerColorClass} transition-colors duration-500 ease-in-out`}
            ></div>
            {bmi !== null && (
                <span className={`text-sm font-semibold px-2 py-1 rounded shadow-md mt-1 bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-[1px_1px_2px_#BEBEBE,_-1px_-1px_2px_#FFFFFF] dark:shadow-[1px_1px_2px_#141c2a,_-1px_-1px_2px_#2c3a50]`}>
                {bmi.toFixed(1)}
                </span>
            )}
          </div>
        )}
      </div>

      {isModalOpen && selectedCategory && (
        <div
            className="fixed inset-0 bg-slate-500 bg-opacity-50 dark:bg-black dark:bg-opacity-75 flex items-center justify-center p-6 z-50 transition-opacity duration-300 ease-in-out"
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-modal-title"
            aria-describedby="category-modal-description"
        >
          <div className={`p-0 rounded-xl max-w-md w-full transform transition-all duration-300 ease-in-out scale-100 ${neumorphicExtrudeClass}`} onClick={(e) => e.stopPropagation()}>
            <div className={`flex justify-between items-center p-5 rounded-t-xl ${selectedCategory.color}`}>
                <h4 id="category-modal-title" className={`text-lg font-semibold ${selectedCategory.textColor || 'text-white'}`}>{selectedCategory.label}</h4>
                <button 
                    onClick={closeModal} 
                    className={`p-2 rounded-md hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10 transition-colors ${selectedCategory.textColor || 'text-white'}`}
                    aria-label="Закрыть модальное окно"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="p-8">
                <p id="category-modal-description" className="text-base text-slate-700 dark:text-slate-300 mb-3">
                Диапазон ИМТ: <span className="font-semibold">{getCategoryDisplayRange(selectedCategory)}</span>
                </p>
                <p className="text-base text-slate-600 dark:text-slate-400 mb-6">
                Это общее описание для категории "{selectedCategory.label}". Для более точной информации и рекомендаций проконсультируйтесь со специалистом.
                </p>
                <button
                onClick={closeModal}
                className={primaryButtonClass}
                >
                Закрыть
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BMIScale;