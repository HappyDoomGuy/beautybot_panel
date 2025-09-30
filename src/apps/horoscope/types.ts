export enum ZodiacSign {
  Aries = 'Овен',
  Taurus = 'Телец',
  Gemini = 'Близнецы',
  Cancer = 'Рак',
  Leo = 'Лев',
  Virgo = 'Дева',
  Libra = 'Весы',
  Scorpio = 'Скорпион',
  Sagittarius = 'Стрелец',
  Capricorn = 'Козерог',
  Aquarius = 'Водолей',
  Pisces = 'Рыбы'
}

export interface ZodiacSignInfo {
  name: ZodiacSign;
  symbol: string;
  dates: string;
}

export interface HoroscopeData {
  title: string;
  horoscope_text: string;
  lucky_color: string;
  lucky_number: number;
}
