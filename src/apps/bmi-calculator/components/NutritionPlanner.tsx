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
      <div className="bg-gradient-to-br from-pink-50/95 to-rose-50/95 backdrop-blur-lg p-8 rounded-2xl shadow-lg border-2 border-rose-200/60 text-center text-gray-700">
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
    { name: 'Белки', grams: proteinCalories / MACRONUTRIENT_CALORIES_PER_GRAM.protein, calories: proteinCalories, percentage: proteinPercentage, color: 'bg-pink-400' },
    { name: 'Углеводы', grams: carbCalories / MACRONUTRIENT_CALORIES_PER_GRAM.carbohydrate, calories: carbCalories, percentage: carbPercentage, color: 'bg-rose-600' },
    { name: 'Жиры', grams: fatCalories / MACRONUTRIENT_CALORIES_PER_GRAM.fat, calories: fatCalories, percentage: fatPercentage, color: 'bg-rose-400' },
  ];
  
  let outcomeMessage = '';
  const calorieDiff = targetCalories - tdee;
  const tdeeThreshold = tdee * 0.05; 

  if (calorieDiff < -tdeeThreshold) outcomeMessage = `Этот рацион (${targetCalories} ккал) приведет к потере веса.`;
  else if (calorieDiff > tdeeThreshold) outcomeMessage = `Этот рацион (${targetCalories} ккал) приведет к набору веса.`;
  else outcomeMessage = `Этот рацион (${targetCalories} ккал) поможет сохранить текущий вес.`;
  
  const pieChartSegments = [
    { percentage: proteinPercentage, color: '#f472b6', label: 'Белки' }, 
    { percentage: carbPercentage, color: '#e11d48', label: 'Углеводы' }, 
    { percentage: fatPercentage, color: '#fb7185', label: 'Жиры' },    
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
    <div className="bg-gradient-to-br from-pink-50/95 to-rose-50/95 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-lg border-2 border-rose-200/60 overflow-hidden">
      <h3 className="text-xl font-semibold text-rose-800 mb-5">Планировщик рациона</h3>

      <div className="mb-8">
        <label className="block text-base font-medium text-gray-700 mb-3">
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
                  ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white' 
                  : 'bg-white border border-rose-200 text-gray-700 hover:bg-pink-50'
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
        ${calorieDiff < -tdeeThreshold ? 'bg-blue-50 text-blue-800' : 
        (calorieDiff > tdeeThreshold ? 'bg-yellow-50 text-yellow-800' : 
        'bg-green-50 text-green-800')}
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
        <h4 className="text-lg font-semibold text-rose-700 mb-4 text-center">
          Ваша тарелка ({targetCalories} ккал):
        </h4>
        
        <div className="flex justify-center items-center mb-6">
          {targetCalories > 0 && (proteinPercentage + carbPercentage + fatPercentage > 0) ? (
             <div className="p-2.5 rounded-full bg-white border border-rose-100">
                <PieChart segments={pieChartSegments} size={170} strokeWidth={28} />
              </div>
          ) : (
            <div className="w-[186px] h-[186px] flex items-center justify-center text-rose-400 border-2 border-dashed border-rose-300 rounded-full bg-white">
                <span className="text-center text-sm">Настройте калории/макросы</span>
            </div>
          )}
        </div>
        
        <div>
          <ul className="space-y-4">
            <li className={`p-4 rounded-lg ${getMacroBgColor('bg-pink-400')}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="w-3.5 h-3.5 rounded-full mr-3 bg-pink-400"></span>
                  <span className="font-medium text-gray-700 text-base">Белки</span>
                </div>
                <span className="font-bold text-gray-800">{proteinPercentage}%</span>
              </div>
              <div className="mb-2">
                <span className="text-sm text-gray-600">{(proteinCalories / MACRONUTRIENT_CALORIES_PER_GRAM.protein).toFixed(0)} г ({proteinCalories.toFixed(0)} ккал)</span>
              </div>
              <input
                type="range"
                id="proteinPercentage"
                name="proteinPercentage"
                value={proteinPercentage}
                onChange={(e) => handleMacroChange('proteinPercentage', e.target.value)}
                min={String(MIN_MACRO_PERCENTAGE)}
                max={String(proteinSliderMax)}
                step="1"
                className="w-full h-2.5 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-400 hover:accent-pink-500"
                style={{
                  '--slider-color': '#f472b6',
                  background: `linear-gradient(to right, #f472b6 0%, #f472b6 ${(proteinPercentage / parseInt(String(proteinSliderMax))) * 100}%, #fbcfe8 ${(proteinPercentage / parseInt(String(proteinSliderMax))) * 100}%, #fbcfe8 100%)`
                } as React.CSSProperties}
              />
            </li>
            
            <li className={`p-4 rounded-lg ${getMacroBgColor('bg-rose-600')}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="w-3.5 h-3.5 rounded-full mr-3 bg-rose-600"></span>
                  <span className="font-medium text-gray-700 text-base">Углеводы</span>
                </div>
                <span className="font-bold text-gray-800">{carbPercentage}%</span>
              </div>
              <div className="mb-2">
                <span className="text-sm text-gray-600">{(carbCalories / MACRONUTRIENT_CALORIES_PER_GRAM.carbohydrate).toFixed(0)} г ({carbCalories.toFixed(0)} ккал)</span>
              </div>
              <input
                type="range"
                id="carbPercentage"
                name="carbPercentage"
                value={carbPercentage}
                onChange={(e) => handleMacroChange('carbPercentage', e.target.value)}
                min={String(MIN_MACRO_PERCENTAGE)}
                max={String(actualCarbAndFatMax)}
                step="1"
                className="w-full h-2.5 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-600 hover:accent-rose-700"
                style={{
                  '--slider-color': '#e11d48',
                  background: `linear-gradient(to right, #e11d48 0%, #e11d48 ${(carbPercentage / actualCarbAndFatMax) * 100}%, #fecdd3 ${(carbPercentage / actualCarbAndFatMax) * 100}%, #fecdd3 100%)`
                } as React.CSSProperties}
              />
            </li>
            
            <li className={`p-4 rounded-lg ${getMacroBgColor('bg-rose-400')}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="w-3.5 h-3.5 rounded-full mr-3 bg-rose-400"></span>
                  <span className="font-medium text-gray-700 text-base">Жиры</span>
                </div>
                <span className="font-bold text-gray-800">{fatPercentage}%</span>
              </div>
              <div className="mb-2">
                <span className="text-sm text-gray-600">{(fatCalories / MACRONUTRIENT_CALORIES_PER_GRAM.fat).toFixed(0)} г ({fatCalories.toFixed(0)} ккал)</span>
              </div>
              <input
                type="range"
                id="fatPercentage"
                name="fatPercentage"
                value={fatPercentage}
                onChange={(e) => handleMacroChange('fatPercentage', e.target.value)}
                min={String(MIN_MACRO_PERCENTAGE)}
                max={String(actualCarbAndFatMax)}
                step="1"
                className="w-full h-2.5 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-400 hover:accent-rose-500"
                style={{
                  '--slider-color': '#fb7185',
                  background: `linear-gradient(to right, #fb7185 0%, #fb7185 ${(fatPercentage / actualCarbAndFatMax) * 100}%, #fecdd3 ${(fatPercentage / actualCarbAndFatMax) * 100}%, #fecdd3 100%)`
                } as React.CSSProperties}
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NutritionPlanner;
