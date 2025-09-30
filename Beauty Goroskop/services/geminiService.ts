import { ZodiacSign, HoroscopeData } from '../types';

const PROXY_URL = 'https://happydoomguy.pythonanywhere.com/gemini/models/gemini-2.5-flash:generateContent';

export const getHoroscope = async (sign: ZodiacSign): Promise<HoroscopeData> => {
  const today = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  const prompt = `
    Создай подробный, позитивный и вдохновляющий бьюти-гороскоп для знака зодиака ${sign} на сегодня, ${today}.
    Сделай основной акцент на уходе за собой: дай конкретные советы по уходу за кожей, волосами или телом, а также упомяни практики для релаксации и гармонии.
    В качестве второстепенных рекомендаций, предложи идеи для макияжа и стиля в одежде, которые дополнят образ и будут соответствовать энергии дня.
    Тон должен быть мистическим, заботливым и модным.
    Включи в ответ "цвет дня" (подходящий для макияжа, одежды или маникюра) и "счастливое число".
    Ответ должен быть на русском языке.
    
    ВАЖНО: НЕ используй никаких обращений к пользователю по знаку зодиака (типа "Дорогая Овен", "Дорогие Стрельцы" и т.д.). Начинай гороскоп сразу с содержания.
    
    КРИТИЧЕСКИ ВАЖНО: Текст гороскопа должен быть отформатирован в ЧИСТОМ Markdown без экранированных символов:
    
    ПРАВИЛА ФОРМАТИРОВАНИЯ:
    - ## для подзаголовков (без экранирования)
    - **жирный текст** для важных моментов
    - *курсив* для акцентов
    - - для списков
    - > для цитат или особых советов (без экранирования)
    
    СТРОГИЕ ЗАПРЕТЫ:
    - ЗАПРЕЩЕНО использовать символы \\n, \\", \\', \\\\ в тексте
    - ЗАПРЕЩЕНО экранировать символы Markdown
    - ЗАПРЕЩЕНО писать > как \\> или ## как \\##
    
    ОБЯЗАТЕЛЬНЫЕ ТРЕБОВАНИЯ:
    - Между каждым абзацем, заголовком и списком должна быть ПУСТАЯ СТРОКА
    - Заголовки должны быть отделены пустыми строками сверху и снизу
    - Используй только обычные переносы строк (Enter), не символы \\n
    - Все символы Markdown пиши как есть, без обратных слешей
  `;

  const requestBody = {
    contents: [{
      parts: [{ text: prompt }]
    }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: 'OBJECT',
        properties: {
          title: {
            type: 'STRING',
            description: "Краткий, интригующий заголовок для бьюти-гороскопа, например, 'Сияние твоей души'."
          },
          horoscope_text: {
            type: 'STRING',
            description: "Подробный текст бьюти-гороскопа с акцентом на уход за собой (кожа, волосы, тело) и второстепенными советами по макияжу и стилю. СТРОГО ОБЯЗАТЕЛЬНО: Текст должен быть в ЧИСТОМ Markdown без экранированных символов. ЗАПРЕЩЕНО использовать \\n, \\\", \\', \\\\ в тексте. ЗАПРЕЩЕНО экранировать символы Markdown (>, ##, **, *). Между каждым абзацем, заголовком и списком должна быть пустая строка. НЕ используй никаких обращений к пользователю по знаку зодиака - начинай сразу с содержания."
          },
          lucky_color: {
            type: 'STRING',
            description: "Цвет дня, который стоит использовать в макияже, одежде или маникюре."
          },
          lucky_number: {
            type: 'INTEGER',
            description: "Счастливое число на сегодня."
          }
        },
        required: ["title", "horoscope_text", "lucky_color", "lucky_number"]
      }
    }
  };
  
  try {
    const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Error from proxy/API:", errorBody);
        throw new Error(`Failed to fetch horoscope from proxy. Status: ${response.status}`);
    }

    const responseData = await response.json();

    const jsonText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!jsonText) {
        console.error("Invalid response structure from API:", responseData);
        throw new Error("API response is missing expected content.");
    }
    
    const parsedData = JSON.parse(jsonText);

    // Basic validation to ensure the parsed data matches the expected structure.
    if (
        typeof parsedData.title === 'string' &&
        typeof parsedData.horoscope_text === 'string' &&
        typeof parsedData.lucky_color === 'string' &&
        typeof parsedData.lucky_number === 'number'
    ) {
        // Очищаем текст от экранированных символов
        const cleanHoroscopeText = parsedData.horoscope_text
            .replace(/\\n/g, '\n')  // Заменяем \n на переносы строк
            .replace(/\\"/g, '"')   // Заменяем \" на "
            .replace(/\\'/g, "'")   // Заменяем \' на '
            .replace(/\\\\/g, '\\'); // Заменяем \\ на \
        
        return {
            ...parsedData,
            horoscope_text: cleanHoroscopeText
        } as HoroscopeData;
    } else {
        throw new Error("API response format is incorrect");
    }

  } catch (error) {
    console.error("Error fetching horoscope via proxy:", error);
    throw new Error("Failed to generate horoscope.");
  }
};