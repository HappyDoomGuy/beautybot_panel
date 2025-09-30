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
  if (tdee === null) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
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
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Планировщик рациона</h3>

      <div className="mb-8">
        <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-3">
          Выберите вашу цель по калориям:
        </label>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {CALORIE_GOAL_OPTIONS.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => onCalorieGoalChange(option.value)}
              className={`px-4 py-2.5 sm:px-5 text-base font-medium rounded-lg focus:outline-none transition-all duration-200 ease-in-out text-center w-full sm:flex-1 ${
                calorieGoal === option.value 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
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

      <div className="mt-8">
        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">
          Ваша тарелка ({targetCalories} ккал):
        </h4>
        
        <div className="flex justify-center items-center mb-6">
          {targetCalories > 0 && (proteinPercentage + carbPercentage + fatPercentage > 0) ? (
             <div className="p-2.5 rounded-full bg-gray-50 dark:bg-gray-700">
                <PieChart segments={pieChartSegments} size={170} strokeWidth={28} />
              </div>
          ) : (
            <div className="w-[186px] h-[186px] flex items-center justify-center text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700">
                <span className="text-center text-sm">Настройте калории/макросы</span>
            </div>
          )}
        </div>
        
        <div>
          <ul className="space-y-3">
            {macronutrients.map(macro => (
              <li key={macro.name} className={`p-3 rounded-lg ${getMacroBgColor(macro.color)}`}>
                <div className="flex items-center">
                  <span className={`w-3.5 h-3.5 rounded-full mr-3 ${macro.color}`}></span>
                  <span className="font-medium text-gray-700 dark:text-gray-300 text-base">{macro.name} ({macro.percentage.toFixed(0)}%)</span>
                </div>
                <div className="pl-[calc(0.875rem+0.75rem)] mt-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{macro.grams.toFixed(0)} г ({macro.calories.toFixed(0)} ккал)</span>
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
