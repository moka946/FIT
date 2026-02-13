import React, { useState } from 'react';
import { Play, ChevronDown, ChevronUp, Flame, Droplet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExerciseCard({ exercise, index, language = 'en', isRTL = false, t = (k) => k }) {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800"
    >
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <span className="text-orange-500 font-bold">{index + 1}</span>
          </div>
          <div className={isRTL ? 'text-right' : ''}>
            <h4 className="text-white font-semibold">{language === 'ar' && exercise.nameAr ? exercise.nameAr : exercise.name}</h4>
            <p className="text-zinc-500 text-sm">{exercise.sets} {t('sets')} × {exercise.reps}</p>
          </div>
        </div>
        {exercise.gif_url && (
          <button
            onClick={() => setShowVideo(!showVideo)}
            className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center"
          >
            {showVideo ? (
              <ChevronUp className="w-5 h-5 text-black" />
            ) : (
              <Play className="w-5 h-5 text-black" />
            )}
          </button>
        )}
      </div>

      {/* Calories & Fat Burn Info */}
      {(exercise.calories || exercise.fat) && (
        <div className={`flex gap-4 mt-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {exercise.calories && (
            <div className={`flex items-center gap-1.5 bg-orange-500/10 px-3 py-1.5 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-orange-500 text-sm font-medium">{t('burns')} {exercise.calories} {t('kcal')}</span>
            </div>
          )}
          {exercise.fat && (
            <div className={`flex items-center gap-1.5 bg-blue-500/10 px-3 py-1.5 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Droplet className="w-4 h-4 text-blue-500" />
              <span className="text-blue-500 text-sm font-medium">{exercise.fat}g {t('fat')}</span>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {showVideo && exercise.gif_url && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-xl overflow-hidden bg-zinc-800 relative min-h-[200px] flex items-center justify-center">
              {exercise.gif_url.match(/\.(mp4|webm|mov)$/) ? (
                <video
                  src={exercise.gif_url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                />
              ) : (
                <img
                  src={exercise.gif_url}
                  alt={exercise.name}
                  className="w-full h-auto"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop';
                    target.className = "w-full h-48 object-cover opacity-50 grayscale";
                  }}
                />
              )}
            </div>
            {exercise.description && (
              <p className={`mt-3 text-zinc-400 text-sm ${isRTL ? 'text-right' : ''}`}>{exercise.description}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}