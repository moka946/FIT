import React, { useState } from 'react';
import { Utensils } from 'lucide-react';
import { motion } from 'framer-motion';
import BottomNav from '@/components/navigation/BottomNav';
import FooterCredit from '@/components/FooterCredit';
import MealCard from '@/components/meals/MealCard';
import { useLanguage } from '@/components/LanguageContext';

const egyptianMeals = [
  // Breakfast Options
  {
    name: 'Ful Medames (High Protein)',
    titleKey: 'meal_ful',
    meal_type: 'Breakfast',
    calories: 220,
    protein: 15,
    carbs: 28,
    fats: 6,
    image_url: '/meal-images/full.jpg',
    portion_size: '200g (cooked), approx 1 cup',
    how_much_to_eat: 'Eat half a bowl to stay lean, or a full bowl if bulking.',
    diet_tip: 'Use minimal olive oil (1 tsp) and add plenty of lemon/cumin to avoid extra fat.',
    ingredients: ['Fava beans', 'Lemon juice', '1 tsp Olive oil', 'Cumin', 'Garlic', 'Small Baladi bread (optional)'],
    instructions: 'Slow-cook fava beans, mash with cumin and lemon. Serve with a small piece of whole wheat bread.'
  },
  {
    name: "Baked Ta'ameya (Fit Falafel)",
    titleKey: 'meal_falafel',
    meal_type: 'Breakfast',
    calories: 180,
    protein: 10,
    carbs: 22,
    fats: 5,
    image_url: '/meal-images/falafel.jpg',
    portion_size: '3-4 medium pieces (approx 120g)',
    how_much_to_eat: '3 pieces is perfect for a diet. Avoid deep-frying at all costs.',
    diet_tip: 'Baking them instead of frying saves over 150 calories and 15g of fat!',
    ingredients: ['Crushed fava beans', 'Leek', 'Parsley', 'Baking soda', 'Little sesame (topping)'],
    instructions: 'Shape the mixture into discs and bake in the oven at 200C until golden brown.'
  },
  {
    name: "Shakshuka (Healthy Style)",
    titleKey: 'meal_shakshuka',
    meal_type: 'Breakfast',
    calories: 240,
    protein: 18,
    carbs: 12,
    fats: 14,
    image_url: '/meal-images/eggs.jpg',
    portion_size: '2 Large Eggs with sauce (approx 200g)',
    how_much_to_eat: 'Enjoy the whole portion as it is high in protein and low in carbs.',
    diet_tip: 'Use zero-calorie cooking spray or 1/2 tsp ghee for the onions.',
    ingredients: ['2 Eggs', 'Fresh tomatoes', 'Bell peppers', 'Onions', 'Chili (optional)'],
    instructions: 'Sauté vegetables until soft, crack eggs on top and cover until cooked.'
  },
  {
    name: "Areesh Cheese with Veggies",
    titleKey: 'meal_areesh',
    meal_type: 'Breakfast',
    calories: 150,
    protein: 24,
    carbs: 8,
    fats: 2,
    image_url: '/meal-images/gebna.jpg',
    portion_size: '150g cheese',
    how_much_to_eat: 'This is the ultimate fit breakfast. High protein, nearly zero fat.',
    diet_tip: 'Areesh cheese is the best choice for bodybuilders in Egypt.',
    ingredients: ['Egyptian Quraish cheese', 'Cucumber', 'Tomato', 'Cumin', 'Black seeds'],
    instructions: 'Mix the cheese with chopped cucumber and tomato. Sprinkle cumin.'
  },

  // Lunch Options
  {
    name: 'Grilled Chicken (Lean Egyptian Style)',
    titleKey: 'meal_chicken',
    meal_type: 'Lunch',
    calories: 320,
    protein: 45,
    carbs: 15,
    fats: 8,
    image_url: '/meal-images/chicken_rice.jpg',
    portion_size: '150g cooked breast',
    how_much_to_eat: 'Eat one large breast piece. Skip most of the rice to keep it low-carb.',
    diet_tip: 'Ask for "Mashwi" (grilled) and remove the skin before eating.',
    ingredients: ['Chicken breast marinated in onion juice', 'Tomato puree', 'Thyme', 'Yogurt'],
    instructions: 'Marinate then grill over charcoal or in an air-fryer.'
  },
  {
    name: 'Molokhia (Zero-Fat Stock)',
    titleKey: 'meal_molokhia',
    meal_type: 'Lunch',
    calories: 120,
    protein: 8,
    carbs: 15,
    fats: 3,
    image_url: '/meal-images/molokhya.jpg',
    portion_size: '250ml bowl',
    how_much_to_eat: 'You can drink a full bowl. It\'s very low in calories if made correctly.',
    diet_tip: 'Use skinless chicken stock and skip the excessive butter in the "Tasha" (garlic sizzle).',
    ingredients: ['Fresh Molokhia leaves', 'Minced garlic', 'Dry coriander', 'Lean chicken broth'],
    instructions: 'Cook in boiling broth. Sizzle garlic with coriander in minimal oil and add to pot.'
  },
  {
    name: 'Lentil Soup (The Diet King)',
    titleKey: 'meal_lentil',
    meal_type: 'Lunch',
    calories: 210,
    protein: 16,
    carbs: 35,
    fats: 1,
    image_url: '/meal-images/3ats.jpg',
    portion_size: '300ml large bowl',
    how_much_to_eat: 'Great for cold days. High fiber keeps you full for hours.',
    diet_tip: 'Do not add vermicelli (sha\'reya) or butter to keep it fit-friendly.',
    ingredients: ['Yellow lentils', 'Carrots', 'Onions', 'Celery', 'Cumin'],
    instructions: 'Boil all together, blend until smooth, and season with cumin.'
  },
  {
    name: 'Baked Sayadeya Fish',
    titleKey: 'meal_fish',
    meal_type: 'Lunch',
    calories: 280,
    protein: 38,
    carbs: 10,
    fats: 9,
    image_url: '/meal-images/koshary.jpg',
    portion_size: '200g Tilapia or Sea Bass',
    how_much_to_eat: 'Eat with 3-4 spoons of brown rice maximum.',
    diet_tip: 'Grilling or baking fish is 5x better than frying for heart health.',
    ingredients: ['Tilapia fish', 'Cumin', 'Garlic', 'Lemon', 'Tomato slices'],
    instructions: 'Marinate with garlic and cumin, bake with tomato and pepper slices.'
  },

  // Snacks
  {
    name: 'Greek Yogurt with 3 Dates',
    titleKey: 'meal_yogurt',
    meal_type: 'Snack',
    calories: 180,
    protein: 15,
    carbs: 25,
    fats: 2,
    image_url: '/meal-images/dates.jpg',
    portion_size: '150g yogurt + 3 dates',
    how_much_to_eat: 'Perfect mid-day snack. Natural sweet fix without the sugar spike.',
    diet_tip: 'Dates are energy-dense, stick to 3 pieces maximum.',
    ingredients: ['Low-fat yogurt', '3 Medjool dates', 'Cinnamon'],
    instructions: 'Mix chopped dates into yogurt and sprinkle cinnamon.'
  },
  {
    name: 'Lupin Beans (Termes)',
    titleKey: 'meal_termes',
    meal_type: 'Snack',
    calories: 120,
    protein: 12,
    carbs: 10,
    fats: 4,
    image_url: '/meal-images/nuts.jpg',
    portion_size: '100g (one cup)',
    how_much_to_eat: 'The healthiest roadside snack in Egypt. Eat freely!',
    diet_tip: 'Termes is incredibly high in protein and fiber. A true superfood.',
    ingredients: ['Boiled lupin beans', 'Cumin', 'Salt', 'Lemon'],
    instructions: 'Soak, boil, and season with lemon and cumin.'
  },
  {
    name: 'Grilled Corn (Durah)',
    titleKey: 'meal_corn',
    meal_type: 'Snack',
    calories: 150,
    protein: 4,
    carbs: 30,
    fats: 2,
    image_url: '/meal-images/banana.jpg',
    portion_size: '1 medium cob',
    how_much_to_eat: 'Eat one cob as a pre-workout carb source.',
    diet_tip: 'Corn is a complex carb. Don\'t add butter or extra salt.',
    ingredients: ['Fresh corn cob'],
    instructions: 'Grill over open flame or in the oven until charred.'
  },

  // Pre-Workout
  {
    name: 'Black Coffee with 3 Dates',
    titleKey: 'meal_coffee',
    meal_type: 'Pre-Workout',
    calories: 70,
    protein: 1,
    carbs: 18,
    fats: 0,
    image_url: '/meal-images/dates.jpg',
    portion_size: '1 Cup + 3 Dates',
    how_much_to_eat: 'Take 30 mins before your workout.',
    diet_tip: 'Caffeine + natural glucose = the ultimate natural pre-workout.',
    ingredients: ['Dark roasted coffee', '3 Dates'],
    instructions: 'Brew coffee and eat dates alongside it.'
  },
  {
    name: 'Oats with Milk and Honey',
    titleKey: 'meal_oats',
    meal_type: 'Pre-Workout',
    calories: 250,
    protein: 10,
    carbs: 45,
    fats: 4,
    image_url: '/meal-images/banana.jpg',
    portion_size: '50g oats + 150ml milk',
    how_much_to_eat: 'Good for long endurance or heavy leg days.',
    diet_tip: 'Use skimmed milk and only 1 tsp of honey.',
    ingredients: ['Oats', 'Low-fat milk', 'Honey', 'Cinnamon'],
    instructions: 'Boil oats with milk, top with honey and cinnamon.'
  }
];

const mealTypes = ['All', 'Breakfast', 'Dinner', 'Lunch', 'Snack', 'Pre-Workout', 'Post-Workout'];
const mealTypeKeys = {
  'All': 'all',
  'Breakfast': 'breakfast',
  'Dinner': 'dinner',
  'Lunch': 'lunch',
  'Snack': 'snack',
  'Pre-Workout': 'preWorkout',
  'Post-Workout': 'postWorkout'
};

export default function Meals() {
  const { t, isRTL } = useLanguage();
  const [selectedType, setSelectedType] = useState('Dinner');

  // Sort meals by type order when showing all
  const mealTypeOrder = { 'Breakfast': 1, 'Dinner': 2, 'Lunch': 3, 'Snack': 4, 'Pre-Workout': 5, 'Post-Workout': 6 };

  const filteredMeals = selectedType === 'All'
    ? [...egyptianMeals].sort((a, b) => mealTypeOrder[a.meal_type] - mealTypeOrder[b.meal_type])
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
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
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