import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Weight, X } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

export default function ProfileSetupModal({ onClose }) {
  const { t, isRTL } = useLanguage();
  const [goal, setGoal] = useState('cut');
  const [weight, setWeight] = useState('');

  const goals = [
    { key: 'bulk', emoji: '💪' },
    { key: 'cut', emoji: '🔥' },
    { key: 'maintain', emoji: '⚖️' },
  ];

  const handleSave = () => {
    if (!weight) return;
    const profile = { goal, weight: parseFloat(weight), createdAt: Date.now() };
    localStorage.setItem('fitegypt_user_profile', JSON.stringify(profile));
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm bg-zinc-900 rounded-3xl border border-zinc-800 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-black text-xl">{t('setupProfile')}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Goal Selection */}
        <div className="mb-6">
          <label className={`block text-zinc-400 text-sm font-bold mb-3 ${isRTL ? 'text-right' : ''}`}>{t('whatsYourGoal')}</label>
          <div className="grid grid-cols-3 gap-3">
            {goals.map(g => (
              <button
                key={g.key}
                onClick={() => setGoal(g.key)}
                className={`py-3 rounded-2xl text-center transition-all ${
                  goal === g.key
                    ? 'bg-orange-500 text-black font-bold shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                    : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                }`}
              >
                <span className="text-lg">{g.emoji}</span>
                <p className="text-xs font-bold mt-1">{t(g.key)}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Weight Input */}
        <div className="mb-6">
          <label className={`block text-zinc-400 text-sm font-bold mb-2 ${isRTL ? 'text-right' : ''}`}>{t('currentWeight')}</label>
          <div className="flex items-center gap-3 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl px-4 py-3">
            <Weight className="w-5 h-5 text-orange-500" />
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="75"
              className={`bg-transparent flex-1 text-white text-lg font-medium outline-none placeholder:text-zinc-600 ${isRTL ? 'text-right' : ''}`}
            />
            <span className="text-zinc-500 text-sm">{t('kg')}</span>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!weight}
          className="w-full py-4 rounded-2xl bg-orange-500 text-black font-bold text-lg disabled:opacity-50 active:scale-[0.98] transition-all shadow-[0_8px_30px_rgba(249,115,22,0.3)]"
        >
          {t('saveProfile')}
        </button>
      </motion.div>
    </motion.div>
  );
}
