import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Dumbbell, Utensils, MessageCircle, ChevronRight, Flame, Target, GlassWater } from 'lucide-react';
import { motion } from 'framer-motion';
import BottomNav from '@/components/navigation/BottomNav';
import FooterCredit from '@/components/FooterCredit';
import SettingsMenu from '@/components/SettingsMenu';
import { useLanguage } from '@/components/LanguageContext';

function getWaterKey() {
  return `fitegypt_water_${new Date().toISOString().split('T')[0]}`;
}

export default function Home() {
  const { t, isRTL, getDailyMotivationQuote } = useLanguage();

  // Water tracker
  const [waterCount, setWaterCount] = useState(() => {
    return parseInt(localStorage.getItem(getWaterKey()) || '0', 10);
  });

  useEffect(() => {
    localStorage.setItem(getWaterKey(), String(waterCount));
  }, [waterCount]);

  const toggleGlass = (index) => {
    if (index < waterCount) {
      setWaterCount(index);
    } else {
      setWaterCount(index + 1);
    }
  };

  // Profile badge
  const [userProfile, setUserProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fitegypt_user_profile')); } catch { return null; }
  });

  useEffect(() => {
    const handleProfileUpdate = () => {
      try {
        const updatedProfile = JSON.parse(localStorage.getItem('fitegypt_user_profile'));
        setUserProfile(updatedProfile);
      } catch {
        setUserProfile(null);
      }
    };
    window.addEventListener('fitegypt_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('fitegypt_profile_updated', handleProfileUpdate);
  }, []);

  const quickActions = [
    {
      titleKey: 'todaysWorkout',
      subtitleKey: 'buildMuscle',
      icon: Dumbbell,
      page: 'Workouts',
      color: 'from-orange-500 to-red-600'
    },
    {
      titleKey: 'mealPlan',
      subtitleKey: 'egyptianNutrition',
      icon: Utensils,
      page: 'Meals',
      color: 'from-emerald-500 to-green-600'
    },
    {
      titleKey: 'askCoach',
      subtitleKey: 'aiTrainer',
      icon: MessageCircle,
      page: 'Coach',
      color: 'from-blue-500 to-indigo-600'
    },
  ];

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/30 rounded-full blur-3xl" />

        <div className="relative px-6 pt-12 pb-8">
          <div className="flex items-start justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-orange-500 font-medium">{t('welcomeBack')}</p>
              <h1 className="text-3xl font-bold text-white mt-1">{t('champion')}</h1>
              {userProfile && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-2 inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1"
                >
                  <span className="text-orange-500 text-xs font-bold">
                    {t('goalLabel')}: {t(userProfile.goal?.toLowerCase() || 'maintain')} 🔥
                  </span>
                </motion.div>
              )}
            </motion.div>
            <div className="flex items-center gap-2">
              <SettingsMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 -mt-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center">
              <Flame className="w-7 h-7 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-zinc-400 text-sm">{t('dailyGoal')}</p>
              <p className="text-white font-bold text-xl">{t('stayConsistent')}</p>
            </div>
            <div className="text-right">
              <div className="w-16 h-16 rounded-full border-4 border-orange-500 flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Water Intake Tracker */}
      <div className="px-6 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800"
        >
          <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <GlassWater className="w-5 h-5 text-cyan-400" />
            <span className="text-white font-bold">{t('waterIntake')}</span>
            <span className="text-zinc-500 text-sm ml-auto">{waterCount}/8 {t('glasses')}</span>
          </div>
          {/* Glass Icons */}
          <div className="flex gap-2 justify-between mb-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <button
                key={i}
                onClick={() => toggleGlass(i)}
                className={`w-8 h-10 rounded-lg flex items-center justify-center transition-all active:scale-90 ${
                  i < waterCount
                    ? 'bg-cyan-500/20 border border-cyan-500/40'
                    : 'bg-zinc-800/50 border border-zinc-700/30'
                }`}
              >
                <GlassWater className={`w-4 h-4 ${i < waterCount ? 'text-cyan-400' : 'text-zinc-600'}`} />
              </button>
            ))}
          </div>
          {/* Progress bar */}
          <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(waterCount / 8) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-zinc-500 text-xs mt-2 text-center">{t('waterGoal')}</p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mt-8">
        <h2 className="text-lg font-bold text-white mb-4">{t('quickActions')}</h2>
        <div className="space-y-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.page}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Link to={createPageUrl(action.page)}>
                  <div className={`bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex items-center gap-4 active:scale-98 transition-transform ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                      <h3 className="text-white font-semibold">{t(action.titleKey)}</h3>
                      <p className="text-zinc-500 text-sm">{t(action.subtitleKey)}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-zinc-600 ${isRTL ? 'rotate-180' : ''}`} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Motivation Quote */}
      <div className="px-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-6 ${isRTL ? 'text-right' : ''}`}
        >
          <p className="text-white/80 text-sm font-medium mb-2">{t('todaysMotivation')}</p>
          <p className="text-white text-xl font-bold leading-relaxed">
            {getDailyMotivationQuote()}
          </p>
        </motion.div>
      </div>

      <FooterCredit />

      <BottomNav currentPage="Home" />
    </div>
  );
}

