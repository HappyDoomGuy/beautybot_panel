import React from 'react';

interface HeaderProps {
  onReset: () => void;
  showReset: boolean;
}

const Header: React.FC<HeaderProps> = ({ onReset, showReset }) => {
  return (
    <header className="w-full max-w-2xl mx-auto py-6 px-4 flex justify-between items-center">
        {showReset && (
            <button
                onClick={onReset}
                className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
            >
                Назад
            </button>
        )}
        <div className={`flex items-center space-x-3 cursor-pointer ${showReset ? '' : 'mx-auto'}`} onClick={onReset}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-8 w-8 text-purple-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
            </svg>
            <h1 className="font-cinzel text-2xl md:text-3xl font-bold tracking-widest text-gray-200">
                Beauty Oracle
            </h1>
        </div>
        {showReset && <div className="w-16"></div>}
    </header>
  );
};

export default Header;