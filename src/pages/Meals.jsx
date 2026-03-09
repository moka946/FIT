import React, { useState } from 'react';
import { Utensils } from 'lucide-react';
import { motion } from 'framer-motion';
import BottomNav from '@/components/navigation/BottomNav';
import FooterCredit from '@/components/FooterCredit';
import MealCard from '@/components/meals/MealCard';
import { useLanguage } from '@/components/LanguageContext';

const egyptianMeals = [
  // Breakfast - Ultra Lean
  {
    titleKey: "meal_ful",
    portionKey: "meal_ful_portion",
    howMuchKey: "meal_ful_how",
    tipKey: "meal_ful_tip",
    ingredientsKey: "meal_ful_ingredients",
    instructionsKey: "meal_ful_instr",
    meal_type: "Breakfast",
    calories: 180, protein: 14, carbs: 20, fats: 2,
    image_url: "https://eatwellabi.com/wp-content/uploads/2022/06/Ful-Medame-13.jpg"
  },
  {
    titleKey: "meal_areesh",
    portionKey: "meal_areesh_portion",
    howMuchKey: "meal_areesh_how",
    tipKey: "meal_areesh_tip",
    ingredientsKey: "meal_areesh_ingredients",
    instructionsKey: "meal_areesh_instr",
    meal_type: "Breakfast",
    calories: 120, protein: 26, carbs: 4, fats: 1,
    image_url: "https://www.seductioninthekitchen.com/wp-content/uploads/2017/08/Egyptian-Feta-Cucumber-Salad-1.jpg"
  },

  // Lunch - High Protein & Lean
  {
    titleKey: "meal_chicken",
    portionKey: "meal_chicken_portion",
    howMuchKey: "meal_chicken_how",
    tipKey: "meal_chicken_tip",
    ingredientsKey: "meal_chicken_ingredients",
    instructionsKey: "meal_chicken_instr",
    meal_type: "Lunch",
    calories: 260, protein: 50, carbs: 0, fats: 4,
    image_url: "https://healthyfitnessmeals.com/wp-content/uploads/2018/06/grilled-chicken-shish-tawook-9.jpg"
  },
  {
    titleKey: "meal_fish",
    portionKey: "meal_fish_portion",
    howMuchKey: "meal_fish_how",
    tipKey: "meal_fish_tip",
    ingredientsKey: "meal_fish_ingredients",
    instructionsKey: "meal_fish_instr",
    meal_type: "Lunch",
    calories: 220, protein: 42, carbs: 0, fats: 6,
    image_url: "https://scarfgalfood.com/wp-content/uploads/2015/05/screen-shot-2015-05-26-at-1-26-17-pm.png"
  },

  // Dinner - Light
  {
    titleKey: "meal_egg_whites",
    portionKey: "meal_egg_whites_portion",
    howMuchKey: "meal_egg_whites_how",
    tipKey: "meal_egg_whites_tip",
    ingredientsKey: "meal_egg_whites_ingredients",
    instructionsKey: "meal_egg_whites_instr",
    meal_type: "Dinner",
    calories: 130, protein: 26, carbs: 2, fats: 1,
    image_url: "https://www.eatingbirdfood.com/wp-content/uploads/2023/01/egg-white-omelette-hero.jpg"
  },
  {
    titleKey: "meal_tuna",
    portionKey: "meal_tuna_portion",
    howMuchKey: "meal_tuna_how",
    tipKey: "meal_tuna_tip",
    ingredientsKey: "meal_tuna_ingredients",
    instructionsKey: "meal_tuna_instr",
    meal_type: "Dinner",
    calories: 170, protein: 35, carbs: 5, fats: 2,
    image_url: "https://www.themediterraneandish.com/wp-content/uploads/2021/05/Mediterranean-Tuna-Salad-5.jpg"
  },

  // Post-Workout - Recovery
  {
    titleKey: "meal_post_chicken",
    portionKey: "meal_post_chicken_portion",
    howMuchKey: "meal_post_chicken_how",
    tipKey: "meal_post_chicken_tip",
    ingredientsKey: "meal_post_chicken_ingredients",
    instructionsKey: "meal_post_chicken_instr",
    meal_type: "Post-Workout",
    calories: 360, protein: 45, carbs: 42, fats: 3,
    image_url: "https://healthyfitnessmeals.com/wp-content/uploads/2021/01/Honey-garlic-chicken-and-rice.jpg"
  },
  {
    titleKey: "meal_protein_shake",
    portionKey: "meal_protein_shake_portion",
    howMuchKey: "meal_protein_shake_how",
    tipKey: "meal_protein_shake_tip",
    ingredientsKey: "meal_protein_shake_ingredients",
    instructionsKey: "meal_protein_shake_instr",
    meal_type: "Post-Workout",
    calories: 120, protein: 24, carbs: 3, fats: 1,
    image_url: "https://images.unsplash.com/photo-1593095191850-2a763396707a?auto=format&fit=crop&q=80&w=1000"
  },

  // Snacks & Pre-Workout
  {
    titleKey: "meal_termes",
    portionKey: "meal_termes_portion",
    howMuchKey: "meal_termes_how",
    tipKey: "meal_termes_tip",
    ingredientsKey: "meal_termes_ingredients",
    instructionsKey: "meal_termes_instr",
    meal_type: "Snack",
    calories: 120, protein: 12, carbs: 10, fats: 4,
    image_url: "https://cheznermine.com/wp-content/uploads/2021/02/Egyptian-Termes-Lupini-Beans-Snack-%D8%AA%D8%B1%D9%85%D8%B3-scaled.jpg"
  },
  {
    titleKey: "meal_coffee",
    portionKey: "meal_coffee_portion",
    howMuchKey: "meal_coffee_how",
    tipKey: "meal_coffee_tip",
    ingredientsKey: "meal_coffee_ingredients",
    instructionsKey: "meal_coffee_instr",
    meal_type: "Pre-Workout",
    calories: 60, protein: 1, carbs: 15, fats: 0,
    image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1000"
  }
];

