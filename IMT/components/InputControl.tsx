
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
  const neumorphicBaseClass = "transition-shadow duration-300 ease-in-out";
  const neumorphicInsetEffect = "bg-gray-200 shadow-[inset_3px_3px_6px_#BEBEBE,_inset_-3px_-3px_6px_#FFFFFF] dark:bg-slate-800 dark:shadow-[inset_3px_3px_6px_#141c2a,_inset_-3px_-3px_6px_#2c3a50]";
  const neumorphicFocusEffect = "focus:bg-gray-200 focus:shadow-[3px_3px_6px_#BEBEBE,_-3px_-3px_6px_#FFFFFF] dark:focus:bg-slate-800 dark:focus:shadow-[3px_3px_6px_#141c2a,_-3px_-3px_6px_#2c3a50]";

  if (type === 'range') {
    return (
      <div className="mb-6"> {/* Adjusted margin from mb-8 */}
        <div className="flex justify-between items-baseline mb-3">
          <label htmlFor={id} className="text-xl font-semibold text-slate-700 dark:text-slate-300"> {/* Increased from text-lg */}
            {label}
          </label>
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400"> {/* Increased from text-lg */}
            {value}
            {unit ? <span className="text-lg font-medium text-slate-500 dark:text-slate-400 ml-1.5">{unit}</span> : ''} {/* Increased from text-base */}
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
          className={`w-full h-2 rounded-lg appearance-none cursor-pointer custom-slider-thumb ${neumorphicInsetEffect}`}
          aria-labelledby={id + "-label"}
        />
        {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>} {/* Adjusted margin from mt-1.5 */}
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label htmlFor={id} className="block text-base font-semibold text-slate-700 dark:text-slate-300 mb-2">
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
          className={`block w-full px-3.5 py-3 border-none text-slate-800 dark:text-slate-200 rounded-lg focus:outline-none text-sm ${neumorphicBaseClass} ${neumorphicInsetEffect} ${neumorphicFocusEffect} placeholder-slate-400 dark:placeholder-slate-500`}
        />
        {unit && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{unit}</span>
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default InputControl;