import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

const translations = {
  en: {
    welcomeBack: 'Welcome back,',
    champion: 'Champion',
    dailyGoal: 'Daily Goal',
    stayConsistent: 'Stay Consistent!',
    quickActions: 'Quick Actions',
    todaysWorkout: "Today's Workout",
    buildMuscle: 'Build muscle and burn fat',
    mealPlan: 'Meal Plan',
    egyptianNutrition: 'Egyptian nutrition',
    askCoach: 'Ask Coach',
    aiTrainer: 'AI personal trainer',
    todaysMotivation: "TODAY'S MOTIVATION",
    motivationQuote1: 'Discipline beats motivation.',
    motivationQuote2: 'Small progress is still progress.',
    motivationQuote3: 'Train hard. Recover harder.',
    motivationQuote4: 'Your body hears everything your mind says.',
    motivationQuote5: 'Consistency creates champions.',
    motivationQuote6: 'Do not skip the day you need most.',
    motivationQuote7: 'One workout at a time, one goal at a time.',

    home: 'Home',
    workouts: 'Workouts',
    meals: 'Meals',
    coach: 'Coach',
    more: 'More',

    getYourPlan: 'Get Your Personal Plan',
    age: 'Age',
    height: 'Height',
    weight: 'Weight',
    generatePlan: 'Generate My Plan',
    generating: 'Creating your plan...',
    yourCustomPlan: 'Your Custom Plan',
    workoutPlan: 'Workout Plan',
    nutritionPlan: 'Nutrition Plan',
    championStats: 'Champion Stats',
    clearPlan: 'Clear Plan',
    updatePlan: 'Update Plan',
    clearCurrentPlanConfirm: 'Clear current plan?',
    missingGroqApiKey: 'Please add your Groq API key to the .env file.',
    failedConnectAI: 'Failed to connect to AI. Disable ad blockers or check your internet.',
    failedGeneratePlan: 'Failed to generate plan. Check your API key or connection.',

    yourWeeklyPlan: 'Your weekly plan',
    today: 'Today',
    exercises: 'Exercises',
    restDay: 'Rest Day',
    restDayMsg: 'Recovery is part of the process. Let your muscles grow.',
    min: 'min',
    burns: 'Burns',
    kcal: 'kcal',
    fat: 'fat',
    sets: 'sets',

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

    preWorkoutTip: 'Best Fat-Burning Pre-Workout Foods',
    preWorkoutFoods: 'Coffee, Green Tea, Oats, Bananas, Dates with Almonds',

    coachAI: 'Coach AI',
    online: 'Online',
    askCoachAnything: 'Ask Coach anything...',
    coachThinking: 'Coach is thinking...',
    listen: 'Listen',
    stop: 'Stop',
    coachInitialMessage: "Hey champ. I am Coach, your personal fitness AI. Ask me about workouts, nutrition, or your fitness journey.",
    coachMissingApiKey: 'I do not have your Groq API key yet. Add VITE_GROQ_API_KEY in .env.',
    coachLostThought: 'Sorry champ, I lost my train of thought.',
    coachInvalidApiKey: 'Your Groq API key looks invalid. Check it in .env.',
    coachRateLimit: 'Rate limit reached. Wait a bit and try again.',
    coachNetworkIssue: 'I had trouble connecting. Check internet or disable blockers.',
    coachErrorPrefix: 'Sorry champ, I had a connection issue:',

    Sunday: 'Sunday',
    Monday: 'Monday',
    Tuesday: 'Tuesday',
    Wednesday: 'Wednesday',
    Thursday: 'Thursday',
    Friday: 'Friday',
    Saturday: 'Saturday',

    language: 'Language',
    logout: 'Logout',
    settings: 'Settings',
    changeSchedule: 'Change training days',

    appTagline: 'Your Elite AI Fitness Coach',
    joinTeamTitle: 'Join the Team',
    welcomeChampionTitle: 'Welcome, Champion',
    signUp: 'Sign up',
    continue: 'Continue',
    withGoogle: 'with Google',
    orUseEmail: 'Or use email',
    emailAddress: 'Email address',
    password: 'Password',
    createAccount: 'Create Account',
    startTraining: 'Start Training',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    signIn: 'Sign in',
    joinTheTeam: 'Join the team',

    googleLoginFailed: 'Google login failed. Please try again.',
    pleaseFillAllFields: 'Please fill in all fields',
    accountCreatedExercisePrompt: 'Account created. Tell us which days you plan to exercise.',
    welcomeBackToast: 'Welcome back!',
    emailAlreadyRegistered: 'This email is already registered.',
    invalidCredentials: 'Invalid email or password.',
    authFailed: 'Authentication failed. Please check your credentials.',

    whenPlanExercise: 'When do you plan to exercise?',
    selectPlannedDays: 'Select the days you plan to train',
    selectAtLeastOneTrainingDay: 'Please select at least one training day',
    exerciseScheduleSaved: 'Exercise schedule saved!',
    errorOccurred: 'An error occurred',
    trainingDaysLabel: 'Training days:',
    noDaysSelected: 'No days selected',
    continueCta: 'Continue',
    changeLaterInSettings: 'You can change this later in settings',

    accessRestricted: 'Access Restricted',
    notRegisteredMessage: 'You are not registered to use this application. Please contact the app administrator for access.',
    ifErrorYouCan: 'If you believe this is an error, you can:',
    verifyCorrectAccount: 'Verify you are logged in with the correct account',
    contactAdmin: 'Contact the app administrator for access',
    tryLoginAgain: 'Try logging out and back in again',

    pageNotFound: 'Page Not Found',
    pageNotFoundLead: 'The page',
    pageNotFoundSuffix: 'could not be found in this application.',
    goHome: 'Go Home',

    footerCredit: 'Made by Mohamed Tamer | Powered by Firebase | Groq AI',
  },
  ar: {
    welcomeBack: 'اهلا بعودتك،',
    champion: 'يا بطل',
    dailyGoal: 'هدف اليوم',
    stayConsistent: 'استمر في التمرين',
    quickActions: 'اجراءات سريعة',
    todaysWorkout: 'تمرين اليوم',
    buildMuscle: 'بناء العضلات وحرق الدهون',
    mealPlan: 'خطة الوجبات',
    egyptianNutrition: 'تغذية مصرية',
    askCoach: 'اسال المدرب',
    aiTrainer: 'مدرب ذكي شخصي',
    todaysMotivation: 'تحفيز اليوم',
    motivationQuote1: 'الالتزام اهم من الحماس.',
    motivationQuote2: 'التقدم الصغير يظل تقدما.',
    motivationQuote3: 'تمرن بقوة وتعافى بذكاء.',
    motivationQuote4: 'جسمك يسمع ما تقوله لعقلك.',
    motivationQuote5: 'الاستمرارية تصنع الابطال.',
    motivationQuote6: 'لا تتخطى اليوم الذي تحتاجه.',
    motivationQuote7: 'تمرين بعد تمرين.. هدف بعد هدف.',

    home: 'الرئيسية',
    workouts: 'التمارين',
    meals: 'الوجبات',
    coach: 'المدرب',
    more: 'المزيد',

    getYourPlan: 'احصل على خطتك الشخصية',
    age: 'العمر',
    height: 'الطول',
    weight: 'الوزن',
    generatePlan: 'انشاء خطتي',
    generating: 'جاري انشاء الخطة...',
    yourCustomPlan: 'خطتك المخصصة',
    workoutPlan: 'خطة التمرين',
    nutritionPlan: 'خطة التغذية',
    championStats: 'بيانات البطل',
    clearPlan: 'مسح الخطة',
    updatePlan: 'تحديث الخطة',
    clearCurrentPlanConfirm: 'هل تريد مسح الخطة الحالية؟',
    missingGroqApiKey: 'اضف مفتاح Groq API في ملف .env',
    failedConnectAI: 'فشل الاتصال بالذكاء الاصطناعي. تحقق من الانترنت او مانع الاعلانات.',
    failedGeneratePlan: 'فشل انشاء الخطة. تحقق من المفتاح او الاتصال.',

    yourWeeklyPlan: 'خطتك الاسبوعية',
    today: 'اليوم',
    exercises: 'التمارين',
    restDay: 'يوم راحة',
    restDayMsg: 'الراحة جزء من العملية. دع عضلاتك تتعافى.',
    min: 'دقيقة',
    burns: 'يحرق',
    kcal: 'سعرة',
    fat: 'دهون',
    sets: 'مجموعات',

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

    preWorkoutTip: 'افضل اطعمة قبل التمرين',
    preWorkoutFoods: 'القهوة، الشاي الاخضر، الشوفان، الموز، التمر مع اللوز',

    coachAI: 'المدرب الذكي',
    online: 'متصل',
    askCoachAnything: 'اسال المدرب اي شيء...',
    coachThinking: 'المدرب يفكر...',
    listen: 'استمع',
    stop: 'ايقاف',
    coachInitialMessage: 'اهلا يا بطل. انا المدرب الذكي الخاص بك. اسالني عن التمارين او التغذية او رحلتك الرياضية.',
    coachMissingApiKey: 'لا يوجد مفتاح Groq API بعد. اضفه في ملف .env باسم VITE_GROQ_API_KEY.',
    coachLostThought: 'اسف يا بطل، فقدت الفكرة للحظة.',
    coachInvalidApiKey: 'مفتاح Groq غير صحيح. تحقق منه في .env.',
    coachRateLimit: 'وصلنا للحد الاقصى من الطلبات. حاول بعد قليل.',
    coachNetworkIssue: 'واجهت مشكلة اتصال. تحقق من الانترنت او اوقف مانع الاعلانات.',
    coachErrorPrefix: 'اسف يا بطل، حدثت مشكلة:',

    Sunday: 'الاحد',
    Monday: 'الاثنين',
    Tuesday: 'الثلاثاء',
    Wednesday: 'الاربعاء',
    Thursday: 'الخميس',
    Friday: 'الجمعة',
    Saturday: 'السبت',

    language: 'اللغة',
    logout: 'تسجيل خروج',
    settings: 'الاعدادات',
    changeSchedule: 'تغيير ايام التمرين',

    appTagline: 'مدرب اللياقة الذكي الخاص بك',
    joinTeamTitle: 'انضم الى الفريق',
    welcomeChampionTitle: 'مرحبا ايها البطل',
    signUp: 'انشاء حساب',
    continue: 'متابعة',
    withGoogle: 'باستخدام جوجل',
    orUseEmail: 'او استخدم البريد الالكتروني',
    emailAddress: 'البريد الالكتروني',
    password: 'كلمة المرور',
    createAccount: 'انشاء الحساب',
    startTraining: 'ابدأ التمرين',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    dontHaveAccount: 'ليس لديك حساب؟',
    signIn: 'تسجيل الدخول',
    joinTheTeam: 'انضم للفريق',

    googleLoginFailed: 'فشل تسجيل الدخول عبر جوجل. حاول مرة اخرى.',
    pleaseFillAllFields: 'يرجى ملء جميع الحقول',
    accountCreatedExercisePrompt: 'تم انشاء الحساب. اخبرنا بايام التمرين المناسبة لك.',
    welcomeBackToast: 'مرحبا بعودتك!',
    emailAlreadyRegistered: 'هذا البريد مسجل بالفعل.',
    invalidCredentials: 'البريد الالكتروني او كلمة المرور غير صحيحة.',
    authFailed: 'فشلت المصادقة. تحقق من بياناتك.',

    whenPlanExercise: 'متى تخطط للتمرين؟',
    selectPlannedDays: 'اختر الايام التي تخطط للتمرين فيها',
    selectAtLeastOneTrainingDay: 'يرجى اختيار يوم تمرين واحد على الاقل',
    exerciseScheduleSaved: 'تم حفظ جدول التمارين!',
    errorOccurred: 'حدث خطأ',
    trainingDaysLabel: 'ايام التمرين:',
    noDaysSelected: 'لم يتم اختيار ايام',
    continueCta: 'متابعة',
    changeLaterInSettings: 'يمكنك تغيير هذا لاحقا من الاعدادات',

    accessRestricted: 'وصول مقيد',
    notRegisteredMessage: 'انت غير مسجل لاستخدام هذا التطبيق. تواصل مع مسؤول التطبيق لطلب الوصول.',
    ifErrorYouCan: 'اذا كنت تعتقد ان هذا خطأ، يمكنك:',
    verifyCorrectAccount: 'التأكد من تسجيل الدخول بالحساب الصحيح',
    contactAdmin: 'التواصل مع مسؤول التطبيق للحصول على صلاحية',
    tryLoginAgain: 'تسجيل الخروج ثم الدخول مرة اخرى',

    pageNotFound: 'الصفحة غير موجودة',
    pageNotFoundLead: 'الصفحة',
    pageNotFoundSuffix: 'غير موجودة في هذا التطبيق.',
    goHome: 'العودة للرئيسية',

    footerCredit: 'تم التطوير بواسطة Mohamed Tamer | مدعوم بواسطة Firebase و Groq AI',
  },
};

