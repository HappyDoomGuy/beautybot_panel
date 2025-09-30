import React, { useState, useEffect, useCallback } from 'react';
import { UserData, Gender, ActivityLevel, CalculationResults, BMICategory, DietSettings, CalorieGoal } from './bmi-calculator/types';
import { 
  ACTIVITY_MULTIPLIERS, 
  BMI_CATEGORIES, 
  GENDER_OPTIONS, 
  ACTIVITY_LEVEL_OPTIONS,
  INITIAL_PROTEIN_PERCENTAGE,
  INITIAL_CARB_PERCENTAGE,
  INITIAL_FAT_PERCENTAGE,
  MIN_MACRO_PERCENTAGE,
  WEIGHT_LOSS_PERCENTAGE,
  WEIGHT_GAIN_PERCENTAGE,
  CALORIE_GOAL_OPTIONS
} from './bmi-calculator/constants';
import InputControl from './bmi-calculator/components/InputControl';
import SelectControl from './bmi-calculator/components/SelectControl';
import ResultsCard from './bmi-calculator/components/ResultsCard';
import NutritionPlanner from './bmi-calculator/components/NutritionPlanner';
import { AppNavigation } from '../components/AppNavigation';

interface BMICalculatorAppProps {
  onBack: () => void;
}

const USER_DATA_KEY = 'bmiCalculatorUserData';
const DIET_SETTINGS_KEY = 'bmiCalculatorDietSettings';
const CALORIE_GOAL_KEY = 'bmiCalculatorCalorieGoal';
const THEME_KEY = 'bmiCalculatorTheme';
const LAST_AI_REQUEST_SNAPSHOT_KEY = 'bmiCalculatorLastAiRequestSnapshot';
const AI_RECOMMENDATION_KEY = 'bmiCalculatorAiRecommendation';

// Configuration for OpenAI via proxy
const OPENAI_PROXY_BASE_URL = 'https://happydoomguy.pythonanywhere.com'; 
const OPENAI_MODEL_NAME = 'gpt-4.1-nano';

const translateGender = (gender: Gender): string => {
  return GENDER_OPTIONS.find(opt => opt.value === gender)?.label || gender;
};

const translateActivityLevel = (level: ActivityLevel): string => {
  return ACTIVITY_LEVEL_OPTIONS.find(opt => opt.value === level)?.label || level;
};

const translateCalorieGoal = (goal: CalorieGoal): string => {
  const option = CALORIE_GOAL_OPTIONS.find(g => g.value === goal);
  if (goal === CalorieGoal.CUSTOM) return "индивидуальная настройка калорий";
  return option ? option.label.toLowerCase() : "не указана";
};

