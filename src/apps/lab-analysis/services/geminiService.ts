// IMPORTANT: इंश्योर करें कि PROXY_BASE_URL आपकी PythonAnywhere ऐप के नाम से सही तरह से कॉन्फ़िगर किया गया है।
// उदाहरण के लिए, यदि आपकी ऐप 'myuser.pythonanywhere.com' पर है, तो URL होना चाहिए:
// 'https://myuser.pythonanywhere.com/gemini'
const PROXY_BASE_URL = 'https://happydoomguy.pythonanywhere.com/gemini'; // User confirmed this is set

const MODEL_NAME = 'gemini-2.5-flash'; // Updated model name

// Interfaces to represent the Gemini API response structure
interface GeminiApiError {
  code?: number;
  message?: string;
  status?: string;
  details?: any[];
}

interface Part {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
  // Other possible part types: functionCall, functionResponse, fileData
}

interface Content {
  parts: Part[];
  role?: string;
}

interface Candidate {
  content: Content;
  finishReason?: string;
  index?: number;
  safetyRatings?: Array<{
    category: string;
    probability: string;
    blocked?: boolean;
  }>;
  // tokenCount, citationMetadata, etc.
}

interface PromptFeedback {
  blockReason?: string;
  safetyRatings?: Array<{
    category: string;
    probability: string;
  }>;
  // blockReasonMessage (if blocked)
}

interface GeminiApiResponse {
  // Direct text field, if proxy kindly adds it or if it's a simple text response
  text?: string; 
  candidates?: Candidate[];
  promptFeedback?: PromptFeedback;
  // To catch errors returned in a 200 OK by proxy, or if proxy forwards Gemini error structure
  error?: GeminiApiError; 
}