translations.es = {
  ...translations.en,
  welcomeBack: 'Bienvenido de nuevo,',
  dailyGoal: 'Objetivo diario',
  stayConsistent: 'Manten la constancia',
  quickActions: 'Acciones rapidas',
  mealPlan: 'Plan de comidas',
  askCoach: 'Preguntar al coach',
  todaysMotivation: 'MOTIVACION DE HOY',
  home: 'Inicio',
  workouts: 'Entrenos',
  meals: 'Comidas',
  more: 'Mas',
  language: 'Idioma',
  settings: 'Configuracion',
  changeSchedule: 'Cambiar dias de entrenamiento',
  logout: 'Cerrar sesion',
  joinTeamTitle: 'Unete al equipo',
  welcomeChampionTitle: 'Bienvenido, campeon',
  signUp: 'Registrarse',
  continue: 'Continuar',
  orUseEmail: 'O usar correo',
  createAccount: 'Crear cuenta',
  startTraining: 'Comenzar entrenamiento',
  signIn: 'Iniciar sesion',
  goHome: 'Ir a inicio',
};

translations.fr = {
  ...translations.en,
  welcomeBack: 'Bon retour,',
  dailyGoal: 'Objectif du jour',
  stayConsistent: 'Reste regulier',
  quickActions: 'Actions rapides',
  mealPlan: 'Plan repas',
  askCoach: 'Demander au coach',
  todaysMotivation: 'MOTIVATION DU JOUR',
  home: 'Accueil',
  workouts: 'Entrainements',
  meals: 'Repas',
  more: 'Plus',
  language: 'Langue',
  settings: 'Parametres',
  changeSchedule: "Changer les jours d'entrainement",
  logout: 'Se deconnecter',
  joinTeamTitle: "Rejoindre l'equipe",
  welcomeChampionTitle: 'Bienvenue, champion',
  signUp: "S'inscrire",
  continue: 'Continuer',
  orUseEmail: 'Ou utiliser email',
  createAccount: 'Creer un compte',
  startTraining: "Commencer l'entrainement",
  signIn: 'Se connecter',
  goHome: "Retour a l'accueil",
};

