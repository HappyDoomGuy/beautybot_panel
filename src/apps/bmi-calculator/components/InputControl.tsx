import React from 'react';

interface InputControlProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  unit?: string;
  min?: string;
  max?: string;
  step?: string;
  error?: string;
}

const InputControl: React.FC<InputControlProps> = ({
  label,
  id,
  type = 'number',
  value,
  onChange,
  placeholder,
  unit,
  min,
  max,
  step,
  error
}) => {
  if (type === 'range') {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-baseline mb-3">
          <label htmlFor={id} className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            {label}
          </label>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {value}
            {unit ? <span className="text-lg font-medium text-gray-500 dark:text-gray-400 ml-1.5">{unit}</span> : ''}
          </span>
        </div>
        <input
          type="range"
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          aria-labelledby={id + "-label"}
        />
        {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label htmlFor={id} className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative rounded-lg">
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className="block w-full px-3.5 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {unit && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400 text-sm">{unit}</span>
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default InputControl;
