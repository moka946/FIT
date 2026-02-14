import React, { useState } from 'react';
import { Flame, Beef, Wheat, Droplet, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MealCard({ meal, index }) {
  const [expanded, setExpanded] = useState(false);
  const isSnack = meal.meal_type === 'Snack';

  // Compact card for snacks
  if (isSnack) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 flex items-center gap-3 p-3"
      >
        {meal.image_url && (
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={(import.meta.env.BASE_URL + meal.image_url).replace(/\/+/g, '/')}
              alt={meal.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm truncate">{meal.name}</h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-orange-500 text-xs font-medium">{meal.calories} kcal</span>
            <span className="text-zinc-500 text-xs">{meal.protein}g protein</span>
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
        <div className="h-40 w-full overflow-hidden">
          <img
            src={(import.meta.env.BASE_URL + meal.image_url).replace(/\/+/g, '/')}
            alt={meal.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-orange-500 uppercase tracking-wider">
              {meal.meal_type}
            </span>
            <h3 className="text-white font-bold text-lg mt-1">{meal.name}</h3>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center"
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-zinc-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 mt-4">
          <div className="bg-zinc-800/50 rounded-xl p-2 text-center">
            <Flame className="w-4 h-4 text-orange-500 mx-auto mb-1" />
            <p className="text-white font-bold text-sm">{meal.calories || 0}</p>
            <p className="text-zinc-500 text-xs">kcal</p>
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-2 text-center">
            <Beef className="w-4 h-4 text-red-500 mx-auto mb-1" />
            <p className="text-white font-bold text-sm">{meal.protein || 0}g</p>
            <p className="text-zinc-500 text-xs">Protein</p>
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-2 text-center">
            <Wheat className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
            <p className="text-white font-bold text-sm">{meal.carbs || 0}g</p>
            <p className="text-zinc-500 text-xs">Carbs</p>
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-2 text-center">
            <Droplet className="w-4 h-4 text-blue-500 mx-auto mb-1" />
            <p className="text-white font-bold text-sm">{meal.fats || 0}g</p>
            <p className="text-zinc-500 text-xs">Fats</p>
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
              {meal.ingredients?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-zinc-400 text-sm font-medium mb-2">Ingredients</h4>
                  <ul className="space-y-1">
                    {meal.ingredients.map((ing, i) => (
                      <li key={i} className="text-white text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {meal.instructions && (
                <div className="mt-4">
                  <h4 className="text-zinc-400 text-sm font-medium mb-2">How to prepare</h4>
                  <p className="text-zinc-300 text-sm">{meal.instructions}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}