translations.de = {
  ...translations.en,
  welcomeBack: 'Willkommen zuruck,',
  dailyGoal: 'Tagesziel',
  stayConsistent: 'Bleib konsequent',
  quickActions: 'Schnellaktionen',
  mealPlan: 'Ernahrungsplan',
  askCoach: 'Coach fragen',
  todaysMotivation: 'MOTIVATION HEUTE',
  home: 'Start',
  workouts: 'Workouts',
  meals: 'Mahlzeiten',
  more: 'Mehr',
  language: 'Sprache',
  settings: 'Einstellungen',
  changeSchedule: 'Trainingstage andern',
  logout: 'Abmelden',
  joinTeamTitle: 'Dem Team beitreten',
  welcomeChampionTitle: 'Willkommen, Champion',
  signUp: 'Registrieren',
  continue: 'Weiter',
  orUseEmail: 'Oder E-Mail nutzen',
  createAccount: 'Konto erstellen',
  startTraining: 'Training starten',
  signIn: 'Anmelden',
  goHome: 'Zur Startseite',
};

translations.it = {
  ...translations.en,
  welcomeBack: 'Bentornato,',
  dailyGoal: 'Obiettivo giornaliero',
  stayConsistent: 'Rimani costante',
  quickActions: 'Azioni rapide',
  mealPlan: 'Piano pasti',
  askCoach: 'Chiedi al coach',
  todaysMotivation: 'MOTIVAZIONE DI OGGI',
  home: 'Home',
  workouts: 'Allenamenti',
  meals: 'Pasti',
  more: 'Altro',
  language: 'Lingua',
  settings: 'Impostazioni',
  changeSchedule: 'Cambia giorni di allenamento',
  logout: 'Esci',
  joinTeamTitle: 'Unisciti al team',
  welcomeChampionTitle: 'Benvenuto, campione',
  signUp: 'Registrati',
  continue: 'Continua',
  orUseEmail: 'Oppure usa email',
  createAccount: 'Crea account',
  startTraining: 'Inizia allenamento',
  signIn: 'Accedi',
  goHome: 'Vai alla home',
};

