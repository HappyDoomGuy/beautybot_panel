import React from 'react';
import { AlertTriangleIcon } from './Icons';

export const Disclaimer: React.FC = () => {
  return (
    <div className="bg-rose-50/90 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-rose-200/60">
      <div className="flex items-start">
        <AlertTriangleIcon className="w-7 h-7 sm:w-8 sm:h-8 mr-3 text-rose-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-rose-800 mb-2">Важное уведомление:</h3>
          <p className="text-rose-700 leading-relaxed">
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
