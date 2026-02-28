import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Ruler, Weight, Sparkles, Loader2, ClipboardList, RotateCcw, Trash2 } from 'lucide-react';
import BottomNav from '@/components/navigation/BottomNav';
import FooterCredit from '@/components/FooterCredit';
import { useLanguage } from '@/components/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { Groq } from 'groq-sdk';
import ReactMarkdown from 'react-markdown';

export default function More() {
  const { t, isRTL, getAIResponseLanguageName } = useLanguage();
  const { user } = useAuth();

  const formKey = user ? `plan_form_${user.uid}` : 'plan_form_guest';
  const planKey = user ? `plan_saved_${user.uid}` : 'plan_saved_guest';

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem(formKey);
    return saved ? JSON.parse(saved) : { age: '', height: '', weight: '' };
  });

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(() => {
    return localStorage.getItem(planKey) || null;
  });

  useEffect(() => {
    localStorage.setItem(formKey, JSON.stringify(formData));
  }, [formData, formKey]);

  useEffect(() => {
    if (plan) {
      localStorage.setItem(planKey, plan);
    } else {
      localStorage.removeItem(planKey);
    }
  }, [plan, planKey]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearPlan = () => {
    if (window.confirm(t('clearCurrentPlanConfirm'))) {
      setPlan(null);
    }
  };

  const generatePlan = async () => {
    if (!formData.age || !formData.height || !formData.weight) return;

    setLoading(true);
    setPlan(null);

    const apiKey = import.meta.env.VITE_GROQ_API_KEY?.trim();
    if (!apiKey || apiKey === 'YOUR_GROQ_API_KEY') {
      alert(t('missingGroqApiKey'));
      setLoading(false);
      return;
    }

    try {
      const groq = new Groq({
        apiKey,
        dangerouslyAllowBrowser: true,
      });

      const prompt = `Create a complete personalized workout and nutrition plan for an Egyptian fitness enthusiast with these stats:
- Age: ${formData.age}
- Height: ${formData.height} cm
- Weight: ${formData.weight} kg

The plan should include:
1. A weekly workout schedule focused on these stats.
2. A daily nutrition plan including Egyptian meals (like Foul, Ta'ameya, Grilled Chicken, etc.) with estimated calories.

Please respond in ${getAIResponseLanguageName()} and format with clear headers for "Workout Plan" and "Nutrition Plan".`;

      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
      });

      const responseText = completion.choices[0]?.message?.content || '';
      setPlan(responseText);
    } catch (error) {
      console.error('Plan Generation Error:', error);
      if (String(error).includes('fetch')) {
        alert(t('failedConnectAI'));
      } else {
        alert(t('failedGeneratePlan'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      <div className="sticky top-0 bg-black/95 backdrop-blur-xl z-40 border-b border-zinc-800/50 p-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.3)]">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-2xl font-black tracking-tight ${isRTL ? 'text-right' : ''}`}>{t('more')}</h1>
            <p className={`text-zinc-500 text-xs font-medium uppercase tracking-wider ${isRTL ? 'text-right' : ''}`}>{t('getYourPlan')}</p>
          </div>
        </motion.div>
      </div>

      <div className="p-6 max-w-md mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-[2rem] blur opacity-20 group-hover:opacity-30 transition duration-1000" />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 space-y-8">
            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-2 h-8 bg-orange-500 rounded-full" />
              <h2 className="text-xl font-bold tracking-tight">{t('championStats')}</h2>
            </div>

            <div className="grid gap-6">
              {[
                { name: 'age', icon: User, placeholder: 'age', unit: '' },
                { name: 'height', icon: Ruler, placeholder: 'height', unit: 'cm' },
                { name: 'weight', icon: Weight, placeholder: 'weight', unit: 'kg' },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className={`block text-xs font-bold text-zinc-500 uppercase tracking-widest ${isRTL ? 'text-right' : ''}`}>
                    {t(field.placeholder)} {field.unit && `(${field.unit})`}
                  </label>
                  <div className={`flex items-center gap-3 p-4 bg-zinc-800/30 rounded-2xl border border-zinc-700/30 focus-within:border-orange-500/50 focus-within:bg-zinc-800/50 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <field.icon className="w-5 h-5 text-orange-500/70" />
                    <input
                      type="number"
                      name={field.name}
                      placeholder="..."
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      className={`bg-transparent w-full outline-none text-white text-lg font-medium placeholder:text-zinc-700 ${isRTL ? 'text-right' : ''}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={generatePlan}
              disabled={loading || !formData.age || !formData.height || !formData.weight}
              className="w-full h-16 rounded-2xl bg-orange-500 text-black font-black text-lg flex items-center justify-center gap-3 hover:bg-orange-400 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_30px_rgba(249,115,22,0.3)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  {t('generating')}
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 text-black" />
                  {t('generatePlan')}
                </>
              )}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {plan && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative"
            >
              <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl" />

                <div className={`flex items-center justify-between mb-8 pb-6 border-b border-zinc-800 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">{t('yourCustomPlan')}</h3>
                  </div>
                  <button
                    onClick={clearPlan}
                    className="p-2.5 rounded-xl bg-zinc-800/50 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    title={t('clearPlan')}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className={`prose prose-invert prose-orange max-w-none ${isRTL ? 'text-right' : ''}`}>
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => <h1 className="text-2xl font-black text-white mt-8 mb-4 border-l-4 border-orange-500 pl-4" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-orange-500 mt-8 mb-4" {...props} />,
                      p: ({ node, ...props }) => <p className="text-zinc-400 leading-relaxed mb-4" {...props} />,
                      li: ({ node, ...props }) => <li className="text-zinc-300 mb-2 marker:text-orange-500" {...props} />,
                    }}
                  >
                    {plan}
                  </ReactMarkdown>
                </div>

                <div className="mt-12 pt-8 border-t border-zinc-800 flex justify-center">
                  <button
                    onClick={generatePlan}
                    className="flex items-center gap-2 text-orange-500 font-bold hover:text-orange-400 transition-colors py-2 px-6 rounded-full bg-orange-500/5 border border-orange-500/20"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {t('updatePlan')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FooterCredit />
      <BottomNav currentPage="More" />
    </div>
  );
}

