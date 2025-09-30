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
  const selectedOption = options.find(opt => opt.value === value);
  // Determine if short label should be shown for the selected option in the box
  const displayShortLabelInBox = selectedOption && typeof selectedOption.shortLabel === 'string';
  
  return (
    <div className="mb-6">
      <label htmlFor={id} className="block text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        {displayShortLabelInBox && selectedOption && (
          <div className="absolute inset-y-0 left-0 pl-3.5 pr-12 flex items-center pointer-events-none z-[1]">
            <span className="text-gray-800 dark:text-gray-200 text-base">
              {selectedOption.shortLabel}
            </span>
          </div>
        )}
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          className={`block w-full pl-3.5 pr-12 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base rounded-lg appearance-none ${displayShortLabelInBox ? 'text-transparent' : 'text-gray-800 dark:text-gray-200'}`}
          aria-label={label} 
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectControl;