const supportedLanguages = [
  { code: 'en', label: 'English', base: 'en', dir: 'ltr', aiName: 'English' },
  { code: 'ar', label: 'العربية', base: 'ar', dir: 'rtl', aiName: 'Arabic' },
  { code: 'es', label: 'Espanol', base: 'es', dir: 'ltr', aiName: 'Spanish' },
  { code: 'fr', label: 'Francais', base: 'fr', dir: 'ltr', aiName: 'French' },
  { code: 'de', label: 'Deutsch', base: 'de', dir: 'ltr', aiName: 'German' },
  { code: 'it', label: 'Italiano', base: 'it', dir: 'ltr', aiName: 'Italian' },
];

const motivationQuoteKeys = [
  'motivationQuote1',
  'motivationQuote2',
  'motivationQuote3',
  'motivationQuote4',
  'motivationQuote5',
  'motivationQuote6',
  'motivationQuote7',
];

const getLanguageConfig = (code) => (
  supportedLanguages.find((language) => language.code === code) || supportedLanguages[0]
);

const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  return Math.floor(diff / 86400000);
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('appLanguage') || 'en';
    return getLanguageConfig(savedLanguage).code;
  });

  useEffect(() => {
    const languageConfig = getLanguageConfig(language);
    localStorage.setItem('appLanguage', languageConfig.code);
    document.documentElement.dir = languageConfig.dir;
    document.documentElement.lang = languageConfig.code;
  }, [language]);

  const setAppLanguage = (newLanguage) => {
    setLanguage(getLanguageConfig(newLanguage).code);
  };

  const translateKey = (key, langCode = language) => {
    const { base } = getLanguageConfig(langCode);
    const activeTranslations = translations[base] || translations.en;
    return activeTranslations[key] || translations.en[key] || key;
  };

  const t = (key) => translateKey(key);

  const getDailyMotivationQuote = () => {
    const index = (getDayOfYear() - 1) % motivationQuoteKeys.length;
    const quoteKey = motivationQuoteKeys[index < 0 ? 0 : index];
    return translateKey(quoteKey);
  };

  const getAIResponseLanguageName = () => getLanguageConfig(language).aiName;

  const isRTL = getLanguageConfig(language).dir === 'rtl';

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: setAppLanguage,
        t,
        isRTL,
        supportedLanguages,
        getDailyMotivationQuote,
        getAIResponseLanguageName,
      }}
    >
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

