import React, { useState, useEffect } from 'react';
import { Flame, BarChart3, Plus, Ruler, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import BottomNav from '@/components/navigation/BottomNav';
import FooterCredit from '@/components/FooterCredit';
import { useLanguage } from '@/components/LanguageContext';
import toast from 'react-hot-toast';

const PROGRESS_KEY = 'fitegypt_progress';
const MEASUREMENTS_KEY = 'fitegypt_measurements';

function getWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);

  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatDateKey(date) {
  return date.toISOString().split('T')[0];
}

function calcStreak(completedDays) {
  let streak = 0;
  const today = new Date();
  const d = new Date(today);

  while (true) {
    const key = formatDateKey(d);
    if (completedDays[key]) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export default function Progress() {
  const { t, isRTL } = useLanguage();

  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem(PROGRESS_KEY);
    return saved ? JSON.parse(saved) : { completedDays: {} };
  });

  const [measurements, setMeasurements] = useState(() => {
    const saved = localStorage.getItem(MEASUREMENTS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [showMeasurements, setShowMeasurements] = useState(false);
  const [measureForm, setMeasureForm] = useState({ weight: '', waist: '', arms: '', chest: '' });

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem(MEASUREMENTS_KEY, JSON.stringify(measurements));
  }, [measurements]);

  const weekDates = getWeekDates();
  const todayKey = formatDateKey(new Date());
  const isTodayCompleted = !!progress.completedDays[todayKey];
  const streak = calcStreak(progress.completedDays);
  const totalCalories = Object.values(progress.completedDays).reduce((sum, d) => sum + (d.calories || 0), 0);
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const toggleToday = () => {
    setProgress(prev => {
      const updated = { ...prev, completedDays: { ...prev.completedDays } };
      if (updated.completedDays[todayKey]) {
        delete updated.completedDays[todayKey];
      } else {
        updated.completedDays[todayKey] = { calories: 0, timestamp: Date.now() };
      }
      return updated;
    });
  };

  const saveMeasurement = () => {
    if (!measureForm.weight) return;
    const entry = {
      ...measureForm,
      weight: parseFloat(measureForm.weight) || 0,
      waist: parseFloat(measureForm.waist) || 0,
      arms: parseFloat(measureForm.arms) || 0,
      chest: parseFloat(measureForm.chest) || 0,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString(),
    };
    setMeasurements(prev => [...prev, entry]);
    setMeasureForm({ weight: '', waist: '', arms: '', chest: '' });
    toast.success(t('measurementSaved'));
  };

  const chartData = measurements
    .filter(m => m.weight > 0)
    .map(m => ({
      date: new Date(m.timestamp).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      weight: m.weight,
    }));

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-lg z-40 border-b border-zinc-800">
        <div className="px-6 py-4">
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <BarChart3 className="w-5 h-5 text-black" />
            </div>
            <div className={isRTL ? 'text-right' : ''}>
              <h1 className="text-xl font-bold text-white">{t('progress')}</h1>
              <p className="text-zinc-500 text-sm">{t('weeklyProgress')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 space-y-6">
        {/* Streak & Calories Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-zinc-400 text-sm">{t('streak')}</span>
            </div>
            <p className="text-3xl font-black text-white">{streak}</p>
            <p className="text-zinc-500 text-xs mt-1">{t('days')}</p>
          </div>
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <span className="text-zinc-400 text-sm">{t('kcal')}</span>
            </div>
            <p className="text-3xl font-black text-white">{totalCalories}</p>
            <p className="text-zinc-500 text-xs mt-1">{t('totalCaloriesBurned')}</p>
          </div>
        </motion.div>

        {/* Weekly Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800"
        >
          <h3 className={`text-white font-bold mb-4 ${isRTL ? 'text-right' : ''}`}>{t('weeklyProgress')}</h3>
          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, i) => {
              const key = formatDateKey(date);
              const isCompleted = !!progress.completedDays[key];
              const isToday = key === todayKey;
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-zinc-500 text-[10px] font-bold uppercase">{dayLabels[i]}</span>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                      isCompleted
                        ? 'bg-orange-500 text-black shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                        : isToday
                        ? 'bg-zinc-800 text-white border-2 border-orange-500/50'
                        : 'bg-zinc-800/50 text-zinc-500'
                    }`}
                  >
                    {date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Mark Complete Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={toggleToday}
          className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
            isTodayCompleted
              ? 'bg-zinc-800 text-orange-500 border border-orange-500/30'
              : 'bg-orange-500 text-black shadow-[0_8px_30px_rgba(249,115,22,0.3)]'
          }`}
        >
          {isTodayCompleted ? (
            <>✓ {t('completed')}</>
          ) : (
            <><Plus className="w-5 h-5" /> {t('markComplete')}</>
          )}
        </motion.button>

        {/* Body Measurements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => setShowMeasurements(!showMeasurements)}
            className={`w-full flex items-center justify-between bg-zinc-900 rounded-2xl p-5 border border-zinc-800 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Ruler className="w-5 h-5 text-orange-500" />
              </div>
              <span className="text-white font-bold">{t('bodyMeasurements')}</span>
            </div>
            <motion.div animate={{ rotate: showMeasurements ? 180 : 0 }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 8L10 13L15 8" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </motion.div>
          </button>

          <AnimatePresence>
            {showMeasurements && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-zinc-900 border border-zinc-800 border-t-0 rounded-b-2xl p-5 space-y-4">
                  {/* Input Fields */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'weight', label: t('weight'), unit: t('kg') },
                      { key: 'waist', label: t('waist'), unit: t('cm') },
                      { key: 'arms', label: t('arms'), unit: t('cm') },
                      { key: 'chest', label: t('chestMeasure'), unit: t('cm') },
                    ].map(field => (
                      <div key={field.key} className="space-y-1">
                        <label className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{field.label} ({field.unit})</label>
                        <input
                          type="number"
                          value={measureForm[field.key]}
                          onChange={(e) => setMeasureForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                          placeholder="..."
                          className={`w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 ${isRTL ? 'text-right' : ''}`}
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={saveMeasurement}
                    disabled={!measureForm.weight}
                    className="w-full py-3 rounded-xl bg-orange-500 text-black font-bold text-sm disabled:opacity-50 active:scale-[0.98] transition-all"
                  >
                    {t('saveMeasurement')}
                  </button>

                  {/* Weight Chart */}
                  {chartData.length > 0 ? (
                    <div>
                      <h4 className={`text-white font-bold text-sm mb-3 ${isRTL ? 'text-right' : ''}`}>{t('weightOverTime')}</h4>
                      <div className="bg-zinc-800/30 rounded-xl p-3 border border-zinc-700/30">
                        <ResponsiveContainer width="100%" height={180}>
                          <LineChart data={chartData}>
                            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                            <Tooltip
                              contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 12, color: '#fff', fontSize: 12 }}
                            />
                            <Line type="monotone" dataKey="weight" stroke="#f97316" strokeWidth={2.5} dot={{ fill: '#f97316', strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ) : (
                    <p className="text-zinc-500 text-sm text-center py-4">{t('noMeasurements')}</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <FooterCredit />
      <BottomNav currentPage="Progress" />
    </div>
  );
}
