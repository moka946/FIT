import React from 'react';
import { Bot } from 'lucide-react';
import BottomNav from '@/components/navigation/BottomNav';
import CoachChat from '@/components/coach/CoachChat';
import { useLanguage } from '@/components/LanguageContext';

export default function Coach() {
  const { t, isRTL } = useLanguage();
  
  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-black/95 backdrop-blur-lg border-b border-zinc-800 px-6 py-4">
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-black" />
          </div>
          <div className={isRTL ? 'text-right' : ''}>
            <h1 className="text-xl font-bold text-white">{t('coachAI')}</h1>
            <p className={`text-emerald-500 text-sm flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {t('online')}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden pb-20">
        <CoachChat />
      </div>

      <BottomNav currentPage="Coach" />
    </div>
  );
}