const mealTypes = ["All", "Breakfast", "Lunch", "Dinner", "Snack", "Pre-Workout", "Post-Workout"];
const mealTypeKeys = {
  "All": "all",
  "Breakfast": "breakfast",
  "Dinner": "dinner",
  "Lunch": "lunch",
  "Snack": "snack",
  "Pre-Workout": "preWorkout",
  "Post-Workout": "postWorkout"
};

export default function Meals() {
  const { t, isRTL } = useLanguage();
  const [selectedType, setSelectedType] = useState("All");

  const mealTypeOrder = { "Breakfast": 1, "Lunch": 2, "Dinner": 3, "Snack": 4, "Pre-Workout": 5, "Post-Workout": 6 };

  const filteredMeals = selectedType === "All"
    ? [...egyptianMeals].sort((a, b) => (mealTypeOrder[a.meal_type] || 99) - (mealTypeOrder[b.meal_type] || 99))
    : egyptianMeals.filter(meal => meal.meal_type === selectedType);

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-lg z-40 border-b border-zinc-800">
        <div className="px-6 py-4">
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <Utensils className="w-5 h-5 text-black" />
            </div>
            <div className={isRTL ? 'text-right' : ''}>
              <h1 className="text-xl font-bold text-white">{t('mealPlan')}</h1>
              <p className="text-zinc-500 text-sm">{t('egyptianMeals')}</p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-6 pb-4 overflow-x-auto scrollbar-hide">
          <div className={`flex gap-2 min-w-max ${isRTL ? 'flex-row-reverse' : ''}`}>
            {mealTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedType === type
                  ? 'bg-orange-500 text-black'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 shadow-lg'
                  }`}
              >
                {t(mealTypeKeys[type])}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Meals Grid */}
      <div className="px-6 py-4">
        <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h2 className="text-lg font-bold text-white">
            {selectedType === 'All' ? t('allMeals') : t(mealTypeKeys[selectedType])}
          </h2>
          <span className="text-zinc-500 text-sm">{filteredMeals.length} {t('options')}</span>
        </div>

        <div className="space-y-4">
          {filteredMeals.map((meal, index) => (
            <MealCard key={index} meal={meal} index={index} />
          ))}
        </div>
      </div>

      <FooterCredit />
      <BottomNav currentPage="Meals" />
    </div>
  );
}