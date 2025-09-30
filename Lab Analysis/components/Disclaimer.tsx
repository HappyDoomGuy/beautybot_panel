
import React from 'react';
import { AlertTriangleIcon } from './Icons';

export const Disclaimer: React.FC = () => {
  return (
    <div className="neo neo-inset p-4 sm:p-5 rounded-xl text-inherit"> {/* Consistent padding, mt-8 removed */}
      <div className="flex items-start">
        <AlertTriangleIcon className="w-7 h-7 sm:w-8 sm:h-8 mr-3 text-inherit opacity-80 flex-shrink-0 mt-0.5" />
        <div>
          {/* Standard font size (1rem) */}
          <h3 className="font-semibold text-inherit" style={{ fontSize: 'var(--font-size-standard)' }}>Важное уведомление:</h3>
          {/* Standard font size (1rem) */}
          <p className="mt-1.5" style={{ fontSize: 'var(--font-size-standard)' }}>
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