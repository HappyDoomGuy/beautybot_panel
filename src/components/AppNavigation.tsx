import React from 'react';

interface AppNavigationProps {
  title: string;
  onBack: () => void;
  icon?: string;
  gradient?: string;
}

const AppNavigation: React.FC<AppNavigationProps> = ({ 
  title, 
  onBack, 
  icon = '🏠',
  gradient = 'from-purple-500 to-pink-500'
}) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 group"
          >
            <svg 
              className="w-6 h-6 transition-transform duration-200 group-hover:-translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Назад</span>
          </button>

          {/* Title */}
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{icon}</div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">
              {title}
            </h1>
          </div>

          {/* Placeholder for symmetry */}
          <div className="w-20"></div>
        </div>
      </div>
    </nav>
  );
};

export { AppNavigation };
