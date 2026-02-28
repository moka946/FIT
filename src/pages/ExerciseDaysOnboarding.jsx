import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import { useExerciseDays } from '@/lib/useExerciseDays';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ExerciseDaysOnboarding() {
  const { t, isRTL } = useLanguage();
  const { setUserExerciseDays, exerciseDays, isLoading: isLoadingExerciseDays } = useExerciseDays();
  const navigate = useNavigate();
  const [selectedDays, setSelectedDays] = useState(['Monday', 'Tuesday', 'Sunday']);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoadingExerciseDays) return;
    if (Array.isArray(exerciseDays) && exerciseDays.length > 0) {
      setSelectedDays(exerciseDays);
    }
  }, [exerciseDays, isLoadingExerciseDays]);

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  const handleContinue = async () => {
    if (selectedDays.length === 0) {
      toast.error(t('selectAtLeastOneTrainingDay'));
      return;
    }

    setIsLoading(true);
    try {
      setUserExerciseDays(selectedDays);
      toast.success(t('exerciseScheduleSaved'));
      navigate('/');
    } catch (error) {
      toast.error(t('errorOccurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="w-16 h-16 bg-orange-500 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(249,115,22,0.3)]"
          >
            <Dumbbell className="w-8 h-8 text-black" />
          </motion.div>
          <h1 className={`text-3xl font-black text-white tracking-tighter mb-2 ${isRTL ? 'text-right' : ''}`}>
            {t('whenPlanExercise')}
          </h1>
          <p className={`text-zinc-500 font-medium ${isRTL ? 'text-right' : ''}`}>
            {t('selectPlannedDays')}
          </p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl mb-6">
          <div className={`grid grid-cols-2 gap-3 ${isRTL ? 'text-right' : ''}`}>
            {dayNames.map((day) => {
              const isSelected = selectedDays.includes(day);

              return (
                <motion.button
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleDay(day)}
                  className={`h-16 rounded-2xl font-bold transition-all flex items-center justify-center text-sm ${
                    isSelected
                      ? 'bg-orange-500 text-black shadow-[0_4px_15px_rgba(249,115,22,0.3)]'
                      : 'bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 hover:border-zinc-600'
                  }`}
                >
                  {t(day)}
                </motion.button>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4 mb-6 ${isRTL ? 'text-right' : ''}`}
        >
          <p className="text-zinc-400 text-sm mb-2">{t('trainingDaysLabel')}</p>
          <p className="text-orange-400 font-semibold">
            {selectedDays.length === 0
              ? t('noDaysSelected')
              : selectedDays.map((day) => t(day)).join(', ')}
          </p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          disabled={isLoading}
          className="w-full h-14 bg-orange-500 text-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-400 transition-all shadow-[0_4px_15px_rgba(249,115,22,0.2)] active:scale-[0.98] disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {t('continueCta')}
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </motion.button>

        <p className="text-center text-zinc-500 text-sm mt-6">
          {t('changeLaterInSettings')}
        </p>
      </motion.div>
    </div>
  );
}

