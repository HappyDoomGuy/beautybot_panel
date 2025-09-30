import React from 'react';

interface SelectOption<T extends string> {
  value: T;
  label: string;
  shortLabel?: string; // shortLabel is optional
}

interface SelectControlProps<T extends string> {
  label: string;
  id: string;
  value: T;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption<T>[];
}

const SelectControl = <T extends string,>({ label, id, value, onChange, options }: SelectControlProps<T>): React.ReactElement => {
  const neumorphicBaseClass = "transition-shadow duration-300 ease-in-out";
  const neumorphicInsetEffect = "bg-gray-200 shadow-[inset_3px_3px_6px_#BEBEBE,_inset_-3px_-3px_6px_#FFFFFF] dark:bg-slate-800 dark:shadow-[inset_3px_3px_6px_#141c2a,_inset_-3px_-3px_6px_#2c3a50]";
  const neumorphicFocusEffect = "focus:bg-gray-200 focus:shadow-[3px_3px_6px_#BEBEBE,_-3px_-3px_6px_#FFFFFF] dark:focus:bg-slate-800 dark:focus:shadow-[3px_3px_6px_#141c2a,_-3px_-3px_6px_#2c3a50]";

  const selectedOption = options.find(opt => opt.value === value);
  // Determine if short label should be shown for the selected option in the box
  const displayShortLabelInBox = selectedOption && typeof selectedOption.shortLabel === 'string';
  
  return (
    <div className="mb-6">
      <label htmlFor={id} className="block text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
        {label}
      </label>
      <div className="relative"> {/* Wrapper for select and overlay */}
        {displayShortLabelInBox && selectedOption && (
          <div className="absolute inset-y-0 left-0 pl-3.5 pr-12 flex items-center pointer-events-none z-[1]"> {/* Using z-[1] just in case, though usually not needed if select has no background */}
            <span className="text-slate-800 dark:text-slate-200 text-base">
              {selectedOption.shortLabel}
            </span>
          </div>
        )}
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          className={`block w-full pl-3.5 pr-12 py-3 border-none focus:outline-none text-base rounded-lg appearance-none ${neumorphicBaseClass} ${neumorphicInsetEffect} ${neumorphicFocusEffect} ${displayShortLabelInBox ? 'text-transparent' : 'text-slate-800 dark:text-slate-200'}`}
          aria-label={label} 
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
              {option.label} {/* Dropdown options always show full label */}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectControl;