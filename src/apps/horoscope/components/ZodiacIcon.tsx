import React from 'react';
import { ZodiacSign } from '../types';

interface ZodiacIconProps {
  sign: ZodiacSign;
  className?: string;
}

const ZodiacIcon: React.FC<ZodiacIconProps> = ({ sign, className = '' }) => {
  const getIconPath = (zodiacSign: ZodiacSign): string => {
    // Возвращаем Unicode символ знака зодиака + U+FE0E (text presentation selector)
    // чтобы принудительно показывать текстовую версию вместо emoji
    const textSelector = '\uFE0E';
    switch (zodiacSign) {
      case ZodiacSign.Aries:
        return '♈' + textSelector;
      case ZodiacSign.Taurus:
        return '♉' + textSelector;
      case ZodiacSign.Gemini:
        return '♊' + textSelector;
      case ZodiacSign.Cancer:
        return '♋' + textSelector;
      case ZodiacSign.Leo:
        return '♌' + textSelector;
      case ZodiacSign.Virgo:
        return '♍' + textSelector;
      case ZodiacSign.Libra:
        return '♎' + textSelector;
      case ZodiacSign.Scorpio:
        return '♏' + textSelector;
      case ZodiacSign.Sagittarius:
        return '♐' + textSelector;
      case ZodiacSign.Capricorn:
        return '♑' + textSelector;
      case ZodiacSign.Aquarius:
        return '♒' + textSelector;
      case ZodiacSign.Pisces:
        return '♓' + textSelector;
      default:
        return '⭐' + textSelector;
    }
  };

  return (
    <span 
      className={`zodiac-icon ${className}`}
      style={{
        display: 'inline-block',
        color: '#ec4899', // Розовый цвет
        textShadow: '0 0 10px rgba(236, 72, 153, 0.5)',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold'
      }}
    >
      {getIconPath(sign)}
    </span>
  );
};

export default ZodiacIcon;

