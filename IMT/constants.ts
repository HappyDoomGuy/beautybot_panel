import { ActivityLevel, BMICategory, Gender, CalorieGoal } from './types';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  [ActivityLevel.SEDENTARY]: 1.2,
  [ActivityLevel.LIGHT]: 1.375,
  [ActivityLevel.MODERATE]: 1.55,
  [ActivityLevel.ACTIVE]: 1.725,
  [ActivityLevel.VERY_ACTIVE]: 1.9,
};

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: Gender.MALE, label: 'Мужчина' },
  { value: Gender.FEMALE, label: 'Женщина' },
];

export const ACTIVITY_LEVEL_OPTIONS: { value: ActivityLevel; label: string; shortLabel: string }[] = [
  { value: ActivityLevel.SEDENTARY, label: 'Сидячий образ жизни', shortLabel: 'Сидячий образ жизни' },
  { value: ActivityLevel.LIGHT, label: 'Легкая активность (1-3 тренировки/нед.)', shortLabel: 'Легкая активность' },
  { value: ActivityLevel.MODERATE, label: 'Умеренная активность (3-5 тренировок/нед.)', shortLabel: 'Умеренная активность' },
  { value: ActivityLevel.ACTIVE, label: 'Высокая активность (6-7 тренировок/нед.)', shortLabel: 'Высокая активность' },
  { value: ActivityLevel.VERY_ACTIVE, label: 'Очень высокая активность (тяжелая работа/2 р. в день)', shortLabel: 'Очень высокая активность' },
];

export const BMI_CATEGORIES: BMICategory[] = [
  { label: 'Значительный дефицит массы', min: 0, max: 16, color: 'bg-sky-500', textColor: 'text-white' },
  { label: 'Недостаточная масса', min: 16, max: 18.5, color: 'bg-sky-400', textColor: 'text-white' },
  { label: 'Нормальный вес', min: 18.5, max: 25, color: 'bg-green-500', textColor: 'text-white' },
  { label: 'Избыточная масса', min: 25, max: 30, color: 'bg-yellow-400', textColor: 'text-slate-800' },
  { label: 'Ожирение I степени', min: 30, max: 35, color: 'bg-orange-500', textColor: 'text-white' },
  { label: 'Ожирение II степени', min: 35, max: 40, color: 'bg-red-500', textColor: 'text-white' },
  { label: 'Ожирение III степени', min: 40, max: Infinity, color: 'bg-red-700', textColor: 'text-white' },
];

export const MACRONUTRIENT_CALORIES_PER_GRAM = {
  protein: 4,
  carbohydrate: 4,
  fat: 9,
};

export const INITIAL_PROTEIN_PERCENTAGE = 30;
export const INITIAL_CARB_PERCENTAGE = 40;
export const INITIAL_FAT_PERCENTAGE = 30;
export const MIN_MACRO_PERCENTAGE = 5; // Minimum percentage for any macronutrient

export const WEIGHT_LOSS_PERCENTAGE = 0.15; // 15% deficit from TDEE
export const WEIGHT_GAIN_PERCENTAGE = 0.15; // 15% surplus from TDEE

export const CALORIE_GOAL_OPTIONS: { value: CalorieGoal; label: string; shortLabel: string; description: string;}[] = [
  { value: CalorieGoal.LOSS, label: 'Снижение веса', shortLabel: 'Снижение веса', description: `Целевые калории будут на ${WEIGHT_LOSS_PERCENTAGE*100}% ниже TDEE.` },
  { value: CalorieGoal.MAINTENANCE, label: 'Поддержание веса', shortLabel: 'Поддержание веса', description: 'Целевые калории будут равны TDEE.' },
  { value: CalorieGoal.GAIN, label: 'Набор веса', shortLabel: 'Набор веса', description: `Целевые калории будут на ${WEIGHT_GAIN_PERCENTAGE*100}% выше TDEE.` },
];