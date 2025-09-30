import React from 'react';

interface ContentCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'light' | 'dark';
}

/**
 * Компонент красивой полупрозрачной плашки для размещения контента на фоне
 * Обеспечивает читаемость текста с помощью backdrop-blur и полупрозрачного фона
 */
const ContentCard: React.FC<ContentCardProps> = ({ 
  children, 
  className = '', 
  variant = 'default' 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-br from-white/95 via-pink-50/95 to-rose-50/95 border-pink-200/60';
      case 'light':
        return 'bg-white/90 border-white/40';
      case 'dark':
        return 'bg-white/85 border-rose-200/50';
      default:
        return 'bg-white/90 backdrop-blur-md border-rose-200/50';
    }
  };

  return (
    <div
      className={`
        rounded-2xl sm:rounded-3xl 
        shadow-xl 
        border-2 
        backdrop-blur-lg
        ${getVariantStyles()}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export { ContentCard };
