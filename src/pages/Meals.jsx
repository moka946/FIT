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
    name: "Ful Medames (Ultra Lean)",
    nameAr: "فول مدمس خفيف (بدون زيت)",
    titleKey: "meal_ful",
    meal_type: "Breakfast",
    calories: 180,
    protein: 14,
    carbs: 20,
    fats: 2,
    image_url: "/meal-images/full.jpg",
    portion_size: "150g (boiled)",
    portion_size_ar: "150 جرام (مسلوق)",
    how_much_to_eat: "Eat half a bowl. Use 1/4 whole wheat bread maximum.",
    how_much_to_eat_ar: "نصف طبق فقط مع ربع رغيف خبز أسمر بحد أقصى.",
    diet_tip: "Zero Oil. Add lemon, cumin, and chopped parsley for flavor.",
    diet_tip_ar: "بدون زيت تماماً. استخدم الليمون والكمون والبقدونس للنكهة.",
    ingredients: ["Fava beans", "Lemon", "Cumin", "Garlic", "1/4 Baladi bread"],
    ingredients_ar: ["فول مدمس", "ليمون", "كمون", "ثوم", "ربع رغيف بلدي"],
    instructions: "Boil beans, mash with lemon and spices. No oil added.",
    instructions_ar: "قم بسلق الفول، وهرسه مع الليمون والبهارات. لا تضف أي زيت."
  },
  {
    name: "Low-Fat Areesh Cheese",
    nameAr: "جبنة قريش دايت",
    titleKey: "meal_areesh",
    meal_type: "Breakfast",
    calories: 120,
    protein: 26,
    carbs: 4,
    fats: 1,
    image_url: "/meal-images/gebna.jpg",
    portion_size: "200g",
    portion_size_ar: "200 جرام",
    how_much_to_eat: "Best fit breakfast. Eat the full portion.",
    how_much_to_eat_ar: "أفضل فطور صحي. يمكنك تناول الحصة كاملة.",
    diet_tip: "Top with lots of cucumber and green pepper to feel full.",
    diet_tip_ar: "ضع الكثير من الخيار والفلفل الأخضر للشعور بالشبع.",
    ingredients: ["200g Quraish cheese", "Cucumber", "Green pepper", "Black seeds"],
    ingredients_ar: ["200 جرام جبنة قريش", "خيار", "فلفل أخضر", "حبة البركة"],
    instructions: "Mix cheese with vegetables. Avoid adding any oil or cream.",
    instructions_ar: "اخلط الجبنة مع الخضار المقطع. تجنب إضافة الزيت أو القشطة."
  },

  // Lunch - High Protein & Lean
  {
    name: "Grilled Chicken Breast (Lean)",
    nameAr: "صدور دجاج مشوية (بدون دهون)",
    titleKey: "meal_chicken",
    meal_type: "Lunch",
    calories: 260,
    protein: 50,
    carbs: 0,
    fats: 4,
    image_url: "/meal-images/chicken_rice.jpg",
    portion_size: "200g breast",
    portion_size_ar: "200 جرام صدور",
    how_much_to_eat: "One large breast. Skip the rice for faster fat loss.",
    how_much_to_eat_ar: "صدر دجاج كبير. تجنب الأرز لخسارة دهون أسرع.",
    diet_tip: "Remove all skin and visible fat before grilling.",
    diet_tip_ar: "قم بإزالة الجلد وأي دهون مرئية قبل الشوي.",
    ingredients: ["Skinless chicken breast", "Onion water", "Thyme", "Black pepper"],
    ingredients_ar: ["صدر دجاج بدون جلد", "ماء بصل", "زعتر", "فلفل أسود"],
    instructions: "Marinate in onion water and spices. Grill over charcoal or in oven.",
    instructions_ar: "تبل الدجاج في ماء البصل والبهارات ثم اشوه في الفرن أو على الفحم."
  },
  {
    name: "Baked Sea Bass or Tilapia",
    nameAr: "سمك مشوي في الفرن",
    titleKey: "meal_fish",
    meal_type: "Lunch",
    calories: 220,
    protein: 42,
    carbs: 0,
    fats: 6,
    image_url: "/meal-images/koshary.jpg",
    portion_size: "250g fish",
    portion_size_ar: "250 جرام سمك",
    how_much_to_eat: "Eat one large fish with a huge green salad.",
    how_much_to_eat_ar: "تناول سمكة كبيرة مع طبق سلطة خضراء كبير.",
    diet_tip: "Baking is much cleaner than frying. No flour coating.",
    diet_tip_ar: "الخبز في الفرن أنظف بكثير من القلي. لا تستخدم الدقيق.",
    ingredients: ["Tilapia or Sea Bass", "Garlic", "Lemon", "Cumin", "Bell pepper"],
    ingredients_ar: ["سمك بلطي أو قاروص", "ثوم", "ليمون", "كمون", "فلفل ألوان"],
    instructions: "Marinate with garlic/lemon, bake with peppers and onion slices.",
    instructions_ar: "تبل السمك بالثوم والليمون واخبزه مع شرائح الفلفل والبصل."
  },

  // Dinner - Light
  {
    name: "Fit Egg White Omelet",
    nameAr: "أومليت بياض البيض",
    titleKey: "meal_egg_whites",
    meal_type: "Dinner",
    calories: 130,
    protein: 26,
    carbs: 2,
    fats: 1,
    image_url: "/meal-images/eggs.jpg",
    portion_size: "6 Egg whites",
    portion_size_ar: "بياض 6 بيضات",
    how_much_to_eat: "Perfect light dinner for muscle definition.",
    how_much_to_eat_ar: "عشاء خفيف مثالي لتقسيم العضلات.",
    diet_tip: "Use zero yolk for zero cholesterol and minimal fat.",
    diet_tip_ar: "بدون صفار لتقليل الكوليسترول والدهون تماماً.",
    ingredients: ["6 Egg whites", "Fresh spinach", "Salt", "Mushrooms"],
    ingredients_ar: ["بياض 6 بيضات", "سبانخ طازجة", "ملح", "مشروم"],
    instructions: "Cook with a drop of vinegar to remove egg smell. Use non-stick pan.",
    instructions_ar: "اطبخه في طاسة غير لاصقة مع نقطة خل لإزالة الرائحة."
  },
  {
    name: "Lean Egyptian Tuna Salad",
    nameAr: "سلطة تونة مصرية (دايت)",
    titleKey: "meal_tuna",
    meal_type: "Dinner",
    calories: 170,
    protein: 35,
    carbs: 5,
    fats: 2,
    image_url: "/meal-images/nuts.jpg",
    portion_size: "1 can (drained)",
    portion_size_ar: "علبة تونة (مصفاة)",
    how_much_to_eat: "Eat directly with a fork. No bread.",
    how_much_to_eat_ar: "تناولها بالشوكة مباشرة بدون خبز.",
    diet_tip: "Wash tuna with vinegar and water to remove excess sodium and oil.",
    diet_tip_ar: "اغسل التونة بالخل والماء لإزالة الصوديوم والزيوت الزائدة.",
    ingredients: ["Canned tuna in water", "Onion", "Vinegar", "Chili", "Celery"],
    ingredients_ar: ["تونة قطع في محلول ملحي", "بصل", "خل", "شطة", "كرفس"],
    instructions: "Drain water/oil, mix with chopped veggies and vinegar.",
    instructions_ar: "صفِّ التونة تماماً واخلطها مع الخضار المقطع والخل."
  },

  // Post-Workout - Recovery
  {
    name: "Post-Workout Chicken & Rice",
    nameAr: "وجبة دجاج وأرز بعد التمرين",
    titleKey: "meal_post_chicken",
    meal_type: "Post-Workout",
    calories: 360,
    protein: 45,
    carbs: 42,
    fats: 3,
    image_url: "/meal-images/chicken_rice.jpg",
    portion_size: "150g Chicken + 100g Rice",
    portion_size_ar: "150 جم دجاج + 100 جم أرز",
    how_much_to_eat: "Take within 60 mins of finishing your workout.",
    how_much_to_eat_ar: "تناولها خلال 60 دقيقة من نهاية التمرين.",
    diet_tip: "Steamed rice only. No butter or oil in the rice.",
    diet_tip_ar: "أرز مسلوق أو على البخار فقط بدون أي زيت أو سمن.",
    ingredients: ["Grilled chicken breast", "Steamed white rice", "Cinnamon"],
    ingredients_ar: ["صدر دجاج مشوي", "أرز أبيض مسلوق", "قرفة"],
    instructions: "Serve grilled chicken over steamed rice for fast recovery.",
    instructions_ar: "قدم الدجاج المشوي مع الأرز المسلوق لسرعة الاستشفاء."
  },
  {
    name: "Whey Protein Shake",
    nameAr: "مخفوق بروتين (واي بروتين)",
    titleKey: "meal_protein_shake",
    meal_type: "Post-Workout",
    calories: 120,
    protein: 24,
    carbs: 3,
    fats: 1,
    image_url: "/meal-images/dates.jpg",
    portion_size: "1 Scoop",
    portion_size_ar: "سكوب واحد",
    how_much_to_eat: "Best consumed immediately after training.",
    how_much_to_eat_ar: "يفضل تناوله مباشرة بعد التمرين.",
    diet_tip: "Use skimmed milk or water to keep calories minimal.",
    diet_tip_ar: "استخدم الماء أو حليب خالي الدسم لتقليل السعرات.",
    ingredients: ["Whey Protein Scoop", "300ml Water/Skimmed Milk"],
    ingredients_ar: ["سكوب واي بروتين", "300 مل ماء أو حليب خالي الدسم"],
    instructions: "Mix in a shaker and drink immediately.",
    instructions_ar: "اخلطه في الشيكر واشربه فوراً."
  },

  // Snacks & Pre-Workout
  {
    name: "Boiled Lupin Beans (Termes)",
    nameAr: "ترمس مسلوق (سناك البروتين)",
    titleKey: "meal_termes",
    meal_type: "Snack",
    calories: 120,
    protein: 12,
    carbs: 10,
    fats: 4,
    image_url: "/meal-images/nuts.jpg",
    portion_size: "1 Cup",
    portion_size_ar: "كوب واحد",
    how_much_to_eat: "Great high-protein snack for the evening.",
    how_much_to_eat_ar: "سناك ممتاز عالي البروتين لفترة المساء.",
    diet_tip: "Use low salt to avoid water bloating.",
    diet_tip_ar: "قلل الملح لتجنب احتباس السوائل في الجسم.",
    ingredients: ["Lupin beans", "Cumin", "Lemon juice"],
    ingredients_ar: ["ترمس", "كمون", "عصير ليمون"],
    instructions: "Boil until soft, season with cumin and lemon.",
    instructions_ar: "اسلق الترمس حتى ينضج ثم تبله بالكمون والليمون."
  },
  {
    name: "Pre-Workout Coffee & Dates",
    nameAr: "قهوة وتمر قبل التمرين",
    titleKey: "meal_coffee",
    meal_type: "Pre-Workout",
    calories: 60,
    protein: 1,
    carbs: 15,
    fats: 0,
    image_url: "/meal-images/dates.jpg",
    portion_size: "Coffee + 2 Dates",
    portion_size_ar: "قهوة +  تمرتين",
    how_much_to_eat: "30 mins before your training session.",
    how_much_to_eat_ar: "قبل جلسة التمرين بـ 30 دقيقة.",
    diet_tip: "Dates provide natural energy boost for your muscles.",
    diet_tip_ar: "التمر يوفر طاقة طبيعية فورية لعضلاتك.",
    ingredients: ["Black Coffee (Plain)", "2 Medjool Dates"],
    ingredients_ar: ["قهوة سادة", "2 تمرة"],
    instructions: "Brew coffee and have with dates for energy jump.",
    instructions_ar: "حضر القهوة وتناولها مع التمر لطاقة تفجيرية."
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
  const { t, isRTL, language } = useLanguage();
  const [selectedType, setSelectedType] = useState("All");

  // Sort meals by type order when showing all
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