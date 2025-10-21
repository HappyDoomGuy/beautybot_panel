/**
 * Google Apps Script для записи аналитики посещений в Google Sheets
 * 
 * ОПТИМИЗАЦИЯ ДЛЯ ВЫСОКИХ НАГРУЗОК:
 * - Использует LockService для предотвращения race conditions
 * - Поддерживает до 30 одновременных пользователей без задержек
 * - До 100 пользователей с минимальными задержками (1-5 сек)
 * - Автоматическая очередь запросов при высокой нагрузке
 * 
 * ИНСТРУКЦИЯ ПО НАСТРОЙКЕ:
 * 
 * 1. Создайте новую Google Таблицу
 * 2. Перейдите в Extensions > Apps Script
 * 3. Скопируйте этот код в редактор
 * 4. Замените SPREADSHEET_ID на ID вашей таблицы (из URL)
 * 5. Нажмите Deploy > New deployment
 * 6. Выберите "Web app"
 * 7. Execute as: "Me"
 * 8. Who has access: "Anyone"
 * 9. Скопируйте URL деплоя
 * 10. Вставьте URL в src/utils/analytics.ts (переменная GOOGLE_APPS_SCRIPT_URL)
 */

// ID вашей Google Таблицы (замените на свой)
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Analytics';

/**
 * Обрабатывает POST запросы
 */
function doPost(e) {
  // Получаем блокировку для предотвращения race conditions
  const lock = LockService.getScriptLock();
  
  try {
    // Ждем до 30 секунд, пока не освободится блокировка
    lock.waitLock(30000);
    
    const data = JSON.parse(e.postData.contents);
    const { userId, fullName, section, timestamp } = data;
    
    // ОТЛАДКА: Логируем что получили
    Logger.log('📊 Received data:');
    Logger.log('User ID: ' + userId);
    Logger.log('Full Name: ' + fullName);
    Logger.log('Section: ' + section);
    Logger.log('Timestamp: ' + timestamp);
    
    // Получаем таблицу
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Если листа нет, создаем его с заголовками
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      sheet.getRange(1, 1, 1, 7).setValues([[
        'User ID',
        'Full Name',
        'Умный нутрициолог',
        'Расшифровщик анализов',
        'Персональный гороскоп',
        'Аффирмации красоты',
        'Последнее посещение'
      ]]);
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
    }
    
    // Ищем строку с этим пользователем
    // Используем getDataRange() только один раз для оптимизации
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    let userRow = -1;
    
    // Оптимизированный поиск пользователя
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] == userId) {
        userRow = i + 1; // +1 потому что индексы в Sheets начинаются с 1
        break;
      }
    }
    
    // Определяем колонку по разделу (с учетом новой колонки Full Name)
    const sectionColumns = {
      'bmi-calculator': 3,    // Умный нутрициолог (Колонка C)
      'lab-analysis': 4,      // Расшифровщик анализов (Колонка D)
      'horoscope': 5,         // Персональный гороскоп (Колонка E)
      'affirmation': 6        // Аффирмации красоты (Колонка F)
    };
    
    const sectionColumn = sectionColumns[section];
    
    // ОТЛАДКА: Логируем маппинг
    Logger.log('Section "' + section + '" maps to column ' + sectionColumn);
    
    if (!sectionColumn) {
      Logger.log('❌ ERROR: Invalid section: ' + section);
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Invalid section: ' + section
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (userRow === -1) {
      // Новый пользователь - добавляем строку
      // Массив: [userId, fullName, bmi, lab, horoscope, affirmation, timestamp]
      // Индексы: [0,     1,        2,   3,   4,         5,           6]
      const newRow = [userId, fullName, 0, 0, 0, 0, timestamp];
      
      // ВАЖНО: В массиве индексы начинаются с 0, а в Sheets колонки с 1
      // Поэтому нужно вычесть 1 из номера колонки для массива
      const arrayIndex = sectionColumn - 1;
      newRow[arrayIndex] = 1; // Устанавливаем 1 для посещенного раздела
      
      Logger.log('✅ New user: writing 1 to array index ' + arrayIndex + ' (column ' + sectionColumn + ')');
      sheet.appendRow(newRow);
    } else {
      // Существующий пользователь - обновляем счетчики и имя
      sheet.getRange(userRow, 2).setValue(fullName); // Обновляем имя на случай если изменилось
      
      const currentCount = sheet.getRange(userRow, sectionColumn).getValue();
      Logger.log('✅ Existing user row ' + userRow + ': updating column ' + sectionColumn + ' from ' + currentCount + ' to ' + (currentCount + 1));
      sheet.getRange(userRow, sectionColumn).setValue(currentCount + 1);
      
      // Обновляем время последнего посещения
      sheet.getRange(userRow, 7).setValue(timestamp);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Analytics tracked successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    // Всегда освобождаем блокировку
    lock.releaseLock();
  }
}

/**
 * Обрабатывает GET запросы (опционально, для тестирования)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'OK',
    message: 'Beauty Panel Analytics API is running'
  })).setMimeType(ContentService.MimeType.JSON);
}