export const analyzeBloodTest = async (
  fileDataBase64: string,
  fileMimeType: string
): Promise<string> => {
  if (PROXY_BASE_URL.includes('[YOUR_PYTHONANYWHERE_APP_NAME]')) {
    console.error("CRITICAL: PROXY_BASE_URL is not configured. Please edit services/geminiService.ts and replace '[YOUR_PYTHONANYWHERE_APP_NAME]' with your actual PythonAnywhere application name.");
    return Promise.reject("Ошибка конфигурации: URL прокси-сервера не настроен. Обратитесь к администратору.");
  }
  
  const prompt = `Ты — опытный ИИ-ассистент, специализирующийся на интерпретации результатов анализов крови. Твоя задача — проанализировать предоставленное изображение или PDF-документ с результатами анализа крови пациента.

ВАЖНО: ВНАЧАЛЕ ВНИМАТЕЛЬНО ИЗУЧИ ДОКУМЕНТ И НАЙДИ ИНФОРМАЦИЮ О ПОЛЕ И ВОЗРАСТЕ ПАЦИЕНТА. ЭТА ИНФОРМАЦИЯ КРИТИЧЕСКИ ВАЖНА ДЛЯ КОРРЕКТНОЙ ИНТЕРПРЕТАЦИИ.

Если информация о поле и возрасте найдена в документе:
- Используй найденные пол и возраст для анализа каждого показателя и формирования референтных интервалов.
- В начале своего ответа четко укажи найденные пол и возраст (например: "Анализ для: Женщина, 35 лет").

Если информация о поле и/или возрасте отсутствует в документе:
- Четко сообщи об этом в начале ответа (например: "Пол и/или возраст пациента не указаны в документе. Анализ будет проведен на основе усредненных референтных значений. Для более точной интерпретации рекомендуется учитывать пол и возраст.").
- Проведи анализ, используя наиболее общие или усредненные референтные интервалы, но обязательно отметь, что точность интерпретации может быть снижена из-за отсутствия этих данных.

Для каждого показателя, найденного в анализе (например, Гемоглобин, Лейкоциты, ТТГ, Креатинин, Глюкоза, Холестерин общий, ЛПВП, ЛПНП, Триглицериды, АЛТ, АСТ, Билирубин общий, СОЭ и т.д.):
1.  **Название показателя**: Укажи полное название.
2.  **Результат**: Укажи значение из анализа и единицы измерения.
3.  **Референтный интервал**: Укажи нормальные значения для данного показателя С УЧЕТОМ НАЙДЕННЫХ В ДОКУМЕНТЕ ПОЛА И ВОЗРАСТА пациента (или общие, если данные не найдены, с соответствующей пометкой). Если в документе есть свои референтные значения, можешь их упомянуть, но приоритет отдавай общепринятым нормам с учетом пола и возраста, если они известны.
4.  **Статус**: Четко укажи: "В норме", "Повышен" или "Понижен". Если близко к границе, можно это отметить (например, "Незначительно повышен", "На верхней границе нормы").
5.  **За что отвечает**: Кратко и ПРОСТЫМ ЯЗЫКОМ объясни основную функцию этого показателя в организме.
6.  **Возможные причины отклонений (если есть)**: Если показатель отклоняется от нормы, опиши ОБЩИЕ и наиболее вероятные причины (например, связанные с питанием, образом жизни, возможными состояниями). НЕ СТАВЬ ДИАГНОЗ. Формулируй осторожно (например, "может указывать на...", "иногда связан с...").
7.  **Общие рекомендации (если есть отклонения)**: Дай ОБЩИЕ советы, что можно предпринять (например, "обсудить с врачом", "скорректировать диету", "увеличить физическую активность"). НЕ НАЗНАЧАЙ ЛЕКАРСТВА ИЛИ КОНКРЕТНОЕ ЛЕЧЕНИЕ.

После анализа всех показателей, предоставь:
А.  **Общее заключение**: Кратко суммируй наиболее важные находки. Есть ли какие-то показатели, требующие особого внимания? Какие системы организма могут быть затронуты, судя по результатам?
Б.  **Общие рекомендации для дальнейших действий**: На основе всего анализа, дай общие советы пациенту простым языком (например, "рекомендуется плановая консультация терапевта для обсуждения результатов и возможного дообследования", "поводов для срочного беспокойства не выявлено, но стоит следить за показателем X и образом жизни", "рекомендуется повторить анализы через Y месяцев для контроля динамики").

ВАЖНО (повторение):
- Весь ответ должен быть представлен в формате Markdown для удобного чтения. Используй заголовки (например, ## Название показателя), списки (*), жирный шрифт (**) для выделения ключевой информации.
- Избегай сложной медицинской терминологии там, где это возможно. Твоя цель — сделать информацию максимально доступной и понятной человеку без специального образования.
- Всегда подчеркивай, что твоя интерпретация НЕ ЯВЛЯЕТСЯ МЕДИЦИНСКИМ ДИАГНОЗОМ и не заменяет очную консультацию квалифицированного врача. Только врач может поставить диагноз и назначить лечение.

Проанализируй приложенный файл.
`;

  const requestBody = {
    contents: [
      {
        parts: [
          { inlineData: { data: fileDataBase64, mimeType: fileMimeType } },
          { text: prompt }
        ]
      }
    ],
     generationConfig: { 
       temperature: 0.2,
       // topP: 0.95, // Default is usually fine
       // topK: 40,   // Default is usually fine
     }
     // No thinkingConfig, default is enabled for higher quality (appropriate for this task)
  };

  const targetUrl = `${PROXY_BASE_URL}/models/${MODEL_NAME}:generateContent`;

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let parsedErrorBody: any = null;
      let errorTextDetails = response.statusText;
      try {
        const responseBodyText = await response.text(); 
        errorTextDetails = responseBodyText || response.statusText;
        if (responseBodyText) {
            parsedErrorBody = JSON.parse(responseBodyText);
        }
      } catch (e) {
        // If response is not JSON or empty, errorTextDetails already holds the text or statusText
        // parsedErrorBody remains null
      }
      
      const errorMessage = 
        parsedErrorBody?.error?.message || // Check for proxy-wrapped error message
        parsedErrorBody?.message ||         // Check for direct Gemini-like error message
        errorTextDetails;                   // Fallback to raw text or status text

      console.error("Ошибка от прокси или API (HTTP не-OK):", response.status, errorMessage, parsedErrorBody);
      throw new Error(`Ошибка API (${response.status}): ${errorMessage}`);
    }

    const data: GeminiApiResponse = await response.json();
    
    // Check if the response (even if HTTP 200) contains a Gemini error object
    if (data.error && data.error.message) {
        console.error("Ошибка от API Gemini (через прокси, HTTP 200):", JSON.stringify(data.error, null, 2));
        throw new Error(`Ошибка от API Gemini: ${data.error.message}`);
    }
    
    // Try to extract text, prioritizing direct .text field, then standard candidates path.
    let extractedText: string | null = null;

    if (data.text && typeof data.text === 'string') {
        extractedText = data.text;
    } else if (data.candidates &&
               data.candidates.length > 0 &&
               data.candidates[0].content &&
               data.candidates[0].content.parts &&
               data.candidates[0].content.parts.length > 0 &&
               data.candidates[0].content.parts[0].text &&
               typeof data.candidates[0].content.parts[0].text === 'string') {
        extractedText = data.candidates[0].content.parts[0].text;
    }

    if (extractedText === null) {
      // Log the full structure for debugging if text is still not found
      console.error("Не удалось извлечь текст из ответа API. Структура ответа:", JSON.stringify(data, null, 2));
      // Check for block reason in promptFeedback
      if (data.promptFeedback?.blockReason) {
        throw new Error(`Запрос был заблокирован. Причина: ${data.promptFeedback.blockReason}. ${data.promptFeedback.safetyRatings?.map(r => `${r.category}: ${r.probability}`).join(', ') || ''}`);
      }
      throw new Error("Не удалось извлечь текст из ответа API. Структура ответа не соответствует ожиданиям или текст отсутствует.");
    }
    
    return extractedText;

  } catch (error: any) {
    console.error("Ошибка при вызове API через прокси:", error.message, error.stack);
    if (error instanceof Error) {
        if (error.message.toLowerCase().includes('failed to fetch')) {
             return Promise.reject(`Сетевая ошибка: Не удалось подключиться к прокси-серверу. Проверьте ваше интернет-соединение и URL прокси (${PROXY_BASE_URL}). Убедитесь, что прокси-сервер запущен и доступен.`);
        }
        return Promise.reject(error.message);
    }
    return Promise.reject("Произошла неизвестная ошибка при обращении к прокси-серверу.");
  }
};
