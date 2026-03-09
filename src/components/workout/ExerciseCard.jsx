import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Flame, Beef, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

export default function ExerciseCard({ exercise, index }) {
  const [expanded, setExpanded] = useState(false);
  const { t, isRTL } = useLanguage();

  const title = exercise.titleKey ? t(exercise.titleKey) : exercise.name;
  const description = exercise.descKey ? t(exercise.descKey) : exercise.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-zinc-900/60 rounded-2xl overflow-hidden border border-zinc-800 backdrop-blur-md"
    >
      <div className={`p-4 flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-20 h-20 rounded-xl bg-zinc-800 overflow-hidden flex-shrink-0 relative">
          <img
            src={exercise.gif_url ? (import.meta.env.BASE_URL + exercise.gif_url).replace(/\/+/g, '/') : "https://via.placeholder.com/80"}
            alt={title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => setExpanded(!expanded)}
            className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
          >
            <Play className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
          <h4 className="text-white font-bold text-base truncate">{title}</h4>
          <div className={`flex items-center gap-3 mt-1.5 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-orange-500" />
              <span className="text-zinc-400 text-xs font-medium">{exercise.sets} {t('sets')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-500" />
              <span className="text-zinc-400 text-xs font-medium">{exercise.reps} {t('reps')}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-zinc-800 bg-zinc-900/40"
          >
            <div className="p-4">
              <p className={`text-zinc-400 text-sm leading-relaxed ${isRTL ? 'text-right' : ''}`}>
                {description}
              </p>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-zinc-800/50 p-2.5 rounded-xl border border-zinc-800/50 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{exercise.calories}</p>
                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">{t('kcal')}</p>
                  </div>
                </div>
                <div className="bg-zinc-800/50 p-2.5 rounded-xl border border-zinc-800/50 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Beef className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{exercise.fat}g</p>
                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">{t('fat')}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}