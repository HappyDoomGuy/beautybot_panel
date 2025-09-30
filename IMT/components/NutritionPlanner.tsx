
import React from 'react';
import { DietSettings, MacronutrientInfo, CalorieGoal } from '../types';
import { MACRONUTRIENT_CALORIES_PER_GRAM, MIN_MACRO_PERCENTAGE, CALORIE_GOAL_OPTIONS } from '../constants';
import InputControl from './InputControl';
import PieChart from './PieChart';

interface NutritionPlannerProps {
  tdee: number | null;
  dietSettings: DietSettings;
  onDietSettingsChange: (newSettings: Partial<DietSettings>) => void;
  calorieGoal: CalorieGoal;
  onCalorieGoalChange: (goal: CalorieGoal) => void;
}

const NutritionPlanner: React.FC<NutritionPlannerProps> = ({ 
  tdee, 
  dietSettings, 
  onDietSettingsChange,
  calorieGoal,
  onCalorieGoalChange 
}) => {
  const neumorphicBaseClass = "transition-all duration-300 ease-in-out";
  const neumorphicExtrudeClass = `${neumorphicBaseClass} bg-gray-200 shadow-[6px_6px_12px_#BEBEBE,_-6px_-6px_12px_#FFFFFF] dark:bg-slate-800 dark:shadow-[6px_6px_12px_#141c2a,_-6px_-6px_12px_#2c3a50]`;
  
  const neumorphicButtonBase = `px-4 py-2.5 sm:px-5 text-base font-medium rounded-lg focus:outline-none transition-all duration-200 ease-in-out text-center w-full`; // Added w-full
  const neumorphicButtonExtrude = `bg-gray-200 text-slate-700 dark:text-slate-300 shadow-[3px_3px_5px_#BEBEBE,_-3px_-3px_5px_#FFFFFF] hover:shadow-[4px_4px_6px_#BEBEBE,_-4px_-4px_6px_#FFFFFF] dark:bg-slate-700 dark:shadow-[3px_3px_5px_#141c2a,_-3px_-3px_5px_#2c3a50] dark:hover:shadow-[4px_4px_6px_#141c2a,_-4px_-4px_6px_#2c3a50]`;
  const neumorphicButtonInset = `bg-gray-200 text-slate-800 dark:text-slate-100 shadow-[inset_2px_2px_4px_#BEBEBE,_inset_-2px_-2px_4px_#FFFFFF] dark:bg-slate-800 dark:shadow-[inset_2px_2px_4px_#141c2a,_inset_-2px_-2px_4px_#2c3a50]`;


  if (tdee === null) {
    return (
      <div className={`p-8 sm:p-10 rounded-2xl ${neumorphicExtrudeClass} text-center text-slate-500 dark:text-slate-400 text-base`}>
        Рассчитайте TDEE для планирования рациона.
      </div>
    );
  }

  const { targetCalories, proteinPercentage, carbPercentage, fatPercentage } = dietSettings;

  const handleTargetCaloriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = Math.round(tdee || 0); 
    if (val < 0) val = 0;
    onDietSettingsChange({ targetCalories: val });
    if (calorieGoal !== CalorieGoal.CUSTOM) {
        onCalorieGoalChange(CalorieGoal.CUSTOM);
    }
  };
  
  const handleMacroChange = (macroName: 'proteinPercentage' | 'carbPercentage' | 'fatPercentage', value: string) => {
    onDietSettingsChange({ [macroName]: parseInt(value, 10) });
  };

  const proteinCalories = (targetCalories * proteinPercentage) / 100;
  const carbCalories = (targetCalories * carbPercentage) / 100;
  const fatCalories = (targetCalories * fatPercentage) / 100;

  const macronutrients: MacronutrientInfo[] = [
    { name: 'Белки', grams: proteinCalories / MACRONUTRIENT_CALORIES_PER_GRAM.protein, calories: proteinCalories, percentage: proteinPercentage, color: 'bg-sky-500' },
    { name: 'Углеводы', grams: carbCalories / MACRONUTRIENT_CALORIES_PER_GRAM.carbohydrate, calories: carbCalories, percentage: carbPercentage, color: 'bg-amber-500' },
    { name: 'Жиры', grams: fatCalories / MACRONUTRIENT_CALORIES_PER_GRAM.fat, calories: fatCalories, percentage: fatPercentage, color: 'bg-lime-500' },
  ];
  
  let outcomeMessage = '';
  const calorieDiff = targetCalories - tdee;
  const tdeeThreshold = tdee * 0.05; 

  if (calorieDiff < -tdeeThreshold) outcomeMessage = `Этот рацион (${targetCalories} ккал) приведет к потере веса.`;
  else if (calorieDiff > tdeeThreshold) outcomeMessage = `Этот рацион (${targetCalories} ккал) приведет к набору веса.`;
  else outcomeMessage = `Этот рацион (${targetCalories} ккал) поможет сохранить текущий вес.`;
  
  const pieChartSegments = [
    { percentage: proteinPercentage, color: '#0ea5e9', label: 'Белки' }, 
    { percentage: carbPercentage, color: '#f59e0b', label: 'Углеводы' }, 
    { percentage: fatPercentage, color: '#84cc16', label: 'Жиры' },    
  ];
  
  const getMacroBgColor = (baseColor: string) => {
    const colorName = baseColor.split('-')[1]; 
    return `bg-${colorName}-100 dark:bg-${colorName}-900 dark:bg-opacity-40`;
  };


  const proteinSliderMax = 100 - 2 * MIN_MACRO_PERCENTAGE;
  const carbAndFatMaxBasedOnProtein = dietSettings.proteinPercentage !== undefined 
      ? (100 - dietSettings.proteinPercentage - MIN_MACRO_PERCENTAGE)
      : proteinSliderMax; 
  const actualCarbAndFatMax = Math.max(MIN_MACRO_PERCENTAGE, carbAndFatMaxBasedOnProtein);


  return (
    <div className={`p-8 sm:p-10 rounded-2xl ${neumorphicExtrudeClass}`}>
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">Планировщик рациона</h3>

      <div className="mb-8">
        <label className="block text-base font-medium text-slate-700 dark:text-slate-300 mb-3">
          Выберите вашу цель по калориям:
        </label>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3"> {/* Changed from flex-wrap to flex-col sm:flex-row */}
          {CALORIE_GOAL_OPTIONS.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => onCalorieGoalChange(option.value)}
              className={`${neumorphicButtonBase} ${calorieGoal === option.value ? neumorphicButtonInset : neumorphicButtonExtrude} sm:flex-1`} // Removed flex-1 for mobile, added sm:flex-1
              aria-pressed={calorieGoal === option.value}
              title={option.description}
            >
              {option.shortLabel}
            </button>
          ))}
        </div>
      </div>
      
      <p className={`mt-6 mb-6 font-medium p-4 rounded-lg text-base
        ${calorieDiff < -tdeeThreshold ? 'bg-blue-100 dark:bg-blue-900 dark:bg-opacity-50 text-blue-700 dark:text-blue-300' : 
        (calorieDiff > tdeeThreshold ? 'bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-50 text-yellow-700 dark:text-yellow-300' : 
        'bg-green-100 dark:bg-green-900 dark:bg-opacity-50 text-green-700 dark:text-green-300')}
        shadow-[2px_2px_4px_#BEBEBE,_-2px_-2px_4px_#FFFFFF] dark:shadow-[2px_2px_4px_#172031,_-2px_-2px_4px_#2a364b]
      `}>
        {outcomeMessage}
      </p>

      <InputControl
        label={`Целевое количество калорий в день ${calorieGoal === CalorieGoal.CUSTOM ? "(ручной ввод)" : ""}`}
        id="targetCalories"
        type="number"
        value={String(targetCalories)}
        onChange={handleTargetCaloriesChange}
        unit="ккал"
        min="0"
      />

      <div className="mt-8"> {/* Container for Heading, Chart, and List */}
        <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4 text-center">
          Ваша тарелка ({targetCalories} ккал):
        </h4>
        
        <div className="flex justify-center items-center mb-6"> {/* Chart container */}
          {targetCalories > 0 && (proteinPercentage + carbPercentage + fatPercentage > 0) ? (
             <div className="p-2.5 rounded-full shadow-[inset_4px_4px_8px_#BEBEBE,_inset_-4px_-4px_8px_#FFFFFF] dark:shadow-[inset_4px_4px_8px_#141c2a,_inset_-4px_-4px_8px_#2c3a50]">
                <PieChart segments={pieChartSegments} size={170} strokeWidth={28} />
              </div>
          ) : (
            <div className="w-[186px] h-[186px] flex items-center justify-center text-slate-400 dark:text-slate-500 border-2 border-dashed border-[#DEE2E6] dark:border-slate-700 rounded-full shadow-[inset_4px_4px_8px_#BEBEBE,_inset_-4px_-4px_8px_#FFFFFF] dark:shadow-[inset_4px_4px_8px_#141c2a,_inset_-4px_-4px_8px_#2c3a50]">
                <span className="text-center text-sm">Настройте калории/макросы</span>
            </div>
          )}
        </div>
        
        <div> {/* List container */}
          <ul className="space-y-3">
            {macronutrients.map(macro => (
              <li key={macro.name} className={`p-3 rounded-lg ${getMacroBgColor(macro.color)} shadow-[2px_2px_4px_#BEBEBE,_-2px_-2px_4px_#FFFFFF] dark:shadow-[2px_2px_4px_#172031,_-2px_-2px_4px_#2a364b]`}>
                <div className="flex items-center">
                  <span className={`w-3.5 h-3.5 rounded-full mr-3 ${macro.color}`}></span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 text-base">{macro.name} ({macro.percentage.toFixed(0)}%)</span>
                </div>
                <div className="pl-[calc(0.875rem+0.75rem)] mt-1"> {/* 0.875rem (w-3.5) + 0.75rem (mr-3) = 1.625rem */}
                  <span className="text-sm text-slate-600 dark:text-slate-400">{macro.grams.toFixed(0)} г ({macro.calories.toFixed(0)} ккал)</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="my-8 space-y-4 pt-4">
        <InputControl
          label="Белки"
          id="proteinPercentage"
          type="range"
          value={String(proteinPercentage)}
          onChange={(e) => handleMacroChange('proteinPercentage', e.target.value)}
          unit="%"
          min={String(MIN_MACRO_PERCENTAGE)}
          max={String(proteinSliderMax)} 
          step="1"
        />
        <InputControl
          label="Углеводы"
          id="carbPercentage"
          type="range"
          value={String(carbPercentage)}
          onChange={(e) => handleMacroChange('carbPercentage', e.target.value)}
          unit="%"
          min={String(MIN_MACRO_PERCENTAGE)}
          max={String(actualCarbAndFatMax)}
          step="1"
        />
        <InputControl
          label="Жиры"
          id="fatPercentage"
          type="range"
          value={String(fatPercentage)}
          onChange={(e) => handleMacroChange('fatPercentage', e.target.value)}
          unit="%"
          min={String(MIN_MACRO_PERCENTAGE)}
          max={String(actualCarbAndFatMax)}
          step="1"
        />
      </div>
    </div>
  );
};

export default NutritionPlanner;
