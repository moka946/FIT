import React from 'react';
import { useLanguage } from './LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded-xl text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
    >
      <Globe className="w-4 h-4" />
      {language === 'en' ? 'العربية' : 'English'}
    </button>
  );
}