import React from 'react';
import { useLanguage } from '@/components/LanguageContext';

export default function FooterCredit() {
  const { t } = useLanguage();

  return (
    <p className="text-center text-zinc-600 text-[10px] py-8 uppercase tracking-widest font-medium">
      {t('footerCredit')}
    </p>
  );
}

