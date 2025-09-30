import React from 'react';
import { AlertTriangleIcon } from './Icons';

export const Disclaimer: React.FC = () => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-5 rounded-xl border border-blue-200 dark:border-blue-800">
      <div className="flex items-start">
        <AlertTriangleIcon className="w-7 h-7 sm:w-8 sm:h-8 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Важное уведомление:</h3>
          <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
            Результаты, предоставленные этим ИИ-инструментом, не являются медицинским диагнозом.
            Они предназначены исключительно для информационных и образовательных целей.
            Никогда не полагайтесь на эту информацию для принятия решений о вашем здоровье.
            Всегда консультируйтесь с квалифицированным врачом по любым вопросам, связанным с вашим здоровьем и лечением.
          </p>
        </div>
      </div>
    </div>
  );
};
