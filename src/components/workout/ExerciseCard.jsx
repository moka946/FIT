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
      <div
        onClick={() => setExpanded(!expanded)}
        className={`p-5 flex items-center justify-between cursor-pointer group ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
          <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
              <Play className={`w-4 h-4 text-orange-500 transition-transform group-hover:scale-110 ${isRTL ? 'rotate-180' : ''}`} />
            </div>
            <h4 className="text-white font-bold text-lg truncate tracking-tight">{title}</h4>
          </div>

          <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-zinc-500" />
              <span className="text-zinc-400 text-sm font-medium">{exercise.sets} {t('sets')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-zinc-500" />
              <span className="text-zinc-400 text-sm font-medium">{exercise.reps} {t('reps')}</span>
            </div>
          </div>
        </div>

        <div
          className={`w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 transition-all ${expanded ? 'bg-orange-500 text-black shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'group-hover:bg-zinc-700'}`}
        >
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border-t border-zinc-800/50 bg-zinc-900/40 overflow-hidden"
          >
            <div className="p-5 space-y-4">
              {/* Optional: Larger preview when expanded */}
              <div className="w-full rounded-2xl overflow-hidden border border-zinc-800 bg-black/40">
                {exercise.gif_url?.toLowerCase().endsWith('.mp4') ? (
                  <video
                    src={(import.meta.env.BASE_URL + exercise.gif_url).replace(/\/+/g, '/')}
                    className="w-full aspect-video object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={exercise.gif_url ? (import.meta.env.BASE_URL + exercise.gif_url).replace(/\/+/g, '/') : "https://via.placeholder.com/80"}
                    alt={title}
                    className="w-full aspect-video object-cover"
                  />
                )}
              </div>

              <p className={`text-zinc-400 text-sm leading-relaxed ${isRTL ? 'text-right font-medium' : ''}`}>
                {description}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-800/50 p-3.5 rounded-2xl border border-zinc-800/50 flex items-center gap-4 group hover:border-orange-500/30 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center transition-transform group-hover:scale-110">
                    <Flame className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-white font-black text-base">{exercise.calories}</p>
                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">{t('kcal')}</p>
                  </div>
                </div>
                <div className="bg-zinc-800/50 p-3.5 rounded-2xl border border-zinc-800/50 flex items-center gap-4 group hover:border-red-500/30 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center transition-transform group-hover:scale-110">
                    <Beef className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-white font-black text-base">{exercise.fat}g</p>
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