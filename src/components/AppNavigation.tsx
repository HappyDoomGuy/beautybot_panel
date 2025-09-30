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
  gradient = 'from-rose-500 to-blush-500'
}) => {
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-pink-100 to-rose-100 border-b border-rose-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center space-x-1 sm:space-x-2 text-gray-800 hover:text-gray-900 transition-colors duration-200 group font-medium flex-shrink-0"
          >
            <svg 
              className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-hover:-translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm sm:text-base font-medium hidden xs:inline">Назад</span>
          </button>

          {/* Title */}
          <div className="flex items-center flex-1 justify-center px-2">
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate">
              {title}
            </h1>
          </div>

          {/* Placeholder for symmetry */}
          <div className="w-12 sm:w-20 flex-shrink-0"></div>
        </div>
      </div>
    </nav>
  );
};

export { AppNavigation };
