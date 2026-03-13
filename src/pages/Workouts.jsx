import React, { useState, useRef } from 'react';
import { Dumbbell, Calendar, Clock, ChevronLeft, ChevronRight, Flame, Zap, Share2, Download, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
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
      { name: 'Bench Press', titleKey: 'ex_bench_press', descKey: 'ex_bench_press_desc', sets: 4, reps: '8-10', calories: 45, fat: 5, gif_url: '/exercises/Barbell-Bench-Press.gif' },
      { name: 'Incline Dumbbell Press', titleKey: 'ex_incline_db_press', descKey: 'ex_incline_db_press_desc', sets: 3, reps: '10-12', calories: 38, fat: 4, gif_url: '/exercises/Incline-Dumbbell-Press.gif' },
      { name: 'Cable Flyes', titleKey: 'ex_cable_flyes', descKey: 'ex_cable_flyes_desc', sets: 3, reps: '12-15', calories: 30, fat: 3, gif_url: '/exercises/Cable-Crossover.gif' },
      { name: 'Tricep Pushdowns', titleKey: 'ex_tricep_pushdown', descKey: 'ex_tricep_pushdown_desc', sets: 4, reps: '12-15', calories: 25, fat: 3, gif_url: '/exercises/Pushdown.gif' },
    ]
  },
  Back: {
    titleKey: 'backWorkout',
    muscleGroupKey: 'back',
    duration_minutes: 65,
    exercises: [
      { name: 'Deadlift', titleKey: 'ex_deadlift', descKey: 'ex_deadlift_desc', sets: 4, reps: '6-8', calories: 80, fat: 9, gif_url: '/exercises/Barbell-Deadlift.gif' },
      { name: 'Lat Pulldowns', titleKey: 'ex_lat_pulldown', descKey: 'ex_lat_pulldown_desc', sets: 4, reps: '10-12', calories: 40, fat: 4, gif_url: '/exercises/Lat-Pulldown.gif' },
      { name: 'Seated Cable Row', titleKey: 'ex_seated_row', descKey: 'ex_seated_row_desc', sets: 3, reps: '12-15', calories: 35, fat: 3, gif_url: '/exercises/Seated-Cable-Row.gif' },
      { name: 'Barbell Curls', titleKey: 'ex_barbell_curl', descKey: 'ex_barbell_curl_desc', sets: 3, reps: '12-15', calories: 25, fat: 2, gif_url: '/exercises/Barbell-Curl.gif' },
    ]
  },
  Legs: {
    titleKey: 'legsWorkout',
    muscleGroupKey: 'legs',
    duration_minutes: 70,
    exercises: [
      { name: 'Barbell Squats', titleKey: 'ex_squat', descKey: 'ex_squat_desc', sets: 4, reps: '8-10', calories: 85, fat: 10, gif_url: '/exercises/BARBELL-SQUAT.gif' },
      { name: 'Leg Press', titleKey: 'ex_leg_press', descKey: 'ex_leg_press_desc', sets: 3, reps: '12-15', calories: 50, fat: 4, gif_url: '/exercises/Leg-Press.mp4' },
      { name: 'Leg Extensions', titleKey: 'ex_leg_extension', descKey: 'ex_leg_extension_desc', sets: 3, reps: '12-15', calories: 40, fat: 3, gif_url: '/exercises/LEG-EXTENSION.gif' },
      { name: 'Calf Raises', titleKey: 'ex_calf_raise', descKey: 'ex_calf_raise_desc', sets: 4, reps: '15-20', calories: 20, fat: 2, gif_url: '/exercises/Calf-Raise.gif' },
    ]
  },
  Shoulders: {
    titleKey: 'shouldersWorkout',
    muscleGroupKey: 'shoulders',
    duration_minutes: 65,
    exercises: [
      { name: 'Overhead Press', titleKey: 'ex_ohp', descKey: 'ex_ohp_desc', sets: 4, reps: '8-10', calories: 45, fat: 5, gif_url: '/exercises/Barbell-Shoulder-Press.gif' },
      { name: 'Lateral Raises', titleKey: 'ex_lateral_raise', descKey: 'ex_lateral_raise_desc', sets: 3, reps: '12-15', calories: 15, fat: 1, gif_url: '/exercises/Dumbbell-Lateral-Raise.gif' },
      { name: 'Face Pulls', titleKey: 'ex_face_pull', descKey: 'ex_face_pull_desc', sets: 3, reps: '15-20', calories: 15, fat: 1, gif_url: '/exercises/Face-Pull.gif' },
      { name: 'Cable Crunches', titleKey: 'ex_cable_crunch', descKey: 'ex_cable_crunch_desc', sets: 4, reps: '15-20', calories: 20, fat: 2, gif_url: '/exercises/Cable-Crunch.gif' },
    ]
  }
};

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Workouts() {
  const { t, language, isRTL } = useLanguage();
  const { getTrainingDays, isTrainingDay } = useExerciseDays();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const [selectedDay, setSelectedDay] = useState(today);
  const [showShareCard, setShowShareCard] = useState(false);
  const shareCardRef = useRef(null);

  const trainingDays = getTrainingDays();
  const sortedTrainingDays = [...trainingDays].sort((a, b) => days.indexOf(a) - days.indexOf(b));

  const getWorkoutForDay = (dayName) => {
    if (!isTrainingDay(dayName)) return { titleKey: 'restDay', muscleGroupKey: 'recovery', duration_minutes: 0, exercises: [] };

    const dayIndex = sortedTrainingDays.indexOf(dayName);
    const dayCount = sortedTrainingDays.length;

    const modules = [
      workoutModules.Chest,
      workoutModules.Back,
      workoutModules.Legs,
      workoutModules.Shoulders
    ];

    if (dayCount < 4) {
      const modulesForThisDay = [];
      modules.forEach((module, idx) => {
        if (idx % dayCount === dayIndex) {
          modulesForThisDay.push(module);
        }
      });

      if (modulesForThisDay.length === 0) return { titleKey: 'restDay', muscleGroupKey: 'recovery', duration_minutes: 0, exercises: [] };
      if (modulesForThisDay.length === 1) return modulesForThisDay[0];

      return {
        isCombined: true,
        combinedTitles: modulesForThisDay.map(m => m.titleKey),
        muscleGroupKey: 'mixed',
        duration_minutes: modulesForThisDay.reduce((acc, m) => acc + m.duration_minutes, 0),
        exercises: modulesForThisDay.flatMap(m => m.exercises)
      };
    }

    return modules[dayIndex % modules.length];
  };

  const displayWorkout = getWorkoutForDay(selectedDay);
  const currentIndex = days.indexOf(selectedDay);
  const totalCalories = displayWorkout.exercises.reduce((sum, ex) => sum + (ex.calories || 0), 0);

  const goToPrevDay = () => setSelectedDay(days[(currentIndex - 1 + 7) % 7]);
  const goToNextDay = () => setSelectedDay(days[(currentIndex + 1) % 7]);

  const renderWorkoutTitle = (workout) => {
    if (workout.isCombined) {
      return workout.combinedTitles.map(key => t(key)).join(' + ');
    }
    return t(workout.titleKey);
  };

  const handleFinishWorkout = () => {
    // Save to progress in localStorage
    const todayKey = new Date().toISOString().split('T')[0];
    const saved = JSON.parse(localStorage.getItem('fitegypt_progress') || '{"completedDays":{}}');
    saved.completedDays[todayKey] = { calories: totalCalories, timestamp: Date.now() };
    localStorage.setItem('fitegypt_progress', JSON.stringify(saved));
    setShowShareCard(true);
  };

  const handleShare = async () => {
    if (!shareCardRef.current) return;
    try {
      const canvas = await html2canvas(shareCardRef.current, { backgroundColor: '#000', scale: 2 });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'fitegypt-workout.png', { type: 'image/png' });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: 'FitEgypt Workout', text: t('workoutComplete') });
          } catch { /* user cancelled */ }
        } else {
          // Fallback: download
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'fitegypt-workout.png';
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-lg z-40 border-b border-zinc-800">
        <div className="px-6 py-4">
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Dumbbell className="w-5 h-5 text-black" />
            </div>
            <div className={isRTL ? 'text-right' : ''}>
              <h1 className="text-xl font-bold text-white">{t('workouts')}</h1>
              <p className="text-zinc-500 text-sm">{t('yourWeeklyPlan')}</p>
            </div>
          </div>
        </div>

        {/* Day Selector */}
        <div className="px-6 pb-4">
          <div className={`flex items-center justify-between bg-zinc-900/50 rounded-2xl p-2 border border-zinc-800 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button onClick={isRTL ? goToNextDay : goToPrevDay} className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors">
              <ChevronLeft className={`w-5 h-5 text-white ${isRTL ? 'rotate-180' : ''}`} />
            </button>
            <div className="text-center px-4">
              <p className="text-orange-500 font-bold text-lg">{t(selectedDay)}</p>
              <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">{selectedDay === today ? t('today') : ""}</p>
            </div>
            <button onClick={isRTL ? goToPrevDay : goToNextDay} className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors">
              <ChevronRight className={`w-5 h-5 text-white ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <motion.div key={selectedDay} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`bg-gradient-to-br from-orange-500/20 to-orange-600/5 border border-orange-500/20 rounded-3xl p-6 mb-6 ${isRTL ? 'text-right' : ''}`}>
          <h2 className="text-2xl font-black text-white">{renderWorkoutTitle(displayWorkout)}</h2>
          <div className={`flex items-center gap-4 mt-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span className="text-zinc-400 text-sm font-medium">{t(displayWorkout.muscleGroupKey)}</span>
            </div>
            {displayWorkout.duration_minutes > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-zinc-400 text-sm font-medium">{displayWorkout.duration_minutes} {t('min')}</span>
              </div>
            )}
          </div>
        </motion.div>

        {displayWorkout.exercises.length > 0 ? (
          <>
            <div className="space-y-4">
              <h3 className={`text-lg font-bold text-white mb-2 ${isRTL ? 'text-right' : ''}`}>{t('exercises')}</h3>
              {displayWorkout.exercises.map((exercise, index) => (
                <ExerciseCard key={index} exercise={exercise} index={index} />
              ))}
            </div>

            {/* Finish Workout Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={handleFinishWorkout}
              className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(249,115,22,0.3)] active:scale-[0.98] transition-all"
            >
              <CheckCircle className="w-5 h-5" /> {t('finishWorkout')}
            </motion.button>
          </>
        ) : (
          <div className="text-center py-20 bg-zinc-900/40 rounded-3xl border border-dashed border-zinc-800">
            <div className="text-5xl mb-4 grayscale opacity-50">😴</div>
            <h3 className="text-white font-bold text-xl">{t('restDay')}</h3>
            <p className="text-zinc-500 mt-2 text-sm max-w-[200px] mx-auto">{t('restDayMsg')}</p>
          </div>
        )}
      </div>

      {/* Share Workout Card Modal */}
      <AnimatePresence>
        {showShareCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowShareCard(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Shareable Card */}
              <div
                ref={shareCardRef}
                className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 rounded-3xl p-6 border border-zinc-700"
              >
                <div className="text-center mb-4">
                  <p className="text-orange-500 text-sm font-bold uppercase tracking-widest">FitEgypt</p>
                  <h3 className="text-white text-2xl font-black mt-1">{t('workoutComplete')}</h3>
                </div>
                <div className="bg-zinc-800/50 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-sm">{t('workouts')}</span>
                    <span className="text-white font-bold">{renderWorkoutTitle(displayWorkout)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-sm">{t('exercisesCompleted')}</span>
                    <span className="text-white font-bold">{displayWorkout.exercises.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-sm">{t('caloriesBurned')}</span>
                    <span className="text-orange-500 font-bold">{totalCalories} {t('kcal')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-sm">{t('today')}</span>
                    <span className="text-white font-bold">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Share / Download buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleShare}
                  className="flex-1 py-3 rounded-2xl bg-orange-500 text-black font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                  <Share2 className="w-4 h-4" /> {t('shareWorkout')}
                </button>
                <button
                  onClick={() => setShowShareCard(false)}
                  className="px-6 py-3 rounded-2xl bg-zinc-800 text-zinc-300 font-bold active:scale-[0.98] transition-all"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FooterCredit />
      <BottomNav currentPage="Workouts" />
    </div>
  );
}