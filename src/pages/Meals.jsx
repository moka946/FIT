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
    name: 'Ful Medames',
    meal_type: 'Breakfast',
    calories: 310,
    protein: 16,
    carbs: 35,
    fats: 12,
    image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
    ingredients: ['Fava beans (ful)', 'Olive oil', 'Cumin', 'Lemon', 'Garlic', 'Baladi bread'],
    instructions: 'Mash fava beans with cumin, garlic, and olive oil. Serve with warm baladi bread.'
  },
  {
    name: "Ta'ameya (Egyptian Falafel)",
    meal_type: 'Breakfast',
    calories: 333,
    protein: 13,
    carbs: 31,
    fats: 18,
    image_url: 'https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?w=400',
    ingredients: ['Fava beans', 'Fresh herbs', 'Onions', 'Garlic', 'Spices', 'Baladi bread'],
    instructions: 'Blend fava beans with herbs and spices. Deep fry until golden. Serve in bread with tahini.'
  },
  {
    name: 'Feteer Meshaltet',
    meal_type: 'Breakfast',
    calories: 450,
    protein: 10,
    carbs: 52,
    fats: 24,
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    ingredients: ['Flour', 'Ghee', 'Eggs', 'Honey or cheese'],
    instructions: 'Layer thin dough with ghee, fold and bake until golden and flaky. Serve with honey or cheese.'
  },
  {
    name: "Beyd b'Basal (Eggs with Onions)",
    meal_type: 'Breakfast',
    calories: 280,
    protein: 14,
    carbs: 10,
    fats: 20,
    image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400',
    ingredients: ['Eggs', 'Onions', 'Ghee', 'Salt', 'Black pepper'],
    instructions: 'Caramelize onions in ghee until golden, add beaten eggs and scramble together.'
  },
  {
    name: "Gebna Ma'a Tomatem (Cheese with Tomatoes)",
    meal_type: 'Breakfast',
    calories: 250,
    protein: 12,
    carbs: 8,
    fats: 18,
    image_url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400',
    ingredients: ['Egyptian white cheese', 'Fresh tomatoes', 'Olive oil', 'Mint', 'Baladi bread'],
    instructions: 'Slice cheese and tomatoes, drizzle with olive oil and sprinkle with mint. Serve with bread.'
  },

  // Dinner Options
  {
    name: 'Hawawshi',
    meal_type: 'Dinner',
    calories: 350,
    protein: 22,
    carbs: 32,
    fats: 16,
    image_url: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400',
    ingredients: ['Ground beef', 'Onions', 'Peppers', 'Spices', 'Baladi bread'],
    instructions: 'Stuff bread with spiced minced meat mixture, bake until crispy and meat is cooked through.'
  },
  {
    name: 'Kebda Eskandarani (Alexandrian Liver)',
    meal_type: 'Dinner',
    calories: 370,
    protein: 35,
    carbs: 20,
    fats: 17,
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
    ingredients: ['Beef liver', 'Bell peppers', 'Garlic', 'Cumin', 'Chili', 'Baladi bread'],
    instructions: 'Slice liver thin, sauté with peppers and spices until just cooked. Serve in sandwiches.'
  },
  {
    name: 'Shawerma (Egyptian Style)',
    meal_type: 'Dinner',
    calories: 420,
    protein: 32,
    carbs: 35,
    fats: 18,
    image_url: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400',
    ingredients: ['Chicken or beef', 'Spices', 'Onions', 'Tahini', 'Pickles', 'Bread'],
    instructions: 'Marinate meat in spices, grill and slice thin. Serve in bread with tahini and pickles.'
  },
  {
    name: "Sogo' Sandwiches (Sausage)",
    meal_type: 'Dinner',
    calories: 380,
    protein: 18,
    carbs: 30,
    fats: 22,
    image_url: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400',
    ingredients: ['Egyptian sausages', 'Tomatoes', 'Peppers', 'Tahini', 'Baladi bread'],
    instructions: 'Grill sausages with peppers and tomatoes. Serve in bread with tahini sauce.'
  },
  {
    name: 'Fried Chicken with Rice',
    meal_type: 'Dinner',
    calories: 520,
    protein: 38,
    carbs: 45,
    fats: 22,
    image_url: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400',
    ingredients: ['Chicken pieces', 'Egyptian spices', 'Rice', 'Vegetables'],
    instructions: 'Season and fry chicken until golden and crispy. Serve with vermicelli rice.'
  },

  // Lunch Options
  {
    name: 'Koshary',
    meal_type: 'Lunch',
    calories: 460,
    protein: 16,
    carbs: 70,
    fats: 12,
    image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
    ingredients: ['Rice', 'Lentils', 'Macaroni', 'Chickpeas', 'Tomato sauce', 'Crispy onions', 'Vinegar garlic sauce'],
    instructions: 'Layer rice, lentils, and pasta. Top with spicy tomato sauce and crispy onions.'
  },
  {
    name: 'Molokhia with Chicken',
    meal_type: 'Lunch',
    calories: 420,
    protein: 42,
    carbs: 35,
    fats: 14,
    image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400',
    ingredients: ['Molokhia leaves', 'Chicken', 'Garlic', 'Coriander', 'White rice'],
    instructions: 'Cook molokhia with garlic sauce. Serve over rice with tender chicken pieces.'
  },
  {
    name: 'Mahshi (Stuffed Vegetables)',
    meal_type: 'Lunch',
    calories: 339,
    protein: 8,
    carbs: 59,
    fats: 8,
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
    ingredients: ['Bell peppers', 'Zucchini', 'Grape leaves', 'Rice filling', 'Tomato sauce', 'Herbs'],
    instructions: 'Stuff vegetables with herbed rice mixture. Cook in tomato broth until tender.'
  },
  {
    name: 'Fatta',
    meal_type: 'Lunch',
    calories: 580,
    protein: 38,
    carbs: 52,
    fats: 24,
    image_url: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=800',
    ingredients: ['Lamb or beef', 'Rice', 'Crispy bread', 'Garlic vinegar sauce', 'Tomato sauce'],
    instructions: 'Layer crispy bread with rice and tender meat. Top with garlic vinegar and tomato sauce.'
  },
  {
    name: 'Grilled Kofta with Rice',
    meal_type: 'Lunch',
    calories: 520,
    protein: 32,
    carbs: 45,
    fats: 23,
    image_url: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800',
    ingredients: ['Ground beef kofta', 'Egyptian rice', 'Grilled vegetables', 'Tahini sauce', 'Fresh salad'],
    instructions: 'Grill kofta skewers over charcoal. Serve with vermicelli rice and grilled tomatoes.'
  },

  // Snacks
  {
    name: 'Greek Yogurt with Dates',
    meal_type: 'Snack',
    calories: 230,
    protein: 21,
    carbs: 33,
    fats: 2,
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
    ingredients: ['Greek yogurt', 'Medjool dates', 'Almonds', 'Honey'],
    instructions: 'Top yogurt with chopped dates and almonds. Drizzle with honey.'
  },
  {
    name: 'Mixed Nuts and Dried Fruits',
    meal_type: 'Snack',
    calories: 280,
    protein: 8,
    carbs: 24,
    fats: 18,
    image_url: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=800',
    ingredients: ['Almonds', 'Walnuts', 'Dried apricots', 'Dates', 'Hazelnuts'],
    instructions: 'Mix your favorite nuts and dried fruits. Great for sustained energy!'
  },
  {
    name: 'Baba Ganoush with Veggies',
    meal_type: 'Snack',
    calories: 165,
    protein: 4,
    carbs: 12,
    fats: 12,
    image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db06?w=800',
    ingredients: ['Roasted eggplant', 'Tahini', 'Garlic', 'Lemon', 'Fresh vegetables'],
    instructions: 'Blend roasted eggplant with tahini and garlic. Serve with cucumber and carrot sticks.'
  },
  {
    name: 'Hummus with Pita',
    meal_type: 'Snack',
    calories: 195,
    protein: 8,
    carbs: 22,
    fats: 10,
    image_url: 'https://images.unsplash.com/photo-1577906030551-5b916ebca73e?w=800',
    ingredients: ['Chickpeas', 'Tahini', 'Lemon', 'Garlic', 'Pita bread'],
    instructions: 'Blend chickpeas with tahini and lemon. Serve with warm pita triangles.'
  },
  {
    name: 'Fresh Fruit Plate',
    meal_type: 'Snack',
    calories: 120,
    protein: 2,
    carbs: 28,
    fats: 1,
    image_url: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400',
    ingredients: ['Watermelon', 'Mango', 'Grapes', 'Pomegranate', 'Orange'],
    instructions: 'Slice and arrange seasonal Egyptian fruits on a plate.'
  },

  // Pre-Workout
  {
    name: 'Banana Oat Smoothie',
    meal_type: 'Pre-Workout',
    calories: 320,
    protein: 12,
    carbs: 52,
    fats: 8,
    image_url: 'https://images.unsplash.com/photo-1571115160391-45f8f87e83e9?w=800',
    ingredients: ['Banana', 'Oats', 'Milk', 'Honey', 'Cinnamon'],
    instructions: 'Blend all ingredients until smooth. Drink 30-45 minutes before workout.'
  },
  {
    name: 'Baladi Bread with Honey',
    meal_type: 'Pre-Workout',
    calories: 265,
    protein: 6,
    carbs: 48,
    fats: 5,
    image_url: 'https://images.unsplash.com/photo-1599321955726-e04842a394bb?w=800',
    ingredients: ['Egyptian baladi bread', 'Raw honey', 'Banana slices'],
    instructions: 'Spread honey on warm bread, top with banana. Quick energy boost!'
  },
  {
    name: 'Dates and Almonds',
    meal_type: 'Pre-Workout',
    calories: 210,
    protein: 5,
    carbs: 32,
    fats: 9,
    image_url: 'https://images.unsplash.com/photo-1596567130026-6239bc7a6acb?w=800',
    ingredients: ['Medjool dates', 'Raw almonds'],
    instructions: 'Eat 3-4 dates with a handful of almonds 30 minutes before training.'
  },

  // Post-Workout
  {
    name: 'Chicken Shawarma Bowl',
    meal_type: 'Post-Workout',
    calories: 450,
    protein: 45,
    carbs: 38,
    fats: 14,
    image_url: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400',
    ingredients: ['Chicken shawarma', 'Rice', 'Pickles', 'Garlic sauce', 'Tomatoes', 'Onions'],
    instructions: 'Layer rice with shawarma chicken, top with pickles and garlic sauce. Protein-packed recovery meal!'
  },
  {
    name: 'Lentil Soup with Bread',
    meal_type: 'Post-Workout',
    calories: 245,
    protein: 15,
    carbs: 41,
    fats: 3,
    image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
    ingredients: ['Red lentils', 'Onions', 'Cumin', 'Lemon', 'Baladi bread'],
    instructions: 'Cook lentils until soft, blend smooth. Serve with cumin oil and crispy bread.'
  },
  {
    name: 'Grilled Chicken with Sweet Potato',
    meal_type: 'Post-Workout',
    calories: 410,
    protein: 40,
    carbs: 42,
    fats: 8,
    image_url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400',
    ingredients: ['Chicken breast', 'Sweet potato', 'Olive oil', 'Herbs'],
    instructions: 'Grill chicken and roast sweet potato. Perfect post-workout combo for muscle recovery.'
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