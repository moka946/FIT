import React, { useState } from 'react';
import { Dumbbell, Calendar, Clock, ChevronLeft, ChevronRight, Flame, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import BottomNav from '@/components/navigation/BottomNav';
import FooterCredit from '@/components/FooterCredit';
import ExerciseCard from '@/components/workout/ExerciseCard';
import { useLanguage } from '@/components/LanguageContext';
import { useExerciseDays } from '@/lib/useExerciseDays';

const workoutModules = {
  Chest: {
    titleKey: 'chestWorkout',
    muscleGroupKey: 'chest',
    duration_minutes: 60,
    exercises: [
      { name: 'Bench Press', nameAr: 'ضغط صدر بالبار', sets: 4, reps: '8-10', calories: 45, fat: 5, gif_url: '/exercises/Barbell-Bench-Press.gif', description: 'Keep your back flat and push through your chest' },
      { name: 'Incline Dumbbell Press', nameAr: 'ضغط صدر علوي بالدمبل', sets: 3, reps: '10-12', calories: 38, fat: 4, gif_url: '/exercises/Incline-Dumbbell-Press.gif', description: 'Focus on upper chest, 45-degree angle' },
      { name: 'Cable Flyes', nameAr: 'تفتيح كابل', sets: 3, reps: '12-15', calories: 30, fat: 3, gif_url: '/exercises/Cable-Crossover.gif', description: 'Squeeze at the center for maximum contraction' },
      { name: 'Tricep Pushdowns', nameAr: 'ترايسبس بالكابل', sets: 4, reps: '12-15', calories: 25, fat: 3, gif_url: '/exercises/Pushdown.gif', description: 'Keep elbows tucked to your sides' },
      { name: 'Overhead Tricep Extension', nameAr: 'ترايسبس خلف الرأس', sets: 3, reps: '10-12', calories: 22, fat: 2, gif_url: '/exercises/Dumbbell-Triceps-Extension.gif', description: 'Full stretch at the bottom' },
    ]
  },
  Back: {
    titleKey: 'backWorkout',
    muscleGroupKey: 'back',
    duration_minutes: 65,
    exercises: [
      { name: 'Deadlift', nameAr: 'ديدليفت', sets: 4, reps: '6-8', calories: 80, fat: 9, gif_url: '/exercises/Barbell-Deadlift.gif', description: 'Keep your back straight, lift with your legs' },
      { name: 'Lat Pulldowns', nameAr: 'سحب أمامي', sets: 4, reps: '10-12', calories: 40, fat: 4, gif_url: '/exercises/Lat-Pulldown.gif', description: 'Pull to upper chest, squeeze lats' },
      { name: 'Seated Cable Rows', nameAr: 'سحب أرضي', sets: 3, reps: '10-12', calories: 35, fat: 4, gif_url: '/exercises/Seated-Cable-Row.gif', description: 'Pull to your belly button' },
      { name: 'Barbell Curls', nameAr: 'باي بالبار', sets: 4, reps: '10-12', calories: 28, fat: 3, gif_url: '/exercises/Barbell-Curl.gif', description: 'Keep elbows stationary' },
      { name: 'Hammer Curls', nameAr: 'هامر كيرل', sets: 3, reps: '12-15', calories: 25, fat: 3, gif_url: '/exercises/Hammer-Curl.gif', description: 'Works brachialis for arm thickness' },
    ]
  },
  Legs: {
    titleKey: 'legsWorkout',
    muscleGroupKey: 'legs',
    duration_minutes: 70,
    exercises: [
      { name: 'Barbell Squats', nameAr: 'سكوات بالبار', sets: 4, reps: '8-10', calories: 85, fat: 10, gif_url: '/exercises/BARBELL-SQUAT.gif', description: 'Go below parallel if mobility allows' },
      { name: 'Leg Press', nameAr: 'مكبس الرجل', sets: 4, reps: '10-12', calories: 70, fat: 8, gif_url: '/exercises/Leg-Press.mp4', description: 'Don\'t lock knees at the top' },
      { name: 'Romanian Deadlifts', nameAr: 'ديدليفت روماني', sets: 3, reps: '10-12', calories: 55, fat: 6, gif_url: '/exercises/Barbell-Romanian-Deadlift.gif', description: 'Feel the stretch in hamstrings' },
      { name: 'Leg Extensions', nameAr: 'تمديد الرجل', sets: 3, reps: '12-15', calories: 35, fat: 4, gif_url: '/exercises/LEG-EXTENSION.gif', description: 'Squeeze quads at the top' },
      { name: 'Calf Raises', nameAr: 'رفع السمانة', sets: 4, reps: '15-20', calories: 30, fat: 3, gif_url: '/exercises/Calf-Raise.gif', description: 'Full range of motion' },
    ]
  },
  Shoulders: {
    titleKey: 'shouldersWorkout',
    muscleGroupKey: 'shoulders',
    duration_minutes: 55,
    exercises: [
      { name: 'Overhead Press', nameAr: 'ضغط كتف', sets: 4, reps: '8-10', calories: 45, fat: 5, gif_url: '/exercises/Barbell-Shoulder-Press.gif', description: 'Press straight up, don\'t lean back' },
      { name: 'Lateral Raises', nameAr: 'رفرفة جانبي', sets: 4, reps: '12-15', calories: 28, fat: 3, gif_url: '/exercises/Dumbbell-Lateral-Raise.gif', description: 'Slight bend in elbows' },
      { name: 'Face Pulls', nameAr: 'سحب للوجه', sets: 3, reps: '15-20', calories: 25, fat: 3, gif_url: '/exercises/Face-Pull.gif', description: 'Great for rear delts and posture' },
      { name: 'Hanging Leg Raises', nameAr: 'رفع رجل معلق', sets: 3, reps: '12-15', calories: 35, fat: 4, gif_url: '/exercises/Hanging-Leg-Raise.gif', description: 'Control the movement' },
      { name: 'Cable Crunches', nameAr: 'كرنش بالكابل', sets: 3, reps: '15-20', calories: 30, fat: 3, gif_url: '/exercises/Cable-Crunch.gif', description: 'Crunch down, exhale at bottom' },
    ]
  },
  Arms: {
    titleKey: 'armsWorkout',
    muscleGroupKey: 'arms',
    duration_minutes: 50,
    exercises: [
      { name: 'Close Grip Bench Press', nameAr: 'ضغط قبضة ضيقة', sets: 4, reps: '8-10', calories: 40, fat: 4, gif_url: '/exercises/Close-Grip-Bench-Press.gif', description: 'Hands shoulder-width apart' },
      { name: 'Preacher Curls', nameAr: 'باي على المسند', sets: 3, reps: '10-12', calories: 25, fat: 3, gif_url: '/exercises/Barbell-Preacher-Curl.mp4', description: 'Full stretch at bottom' },
      { name: 'Skull Crushers', nameAr: 'سكل كراشر', sets: 3, reps: '10-12', calories: 28, fat: 3, gif_url: '/exercises/Skull-Crusher.mp4', description: 'Lower to forehead, not behind head' },
      { name: 'Concentration Curls', nameAr: 'باي مركز', sets: 3, reps: '12-15', calories: 22, fat: 2, gif_url: '/exercises/Concentration-Curl.gif', description: 'Peak contraction focus' },
      { name: 'Dips', nameAr: 'ديبس', sets: 3, reps: '10-15', calories: 35, fat: 4, gif_url: '/exercises/Chest-Dips.gif', description: 'Lean forward slightly for chest' },
    ]
  },
  FullBody: {
    titleKey: 'fullBodyWorkout',
    muscleGroupKey: 'fullBody',
    duration_minutes: 45,
    exercises: [
      { name: 'Burpees', nameAr: 'بيربي', sets: 4, reps: '10', calories: 60, fat: 7, gif_url: '/exercises/Burpee.gif', description: 'Explosive jump at the top' },
      { name: 'Mountain Climbers', nameAr: 'تسلق الجبل', sets: 4, reps: '30 sec', calories: 50, fat: 6, gif_url: '/exercises/Cross-Body-Mountain-Climber.mp4', description: 'Keep core tight' },
      { name: 'Jump Squats', nameAr: 'سكوات قفز', sets: 4, reps: '15', calories: 55, fat: 6, gif_url: '/exercises/Jump-Squat.gif', description: 'Land softly' },
      { name: 'Push-ups', nameAr: 'ضغط', sets: 4, reps: '15-20', calories: 40, fat: 4, gif_url: '/exercises/Push-Up.gif', description: 'Full range of motion' },
      { name: 'Plank', nameAr: 'بلانك', sets: 3, reps: '45 sec', calories: 25, fat: 3, gif_url: '/exercises/Front-Plank.gif', description: 'Keep body in straight line' },
    ]
  }
};

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Workouts() {
  const { t, language, isRTL } = useLanguage();
  const { getTrainingDays, isTrainingDay } = useExerciseDays();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const [selectedDay, setSelectedDay] = useState(today);

  // Dynamically map workouts to selected days
  const trainingDays = getTrainingDays(); // ['Monday', 'Wednesday', ...] ordered in week
  const sortedTrainingDays = [...trainingDays].sort((a, b) => days.indexOf(a) - days.indexOf(b));

  const getWorkoutForDay = (dayName) => {
    if (!isTrainingDay(dayName)) {
      return {
        titleKey: 'restDay',
        muscleGroupKey: 'recovery',
        duration_minutes: 0,
        exercises: []
      };
    }

    const dayIndex = sortedTrainingDays.indexOf(dayName);
    const dayCount = sortedTrainingDays.length;

    // Logic based on how many days the user selected
    if (dayCount === 1) {
      return workoutModules.FullBody;
    }

    if (dayCount === 2) {
      // Upper / Lower split
      if (dayIndex === 0) {
        return {
          ...workoutModules.Chest,
          titleKey: 'upperBodyPower',
          exercises: [...workoutModules.Chest.exercises.slice(0, 3), ...workoutModules.Back.exercises.slice(0, 2)]
        };
      }
      return {
        ...workoutModules.Legs,
        titleKey: 'lowerBodyCore',
        exercises: [...workoutModules.Legs.exercises, ...workoutModules.Shoulders.exercises.slice(3)]
      };
    }

    if (dayCount === 3) {
      // Push / Pull / Legs
      if (dayIndex === 0) {
        return {
          ...workoutModules.Chest,
          titleKey: 'pushWorkout',
          exercises: [...workoutModules.Chest.exercises.slice(0, 3), ...workoutModules.Shoulders.exercises.slice(0, 2)]
        };
      }
      if (dayIndex === 1) {
        return {
          ...workoutModules.Back,
          titleKey: 'pullWorkout',
          exercises: [...workoutModules.Back.exercises]
        };
      }
      return {
        ...workoutModules.Legs,
        titleKey: 'legsHiit',
        exercises: [...workoutModules.Legs.exercises.slice(0, 4), workoutModules.FullBody.exercises[0]]
      };
    }

    // 4+ days: Cycle through the traditional 5-6 day split
    const sequence = [
      workoutModules.Chest,
      workoutModules.Back,
      workoutModules.Legs,
      workoutModules.Shoulders,
      workoutModules.Arms,
      workoutModules.FullBody
    ];

    return sequence[dayIndex % sequence.length];
  };

  const displayWorkout = getWorkoutForDay(selectedDay);
  const currentIndex = days.indexOf(selectedDay);

  const goToPrevDay = () => {
    const newIndex = (currentIndex - 1 + 7) % 7;
    setSelectedDay(days[newIndex]);
  };

  const goToNextDay = () => {
    const newIndex = (currentIndex + 1) % 7;
    setSelectedDay(days[newIndex]);
  };

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-lg z-40 border-b border-zinc-800">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-black" />
              </div>
              <div className={isRTL ? 'text-right' : ''}>
                <h1 className="text-xl font-bold text-white">{t('workouts')}</h1>
                <p className="text-zinc-500 text-sm">{t('yourWeeklyPlan')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Day Selector */}
        <div className="px-6 pb-4">
          <div className={`flex items-center justify-between bg-zinc-900 rounded-2xl p-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button onClick={isRTL ? goToNextDay : goToPrevDay} className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
              <ChevronLeft className={`w-5 h-5 text-white ${isRTL ? 'rotate-180' : ''}`} />
            </button>
            <div className="text-center">
              <p className="text-orange-500 font-bold text-lg">{t(selectedDay)}</p>
              <p className="text-zinc-500 text-sm">{selectedDay === today ? t('today') : ""}</p>
            </div>
            <button onClick={isRTL ? goToPrevDay : goToNextDay} className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
              <ChevronRight className={`w-5 h-5 text-white ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Workout Info */}
      <div className="px-6 py-4">
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-6 mb-6 ${isRTL ? 'text-right' : ''}`}
        >
          <h2 className="text-2xl font-bold text-white">{t(displayWorkout.titleKey)}</h2>
          <div className={`flex items-center gap-4 mt-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-sm">{t(displayWorkout.muscleGroupKey)}</span>
            </div>
            {displayWorkout.duration_minutes > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/70" />
                <span className="text-white/70 text-sm">{displayWorkout.duration_minutes} {t('min')}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Pre-Workout Tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6 ${isRTL ? 'text-right' : ''}`}
        >
          <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Zap className="w-5 h-5 text-yellow-500" />
            <h3 className="text-white font-semibold">{t('preWorkoutTip')}</h3>
          </div>
          <p className="text-zinc-400 text-sm">{t('preWorkoutFoods')}</p>
        </motion.div>

        {/* Exercises */}
        {displayWorkout.exercises.length > 0 ? (
          <div className="space-y-4">
            <h3 className={`text-lg font-bold text-white ${isRTL ? 'text-right' : ''}`}>{t('exercises')}</h3>
            {displayWorkout.exercises.map((exercise, index) => (
              <ExerciseCard key={index} exercise={exercise} index={index} language={language} isRTL={isRTL} t={t} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">😴</span>
            </div>
            <h3 className="text-white font-bold text-xl">{t('restDay')}</h3>
            <p className="text-zinc-500 mt-2">{t('restDayMsg')}</p>
          </div>
        )}
      </div>

      <FooterCredit />
      <BottomNav currentPage="Workouts" />
    </div>
  );
}