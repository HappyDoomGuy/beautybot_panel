export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum ActivityLevel {
  SEDENTARY = 'sedentary',
  LIGHT = 'light',
  MODERATE = 'moderate',
  ACTIVE = 'active',
  VERY_ACTIVE = 'very_active',
}

export enum CalorieGoal {
  LOSS = 'loss',
  MAINTENANCE = 'maintenance',
  GAIN = 'gain',
  CUSTOM = 'custom',
}

export interface UserData {
  weight: string;
  height: string;
  age: string;
  gender: Gender;
  activityLevel: ActivityLevel;
}

export interface BMICategory {
  label: string;
  min: number;
  max: number;
  color: string;
  textColor?: string;
}

export interface CalculationResults {
  bmi: number;
  bmiCategory: BMICategory;
  bmr: number;
  tdee: number;
}

export interface DietSettings {
  targetCalories: number;
  proteinPercentage: number;
  carbPercentage: number;
  fatPercentage: number;
}

export interface MacronutrientInfo {
  name: string;
  grams: number;
  calories: number;
  percentage: number;
  color: string;
}