const BMICalculatorApp: React.FC<BMICalculatorAppProps> = ({ onBack }) => {
  const [userData, setUserData] = useState<UserData>(() => {
    const savedData = localStorage.getItem(USER_DATA_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (
          parsedData &&
          typeof parsedData.weight === 'string' &&
          typeof parsedData.height === 'string' &&
          typeof parsedData.age === 'string' &&
          Object.values(Gender).includes(parsedData.gender as Gender) &&
          Object.values(ActivityLevel).includes(parsedData.activityLevel as ActivityLevel)
        ) {
          return parsedData;
        }
      } catch (e) {
        console.error("Failed to parse userData from localStorage", e);
      }
    }
    return {
      weight: '70',
      height: '175',
      age: '30',
      gender: Gender.MALE,
      activityLevel: ActivityLevel.MODERATE,
    };
  });

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof UserData, string>>>({});
  
  const [calorieGoal, setCalorieGoal] = useState<CalorieGoal>(() => {
    const savedGoal = localStorage.getItem(CALORIE_GOAL_KEY);
    if (savedGoal && Object.values(CalorieGoal).includes(savedGoal as CalorieGoal)) {
      return savedGoal as CalorieGoal;
    }
    return CalorieGoal.MAINTENANCE;
  });

  const [dietSettings, setDietSettings] = useState<DietSettings>(() => {
    const savedSettings = localStorage.getItem(DIET_SETTINGS_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (
          parsed &&
          typeof parsed.targetCalories === 'number' &&
          typeof parsed.proteinPercentage === 'number' &&
          typeof parsed.carbPercentage === 'number' &&
          typeof parsed.fatPercentage === 'number'
        ) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse dietSettings from localStorage", e);
      }
    }
    return {
      targetCalories: 0, 
      proteinPercentage: INITIAL_PROTEIN_PERCENTAGE,
      carbPercentage: INITIAL_CARB_PERCENTAGE,
      fatPercentage: INITIAL_FAT_PERCENTAGE,
    };
  });

  // AI Recommendation State
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(() => localStorage.getItem(AI_RECOMMENDATION_KEY));
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [lastAiRequestSnapshot, setLastAiRequestSnapshot] = useState<string | null>(() => localStorage.getItem(LAST_AI_REQUEST_SNAPSHOT_KEY));
  const [isAiRecommendationExpanded, setIsAiRecommendationExpanded] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    localStorage.setItem(DIET_SETTINGS_KEY, JSON.stringify(dietSettings));
  }, [dietSettings]);

  useEffect(() => {
    localStorage.setItem(CALORIE_GOAL_KEY, calorieGoal);
  }, [calorieGoal]);
  
  useEffect(() => {
    if (aiRecommendation) {
        localStorage.setItem(AI_RECOMMENDATION_KEY, aiRecommendation);
    } else {
        localStorage.removeItem(AI_RECOMMENDATION_KEY);
    }
  }, [aiRecommendation]);

  useEffect(() => {
    if (lastAiRequestSnapshot) {
        localStorage.setItem(LAST_AI_REQUEST_SNAPSHOT_KEY, lastAiRequestSnapshot);
    } else {
        localStorage.removeItem(LAST_AI_REQUEST_SNAPSHOT_KEY);
    }
  }, [lastAiRequestSnapshot]);

  const validateInputs = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof UserData, string>> = {};
    const weightNum = parseFloat(userData.weight);
    const heightNum = parseFloat(userData.height);
    const ageNum = parseInt(userData.age, 10);

    if (isNaN(weightNum) || weightNum < 20 || weightNum > 200) newErrors.weight = 'Вес: 20-200 кг.';
    if (isNaN(heightNum) || heightNum < 100 || heightNum > 220) newErrors.height = 'Рост: 100-220 см.';
    if (isNaN(ageNum) || ageNum < 10 || ageNum > 100) newErrors.age = 'Возраст: 10-100 лет.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [userData]);

  const calculateMetrics = useCallback(() => {
    if (!validateInputs()) {
      setResults(null);
      return;
    }

    const weightKg = parseFloat(userData.weight);
    const heightCm = parseFloat(userData.height);
    const ageYears = parseInt(userData.age, 10);
    const { gender, activityLevel } = userData;

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    let currentBMICategory: BMICategory | null = null;
    for (const category of BMI_CATEGORIES) {
      if (bmi >= category.min && bmi < category.max) {
        currentBMICategory = category;
        break;
      }
    }
    if (!currentBMICategory && bmi >= BMI_CATEGORIES[BMI_CATEGORIES.length - 1].min) {
        currentBMICategory = BMI_CATEGORIES[BMI_CATEGORIES.length - 1];
    }

    let bmr: number;
    if (gender === Gender.MALE) {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
    }

    const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel];

    if (currentBMICategory) {
      setResults({ bmi, bmiCategory: currentBMICategory, bmr, tdee });
    } else {
      setResults(null);
    }
  }, [userData, validateInputs]);

  useEffect(() => {
    calculateMetrics();
  }, [calculateMetrics]);

  useEffect(() => {
    if (results?.tdee) {
        if (calorieGoal !== CalorieGoal.CUSTOM) {
            let newTargetCalories = results.tdee;
            if (calorieGoal === CalorieGoal.LOSS) {
                newTargetCalories = results.tdee * (1 - WEIGHT_LOSS_PERCENTAGE);
            } else if (calorieGoal === CalorieGoal.GAIN) {
                newTargetCalories = results.tdee * (1 + WEIGHT_GAIN_PERCENTAGE);
            }
            if (Math.round(newTargetCalories) !== dietSettings.targetCalories) {
                 setDietSettings(prev => ({
                    ...prev,
                    targetCalories: Math.round(newTargetCalories)
                }));
            }
        } else if (dietSettings.targetCalories === 0) { 
            setDietSettings(prev => ({
                ...prev,
                targetCalories: Math.round(results.tdee)
            }));
        }
    }
  }, [results?.tdee, calorieGoal, dietSettings.targetCalories]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCalorieGoalChange = (newGoal: CalorieGoal) => {
    setCalorieGoal(newGoal);
  };
  
  const handleDietSettingsChange = (
    updatedMacroPart: Partial<DietSettings>
  ) => {
    setDietSettings(prevSettings => {
      const newSettings = { ...prevSettings };
  
      if ('targetCalories' in updatedMacroPart && updatedMacroPart.targetCalories !== undefined) {
        const newTarget = Math.max(0, updatedMacroPart.targetCalories);
        if (newTarget !== newSettings.targetCalories) {
            newSettings.targetCalories = newTarget;
        }
        if (Object.keys(updatedMacroPart).length === 1 && 'targetCalories' in updatedMacroPart) {
            return newSettings;
        }
      }
  
      let p = newSettings.proteinPercentage;
      let c = newSettings.carbPercentage;
      let f = newSettings.fatPercentage;
  
      const changedKey = Object.keys(updatedMacroPart).find(k => k.endsWith('Percentage')) as keyof Pick<DietSettings, 'proteinPercentage' | 'carbPercentage' | 'fatPercentage'> | undefined;
  
      if (!changedKey) return newSettings; 
  
      const value = parseInt(String(updatedMacroPart[changedKey]), 10);
  
      if (changedKey === 'proteinPercentage') {
        p = Math.max(MIN_MACRO_PERCENTAGE, Math.min(value, 100 - 2 * MIN_MACRO_PERCENTAGE));
        const remainingForCF = 100 - p;
        const prevCandFSum = prevSettings.carbPercentage + prevSettings.fatPercentage;
        
        let c_share_of_remainder = 0.5; 
        if (prevCandFSum > 0 && prevCandFSum !==0 ) {
          c_share_of_remainder = prevSettings.carbPercentage / prevCandFSum;
        }
        
        let c_target = remainingForCF * c_share_of_remainder;

        if (c_target < MIN_MACRO_PERCENTAGE) {
          c = MIN_MACRO_PERCENTAGE;
          f = remainingForCF - c;
        } else if ((remainingForCF - c_target) < MIN_MACRO_PERCENTAGE) { 
          f = MIN_MACRO_PERCENTAGE;
          c = remainingForCF - f;
        } else {
          c = Math.round(c_target); 
          f = remainingForCF - c;   
        }

      } else if (changedKey === 'carbPercentage') {
        c = Math.max(MIN_MACRO_PERCENTAGE, Math.min(value, 100 - p - MIN_MACRO_PERCENTAGE));
        f = 100 - p - c;
        if (f < MIN_MACRO_PERCENTAGE) {
          f = MIN_MACRO_PERCENTAGE;
          c = 100 - p - f; 
        }
      } else { // fatPercentage
        f = Math.max(MIN_MACRO_PERCENTAGE, Math.min(value, 100 - p - MIN_MACRO_PERCENTAGE));
        c = 100 - p - f;
        if (c < MIN_MACRO_PERCENTAGE) {
          c = MIN_MACRO_PERCENTAGE;
          f = 100 - p - c;
        }
      }
  
      newSettings.proteinPercentage = Math.round(p);
      newSettings.carbPercentage = Math.round(c);
      newSettings.fatPercentage = 100 - newSettings.proteinPercentage - newSettings.carbPercentage; // Ensure sum is 100

      if (newSettings.fatPercentage < MIN_MACRO_PERCENTAGE) {
        newSettings.fatPercentage = MIN_MACRO_PERCENTAGE;
        newSettings.carbPercentage = 100 - newSettings.proteinPercentage - newSettings.fatPercentage;
        if (newSettings.carbPercentage < MIN_MACRO_PERCENTAGE) { // If carb also too low, protein takes the hit
            newSettings.carbPercentage = MIN_MACRO_PERCENTAGE;
            newSettings.proteinPercentage = 100 - newSettings.carbPercentage - newSettings.fatPercentage; // This could make protein < MIN if others are high
        }
      }
      if (newSettings.proteinPercentage < MIN_MACRO_PERCENTAGE) { // Check protein last, as it was adjusted first
          newSettings.proteinPercentage = MIN_MACRO_PERCENTAGE;
          const remainingForCF = 100 - newSettings.proteinPercentage;
          // Re-evaluate C and F based on remaining, preserving ratio if possible
          if (newSettings.carbPercentage + newSettings.fatPercentage !== remainingForCF) {
            let c_ratio = newSettings.carbPercentage / (newSettings.carbPercentage + newSettings.fatPercentage);
            if (isNaN(c_ratio) || !isFinite(c_ratio)) c_ratio = 0.5; // Default if sum was 0
            newSettings.carbPercentage = Math.round(remainingForCF * c_ratio);
            newSettings.fatPercentage = remainingForCF - newSettings.carbPercentage;
          }
      }
      
      // Ensure sum is exactly 100 by adjusting the largest component if needed, due to rounding
      const currentSum = newSettings.proteinPercentage + newSettings.carbPercentage + newSettings.fatPercentage;
      if (currentSum !== 100) {
        const diff = 100 - currentSum;
        if (newSettings.carbPercentage >= newSettings.proteinPercentage && newSettings.carbPercentage >= newSettings.fatPercentage) {
            newSettings.carbPercentage += diff;
        } else if (newSettings.proteinPercentage >= newSettings.carbPercentage && newSettings.proteinPercentage >= newSettings.fatPercentage) {
            newSettings.proteinPercentage += diff;
        } else {
            newSettings.fatPercentage += diff;
        }
      }

      if (newSettings.proteinPercentage === prevSettings.proteinPercentage &&
          newSettings.carbPercentage === prevSettings.carbPercentage &&
          newSettings.fatPercentage === prevSettings.fatPercentage &&
          newSettings.targetCalories === prevSettings.targetCalories) {
        return prevSettings; 
      }
      return newSettings;
    });
  };

  const getCurrentDataSnapshot = useCallback((): string => {
    return JSON.stringify({ userData, calorieGoal, dietSettings, tdee: results?.tdee });
  }, [userData, calorieGoal, dietSettings, results?.tdee]);
  
  const handleGetAiRecommendation = async () => {
    if (!results) {
      setAiError("Не хватает данных для рекомендации. Пожалуйста, убедитесь, что все расчеты выполнены.");
      return;
    }
    if (OPENAI_PROXY_BASE_URL.includes('YOUR_PYTHONANYWHERE_USERNAME')) {
      setAiError("URL прокси-сервера не настроен. Замените 'YOUR_PYTHONANYWHERE_USERNAME' в коде App.tsx.");
      setIsAiLoading(false);
      return;
    }

    setIsAiLoading(true);
    setAiError(null);

    const currentGoalLabel = translateCalorieGoal(calorieGoal);
    const proteinGrams = (dietSettings.targetCalories * dietSettings.proteinPercentage / 100 / 4).toFixed(0);
    const carbGrams = (dietSettings.targetCalories * dietSettings.carbPercentage / 100 / 4).toFixed(0);
    const fatGrams = (dietSettings.targetCalories * dietSettings.fatPercentage / 100 / 9).toFixed(0);

    const systemPrompt = `Вы эксперт-диетолог и фитнес-тренер. Ваша задача - предоставить персонализированные рекомендации по здоровью и питанию на основе данных пользователя. Ответ должен быть на русском языке, четким, практичным, ободряющим, и может использовать маркированные списки для улучшения читаемости. Используй Markdown для выделения: **жирный текст**, *курсив*, ### для заголовков, и --- для разделителей.`;
    
    let importantInstruction = "";
    const bmiCategoryLabel = results.bmiCategory.label;

    if (bmiCategoryLabel === BMI_CATEGORIES[0].label || bmiCategoryLabel === BMI_CATEGORIES[1].label) { // Значительный дефицит массы / Недостаточная масса
        importantInstruction = `Пользователь находится в состоянии дефицита массы тела (${bmiCategoryLabel}). Ваша ГЛАВНАЯ ЗАДАЧА - предоставить рекомендации, направленные на БЕЗОПАСНОЕ и ЗДОРОВОЕ УВЕЛИЧЕНИЕ ВЕСА до нормальных значений (ИМТ 18.5 и выше). Если заявленная цель пользователя ("${currentGoalLabel}") противоречит этому (например, дальнейшее снижение веса или поддержание текущего низкого веса), ТАКТИЧНО ОБЪЯСНИТЕ РИСКИ для здоровья, связанные с недостаточной массой тела, и ПЕРЕОРИЕНТИРУЙТЕ пользователя на набор здоровой массы. Подчеркните важность консультации с врачом. Дайте конкретные советы по увеличению калорийности рациона здоровыми, питательными продуктами и возможной коррекции физической активности для набора мышечной массы, избегая чрезмерных нагрузок.`;
    } else if (bmiCategoryLabel === BMI_CATEGORIES[5].label || bmiCategoryLabel === BMI_CATEGORIES[6].label) { // Ожирение II степени / Ожирение III степени
        importantInstruction = `Пользователь находится в состоянии значительного избыточного веса (${bmiCategoryLabel}). Ваша ГЛАВНАЯ ЗАДАЧА - предоставить рекомендации, направленные на БЕЗОПАСНОЕ и ЗДОРОВОЕ СНИЖЕНИЕ ВЕСА до менее критичных значений. Если заявленная цель пользователя ("${currentGoalLabel}") противоречит этому (например, набор веса или поддержание текущего высокого веса), ТАКТИЧНО ОБЪЯСНИТЕ РИСКИ для здоровья, связанные с ожирением, и ПЕРЕОРИЕНТИРУЙТЕ пользователя на снижение веса. Подчеркните важность консультации с врачом. Если цель совпадает (снижение веса), поддержите ее и дайте конкретные советы по созданию умеренного дефицита калорий, выбору здоровых продуктов, контролю порций и увеличению физической активности, начиная с доступных упражнений.`;
    } else {
        importantInstruction = `Учитывайте заявленную цель пользователя ("${currentGoalLabel}") и его текущие показатели (${bmiCategoryLabel}) для предоставления сбалансированных рекомендаций. Если ИМТ находится в категории "Избыточная масса" или "Ожирение I степени" и цель - снижение веса, поддержите это. Если ИМТ в норме, а цель - набор или снижение, дайте соответствующие советы, обращая внимание на здоровые методы.`;
    }

    const userPrompt = `Вот данные пользователя и его цели:

Цель пользователя: ${currentGoalLabel}.

Данные пользователя:
* Вес: ${userData.weight} кг
* Рост: ${userData.height} см
* Возраст: ${userData.age} лет
* Пол: ${translateGender(userData.gender)}
* Уровень активности: ${translateActivityLevel(userData.activityLevel)}

Расчетные показатели:
* ИМТ: ${results.bmi.toFixed(1)} (${results.bmiCategory.label})
* BMR (Базальный уровень метаболизма): ${results.bmr.toFixed(0)} ккал/день
* TDEE (Общая суточная потребность в энергии): ${results.tdee.toFixed(0)} ккал/день

Текущий план питания:
* Целевые калории: ${dietSettings.targetCalories} ккал/день
* Белки: ${dietSettings.proteinPercentage}% (${proteinGrams} г)
* Углеводы: ${dietSettings.carbPercentage}% (${carbGrams} г)
* Жиры: ${dietSettings.fatPercentage}% (${fatGrams} г)

ВАЖНОЕ УКАЗАНИЕ:
${importantInstruction}

Пожалуйста, предоставьте:
1. Краткую оценку текущей ситуации на основе ИМТ и соотношения TDEE к целевым калориям, ОБЯЗАТЕЛЬНО учитывая ВАЖНОЕ УКАЗАНИЕ выше.
2. Конкретные, действенные рекомендации по питанию (например, типы продуктов, которые следует включить/исключить, предложения по времени приема пищи, если это уместно), соответствующие ВАЖНОМУ УКАЗАНИЮ.
3. Предложения по физической активности или изменениям образа жизни, если это соответствует их цели и уровню активности, а также ВАЖНОМУ УКАЗАНИЮ.
4. Составьте примерное меню на один день (завтрак, обед, ужин, возможные перекусы) из ОБЫЧНЫХ продуктов, ДОСТУПНЫХ В БЕЛАРУСИ, которое соответствует рассчитанным целевым калориям и процентному соотношению макронутриентов (Белки: ${dietSettings.proteinPercentage}%, Углеводы: ${dietSettings.carbPercentage}%, Жиры: ${dietSettings.fatPercentage}%). Меню должно быть практичным и включать конкретные примеры блюд.
5. Любые другие релевантные советы (например, важность сна, гидратации, управления стрессом), которые помогут им достичь цели (${currentGoalLabel}) с учетом их текущего состояния здоровья, как описано во ВАЖНОМ УКАЗАНИИ.
Обязательно напомните, что ваши советы не заменяют консультацию с врачом или дипломированным диетологом, особенно при наличии хронических заболеваний или специфических состояний здоровья.
Отформатируйте ответ, используя ### для подзаголовков разделов (например, "### 1. Оценка ситуации") и --- для визуального разделения основных блоков информации.`;

    const requestBody = {
      model: OPENAI_MODEL_NAME,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7, 
    };

    try {
      const response = await fetch(`${OPENAI_PROXY_BASE_URL}/gpt/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Ошибка API: ${response.status} ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
        setAiRecommendation(data.choices[0].message.content);
        setLastAiRequestSnapshot(getCurrentDataSnapshot());
        setIsAiRecommendationExpanded(true); // Expand when new recommendation is fetched
      } else {
        throw new Error("Ответ от ИИ не содержит ожидаемых данных.");
      }

    } catch (error) {
      console.error("AI Recommendation Error:", error);
      let errorMessage = "Не удалось получить рекомендации от ИИ. Пожалуйста, попробуйте позже.";
      if (error instanceof Error) {
        errorMessage += ` Детали: ${error.message}`;
      }
      setAiError(errorMessage);
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const aiButtonStyle = `w-full font-semibold py-3.5 px-6 rounded-xl text-base focus:outline-none focus:ring-2 ring-offset-2 ring-offset-white transition-all duration-200 ease-in-out \
bg-gradient-to-r from-pink-400 to-rose-400 text-white \
shadow-lg hover:shadow-xl \
hover:from-pink-300 hover:to-rose-300 \
active:shadow-lg \
active:from-pink-500 active:to-rose-500 \
focus:ring-rose-400 \
disabled:opacity-70 disabled:cursor-not-allowed \
disabled:bg-gray-300 \
disabled:text-gray-500 \
disabled:shadow-lg \
disabled:hover:from-pink-400 disabled:hover:to-rose-400`;

  const canRequestNewAiRecommendation = !!results && (!lastAiRequestSnapshot || lastAiRequestSnapshot !== getCurrentDataSnapshot());

  let aiButtonText = "Получить Рекомендации ИИ";
  if (isAiLoading) {
    aiButtonText = "Загрузка...";
  } else if (aiRecommendation) {
    if (canRequestNewAiRecommendation) {
      aiButtonText = "Обновить рекомендации";
    } else {
      aiButtonText = "Данные не изменились";
    }
  }

  const formatAIRecommendationHTML = (rawText: string): string => {
    if (!rawText) return "";
    // Ensure ### headers are block-level and have distinct styling
    let html = rawText
      .replace(/^\s*### (.*?)\s*$/gm, '<h3 class="text-lg font-semibold mt-5 mb-2.5 text-rose-700">$1</h3>') 
      .replace(/^\s*---\s*$/gm, '<hr class="my-5 border-rose-200" />')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>') 
      .replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Handle lists:
    // Convert lines starting with * or - (followed by a space) to list items
    html = html.replace(/^\s*([*-])\s+(.*)/gm, (match, bullet, item) => {
        return `<li>${item.trim()}</li>`;
    });
    // Wrap consecutive <li> items in <ul>
    html = html.replace(/(<li>.*?<\/li>\s*)+/g, (match) => {
        return `<ul class="list-disc list-inside space-y-1.5 pl-2 mb-3 text-gray-800">${match}</ul>`;
    });
    
    // Convert numbered lists
     html = html.replace(/^\s*(\d+\.)\s+(.*)/gm, (match, number, item) => {
        return `<li>${item.trim()}</li>`; // Use <li> for ol too, wrapping will handle <ol>
    });
    // Wrap consecutive <li> that were from numbered lists (heuristic, might need refinement if mixed lists are complex)
    html = html.replace(/(<li>.*?<\/li>\s*)+/g, (match) => {
        // This regex is broad, check if first item seems numbered to decide ul/ol.
        const firstItem = match.match(/<li>(.*?)<\/li>/);
        if (firstItem && /^\d+\./.test(firstItem[1])) { // A bit fragile
            // Assume it's an ordered list if a leading number pattern was in the original text (now stripped)
            return `<ol class="list-decimal list-inside space-y-1.5 pl-2 mb-3 text-gray-800">${match}</ol>`;
        }
        return `<ul class="list-disc list-inside space-y-1.5 pl-2 mb-3 text-gray-800">${match}</ul>`; // Fallback to ul
    });

    // General paragraphs for remaining lines not matching other patterns
    // Split by newlines, wrap non-empty, non-tag lines in <p>
    html = html.split('\n').map(line => {
        const trimmedLine = line.trim();
        if (trimmedLine === '' || trimmedLine.startsWith('<') || trimmedLine.endsWith('>')) {
            return line; // Keep existing HTML tags or empty lines
        }
        return `<p class="mb-2.5 text-gray-800 font-medium">${line}</p>`;
    }).join('\n');
    
    // Clean up potentially double-wrapped paragraphs or empty ones from formatting
    html = html.replace(/<p>\s*<(ul|ol|li|h3|hr)/g, '<$1'); // Remove <p> before block elements
    html = html.replace(/<\/(ul|ol|li|h3|hr)>\s*<\/p>/g, '</$1>'); // Remove </p> after block elements
    html = html.replace(/<p>\s*<\/p>/g, ''); // Remove empty paragraphs

    return html;
  };
  
  const toggleAiRecommendationExpansion = () => {
    setIsAiRecommendationExpanded(prev => !prev);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <AppNavigation 
        title="Калькулятор ИМТ с ИИ" 
        onBack={onBack}
        icon="⚖️"
        gradient="from-pink-500 to-rose-500"
      />
      
      <main className="container mx-auto p-4 md:p-6 max-w-full">
        <header className="text-center mb-6 md:mb-8 relative">
          <div className="inline-block bg-white/90 backdrop-blur-lg rounded-3xl px-6 py-4 shadow-xl border-2 border-rose-200/50 max-w-[90vw]">
            <h1 className="text-3xl sm:text-4xl font-bold text-rose-800 break-words">Калории, белки, жиры, углеводы</h1>
            <p className="text-gray-700 mt-3 text-base break-words">Введите свои данные, чтобы рассчитать показатели, спланировать рацион и получить персональные рекомендации.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-1 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-pink-50/95 to-rose-50/95 backdrop-blur-lg shadow-xl border-2 border-rose-200/60">
            <h2 className="text-2xl font-semibold text-rose-800 mb-8">Ваши данные</h2>
            <InputControl
              label="Вес"
              id="weight"
              type="range"
              value={userData.weight}
              onChange={handleInputChange}
              unit="кг"
              min="20"
              max="200"
              step="1"
              error={errors.weight}
            />
            <InputControl
              label="Рост"
              id="height"
              type="range"
              value={userData.height}
              onChange={handleInputChange}
              unit="см"
              min="100"
              max="220"
              step="1"
              error={errors.height}
            />
            <InputControl
              label="Возраст"
              id="age"
              type="range"
              value={userData.age}
              onChange={handleInputChange}
              unit="лет"
              min="10"
              max="100"
              step="1"
              error={errors.age}
            />
            <SelectControl
              label="Пол"
              id="gender"
              value={userData.gender}
              onChange={handleInputChange}
              options={GENDER_OPTIONS}
            />
            <SelectControl
              label="Уровень активности"
              id="activityLevel"
              value={userData.activityLevel}
              onChange={handleInputChange}
              options={ACTIVITY_LEVEL_OPTIONS}
            />
          </div>

          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {results ? (
              <>
                <ResultsCard results={results} />
                <NutritionPlanner
                  tdee={results.tdee}
                  dietSettings={dietSettings}
                  onDietSettingsChange={handleDietSettingsChange}
                  calorieGoal={calorieGoal}
                  onCalorieGoalChange={handleCalorieGoalChange}
                />
              </>
            ) : (
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-pink-50/95 to-rose-50/95 backdrop-blur-lg shadow-xl border-2 border-rose-200/60 text-center min-h-[300px] flex flex-col justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-rose-400 mb-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <p className="text-base text-gray-700">Введите ваши данные с помощью формы слева, чтобы увидеть результаты.</p>
                {Object.keys(errors).length > 0 && (
                   <p className="text-red-500 dark:text-red-400 mt-3 text-sm">Пожалуйста, исправьте ошибки в форме: {Object.values(errors).join(' ')}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendation Section */}
        <div className="mt-6 md:mt-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-pink-50/95 to-rose-50/95 backdrop-blur-lg shadow-xl border-2 border-rose-200/60">
          <h2 className="text-2xl font-semibold text-rose-800 mb-6">
            Рекомендации от ИИ
          </h2>
          
          {OPENAI_PROXY_BASE_URL.includes('YOUR_PYTHONANYWHERE_USERNAME') && (
             <p className="text-sm text-orange-600 dark:text-orange-400 mb-6 p-4 bg-orange-100 dark:bg-orange-900 dark:bg-opacity-50 rounded-lg shadow-sm">
              Внимание: URL прокси-сервера ИИ не настроен. Замените 'YOUR_PYTHONANYWHERE_USERNAME' в файле App.tsx для активации рекомендаций.
            </p>
          )}

          <>
            {isAiLoading && (
              <div className="flex flex-col items-center justify-center my-6 py-8">
                <svg className="animate-spin h-12 w-12 text-rose-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-700 text-base">Загружаем рекомендации...</p>
              </div>
            )}

            {aiError && !isAiLoading && (
              <div className="my-6 p-5 bg-red-100 dark:bg-red-900 dark:bg-opacity-50 text-red-700 dark:text-red-300 rounded-xl shadow-md">
                <h3 className="font-semibold text-lg mb-2">Ошибка при получении рекомендаций:</h3>
                <p className="whitespace-pre-wrap text-sm">{aiError}</p>
              </div>
            )}

            {aiRecommendation && !isAiLoading && !aiError && (
              <div className="my-6">
                <button
                  onClick={toggleAiRecommendationExpansion}
                  className={`w-full flex justify-between items-center p-4 rounded-lg text-left font-medium text-gray-700 hover:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 transition-colors duration-150 ease-in-out ${ isAiRecommendationExpanded ? 'bg-white border border-rose-200' : 'bg-transparent' } shadow-sm`}
                  aria-expanded={isAiRecommendationExpanded}
                >
                  <span>
                    {isAiRecommendationExpanded ? "Скрыть рекомендации" : "Показать сохраненные рекомендации"}
                  </span>
                  <svg
                    className={`w-5 h-5 transform transition-transform duration-200 ${isAiRecommendationExpanded ? 'rotate-180' : 'rotate-0'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                {isAiRecommendationExpanded && (
                  <div className="mt-4 p-5 bg-white rounded-xl shadow-md border border-rose-200 overflow-hidden">
                    <h3 className="text-lg font-semibold text-rose-700 mb-4 break-words">Ваши персональные рекомендации:</h3>
                    <div
                      className="prose prose-sm sm:prose-base max-w-none ai-recommendation-content text-gray-800 break-words overflow-x-auto"
                      dangerouslySetInnerHTML={{ __html: formatAIRecommendationHTML(aiRecommendation) }}
                    />
                  </div>
                )}
              </div>
            )}

            {!aiRecommendation && !isAiLoading && !aiError && (
              <p className="text-gray-700 my-8 text-base">
                Получите персональные советы по питанию и образу жизни на основе ваших данных и целей.
                Рекомендации будут доступны после ввода всех данных и расчета показателей.
              </p>
            )}
            
            <button
              onClick={handleGetAiRecommendation}
              disabled={OPENAI_PROXY_BASE_URL.includes('YOUR_PYTHONANYWHERE_USERNAME') || !results || isAiLoading || (lastAiRequestSnapshot !== null && !canRequestNewAiRecommendation && aiRecommendation !== null)}
              className={`${aiButtonStyle} flex items-center justify-center mt-6`}
              aria-live="polite"
            >
              {isAiLoading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {aiButtonText}
            </button>
          </>
        </div>

        <footer className="text-center mt-8 md:mt-12 py-6">
          <div className="inline-block bg-white/85 backdrop-blur-lg rounded-2xl px-6 py-4 shadow-lg border-2 border-rose-200/50 max-w-[90vw]">
            <p className="text-sm text-gray-700 break-words">
              &copy; {new Date().getFullYear()} Beauty Panel. Все расчеты являются приблизительными и не заменяют консультацию специалиста. Рекомендации ИИ носят информационный характер.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export { BMICalculatorApp };
