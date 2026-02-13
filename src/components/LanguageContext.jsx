import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

const translations = {
  en: {
    // Home
    welcomeBack: 'Welcome back,',
    champion: 'Champion 💪',
    dailyGoal: 'Daily Goal',
    stayConsistent: 'Stay Consistent!',
    quickActions: 'Quick Actions',
    todaysWorkout: "Today's Workout",
    buildMuscle: 'Build muscle & burn fat',
    mealPlan: 'Meal Plan',
    egyptianNutrition: 'Egyptian nutrition',
    askCoach: 'Ask Coach',
    aiTrainer: 'AI personal trainer',
    todaysMotivation: "TODAY'S MOTIVATION",
    motivationQuote: '"The only bad workout is the one that didn\'t happen."',

    // Navigation
    home: 'Home',
    workouts: 'Workouts',
    meals: 'Meals',
    coach: 'Coach',
    more: 'More',

    // More
    getYourPlan: 'Get Your Personal Plan',
    age: 'Age',
    height: 'Height (cm)',
    weight: 'Weight (kg)',
    generatePlan: 'Generate My Plan',
    generating: 'Creating your plan...',
    yourCustomPlan: 'Your Custom Plan',
    workoutPlan: 'Workout Plan',
    nutritionPlan: 'Nutrition Plan',

    // Workouts
    yourWeeklyPlan: 'Your weekly plan',
    today: 'Today',
    exercises: 'Exercises',
    restDay: 'Rest Day',
    restDayMsg: 'Recovery is part of the process. Let your muscles grow!',
    min: 'min',
    burns: 'Burns',
    kcal: 'kcal',
    fat: 'fat',
    sets: 'sets',

    // Meals
    egyptianMeals: 'Egyptian Nutrition',
    options: 'options',
    allMeals: 'All Meals',
    all: 'All',
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack',
    preWorkout: 'Pre-Workout',
    postWorkout: 'Post-Workout',
    ingredients: 'Ingredients',
    howToPrepare: 'How to prepare',
    protein: 'Protein',
    carbs: 'Carbs',
    fats: 'Fats',

    // Pre-workout tip
    preWorkoutTip: '🔥 Best Fat-Burning Pre-Workout Foods',
    preWorkoutFoods: 'Coffee, Green Tea, Oats, Bananas, Dates with Almonds',

    // Coach
    coachAI: 'Coach AI',
    online: 'Online',
    askCoachAnything: 'Ask Coach anything...',
    coachThinking: 'Coach is thinking...',
    listen: 'Listen',
    stop: 'Stop',

    // Days
    Sunday: 'Sunday',
    Monday: 'Monday',
    Tuesday: 'Tuesday',
    Wednesday: 'Wednesday',
    Thursday: 'Thursday',
    Friday: 'Friday',
    Saturday: 'Saturday',

    // Language
    language: 'Language',
    english: 'English',
    arabic: 'العربية',
    logout: 'Logout',
  },
  ar: {
    // Home
    welcomeBack: 'أهلاً بعودتك،',
    champion: 'يا بطل 💪',
    dailyGoal: 'هدف اليوم',
    stayConsistent: 'استمر بالتمرين!',
    quickActions: 'إجراءات سريعة',
    todaysWorkout: 'تمرين اليوم',
    buildMuscle: 'بناء العضلات وحرق الدهون',
    mealPlan: 'خطة الوجبات',
    egyptianNutrition: 'تغذية مصرية',
    askCoach: 'اسأل المدرب',
    aiTrainer: 'مدرب شخصي ذكي',
    todaysMotivation: 'تحفيز اليوم',
    motivationQuote: '"التمرين السيئ الوحيد هو التمرين الذي لم يحدث."',

    // Navigation
    home: 'الرئيسية',
    workouts: 'التمارين',
    meals: 'الوجبات',
    coach: 'المدرب',
    more: 'المزيد',

    // More
    getYourPlan: 'احصل على خطتك الشخصية',
    age: 'العمر',
    height: 'الطول (سم)',
    weight: 'الوزن (كجم)',
    generatePlan: 'إنشاء خطتي',
    generating: 'جاري إنشاء خطتك...',
    yourCustomPlan: 'خطتك المخصصة',
    workoutPlan: 'خطة التمرين',
    nutritionPlan: 'خطة التغذية',

    // Workouts
    yourWeeklyPlan: 'خطتك الأسبوعية',
    today: 'اليوم',
    exercises: 'التمارين',
    restDay: 'يوم راحة',
    restDayMsg: 'الراحة جزء من العملية. دع عضلاتك تنمو!',
    min: 'دقيقة',
    burns: 'يحرق',
    kcal: 'سعرة',
    fat: 'دهون',
    sets: 'مجموعات',

    // Meals
    egyptianMeals: 'تغذية مصرية',
    options: 'خيارات',
    allMeals: 'كل الوجبات',
    all: 'الكل',
    breakfast: 'فطور',
    lunch: 'غداء',
    dinner: 'عشاء',
    snack: 'سناك',
    preWorkout: 'قبل التمرين',
    postWorkout: 'بعد التمرين',
    ingredients: 'المكونات',
    howToPrepare: 'طريقة التحضير',
    protein: 'بروتين',
    carbs: 'كارب',
    fats: 'دهون',

    // Pre-workout tip
    preWorkoutTip: '🔥 أفضل أطعمة حرق الدهون قبل التمرين',
    preWorkoutFoods: 'القهوة، الشاي الأخضر، الشوفان، الموز، التمر مع اللوز',

    // Coach
    coachAI: 'المدرب الذكي',
    online: 'متصل',
    askCoachAnything: 'اسأل المدرب أي شيء...',
    coachThinking: 'المدرب يفكر...',
    listen: 'استمع',
    stop: 'إيقاف',

    // Days
    Sunday: 'الأحد',
    Monday: 'الاثنين',
    Tuesday: 'الثلاثاء',
    Wednesday: 'الأربعاء',
    Thursday: 'الخميس',
    Friday: 'الجمعة',
    Saturday: 'السبت',

    // Language
    language: 'اللغة',
    english: 'English',
    arabic: 'العربية',
    logout: 'تسجيل خروج',
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('appLanguage') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key) => translations[language][key] || key;
  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}