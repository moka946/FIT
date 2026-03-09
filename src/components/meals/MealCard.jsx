import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Flame, Beef, Wheat, Droplet } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

const mealTypeKeys = {
  "Breakfast": "breakfast",
  "Dinner": "dinner",
  "Lunch": "lunch",
  "Snack": "snack",
  "Pre-Workout": "preWorkout",
  "Post-Workout": "postWorkout"
};

export default function MealCard({ meal, index }) {
  const [expanded, setExpanded] = useState(false);
  const { t, isRTL } = useLanguage();
  const isSnack = meal.meal_type === 'Snack';

  // Helper to get content from key or direct value
  const getContent = (key, fallback) => {
    if (key) return t(key);
    return fallback;
  };

  const display = {
    name: getContent(meal.titleKey, meal.name),
    portion: getContent(meal.portionKey, meal.portion_size),
    howMuch: getContent(meal.howMuchKey, meal.how_much_to_eat),
    tip: getContent(meal.tipKey, meal.diet_tip),
    ingredients: getContent(meal.ingredientsKey, meal.ingredients),
    instructions: getContent(meal.instructionsKey, meal.instructions)
  };

  if (isSnack) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 flex items-center gap-3 p-3 ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        {meal.image_url && (
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={meal.image_url.startsWith('http') ? meal.image_url : (import.meta.env.BASE_URL + meal.image_url).replace(/\/+/g, '/')}
              alt={display.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
          <h3 className="text-white font-semibold text-sm truncate">{display.name}</h3>
          <div className={`flex items-center gap-3 mt-1 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
            <span className="text-orange-500 text-xs font-medium">{meal.calories} {t('kcal')}</span>
            <span className="text-zinc-500 text-xs">{meal.protein}g {t('protein')}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800"
    >
      {meal.image_url && (
        <div className="h-48 w-full overflow-hidden relative">
          <img
            src={meal.image_url.startsWith('http') ? meal.image_url : (import.meta.env.BASE_URL + meal.image_url).replace(/\/+/g, '/')}
            alt={display.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-bottom p-4">
            <span className="self-end text-xs font-medium text-emerald-400 uppercase tracking-widest bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
              {t(mealTypeKeys[meal.meal_type] || meal.meal_type)}
            </span>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <h3 className="text-white font-bold text-xl">
              {display.name}
            </h3>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
          >
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-zinc-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-zinc-400" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 mt-4 text-center">
          <div className="bg-zinc-800/50 rounded-xl p-2 border border-zinc-700/50">
            <Flame className="w-4 h-4 text-orange-500 mx-auto mb-1" />
            <p className="text-white font-bold text-sm">{meal.calories || 0}</p>
            <p className="text-zinc-500 text-[10px]">{t('kcal')}</p>
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-2 border border-zinc-700/50">
            <Beef className="w-4 h-4 text-red-500 mx-auto mb-1" />
            <p className="text-white font-bold text-sm">{meal.protein || 0}g</p>
            <p className="text-zinc-500 text-[10px]">{t('protein')}</p>
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-2 border border-zinc-700/50">
            <Wheat className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
            <p className="text-white font-bold text-sm">{meal.carbs || 0}g</p>
            <p className="text-zinc-500 text-[10px]">{t('carbs')}</p>
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-2 border border-zinc-700/50">
            <Droplet className="w-4 h-4 text-blue-500 mx-auto mb-1" />
            <p className="text-white font-bold text-sm">{meal.fats || 0}g</p>
            <p className="text-zinc-500 text-[10px]">{t('fats')}</p>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-4">
                {display.portion && (
                  <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                    <h4 className="text-orange-500 text-xs font-bold uppercase tracking-wider mb-1">{t('portionSize')}</h4>
                    <p className="text-white text-sm font-medium">{display.portion}</p>
                  </div>
                )}

                {display.howMuch && (
                  <div>
                    <h4 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">{t('howMuchToEat')}</h4>
                    <p className={`text-zinc-300 text-sm ${isRTL ? 'text-right' : ''}`}>{display.howMuch}</p>
                  </div>
                )}

                {display.tip && (
                  <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <h4 className="text-emerald-500 text-xs font-bold uppercase tracking-wider mb-1">{t('dietTip')}</h4>
                    <p className="text-zinc-300 text-sm italic">"{display.tip}"</p>
                  </div>
                )}

                {display.ingredients && (
                  <div>
                    <h4 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">{t('ingredients')}</h4>
                    {Array.isArray(display.ingredients) ? (
                      <ul className="space-y-1">
                        {display.ingredients.map((ing, i) => (
                          <li key={i} className={`text-white text-sm flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            {ing}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={`text-zinc-300 text-sm ${isRTL ? 'text-right' : ''}`}>{display.ingredients}</p>
                    )}
                  </div>
                )}

                {display.instructions && (
                  <div>
                    <h4 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">{t('howToPrepare')}</h4>
                    <p className={`text-zinc-300 text-sm leading-relaxed ${isRTL ? 'text-right' : ''}`}>{display.instructions}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
