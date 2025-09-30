import React from 'react';
import { AppNavigation } from '../components/AppNavigation';

interface AffirmationAppProps {
  onBack: () => void;
}

const AffirmationApp: React.FC<AffirmationAppProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AppNavigation 
        title="Аффирмация красоты" 
        onBack={onBack}
        gradient="from-pink-500 to-rose-500"
      />
      
      <main className="flex-1 flex items-center justify-center p-4">
        {/* Пустая страница - функционал будет добавлен позже */}
      </main>
    </div>
  );
};

export { AffirmationApp };
