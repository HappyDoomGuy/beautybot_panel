import { ZodiacSign, ZodiacSignInfo } from './types';

export const ZODIAC_SIGNS: ZodiacSignInfo[] = [
  { name: ZodiacSign.Aries, symbol: '♈', dates: '21 марта – 19 апреля' },
  { name: ZodiacSign.Taurus, symbol: '♉', dates: '20 апреля – 20 мая' },
  { name: ZodiacSign.Gemini, symbol: '♊', dates: '21 мая – 20 июня' },
  { name: ZodiacSign.Cancer, symbol: '♋', dates: '21 июня – 22 июля' },
  { name: ZodiacSign.Leo, symbol: '♌', dates: '23 июля – 22 августа' },
  { name: ZodiacSign.Virgo, symbol: '♍', dates: '23 августа – 22 сентября' },
  { name: ZodiacSign.Libra, symbol: '♎', dates: '23 сентября – 22 октября' },
  { name: ZodiacSign.Scorpio, symbol: '♏', dates: '23 октября – 21 ноября' },
  { name: ZodiacSign.Sagittarius, symbol: '♐', dates: '22 ноября – 21 декабря' },
  { name: ZodiacSign.Capricorn, symbol: '♑', dates: '22 декабря – 19 января' },
  { name: ZodiacSign.Aquarius, symbol: '♒', dates: '20 января – 18 февраля' },
  { name: ZodiacSign.Pisces, symbol: '♓', dates: '19 февраля – 20 марта' }
];
